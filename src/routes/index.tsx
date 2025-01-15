import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import Freelancers from '@/pages/Freelancers';
import FreelancerDetail from '@/pages/freelancers/FreelancerDetail';
import Jobs from '@/pages/Jobs';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Settings from '@/pages/freelancer/settings/Settings';
import Pricing from '@/pages/Pricing';
import DashboardPage from '@/pages/admin/dashboard';
import FreelancersPage from '@/pages/admin/freelancers';
import EmployersPage from '@/pages/admin/employers';
import PostsPage from '@/pages/admin/posts';
export const mainRoutes: RouteObject[] = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/freelancers',
        element: <Freelancers />
    },
    {
        path: '/freelancers/:id',
        element: <FreelancerDetail />
    },
    {
        path: '/jobs',
        element: <Jobs />
    },
    {
        path: '/about',
        element: <About />
    },
    {
        path: '/contact',
        element: <Contact />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/settingsfreelancer',
        element: <Settings />
    },
    {
        path: '/pricing',
        element: <Pricing />
    },
    {
        path: '*',
        element: <NotFound />
    }
];



export const adminRoutes: RouteObject[] = [
    {
        path: '/',
        element: <DashboardPage />
    },
    {
        path: '/freelancers',
        element: <FreelancersPage />
    },
    {
        path: '/employers',
        element: <EmployersPage />
    },
    {
        path: '/posts',
        element: <PostsPage />
    }
];
