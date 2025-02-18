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
import PostJob from '@/pages/client/PostJob';
import JobDetail from '@/pages/jobs/JobDetail';
import AppliedJobs from '@/pages/freelancer/AppliedJobs';
import Applicants from '@/pages/Applicants';
import PricingManagement from '@/pages/admin/PricingManagement';
import SavedJobs from '@/pages/freelancer/SavedJobs';
import ForgotPassword from '@/pages/ForgetPassword';
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
        path: '/jobs/:id',
        element: <JobDetail />
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
        path: '/client/post-job',
        element: <PostJob />
    },
    {
        path: '/client/jobs/:id',
        element: <JobDetail />
    },
    {
        path: '/client/applied-jobs',
        element: <AppliedJobs />
    },
    {
        path: '/client/applicants',
        element: <Applicants />
    },
    {
        path: '*',
        element: <div className='w-1/2 mx-auto'><NotFound /></div>
    },
    {
        path: '/saved-jobs',
        element: <SavedJobs />
    },
    {
        path: '/forget-password',
        element: <ForgotPassword />
    },
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
    },
    {
        path: "/pricing",
        element: <PricingManagement />
    },
    {
        path: '*',
        element: <div className='w-1/2 mx-auto'><NotFound /></div>
    }
];
