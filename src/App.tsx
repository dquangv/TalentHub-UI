import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import { mainRoutes } from '@/routes';

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Main routes with MainLayout */}
          {mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<MainLayout>{route.element}</MainLayout>}
            />
          ))}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;