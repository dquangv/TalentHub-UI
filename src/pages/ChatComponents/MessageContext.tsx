import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import websocketService, { WebSocketCallbacks } from './websocketService';
import chatApiService from './chatApiService';
import userService from '@/api/userService';

export interface Message {
    id: string;
    conversationId: string;
    content: string;
    timestamp: Date;
    isMe: boolean;
    isRead: boolean;
    senderId: string;
    senderName?: string;
    senderAvatar?: string;
}

export interface Conversation {
    id: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    timestamp: Date;
    unread: number;
    isOnline: boolean;
    lastSeen?: string;
}

interface MessageContextType {
    conversations: Conversation[];
    activeConversationId: string;
    messages: Message[];
    isConnected: boolean;
    reconnecting: boolean;
    setActiveConversationId: (id: string) => void;
    sendMessage: (content: string) => void;
    createNewConversation: (name: string) => string;
    markAsRead: (conversationId: string) => void;
    checkAndCreateConversation: (contactId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType>({} as MessageContextType);

interface MessageProviderProps {
    children: ReactNode;
    initialContactId?: string;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children, initialContactId = '' }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string>(initialContactId);
    const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
    const [isConnected, setIsConnected] = useState<boolean>(true);
    const [reconnecting, setReconnecting] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');

    const messages = activeConversationId ? allMessages[activeConversationId] || [] : [];
    useEffect(() => {
        if (initialContactId && conversations.length > 0) {
            const existingConversation = conversations.find(
                conv => String(conv.id) === String(initialContactId)
            );

            if (existingConversation) {
                console.log('Setting active conversation from provider:', initialContactId);
                setActiveConversationId(initialContactId);
            } else {
                console.log('Conversation not found in list, will attempt to create:', initialContactId);
                checkAndCreateConversation(initialContactId);
            }
        }
    }, [initialContactId, conversations]);
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        const storedUserId = storedUserInfo ? JSON.parse(storedUserInfo).userId : null;
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);
    const createNewConversation = useCallback((name: string, specificId?: string): string => {
        const newId = specificId || uuidv4();
        const newConversation: Conversation = {
            id: newId,
            name,
            lastMessage: 'Chưa có tin nhắn nào',
            timestamp: new Date(),
            unread: 0,
            isOnline: Math.random() > 0.5,
            avatar: `https://i.pravatar.cc/150?u=${newId}`,
        };

        setConversations(prev => [newConversation, ...prev]);
        setAllMessages(prev => ({
            ...prev,
            [newId]: [],
        }));

        return newId;
    }, []);

    const markAsRead = useCallback((conversationId: string) => {
        if (!userId || !conversationId) return;

        // Mark messages as read locally
        setAllMessages(prev => {
            if (!prev[conversationId]) return prev;

            return {
                ...prev,
                [conversationId]: prev[conversationId].map(msg => ({
                    ...msg,
                    isRead: true,
                })),
            };
        });

        // Update conversation unread count
        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversationId
                    ? {
                        ...conv,
                        unread: 0,
                    }
                    : conv
            )
        );

        websocketService.markAsRead(conversationId);

        chatApiService.markMessagesAsRead({
            receiverId: userId,
            senderId: conversationId
        });
    }, [userId]);
    const checkAndCreateConversation = useCallback(async (contactId: string) => {
        if (!userId || !contactId) return;

        console.log("Checking for conversation with contactId:", contactId);

        // Tìm cuộc trò chuyện hiện tại
        const existingConversation = conversations.find(conv =>
            String(conv.id) === String(contactId)
        );

        if (existingConversation) {
            console.log("Found existing conversation, activating:", existingConversation);
            setActiveConversationId(contactId);

            // Tải tin nhắn của cuộc trò chuyện này
            try {
                const messagesData = await chatApiService.getMessages(userId, contactId);

                // Map API data to our Message interface
                const mappedMessages: Message[] = messagesData.map(msg => ({
                    id: msg.id,
                    conversationId: contactId,
                    content: msg.content,
                    timestamp: new Date(msg.timestamp),
                    isMe: msg.senderId === userId,
                    isRead: msg.isRead,
                    senderId: msg.senderId,
                    senderName: msg.senderName,
                    senderAvatar: msg.senderAvatar
                }));

                setAllMessages(prev => ({
                    ...prev,
                    [contactId]: mappedMessages,
                }));

                // Mark messages as read automatically
                if (mappedMessages.some(msg => !msg.isRead && !msg.isMe)) {
                    markAsRead(contactId);
                }
            } catch (error) {
                console.error('Failed to load messages for existing conversation:', error);
            }
        } else {
            console.log("No existing conversation found, creating new one");
            try {
                const userResponse = await userService.getUserById(Number(contactId));

                if (userResponse && userResponse.data) {
                    const userData = userResponse.data;
                    const displayName = userData.firstName && userData.lastName
                        ? `${userData.firstName} ${userData.lastName}`
                        : userData.title || `User ${contactId}`;
                    const avatar = userData.image || `https://i.pravatar.cc/150?u=${contactId}`;

                    console.log("Creating conversation with name:", displayName);
                    const newId = createNewConversation(displayName, contactId);

                    // Cập nhật avatar
                    setConversations(prev =>
                        prev.map(conv =>
                            conv.id === contactId
                                ? { ...conv, avatar }
                                : conv
                        )
                    );

                    // Đặt active conversation sau khi tạo
                    setActiveConversationId(newId);
                } else {
                    console.log("User data not found, creating with default info");
                    const newId = createNewConversation(`User ${contactId}`, contactId);
                    setActiveConversationId(newId);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                const newId = createNewConversation(`User ${contactId}`, contactId);
                setActiveConversationId(newId);
            }
        }
    }, [userId, conversations, createNewConversation, setActiveConversationId]);
    // Mark messages as read

    // Load conversation list from API
    const loadConversations = useCallback(async () => {
        if (!userId) return;

        try {
            const conversationsData = await chatApiService.getConversations(userId);

            // Map API data to our Conversation interface
            const mappedConversations: Conversation[] = conversationsData.map(conv => ({
                id: conv.userId,
                name: conv.name,
                avatar: conv.avatar,
                lastMessage: conv.lastMessage,
                timestamp: conv.timestamp,
                unread: conv.unreadCount,
                isOnline: conv.isOnline,
                lastSeen: conv.lastSeen || undefined
            }));

            setConversations(mappedConversations);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        }
    }, [userId]);

    const handleIncomingMessage = useCallback((message: any) => {
        const isActiveConversation = activeConversationId === message.senderId;
        const newMessage: Message = {
            id: message.id || uuidv4(),
            conversationId: message.senderId,
            content: message.content,
            timestamp: new Date(message.timestamp || new Date()),
            isMe: false,
            isRead: isActiveConversation,
            senderId: message.senderId,
            senderName: message.senderName,
            senderAvatar: message.senderAvatar
        };

        // Add to messages for that conversation
        setAllMessages(prev => {
            const conversationMessages = prev[message.senderId] || [];
            return {
                ...prev,
                [message.senderId]: [...conversationMessages, newMessage]
            };
        });

        // Update conversation list - Đây là phần quan trọng cần sửa
        setConversations(prev => {
            const existingConvIndex = prev.findIndex(c => c.id === message.senderId);

            if (existingConvIndex >= 0) {
                const updatedConversations = [...prev];
                updatedConversations[existingConvIndex] = {
                    ...updatedConversations[existingConvIndex],
                    lastMessage: message.content,
                    timestamp: new Date(),
                    unread: isActiveConversation
                        ? updatedConversations[existingConvIndex].unread
                        : updatedConversations[existingConvIndex].unread + 1
                };

                // Move this conversation to the top
                const [updatedConv] = updatedConversations.splice(existingConvIndex, 1);
                return [updatedConv, ...updatedConversations];
            } else {
                // Nếu không tìm thấy cuộc trò chuyện, tạo một cuộc trò chuyện mới
                const newConversation: Conversation = {
                    id: message.senderId,
                    name: message.senderName || `User ${message.senderId}`,
                    avatar: message.senderAvatar,
                    lastMessage: message.content,
                    timestamp: new Date(),
                    unread: 1,
                    isOnline: true
                };
                return [newConversation, ...prev];
            }
        });

        // If this is the active conversation, mark as read automatically
        if (isActiveConversation) {
            markAsRead(message.senderId);
        } else {
            // Trigger notification for new message
            showNewMessageNotification(message);
        }
    }, [activeConversationId, markAsRead]);

    // Thêm hàm hiển thị thông báo tin nhắn mới
    const showNewMessageNotification = (message: any) => {
        // Có thể thêm mã hiển thị thông báo ở đây (thông qua context API hoặc event)
        // Ví dụ: tạo một event để thông báo cho các component khác
        const newMessageEvent = new CustomEvent('new-message', { detail: message });
        window.dispatchEvent(newMessageEvent);
    };

    // Handle read receipts from WebSocket
    const handleReadReceipt = useCallback((receipt: any) => {
        // Update messages that were sent by the current user to the sender who read them
        setAllMessages(prev => {
            const conversationId = receipt.senderId; // The other user who sent the receipt
            const conversationMessages = prev[conversationId];

            if (!conversationMessages) return prev;

            const updatedMessages = conversationMessages.map(msg => {
                if (msg.isMe && !msg.isRead) {
                    return { ...msg, isRead: true };
                }
                return msg;
            });

            return {
                ...prev,
                [conversationId]: updatedMessages
            };
        });
    }, []);

    // Handle user status updates from WebSocket
    const handleStatusUpdate = useCallback((status: any) => {
        setConversations(prev =>
            prev.map(conv => {
                if (conv.id === status.userId) {
                    return {
                        ...conv,
                        isOnline: status.isOnline,
                        lastSeen: status.isOnline ? undefined : 'Just now'
                    };
                }
                return conv;
            })
        );
    }, []);

    // Setup WebSocket connection when userId is available
    useEffect(() => {
        if (!userId) return;

        // Kiểm tra xem websocket đã kết nối chưa trước khi khởi tạo lại
        if (!websocketService.isConnected()) {
            console.log('Initializing WebSocket connection for user', userId);
            const callbacks: WebSocketCallbacks = {
                onMessageReceived: (message: any) => {
                    handleIncomingMessage(message);
                },
                onReadReceiptReceived: (receipt: any) => {
                    handleReadReceipt(receipt);
                },
                onStatusReceived: (status: any) => {
                    handleStatusUpdate(status);
                },
                onConnectionEstablished: () => {
                    setIsConnected(true);
                    setReconnecting(false);
                    loadConversations();
                },
                onConnectionLost: () => {
                    setIsConnected(false);
                    setReconnecting(true);
                }
            };
            websocketService.connect(userId, callbacks);
        } else {
            console.log('WebSocket already connected, updating callbacks');
            // Chỉ cập nhật lại callbacks nếu WebSocket đã kết nối
            const callbacks: WebSocketCallbacks = {
                onMessageReceived: (message: any) => {
                    handleIncomingMessage(message);
                },
                onReadReceiptReceived: (receipt: any) => {
                    handleReadReceipt(receipt);
                },
                onStatusReceived: (status: any) => {
                    handleStatusUpdate(status);
                },
                onConnectionEstablished: () => {
                    setIsConnected(true);
                    setReconnecting(false);
                    // Reload conversation list when reconnected
                    loadConversations();
                },
                onConnectionLost: () => {
                    setIsConnected(false);
                    setReconnecting(true);
                }
            };
            websocketService.updateCallbacks(callbacks);
        }

        // Load initial conversation list
        loadConversations();

        return () => {
            // websocketService.disconnect();
        };
    }, [userId, handleIncomingMessage, handleReadReceipt, handleStatusUpdate, loadConversations]);

    // Load message history when active conversation changes
    useEffect(() => {
        if (!userId || !activeConversationId) return;

        const loadMessages = async () => {
            try {
                const messagesData = await chatApiService.getMessages(userId, activeConversationId);

                // Map API data to our Message interface
                const mappedMessages: Message[] = messagesData.map(msg => ({
                    id: msg.id,
                    conversationId: activeConversationId,
                    content: msg.content,
                    timestamp: new Date(msg.timestamp),
                    isMe: msg.senderId === userId,
                    isRead: msg.isRead,
                    senderId: msg.senderId,
                    senderName: msg.senderName,
                    senderAvatar: msg.senderAvatar
                }));

                setAllMessages(prev => ({
                    ...prev,
                    [activeConversationId]: mappedMessages,
                }));

                // Mark messages as read automatically
                if (mappedMessages.some(msg => !msg.isRead && !msg.isMe)) {
                    markAsRead(activeConversationId);
                }
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        loadMessages();
    }, [userId, activeConversationId]);


    const sendMessage = useCallback((content: string) => {
        if (!activeConversationId || !content.trim() || !isConnected || !userId) return;

        const tempId = uuidv4();
        const newMessage: Message = {
            id: tempId,
            conversationId: activeConversationId,
            content,
            timestamp: new Date(),
            isMe: true,
            isRead: false,
            senderId: userId,
        };

        // Add to UI immediately for responsiveness
        setAllMessages(prev => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
        }));

        // Update conversation list - sửa phần này
        setConversations(prev => {
            const existingConvIndex = prev.findIndex(c => c.id === activeConversationId);

            if (existingConvIndex >= 0) {
                const updatedConversations = [...prev];
                updatedConversations[existingConvIndex] = {
                    ...updatedConversations[existingConvIndex],
                    lastMessage: content,
                    timestamp: new Date(),
                };

                // Move this conversation to the top
                const [updatedConv] = updatedConversations.splice(existingConvIndex, 1);
                return [updatedConv, ...updatedConversations];
            }

            return prev;
        });

        // Send via WebSocket
        websocketService.sendMessage(activeConversationId, content);
    }, [activeConversationId, isConnected, userId]);



    // Mark messages as read when active conversation changes
    useEffect(() => {
        if (activeConversationId) {
            markAsRead(activeConversationId);
        }
    }, [activeConversationId, markAsRead]);

    const value = {
        conversations,
        activeConversationId,
        messages,
        isConnected,
        reconnecting,
        setActiveConversationId,
        sendMessage,
        createNewConversation,
        markAsRead,
        checkAndCreateConversation,
    };

    return <MessageContext.Provider value={value}> {children} </MessageContext.Provider>;
};

export const useMessages = (): MessageContextType => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
};