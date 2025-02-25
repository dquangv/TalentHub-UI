import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import MainLayout from '@/components/layout/MainLayout';
import { adminRoutes, mainRoutes } from '@/routes';
import AdminLayout from './components/layout/AdminLayout';
import ChatLayout from './components/layout/ChatLayout';
import { AuthProvider } from './contexts/AuthContext';

const chatLayoutPaths = ['/messaging'];

const AppRoutes = () => {
  const location = useLocation();
  const adminRole = JSON.parse(localStorage.getItem('adminRole') || "false");

  const usesChatLayout = chatLayoutPaths.some(path => location.pathname === path);

  if (adminRole) {
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
    </Routes>
  );
};

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;