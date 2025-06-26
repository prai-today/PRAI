import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthForm } from '../components/AuthForm';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function AuthPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const redirectParam = params.get('redirect');
    
    if (modeParam === 'signup') {
      setMode('signup');
    }
    
    if (redirectParam) {
      setRedirectUrl(redirectParam);
    }
  }, []);

  useEffect(() => {
    if (user && !loading) {
      // Check for stored redirect URL first
      const storedRedirectUrl = localStorage.getItem('auth_redirect_url');
      if (storedRedirectUrl) {
        localStorage.removeItem('auth_redirect_url');
        window.location.href = storedRedirectUrl;
        return;
      }
      
      // Use URL parameter redirect
      const targetUrl = redirectUrl || '/dashboard';
      window.location.href = targetUrl;
    }
  }, [user, loading, redirectUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <Header />
      <AuthForm mode={mode} redirectUrl={redirectUrl} />
      <Footer />
    </div>
  );
}