import { cookies } from 'next/headers';

// Admin credentials (في الإنتاج، استخدم قاعدة بيانات وتشفير)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'LandSpice2025!', // غيّر هذا في الإنتاج
};

// User session management
export interface UserSession {
  participantId: number;
  email: string;
  name: string;
  referralCode: string;
}

export interface AdminSession {
  isAdmin: true;
  username: string;
  loginTime: number;
}

// Admin authentication
export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

// Session helpers
export function createSessionToken(data: UserSession | AdminSession): string {
  // في الإنتاج، استخدم JWT أو session store آمن
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function verifySessionToken(token: string): UserSession | AdminSession | null {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString());
    return data;
  } catch {
    return null;
  }
}

// Cookie helpers
export function setAuthCookie(token: string, isAdmin: boolean = false) {
  const cookieName = isAdmin ? 'admin_session' : 'user_session';
  const maxAge = isAdmin ? 60 * 60 * 24 : 60 * 60 * 24 * 30; // Admin: 1 day, User: 30 days
  
  return {
    name: cookieName,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
    path: '/',
  };
}

export function clearAuthCookie(isAdmin: boolean = false) {
  const cookieName = isAdmin ? 'admin_session' : 'user_session';
  return {
    name: cookieName,
    value: '',
    maxAge: 0,
    path: '/',
  };
}
