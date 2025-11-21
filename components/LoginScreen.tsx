
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User, Language } from '../types';
import { Logo } from './Logo';
import { Lock, Mail, UserPlus, LogIn, User as UserIcon } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language, setLanguage, t }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignup) {
      if (!name.trim()) {
        setError(t.error);
        return;
      }
      const result = authService.signup(email, password, name);
      if (result === 'SUCCESS') {
        const user = authService.login(email, password);
        if (user) onLogin(user);
      } else if (result === 'EMAIL_EXISTS') {
        setError(t.emailExists);
      } else if (result === 'USERNAME_EXISTS') {
        setError(t.usernameExists);
      } else {
        setError(t.error);
      }
    } else {
      const user = authService.login(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError(t.authError);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in relative">
      
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 flex gap-2 bg-navy-800 p-1 rounded-full border border-gold-500/30">
        <button 
          onClick={() => setLanguage('ar')}
          className={`px-4 py-1 rounded-full text-sm transition-all ${language === 'ar' ? 'bg-gold-500 text-navy-900 font-bold' : 'text-gray-400 hover:text-white'}`}
        >
          العربية
        </button>
        <button 
          onClick={() => setLanguage('en')}
          className={`px-4 py-1 rounded-full text-sm transition-all ${language === 'en' ? 'bg-gold-500 text-navy-900 font-bold' : 'text-gray-400 hover:text-white'}`}
        >
          English
        </button>
      </div>

      <Logo className="mb-8" size="lg" />

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl border-t-4 border-gold-500">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isSignup ? t.signupTitle : t.loginTitle}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gold-500 rtl:right-4 rtl:left-auto" size={20} />
            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-900 border border-gray-700 rounded-xl py-4 px-12 text-white outline-none focus:border-gold-500 transition-colors"
              required
            />
          </div>

          {isSignup && (
            <div className="relative animate-fade-in">
              <UserIcon className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gold-500 rtl:right-4 rtl:left-auto" size={20} />
              <input
                type="text"
                placeholder={t.username}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-navy-900 border border-gray-700 rounded-xl py-4 px-12 text-white outline-none focus:border-gold-500 transition-colors"
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Lock className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gold-500 rtl:right-4 rtl:left-auto" size={20} />
            <input
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-900 border border-gray-700 rounded-xl py-4 px-12 text-white outline-none focus:border-gold-500 transition-colors"
              required
            />
          </div>

          {error && <p className="text-red-400 text-center text-sm bg-red-900/20 p-2 rounded">{error}</p>}

          <button 
            type="submit"
            className="bg-gold-500 text-navy-900 font-bold py-4 rounded-xl hover:bg-gold-400 transition-all transform hover:-translate-y-1 shadow-lg mt-2 flex items-center justify-center gap-2"
          >
            {isSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isSignup ? t.signupBtn : t.loginBtn}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isSignup ? t.haveAccount : t.noAccount}{' '}
            <button 
              onClick={() => { setIsSignup(!isSignup); setError(null); setName(''); }}
              className="text-gold-500 font-bold hover:underline"
            >
              {isSignup ? t.loginBtn : t.createAccount}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};