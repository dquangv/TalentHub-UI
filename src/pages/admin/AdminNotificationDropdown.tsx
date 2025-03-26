import React, { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
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
import chatApiService from '@/pages/ChatComponents/chatApiService';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy userId từ localStorage
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) return;

        const userInfo = JSON.parse(userInfoStr);
        const currentUserId = userInfo?.userId;

        if (!currentUserId) return;

        setUserId(currentUserId);

        // Lấy danh sách cuộc trò chuyện gần đây
        fetchRecentConversations(currentUserId);

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

            websocketService.connect(currentUserId, callbacks);
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

    // Fetch danh sách cuộc trò chuyện và thêm tin nhắn gần đây nhất vào danh sách thông báo
    const fetchRecentConversations = async (currentUserId: string) => {
        setLoading(true);
        setError(null);

        try {
            // Lấy danh sách các cuộc trò chuyện
            const conversations = await chatApiService.getConversations(currentUserId);

            // Lấy tin nhắn gần đây nhất từ mỗi cuộc trò chuyện và gắn vào thông báo
            const recentMessages: NotificationItem[] = [];

            // Hiển thị trực tiếp các cuộc trò chuyện từ response
            console.log("Conversations loaded:", conversations);

            // Limit số lượng cuộc trò chuyện để tránh quá nhiều yêu cầu API
            const limitedConversations = conversations.slice(0, 5);

            // Thêm trực tiếp từ thông tin cuộc trò chuyện
            for (const conversation of limitedConversations) {
                try {
                    // Tạo thông báo từ thông tin cuộc trò chuyện mà không cần kiểm tra unreadCount
                    if (conversation.lastMessage) {
                        // Đối với isOnline, chúng ta kiểm tra cả trường online và isOnline
                        const isOnline = conversation.online !== undefined ? conversation.online :
                            conversation.isOnline !== undefined ? conversation.isOnline : false;

                        const notificationId = `conv-${conversation.userId}-${new Date(conversation.timestamp).getTime()}`;

                        recentMessages.push({
                            id: notificationId,
                            senderId: conversation.userId.toString(),
                            senderName: conversation.name,
                            senderAvatar: conversation.avatar,
                            content: conversation.lastMessage,
                            timestamp: new Date(conversation.timestamp),
                            // Đánh dấu đã đọc nếu unreadCount là 0
                            read: conversation.unreadCount === 0
                        });
                    }

                    // Nếu cần thêm chi tiết, ta vẫn có thể truy vấn tin nhắn
                    if (conversation.unreadCount > 0) {
                        // Lấy tin nhắn gần đây nhất của cuộc trò chuyện
                        const messages = await chatApiService.getMessages(currentUserId, conversation.userId.toString());

                        // Lấy tin nhắn chưa đọc gần đây nhất
                        const unreadMessages = messages
                            .filter(msg => !msg.isRead && msg.senderId === conversation.userId.toString())
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                        if (unreadMessages.length > 0) {
                            const latestMessage = unreadMessages[0];

                            // Kiểm tra xem đã có thông báo cho cuộc trò chuyện này chưa
                            const existingIndex = recentMessages.findIndex(msg => msg.senderId === conversation.userId.toString());

                            // Nếu chưa có, thêm mới
                            if (existingIndex === -1) {
                                recentMessages.push({
                                    id: latestMessage.id,
                                    senderId: latestMessage.senderId,
                                    senderName: conversation.name,
                                    senderAvatar: conversation.avatar,
                                    content: latestMessage.content,
                                    timestamp: new Date(latestMessage.timestamp),
                                    read: false
                                });
                            }
                        }
                    }
                } catch (err) {
                    console.error(`Error processing conversation with ${conversation.userId}:`, err);
                }
            }

            // Sắp xếp tin nhắn theo thời gian gần đây nhất
            recentMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            // Cập nhật danh sách thông báo
            setNotifications(recentMessages);
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError('Không thể tải danh sách cuộc trò chuyện');
        } finally {
            setLoading(false);
        }
    };

    const handleNewMessage = (message: MessageResponse) => {
        console.log("Received new message:", message);
        const newNotification: NotificationItem = {
            id: message.id || `msg-${message.senderId}-${new Date().getTime()}`,
            senderId: message.senderId,
            senderName: message.senderName || 'User ' + message.senderId,
            senderAvatar: message.senderAvatar,
            content: message.content,
            timestamp: new Date(message.timestamp || new Date()),
            read: false
        };

        setNotifications(prev => {
            // Kiểm tra xem thông báo đã tồn tại chưa
            const exists = prev.some(item => item.id === newNotification.id);
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

        // Đánh dấu đã đọc trên server
        if (userId) {
            chatApiService.markMessagesAsRead({
                receiverId: userId,
                senderId: notification.senderId
            });
        }
    };

    const markAllAsRead = () => {
        // Đánh dấu tất cả thông báo đã đọc trong state
        setNotifications(prev => prev.map(item => ({ ...item, read: true })));

        // Đánh dấu đã đọc trên server
        if (userId) {
            notifications.forEach(notification => {
                if (!notification.read) {
                    chatApiService.markMessagesAsRead({
                        receiverId: userId,
                        senderId: notification.senderId
                    });
                }
            });
        }
    };

    // Đếm số lượng thông báo chưa đọc
    const unreadCount = notifications.filter(n => !n.read).length;

    // Log cho mục đích debug
    useEffect(() => {
        console.log("Current notifications:", notifications);
        console.log("Unread count:", unreadCount);
    }, [notifications, unreadCount]);

    const handleRefresh = () => {
        if (userId) {
            fetchRecentConversations(userId);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            // Tải lại danh sách khi mở dropdown
            if (open && userId) {
                fetchRecentConversations(userId);
            }
        }}>
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
                    <div className="flex items-center gap-2">
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
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 px-2"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Làm mới"}
                        </Button>
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {loading && notifications.length === 0 ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-4 text-sm text-red-500">
                            {error}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
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