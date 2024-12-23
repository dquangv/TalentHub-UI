import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import ScrollToTop from './components/layout/ScrollToTop';
import Freelancers from './pages/Freelancers';
import Jobs from './pages/Jobs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Settings from './pages/freelancer/settings/Settings';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Routes>
            <Route path="/" element={<Home />} />
              <Route path="/freelancers" element={<Freelancers />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/settingsfreelancer" element={<Settings />} />

              <Route path="*" element={<div style={{width: '50%', margin: '0 auto'}}><NotFound /></div>} />
            </Routes>
          </main>
          <ScrollToTop />
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;