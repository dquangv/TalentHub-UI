// Updated ChatLayout.tsx for better mobile support
import { ReactNode, useEffect } from 'react';

interface ChatLayoutProps {
    children: ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps): JSX.Element => {
    // Add meta viewport tag to ensure proper mobile rendering
    useEffect(() => {
        // Check if we need to add or update the viewport meta tag
        let viewportMeta = document.querySelector('meta[name="viewport"]');

        if (!viewportMeta) {
            // Create the viewport meta tag if it doesn't exist
            viewportMeta = document.createElement('meta');
            viewportMeta.setAttribute('name', 'viewport');
            document.head.appendChild(viewportMeta);
        }

        // Set the viewport properties with fixed-width scale and height adjustments
        viewportMeta.setAttribute('content',
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');

        return () => {
            // Optionally restore original viewport settings on unmount
            if (viewportMeta) {
                viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
        };
    }, []);

    return (
        <main className="min-h-screen w-full flex flex-col overflow-hidden mobile-chat-layout">
            {children}
        </main>
    );
};

export default ChatLayout;