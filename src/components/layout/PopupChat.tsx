import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import websocketService from '@/pages/ChatComponents/websocketService';
import { v4 as uuidv4 } from 'uuid';
import chatApiService from '@/pages/ChatComponents/chatApiService';

interface Message {
    id: string;
    content: string;
    isMe: boolean;
    timestamp: Date;
    isRead: boolean;
}

interface PopupChatProps {
    contactId: string;
    contactName: string;
    contactAvatar?: string;
    isOnline?: boolean;
    onClose: () => void;
}

const PopupChat: React.FC<PopupChatProps> = ({
    contactId,
    contactName,
    contactAvatar,
    isOnline = false,
    onClose
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = userInfo.userId;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const response = await chatApiService.getMessages(userId, contactId);

                const formattedMessages = response.map((msg: any) => ({
                    id: msg.id || uuidv4(),
                    content: msg.content,
                    isMe: msg.senderId === userId,
                    timestamp: new Date(msg.timestamp || Date.now()),
                    isRead: msg.isRead
                }));

                setMessages(formattedMessages);

                if (websocketService.isConnected()) {
                    websocketService.markAsRead(contactId);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([
                    {
                        id: '1',
                        content: 'Xin chào, tôi quan tâm đến dự án của bạn',
                        isMe: false,
                        timestamp: new Date(Date.now() - 3600000 * 2),
                        isRead: true
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId && contactId) {
            fetchMessages();
        }

    }, [contactId, userId]);

    useEffect(() => {
        if (!isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isMinimized]);

    useEffect(() => {
        if (!userId || !contactId) return;

        const handleNewMessage = (message: any) => {
            if ((message.senderId === contactId && message.receiverId === userId) ||
                (message.senderId === userId && message.receiverId === contactId)) {

                const newMessage = {
                    id: message.id || uuidv4(),
                    content: message.content,
                    isMe: message.senderId === userId,
                    timestamp: new Date(message.timestamp || new Date()),
                    isRead: false
                };

                setMessages(prev => [...prev, newMessage]);

                if (!newMessage.isMe && websocketService.isConnected()) {
                    websocketService.markAsRead(contactId);
                }

                if (isMinimized && !newMessage.isMe) {
                    const popupHeader = document.getElementById(`popup-header-${contactId}`);
                    if (popupHeader) {
                        popupHeader.classList.add('animate-pulse', 'bg-primary/80');
                        setTimeout(() => {
                            popupHeader.classList.remove('animate-pulse', 'bg-primary/80');
                        }, 2000);
                    }
                }
            }
        };

        if (websocketService.isConnected()) {
            websocketService.markAsRead(contactId);
        }

        return () => {
        };
    }, [contactId, userId, isMinimized]);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: uuidv4(),
            content: inputMessage,
            isMe: true,
            timestamp: new Date(),
            isRead: false
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        if (websocketService.isConnected()) {
            websocketService.sendMessage(contactId, inputMessage);
        }

        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const unreadCount = messages.filter(msg => !msg.isMe && !msg.isRead).length;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-80 rounded-lg shadow-lg flex flex-col bg-background border overflow-hidden"
                style={{ height: isMinimized ? 'auto' : '400px' }}
            >
                {/* Header */}
                <div
                    id={`popup-header-${contactId}`}
                    className="p-3 border-b bg-primary text-primary-foreground flex items-center justify-between cursor-pointer"
                    onClick={isMinimized ? toggleMinimize : undefined}
                >
                    <div className="flex items-center">
                        <div className="relative mr-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={contactAvatar} alt={contactName} />
                                <AvatarFallback>
                                    {contactName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {isOnline && (
                                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-primary"></span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">{contactName}</h3>
                            <p className="text-xs opacity-80">{isOnline ? 'Đang hoạt động' : 'Không hoạt động'}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground" onClick={toggleMinimize}>
                            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {isMinimized && unreadCount > 0 && (
                    <div className="p-2 bg-primary/10 text-center">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                            {unreadCount} tin nhắn mới
                        </Badge>
                    </div>
                )}

                {!isMinimized && (
                    <>
                        <div className="flex-1 p-3 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex justify-center items-center h-full text-center p-4">
                                    <div className="text-muted-foreground">
                                        <p className="text-sm">Không có tin nhắn nào</p>
                                        <p className="text-xs mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`mb-3 flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {!message.isMe && (
                                            <Avatar className="h-6 w-6 mr-2 flex-shrink-0 mt-1">
                                                <AvatarImage src={contactAvatar} />
                                                <AvatarFallback>{contactName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="max-w-[80%]">
                                            <div
                                                className={`p-2 rounded-lg text-sm ${message.isMe
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-muted rounded-bl-none'
                                                    }`}
                                            >
                                                {message.content}
                                            </div>
                                            <div className={`text-xs mt-1 text-muted-foreground flex items-center ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                                                {format(new Date(message.timestamp), 'HH:mm')}
                                                {message.isMe && (
                                                    <span className="ml-1">
                                                        {message.isRead ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M18 6L9.7 16.3l-4-3.6"></path>
                                                                <path d="M18 14L9.7 24.3l-4-3.6"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M20 6L9 17l-5-5"></path>
                                                            </svg>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 border-t">
                            <div className="flex items-center">
                                <Textarea
                                    ref={inputRef}
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 text-sm resize-none min-h-[40px] max-h-20 py-2"
                                    rows={1}
                                />
                                <Button
                                    size="icon"
                                    className="ml-2 h-8 w-8 rounded-full"
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default PopupChat;