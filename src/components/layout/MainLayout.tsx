import { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
            <ScrollToTop />
            <Footer />
        </div>
    );
};

export default MainLayout;