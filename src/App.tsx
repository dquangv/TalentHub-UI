import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import MainLayout from '@/components/layout/MainLayout';
import { adminRoutes, mainRoutes, chatLayoutPaths } from '@/routes';
import AdminLayout from './components/layout/AdminLayout';
import ChatLayout from './components/layout/ChatLayout';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import ChatNotificationManager from './components/layout/ChatNotificationManager';

const AuthenticatedNotifications = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <ChatNotificationManager /> : null;
};

const AppRoutes = () => {
  const location = useLocation();
  const adminRole = JSON.parse(localStorage.getItem('adminRole') || "false");

  const usesChatLayout = chatLayoutPaths.some(path => location.pathname === path);

  if (adminRole && !usesChatLayout) {
    return (
      <Routes>
        {adminRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<AdminLayout>{route.element}</AdminLayout>}
          />
        ))}
      </Routes>
    );
  }

  return (
    <Routes>
      {mainRoutes.map((route) => {
        const Layout = usesChatLayout ? ChatLayout : MainLayout;

        return (
          <Route
            key={route.path}
            path={route.path}
            element={<Layout>{route.element}</Layout>}
          />
        );
      })}
      {adminRole && usesChatLayout && (
        <Route
          path="/messaging"
          element={<ChatLayout>{adminRoutes.find(route => route.path === '/messaging')?.element}</ChatLayout>}
        />
      )}
    </Routes>
  );
};

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <AppRoutes />
          <AuthenticatedNotifications />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;