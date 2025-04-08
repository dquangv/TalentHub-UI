import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useMessages } from '@/pages/ChatComponents/MessageContext';
import { Empty } from 'antd';

const MessageDropdown = () => {
    const { conversations, setActiveConversationId } = useMessages();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const count = conversations.reduce((acc, conv) => acc + conv.unread, 0);
        setUnreadCount(count);
    }, [conversations]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] min-w-[18px] h-[18px] flex items-center justify-center" variant="destructive">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                    <h2 className="font-semibold">Tin nhắn</h2>
                    <a href="/messaging" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        Xem tất cả
                    </a>
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                    {conversations.length > 0 ? (
                        conversations.slice(0, 5).map((conv) => (
                            <DropdownMenuItem key={conv.id} className="px-4 py-2 focus:bg-primary/10 cursor-pointer">
                                <a
                                    href={`/messaging`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 w-full"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.open(`/messaging?contactId=${conv.id}`, '_blank');
                                    }}
                                >
                                    <div className="relative flex-shrink-0">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={conv.avatar} />
                                            <AvatarFallback>{conv.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        {conv.isOnline && (
                                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-background"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-medium text-sm truncate">{conv.name}</h3>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                                {format(new Date(conv.timestamp), 'HH:mm')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                    {conv.unread > 0 && (
                                        <Badge className="ml-auto" variant="default">
                                            {conv.unread}
                                        </Badge>
                                    )}
                                </a>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <Empty description={<p className="text-sm">Chưa có tin nhắn nào</p>} />
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MessageDropdown;