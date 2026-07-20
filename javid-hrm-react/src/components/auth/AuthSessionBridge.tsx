import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { setUnauthorizedHandler } from '@/services/api/sessionManager';

export function AuthSessionBridge() {
  const navigate = useNavigate();
  const { clearSession } = useAuth();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      navigate('/login', {
        replace: true,
        state: { from: window.location.pathname },
      });
    });

    return () => setUnauthorizedHandler(null);
  }, [clearSession, navigate]);

  return null;
}
