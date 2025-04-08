import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App.tsx';
import './index.css';
import { MessageProvider } from './pages/ChatComponents/MessageContext.tsx';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <LanguageProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </LanguageProvider>
  </HelmetProvider>
);