import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import websocketService, { WebSocketCallbacks, MessageResponse } from '@/pages/ChatComponents/websocketService';

interface NotificationItem {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: Date;
    read: boolean;
}

const AdminNotificationDropdown: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy userId từ localStorage
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) return;

        const userInfo = JSON.parse(userInfoStr);
        const userId = userInfo?.userId;

        if (!userId) return;

        // Kết nối WebSocket nếu chưa kết nối
        if (!websocketService.isConnected()) {
            const callbacks: WebSocketCallbacks = {
                onMessageReceived: (message: MessageResponse) => {
                    handleNewMessage(message);
                },
                onReadReceiptReceived: () => {
                    // Không cần xử lý trong dropdown này
                },
                onStatusReceived: () => {
                    // Không cần xử lý trong dropdown này
                },
                onConnectionEstablished: () => {
                    console.log('Admin notification: WebSocket connected');
                },
                onConnectionLost: () => {
                    console.log('Admin notification: WebSocket disconnected');
                }
            };

            websocketService.connect(userId, callbacks);
        } else {
            // Cập nhật callbacks nếu đã kết nối
            websocketService.updateCallbacks({
                onMessageReceived: (message: MessageResponse) => {
                    handleNewMessage(message);
                },
                onReadReceiptReceived: () => { },
                onStatusReceived: () => { },
                onConnectionEstablished: () => { },
                onConnectionLost: () => { }
            });
        }

        // Lắng nghe sự kiện tùy chỉnh từ window cho tin nhắn mới
        const handleNewMessageEvent = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail) {
                handleNewMessage(customEvent.detail);
            }
        };

        window.addEventListener('new-message', handleNewMessageEvent as EventListener);

        return () => {
            window.removeEventListener('new-message', handleNewMessageEvent as EventListener);
        };
    }, []);

    const handleNewMessage = (message: MessageResponse) => {
        const newNotification: NotificationItem = {
            id: message.id,
            senderId: message.senderId,
            senderName: message.senderName || 'User ' + message.senderId,
            senderAvatar: message.senderAvatar,
            content: message.content,
            timestamp: new Date(message.timestamp),
            read: false
        };

        setNotifications(prev => {
            // Kiểm tra xem thông báo đã tồn tại chưa
            const exists = prev.some(item => item.id === message.id);
            if (exists) return prev;

            // Thêm vào đầu danh sách và giới hạn số lượng hiển thị
            return [newNotification, ...prev].slice(0, 10);
        });
    };

    const handleNotificationClick = (notification: NotificationItem) => {
        // Đánh dấu thông báo đã đọc
        setNotifications(prev =>
            prev.map(item =>
                item.id === notification.id ? { ...item, read: true } : item
            )
        );

        // Chuyển hướng đến trang nhắn tin với người gửi
        navigate(`/messaging?contactId=${notification.senderId}`);
        setIsOpen(false);
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(item => ({ ...item, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 px-1.5 h-5 min-w-[20px] flex items-center justify-center bg-primary text-primary-foreground"
                            variant="default"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-3 border-b">
                    <span className="font-semibold">Thông báo tin nhắn</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={markAllAsRead}
                        >
                            Đánh dấu đã đọc
                        </Button>
                    )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                            Không có thông báo mới
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex p-3 cursor-pointer hover:bg-muted border-b last:border-b-0 ${!notification.read ? 'bg-primary/5' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                                    <AvatarImage src={notification.senderAvatar} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {notification.senderName.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-medium truncate text-sm">{notification.senderName}</p>
                                        <span className="text-xs text-muted-foreground ml-1 whitespace-nowrap">
                                            {format(notification.timestamp, 'HH:mm')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{notification.content}</p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-primary ml-2 flex-shrink-0"></div>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                {notifications.length > 0 && (
                    <div className="p-2 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-center text-sm"
                            onClick={() => {
                                navigate('/messaging');
                                setIsOpen(false);
                            }}
                        >
                            Xem tất cả tin nhắn
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AdminNotificationDropdown;