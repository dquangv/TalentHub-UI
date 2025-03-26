import { ReactNode } from 'react';

interface ChatLayoutProps {
    children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps): JSX.Element => {
    return (
        <main className="min-h-screen w-full flex flex-col overflow-hidden">{children}</main>
    );
};

export default ChatLayout;