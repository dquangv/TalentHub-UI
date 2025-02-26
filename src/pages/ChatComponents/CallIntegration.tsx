import React from 'react';
import { CallProvider } from './CallContext';
import VideoCallComponent from './VideoCallComponent';

interface CallIntegrationProps {
    userId: string;
    children: React.ReactNode;
}

const CallIntegration: React.FC<CallIntegrationProps> = ({ userId, children }) => {
    return (
        <CallProvider userId={userId}>
            {children}
            <VideoCallComponent />
        </CallProvider>
    );
};

export default CallIntegration;