import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App.tsx';
import './index.css';
import './mobile-fixes.css';
import { MessageProvider } from './pages/ChatComponents/MessageContext.tsx';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <MessageProvider>
      <App />
    </MessageProvider>
  </LanguageProvider>
);