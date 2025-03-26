import React, { useEffect, useState } from 'react';
import { MessageResponse } from './pages/ChatComponents/websocketService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: Date;
}

const ChatNotificationManager: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Lắng nghe sự kiện tùy chỉnh cho tin nhắn mới
        const handleNewMessageEvent = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail) {
                const message = customEvent.detail as MessageResponse;

                // Kiểm tra các điều kiện để hiển thị thông báo
                // - Không hiển thị thông báo nếu đang ở trang tin nhắn với người gửi
                const url = new URL(window.location.href);
                const currentPath = url.pathname;
                const contactId = url.searchParams.get('contactId');

                // Nếu đang ở trang tin nhắn và đang chat với người gửi, không hiển thị thông báo
                if (currentPath === '/messaging' && contactId === message.senderId) {
                    return;
                }

                // Thêm thông báo mới
                const newNotification: Notification = {
                    id: message.id,
                    senderId: message.senderId,
                    senderName: message.senderName || 'User ' + message.senderId,
                    senderAvatar: message.senderAvatar,
                    content: message.content,
                    timestamp: new Date(message.timestamp)
                };

                // Thêm vào đầu danh sách
                setNotifications(prev => [newNotification, ...prev]);

                // Tự động ẩn thông báo sau 5 giây
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== message.id));
                }, 5000);
            }
        };

        window.addEventListener('new-message', handleNewMessageEvent as EventListener);

        return () => {
            window.removeEventListener('new-message', handleNewMessageEvent as EventListener);
        };
    }, [navigate]);

    const handleNotificationClick = (notification: Notification) => {
        // Chuyển hướng đến trang nhắn tin với người gửi
        window.open(`/messaging?contactId=${notification.senderId}`, '_blank');
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
    };

    const dismissNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-xs sm:max-w-md">
            <AnimatePresence>
                {notifications.map(notification => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className="cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <Alert className="flex items-start p-3 shadow-lg border bg-background">
                            <div className="flex gap-3 w-full">
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage src={notification.senderAvatar} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {notification.senderName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0 space-y-0.5">
                                    <AlertTitle className="text-sm font-semibold">{notification.senderName}</AlertTitle>
                                    <AlertDescription className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.content}
                                    </AlertDescription>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 flex-shrink-0 -mt-1 -mr-1"
                                    onClick={(e) => dismissNotification(notification.id, e)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </Alert>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ChatNotificationManager;