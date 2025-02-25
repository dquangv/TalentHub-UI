import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMessages } from './MessageContext';

const ConnectionStatus: React.FC = () => {
    const { isConnected, reconnecting } = useMessages();

    if (isConnected) {
        return null; // Don't show anything when connected
    }

    return (
        <Alert variant="destructive" className="fixed bottom-4 right-4 max-w-md z-50 flex items-center">
            {reconnecting ? (
                <>
                    <Wifi className="h-4 w-4 mr-2 animate-pulse" />
                    <AlertDescription>
                        Đang kết nối lại với máy chủ...
                    </AlertDescription>
                </>
            ) : (
                <>
                    <WifiOff className="h-4 w-4 mr-2" />
                    <AlertDescription>
                        Mất kết nối. Vui lòng kiểm tra kết nối mạng của bạn.
                    </AlertDescription>
                </>
            )}
        </Alert>
    );
};

export default ConnectionStatus;