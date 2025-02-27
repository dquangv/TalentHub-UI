// ChatMessage.tsx - Optimized for responsiveness
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { CheckCheck, Check } from 'lucide-react';

export interface MessageProps {
    content: string;
    timestamp: Date;
    isMe: boolean;
    isRead?: boolean;
    senderName?: string;
    senderAvatar?: string;
}

const ChatMessage: React.FC<MessageProps> = ({
    content,
    timestamp,
    isMe,
    isRead = false,
    senderName,
    senderAvatar,
}) => {
    // Format time to hours and minutes
    const timeString = format(timestamp, 'HH:mm');

    return (
        <div
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3 relative group`}
        >
            {!isMe && (
                <div className="flex-shrink-0 mr-1.5 md:mr-2">
                    <Avatar className="w-6 h-6 md:w-8 md:h-8">
                        <AvatarImage src={senderAvatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] md:text-xs">
                            {senderName?.slice(0, 2).toUpperCase() || 'UN'}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}

            <div
                className={`max-w-[70%] sm:max-w-[65%] md:max-w-xs lg:max-w-md ${isMe
                        ? 'bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                        : 'bg-muted rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                    } px-3 py-2 md:px-4 md:py-2 break-words text-sm md:text-base`}
            >
                {content}
                <div
                    className={`flex items-center justify-end gap-0.5 text-[10px] md:text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                >
                    <span>{timeString}</span>
                    {isMe && (
                        <span className="ml-0.5 md:ml-1">
                            {isRead ? (
                                <CheckCheck className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary-foreground/70" />
                            ) : (
                                <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary-foreground/70" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;