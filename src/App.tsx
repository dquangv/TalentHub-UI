import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import MainLayout from '@/components/layout/MainLayout';
// import AdminDashboard from '@/pages/admin/AdminDashboard';
import { adminRoutes, mainRoutes } from '@/routes';
import AdminLayout from './components/layout/AdminLayout';

function App(): JSX.Element {
  const adminRole = JSON.parse(localStorage.getItem('adminRole') || "false");
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Admin routes */}
          {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
          {adminRole ? (adminRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<AdminLayout>{route.element}</AdminLayout>}
            ></Route>
          ))) : (mainRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<MainLayout>{route.element}</MainLayout>}
            />
          )))}
          {/* Main routes with MainLayout */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;