import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Message } from './MessageContext';

interface ChatContentProps {
    messages: Message[];
    currentUserId?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({
    messages,
}) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollableArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollableArea) {
                scrollableArea.scrollTop = scrollableArea.scrollHeight;
            }
        }
    }, [messages]);

    // Xử lý trường hợp không có tin nhắn
    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="text-center text-muted-foreground">
                    <p>Chưa có tin nhắn nào.</p>
                    <p>Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
            </div>
        );
    }

    // Group messages by date
    const groupedMessages: { [key: string]: Message[] } = messages.reduce((groups, message) => {
        const date = message.timestamp.toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {} as { [key: string]: Message[] });

    // Format date as a human-readable string
    const formatDateHeader = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    return (
        <div className="flex-1 flex flex-col" ref={scrollAreaRef}>
            <ScrollArea className="flex-1 p-4">
                {Object.keys(groupedMessages).map((date, index) => (
                    <div key={date}>
                        <div className="flex justify-center my-4">
                            <FadeInWhenVisible delay={index * 0.1}>
                                <div className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                                    {formatDateHeader(date)}
                                </div>
                            </FadeInWhenVisible>
                        </div>

                        {groupedMessages[date].map((message) => (
                            <FadeInWhenVisible key={message.id} delay={0.05}>
                                <ChatMessage
                                    content={message.content}
                                    timestamp={message.timestamp}
                                    isMe={message.isMe}
                                    isRead={message.isRead}
                                    senderName={message.senderName}
                                    senderAvatar={message.senderAvatar}
                                />
                            </FadeInWhenVisible>
                        ))}
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
};

export default ChatContent;