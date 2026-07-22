import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from '@/contexts/AuthContext';
import { PermissionProvider } from '@/contexts/PermissionContext';
import { ToastProvider } from '@/contexts/ToastContext';
import '@styles/app.css';
import '@styles/themes.css';
import './styles/index.css';

document.documentElement.setAttribute('dir', 'rtl');
document.documentElement.setAttribute('lang', 'fa-IR');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PermissionProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </PermissionProvider>
    </AuthProvider>
  </StrictMode>,
);
