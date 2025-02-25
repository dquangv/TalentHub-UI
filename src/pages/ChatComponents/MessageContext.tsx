import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
    setActiveConversationId: (id: string) => void;
    sendMessage: (content: string) => void;
    createNewConversation: (name: string) => string;
    markAsRead: (conversationId: string) => void;
}

// Sample data
const sampleConversations: Conversation[] = [
    {
        id: '1',
        name: 'Nguyễn Văn A',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        lastMessage: 'Hey, how are you doing?',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
        unread: 2,
        isOnline: true,
    },
    {
        id: '2',
        name: 'Trần Thị B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        lastMessage: 'Can we meet tomorrow?',
        timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
        unread: 0,
        isOnline: false,
        lastSeen: '2 hours ago',
    },
    {
        id: '3',
        name: 'Lê Văn C',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        lastMessage: 'Thanks for your help!',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 day ago
        unread: 0,
        isOnline: true,
    },
    {
        id: '4',
        name: 'Phạm Thị D',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
        lastMessage: 'The project looks great!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
        unread: 1,
        isOnline: false,
        lastSeen: '5 hours ago',
    },
    {
        id: '5',
        name: 'Hoàng Văn E',
        avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79',
        lastMessage: 'Let me check and get back to you',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
        unread: 0,
        isOnline: false,
        lastSeen: '1 day ago',
    },
    {
        id: '6',
        name: 'Vũ Thị F',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        lastMessage: 'I need your feedback on the design',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60000), // 4 days ago
        unread: 0,
        isOnline: true,
    },
];

