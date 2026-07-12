import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@styles/app.css';
import '@styles/themes.css';
import './styles/index.css';

document.documentElement.setAttribute('dir', 'rtl');
document.documentElement.setAttribute('lang', 'fa-IR');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
