import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppRoutes } from './app/router/routes';
import { AuthForm } from './components/auth/AuthForm';
import { AuthState } from './types';

export default function App() {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    const envKey = process.env.GEMINI_API_KEY;
    
    const finalKey = savedKey || (envKey !== 'MY_GEMINI_API_KEY' ? envKey : null);
    
    return {
      isAuthenticated: !!finalKey,
      apiKey: finalKey || null,
    };
  });
  
  const location = useLocation();

  const handleLogin = (apiKey: string) => {
    localStorage.setItem('gemini_api_key', apiKey);
    setAuth({ isAuthenticated: true, apiKey });
  };

  useEffect(() => {
    if (auth.apiKey === 'MY_GEMINI_API_KEY') {
      setAuth({ isAuthenticated: false, apiKey: null });
    }
  }, [auth.apiKey]);

  if (!auth.isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return <AppRoutes apiKey={auth.apiKey!} />;
}