const sampleMessages: Record<string, Message[]> = {
    '1': [
        {
            id: '101',
            conversationId: '1',
            content: 'Hey, how are you?',
            timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
            isMe: false,
            isRead: true,
            senderId: '1',
            senderName: 'Nguyễn Văn A',
            senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        },
        {
            id: '102',
            conversationId: '1',
            content: "I'm good, thanks! How about you?",
            timestamp: new Date(Date.now() - 25 * 60000), // 25 minutes ago
            isMe: true,
            isRead: true,
            senderId: 'me',
        },
        {
            id: '103',
            conversationId: '1',
            content: "I'm doing well. Just wanted to check in on the project progress.",
            timestamp: new Date(Date.now() - 20 * 60000), // 20 minutes ago
            isMe: false,
            isRead: true,
            senderId: '1',
            senderName: 'Nguyễn Văn A',
            senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        },
        {
            id: '104',
            conversationId: '1',
            content: "We're on track. I'll send you the latest update this afternoon.",
            timestamp: new Date(Date.now() - 18 * 60000), // 18 minutes ago
            isMe: true,
            isRead: true,
            senderId: 'me',
        },
        {
            id: '105',
            conversationId: '1',
            content: 'Great! Looking forward to it.',
            timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
            isMe: false,
            isRead: true,
            senderId: '1',
            senderName: 'Nguyễn Văn A',
            senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        },
    ],
    '2': [
        {
            id: '201',
            conversationId: '2',
            content: 'Hi there!',
            timestamp: new Date(Date.now() - 4 * 60 * 60000), // 4 hours ago
            isMe: false,
            isRead: true,
            senderId: '2',
            senderName: 'Trần Thị B',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        },
        {
            id: '202',
            conversationId: '2',
            content: 'Hello! How can I help you?',
            timestamp: new Date(Date.now() - 3.5 * 60 * 60000), // 3.5 hours ago
            isMe: true,
            isRead: true,
            senderId: 'me',
        },
        {
            id: '203',
            conversationId: '2',
            content: 'I wanted to discuss the meeting we have scheduled for next week.',
            timestamp: new Date(Date.now() - 3 * 60 * 60000), // 3 hours ago
            isMe: false,
            isRead: true,
            senderId: '2',
            senderName: 'Trần Thị B',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        },
        {
            id: '204',
            conversationId: '2',
            content: 'Can we meet tomorrow to prepare?',
            timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
            isMe: false,
            isRead: true,
            senderId: '2',
            senderName: 'Trần Thị B',
            senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        },
    ],
    '3': [
        {
            id: '301',
            conversationId: '3',
            content: 'Hey, I need your help with something.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
            isMe: false,
            isRead: true,
            senderId: '3',
            senderName: 'Lê Văn C',
            senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        },
        {
            id: '302',
            conversationId: '3',
            content: 'Sure, what do you need?',
            timestamp: new Date(Date.now() - 1.9 * 24 * 60 * 60000),
            isMe: true,
            isRead: true,
            senderId: 'me',
        },
        {
            id: '303',
            conversationId: '3',
            content: 'I was wondering if you could review this document for me.',
            timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60000),
            isMe: false,
            isRead: true,
            senderId: '3',
            senderName: 'Lê Văn C',
            senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        },
        {
            id: '304',
            conversationId: '3',
            content: 'Just sent it to you. Let me know what you think.',
            timestamp: new Date(Date.now() - 1.7 * 24 * 60 * 60000),
            isMe: false,
            isRead: true,
            senderId: '3',
            senderName: 'Lê Văn C',
            senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        },
        {
            id: '305',
            conversationId: '3',
            content: "I've reviewed it and sent you my feedback.",
            timestamp: new Date(Date.now() - 1.1 * 24 * 60 * 60000),
            isMe: true,
            isRead: true,
            senderId: 'me',
        },
        {
            id: '306',
            conversationId: '3',
            content: 'Thanks for your help!',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 day ago
            isMe: false,
            isRead: true,
            senderId: '3',
            senderName: 'Lê Văn C',
            senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        },
    ],
    '4': [
        {
            id: '401',
            conversationId: '4',
            content: 'Hi, I wanted to get your thoughts on the new project.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
            isMe: false,
            isRead: true,
            senderId: '4',
            senderName: 'Phạm Thị D',
            senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
        },
        {
            id: '402',
            conversationId: '4',
            content: "It's an interesting concept. When do we start?",
            timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60000),
            isMe: true,
            isRead: true,
            senderId: 'me',
        },
        {
            id: '403',
            conversationId: '4',
            content: "Next week. I think you'll really enjoy working on this one.",
            timestamp: new Date(Date.now() - 2.2 * 24 * 60 * 60000),
            isMe: false,
            isRead: true,
            senderId: '4',
            senderName: 'Phạm Thị D',
            senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
        },
        {
            id: '404',
            conversationId: '4',
            content: 'The project looks great!',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
            isMe: false,
            isRead: false,
            senderId: '4',
            senderName: 'Phạm Thị D',
            senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
        },
    ],
    '5': [
        {
            id: '501',
            conversationId: '5',
            content: 'Do you have the report ready?',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 days ago
            isMe: false,
            isRead: true,
            senderId: '5',
            senderName: 'Hoàng Văn E',
            senderAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79',
        },
        {
            id: '502',
            conversationId: '5',
            content: "I'm still working on it. Should be done by tomorrow.",
            timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60000),
            isMe: true,
            isRead: true,
            senderId: 'me',
        },
        {
            id: '503',
            conversationId: '5',
            content: "OK. Let me know when it's ready.",
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60000),
            isMe: false,
            isRead: true,
            senderId: '5',
            senderName: 'Hoàng Văn E',
            senderAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79',
        },
        {
            id: '504',
            conversationId: '5',
            content: "I've finished the report. Just sent it to you.",
            timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60000),
            isMe: true,
            isRead: true,
            senderId: 'me',
        },
        {
            id: '505',
            conversationId: '5',
            content: 'Let me check and get back to you',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
            isMe: false,
            isRead: true,
            senderId: '5',
            senderName: 'Hoàng Văn E',
            senderAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79',
        },
    ],
    '6': []
};

// Create the context with a default undefined value
const MessageContext = createContext<MessageContextType>({} as MessageContextType);

// Provider component
interface MessageProviderProps {
    children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
    const [activeConversationId, setActiveConversationId] = useState<string>('');
    const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(sampleMessages);

    const messages = activeConversationId ? allMessages[activeConversationId] || [] : [];

    const sendMessage = (content: string) => {
        if (!activeConversationId || !content.trim()) return;

        const newMessage: Message = {
            id: uuidv4(),
            conversationId: activeConversationId,
            content,
            timestamp: new Date(),
            isMe: true,
            isRead: false,
            senderId: 'me',
        };

        setAllMessages(prev => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
        }));

        setConversations(prev =>
            prev.map(conv =>
                conv.id === activeConversationId
                    ? {
                        ...conv,
                        lastMessage: content,
                        timestamp: new Date(),
                    }
                    : conv
            )
        );
    };

    const createNewConversation = (name: string): string => {
        const newId = uuidv4();
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
    };

    const markAsRead = (conversationId: string) => {
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
    };

    useEffect(() => {
        if (activeConversationId) {
            markAsRead(activeConversationId);
        }
    }, [activeConversationId, markAsRead]);

    const value = {
        conversations,
        activeConversationId,
        messages,
        setActiveConversationId,
        sendMessage,
        createNewConversation,
        markAsRead,
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
