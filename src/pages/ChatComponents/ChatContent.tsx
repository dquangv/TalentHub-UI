// Updated ChatContent.tsx with improved mobile support
import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Message } from './MessageContext';
import ChatMessage from './ChatMessage';

interface ChatContentProps {
    messages: Message[];
    currentUserId?: string;
}

const ChatContent: React.FC<ChatContentProps> = ({
    messages,
}) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    // Handle viewport height changes (especially important on mobile)
    useEffect(() => {
        const handleResize = () => {
            // Use a slight delay to ensure we get the final height after UI adjustments
            setTimeout(() => {
                setViewportHeight(window.innerHeight);
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Also handle when virtual keyboard appears/disappears
        window.visualViewport?.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
            window.visualViewport?.removeEventListener('resize', handleResize);
        };
    }, []);

    // Scroll to bottom whenever messages change or viewport height changes
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollableArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollableArea) {
                scrollableArea.scrollTop = scrollableArea.scrollHeight;
            }
        }
    }, [messages, viewportHeight]);

    // Handle case with no messages
    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-4">
                <div className="text-center text-muted-foreground">
                    <p className="text-sm md:text-base">Chưa có tin nhắn nào.</p>
                    <p className="text-sm md:text-base">Hãy bắt đầu cuộc trò chuyện!</p>
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
        <div className="h-full w-full relative" ref={scrollAreaRef}>
            <ScrollArea className="h-full w-full p-2 md:p-4 mobile-chat-scroll">
                <div className="pb-1 mb-2">
                    {Object.keys(groupedMessages).map((date, index) => (
                        <div key={date}>
                            <div className="flex justify-center my-2 md:my-4">
                                <FadeInWhenVisible delay={index * 0.1}>
                                    <div className="px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs rounded-full bg-muted text-muted-foreground">
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
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatContent;