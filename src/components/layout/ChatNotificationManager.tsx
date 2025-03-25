import React, { useState, useEffect } from 'react';
import PopupChat from './PopupChat';
import { v4 as uuidv4 } from 'uuid';
import websocketService, { MessageResponse } from '@/pages/ChatComponents/websocketService';
export interface ChatNotification {
    id: string;
    contactId: string;
    contactName: string;
    contactAvatar?: string;
    isOnline: boolean;
    lastMessage: string;
    timestamp: Date;
    unread: number;
}
const ChatNotificationManager: React.FC = () => {
    const [activeChats, setActiveChats] = useState<ChatNotification[]>([]);
    const [newMessageNotifications, setNewMessageNotifications] = useState<ChatNotification[]>([]);
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = userInfo.userId;
    useEffect(() => {
        if (!userId) return;
        const handleNewMessage = (message: MessageResponse) => {
            if (message.receiverId === userId) {
                const senderId = message.senderId;
                const existingChatIndex = activeChats.findIndex(chat => chat.contactId === senderId);
                if (existingChatIndex >= 0) {
                    return;
                }

                const notification: ChatNotification = {
                    id: uuidv4(),
                    contactId: senderId,
                    contactName: message.senderName || 'Người dùng',
                    contactAvatar: message.senderAvatar,
                    isOnline: true,
                    lastMessage: message.content,
                    timestamp: new Date(message.timestamp || Date.now()),
                    unread: 1
                };

                const existingNotifIndex = newMessageNotifications.findIndex(
                    notif => notif.contactId === senderId
                );

                if (existingNotifIndex >= 0) {
                    setNewMessageNotifications(prev => {
                        const updated = [...prev];
                        updated[existingNotifIndex] = {
                            ...updated[existingNotifIndex],
                            lastMessage: message.content,
                            timestamp: new Date(message.timestamp || Date.now()),
                            unread: updated[existingNotifIndex].unread + 1
                        };
                        return updated;
                    });
                } else {
                    setNewMessageNotifications(prev => [...prev, notification]);
                }
            }
        };

        const setupWebSocket = () => {
            if (!websocketService.isConnected()) {
                const callbacks = {
                    onMessageReceived: handleNewMessage,
                    onReadReceiptReceived: () => { },
                    onStatusReceived: () => { },
                    onConnectionEstablished: () => {
                        console.log('WebSocket kết nối thành công cho ChatNotificationManager');
                    },
                    onConnectionLost: () => {
                        console.log('WebSocket mất kết nối cho ChatNotificationManager');
                        setTimeout(setupWebSocket, 5000);
                    }
                };
                websocketService.connect(userId, callbacks);
            }
        };

        setupWebSocket();

        return () => {
        };
    }, [userId, activeChats, newMessageNotifications]);

    const openChatPopup = (notification: ChatNotification) => {
        setActiveChats(prev => [...prev, notification]);
        setNewMessageNotifications(prev =>
            prev.filter(notif => notif.contactId !== notification.contactId)
        );
    };

    const closeChatPopup = (contactId: string) => {
        setActiveChats(prev => prev.filter(chat => chat.contactId !== contactId));
    };

    useEffect(() => {
        if (newMessageNotifications.length > 0) {
            const timer = setTimeout(() => {
                const notification = newMessageNotifications[0];
                openChatPopup(notification);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [newMessageNotifications]);

    return (
        <>
            <div className="fixed bottom-0 right-0 z-40 flex flex-col-reverse items-end p-4 space-y-reverse space-y-4">
                {activeChats.map((chat, index) => (
                    <div key={chat.id} style={{ marginBottom: index * 20 + 'px' }}>
                        <PopupChat
                            contactId={chat.contactId}
                            contactName={chat.contactName}
                            contactAvatar={chat.contactAvatar}
                            isOnline={chat.isOnline}
                            onClose={() => closeChatPopup(chat.contactId)}
                        />
                    </div>
                ))}
            </div>

        </>
    );
};

export default ChatNotificationManager;