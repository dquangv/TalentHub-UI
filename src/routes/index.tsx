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
import Appointment from '@/pages/Appointment';
import ClientProfile from '@/pages/client/ClientProfile';
import { BannersPage } from '@/pages/banners';
import MessagingPage from '@/pages/MessagingPage';
import PostedJobs from '@/pages/PostedJobs';
import ClientDetail from '@/pages/client/ClientDetail';
import AppointmentClientList from '@/pages/employer/AppointmentList';
import AppointmentFreelancerList from '@/pages/freelancer/AppointmentList';
import ChooseRole from '@/pages/auth/ChooseRole';
import Wallet from '@/pages/Wallet';
import { ReportsPage } from '@/pages/admin/reports';
import AccountsPage from '@/pages/admin/accounts';
import OAuth2Callback from '@/pages/Oauth2Callback';
import SchoolPage from '@/pages/admin/SchoolPage';
import DegreesPage from '@/pages/admin/DegreesPage';
import SkillsPage from '@/pages/admin/SkillsPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';
import ChatbotManagement from '@/pages/admin/ChatBotManagement';
import PaymentResult from "@/pages/payment/payment-result";
import ReportsOfJob from '@/pages/ReportsOfJob';
import FreelancerReports from '@/pages/FreelancerReports';
import Clients from '@/pages/Clients';
import BannedAccountCallback from '@/pages/BannedAccountCallback';
import FaceCapture from '@/pages/auth/FaceCapture';
import FaceRecognize from '@/pages/auth/FaceRecognize';
export const chatLayoutPaths = ['/messaging'];

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
    path: '/clients',
    element: <Clients />
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
    path: '/oauth2-callback',
    element: <OAuth2Callback />
  },
  {
    path: '/banned-account-callback',
    element: <BannedAccountCallback />
  },
  {
    path: '/choose-role',
    element: <ChooseRole />
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
    path: '/reports-job/:id',
    element: <ReportsOfJob />
  },
  {
    path: '/reports-freelancer',
    element: <FreelancerReports />
  },
  {
    path: '/client/post-job',
    element: <PostJob />
  },
  {
    path: '/client/profile',
    element: <ClientProfile />
  },
  {
    path: '/clients/:id',
    element: <ClientDetail />
  },
  {
    path: '/client/jobs/:id',
    element: <JobDetail />
  },
  {
    path: '/client/posted-jobs',
    element: <PostedJobs />
  },
  {
    path: '/client/applied-jobs',
    element: <AppliedJobs />
  },
  {
    path: '/client/applicants/:id',
    element: <Applicants />
  },
  {
    path: '/saved-jobs',
    element: <SavedJobs />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/appointment/:id',
    element: <Appointment />
  },
  {
    path: 'freelancer/appointment',
    element: <AppointmentFreelancerList />
  },
  {
    path: 'client/appointment',
    element: <AppointmentClientList />
  },
  {
    path: '/messaging',
    element: <MessagingPage />
  },
  {
    path: '/freelancer/applied-jobs',
    element: <AppliedJobs />
  },
  {
    path: '/wallet',
    element: <Wallet />
  },
  {
    path: "/PaymentResult",
    element: <PaymentResult />,
  },
  {
    path: '*',
    element: <div className='w-1/2 mx-auto'><NotFound /></div>
  },
  {
    path: '/face-capture',
    element: <FaceCapture/>
  },
  {
    path: '/face-recognize',
    element: <FaceRecognize/>
  }
];

export const adminRoutes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardPage />
  },
  {
    path: '/accounts',
    element: <AccountsPage />
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
    path: '/chatbot',
    element: <ChatbotManagement />
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
    path: "/banners",
    element: <BannersPage />
  },
  {
    path: '/reports',
    element: <ReportsPage />
  },
  {
    path: '/schools',
    element: <SchoolPage />
  },
  {
    path: '/degrees',
    element: <DegreesPage />
  },
  {
    path: '/categories',
    element: <CategoriesPage />
  },
  {
    path: '/skills',
    element: <SkillsPage />
  },
  {
    path: '/messaging',
    element: <MessagingPage />
  },
  {
    path: '*',
    element: <div className='w-1/2 mx-auto'><NotFound /></div>
  }
];
