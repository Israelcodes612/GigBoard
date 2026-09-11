import {
  createUser,
  findUserByEmail,
   findUserById,
} from '../models/User.js';
import {
  storeRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
} from '../models/RefreshToken.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/token.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches REFRESH_TOKEN_EXPIRY
};

function getRefreshExpiryDate() {
  const days = 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function signup(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existing = await findUserByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const schoolDomain = email.split('@')[1] || null;
    const passwordHash = await hashPassword(password);

    const user = await createUser({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      schoolDomain,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await storeRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshExpiryDate(),
    });

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(201).json({ user, accessToken });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Something went wrong during signup' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await comparePassword(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await storeRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshExpiryDate(),
    });

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    const { password_hash, ...safeUser } = user;
    res.status(200).json({ user: safeUser, accessToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong during login' });
  }
}


export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const tokenHash = hashToken(token);
    const stored = await findValidRefreshToken(tokenHash);

    if (!stored) {
      // Token isn't in our DB as valid — either revoked, expired, or reused.
      return res.status(401).json({ message: 'Refresh token not recognized' });
    }

    // Rotate: invalidate the old refresh token, issue a brand new one
    await revokeRefreshToken(tokenHash);

    const user = await findUserById(payload.userId);
if (!user) {
  return res.status(401).json({ message: 'User no longer exists' });
}
const newAccessToken = generateAccessToken(user);
const newRefreshToken = generateRefreshToken(user);

    await storeRefreshToken({
      userId: user.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: getRefreshExpiryDate(),
    });

    res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({ message: 'Something went wrong refreshing your session' });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await revokeRefreshToken(hashToken(token));
    }

    res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Something went wrong during logout' });
  }
}