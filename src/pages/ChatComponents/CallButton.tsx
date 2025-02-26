import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCall } from './CallContext';

interface CallButtonProps {
    contactId: string;
    contactName: string;
    contactAvatar?: string;
    type: 'audio' | 'video';
    className?: string;
}

const CallButton: React.FC<CallButtonProps> = ({
    contactId,
    contactName,
    contactAvatar,
    type,
    className
}) => {
    const { startCall, isInCall } = useCall();

    const handleCall = () => {
        if (isInCall) {
            // Already in a call - could show a notification here
            alert('Bạn đang trong một cuộc gọi khác. Vui lòng kết thúc cuộc gọi trước khi bắt đầu cuộc gọi mới.');
            return;
        }

        startCall(
            contactId,
            contactName,
            contactAvatar,
            {
                enableAudio: true,
                enableVideo: type === 'video'
            }
        );
    };

    return (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${className || ''}`}
                onClick={handleCall}
                title={type === 'audio' ? 'Gọi thoại' : 'Gọi video'}
            >
                {type === 'audio' ? (
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                ) : (
                    <Video className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                )}
            </Button>
        </motion.div>
    );
};

export default CallButton;