
import { User } from '../types';

const USERS_KEY = 'sharq_users';
const SESSION_KEY = 'sharq_session';

export type SignupResult = 'SUCCESS' | 'EMAIL_EXISTS' | 'USERNAME_EXISTS';

export const authService = {
  login: (email: string, pass: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.pass === pass);
    
    if (user) {
      const safeUser = { email: user.email, name: user.name || email.split('@')[0] };
      localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
      return safeUser;
    }
    return null;
  },

  signup: (email: string, pass: string, name: string): SignupResult => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      return 'EMAIL_EXISTS'; 
    }
    
    if (users.some((u: any) => u.name === name)) {
      return 'USERNAME_EXISTS';
    }
    
    const newUser = { email, pass, name: name };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return 'SUCCESS';
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }
};