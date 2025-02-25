import { ReactNode } from 'react';
import ScrollToTop from '@/components/layout/ScrollToTop';

interface ChatLayoutProps {
    children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps): JSX.Element => {
    return (
        <div className="min-h-screen bg-background">
            <main className="h-screen">{children}</main>
            <ScrollToTop />
        </div>
    );
};

export default ChatLayout;