import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMessages } from './MessageContext';

const ConnectionStatus: React.FC = () => {
    const { isConnected, reconnecting } = useMessages();
    if (isConnected) {
        return null;
    }
    return (
        <Alert
            variant="destructive"
            className="fixed bottom-4 right-4 max-w-[calc(100vw-2rem)] sm:max-w-xs md:max-w-md z-50 flex items-center p-2 sm:p-3"
        >
            {reconnecting ? (
                <>
                    <Wifi className="h-4 w-4 mr-2 animate-pulse flex-shrink-0" />
                    <AlertDescription className="text-xs sm:text-sm">
                        Đang kết nối lại với máy chủ...
                    </AlertDescription>
                </>
            ) : (
                <>
                    <WifiOff className="h-4 w-4 mr-2 flex-shrink-0" />
                    <AlertDescription className="text-xs sm:text-sm">
                        Mất kết nối. Vui lòng kiểm tra kết nối mạng của bạn.
                    </AlertDescription>
                </>
            )}
        </Alert>
    );
};

export default ConnectionStatus;