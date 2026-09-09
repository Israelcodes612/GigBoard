import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';

export interface User {
  id: string;
  full_name: string;
  email: string;
  school_domain: string | null;
  role: string;
  is_verified: boolean;
  created_at: string;
}

interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (input: SignupInput) => Promise<User>;
  login: (input: LoginInput) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get<{ user: User }>('/auth/me');
        setUser(data.user);
      } catch {
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function signup({ fullName, email, password }: SignupInput) {
    const { data } = await api.post<{ user: User; accessToken: string }>('/auth/signup', {
      fullName,
      email,
      password,
    });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data.user;
  }

  async function login({ email, password }: LoginInput) {
    const { data } = await api.post<{ user: User; accessToken: string }>('/auth/login', {
      email,
      password,
    });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}