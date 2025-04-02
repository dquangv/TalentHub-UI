import { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import CustomChatbot from '../CustomChatbot';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
            <CustomChatbot />
            <ScrollToTop />
            <Footer />
        </div>
    );
};

export default MainLayout;