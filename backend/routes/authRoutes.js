import express from 'express';
import { signup, login, refresh, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { findUserById } from '../models/User.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Quick protected route to sanity-check the whole flow end to end
router.get('/me', requireAuth, async (req, res) => {
  const user = await findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user });
});

export default router;