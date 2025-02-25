
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Conversation } from './MessageContext';

interface ConversationListProps {
    conversations: Conversation[];
    activeConversationId: string;
    onSelectConversation: (id: string) => void;
    onNewConversation?: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter conversations based on search query
    const filteredConversations = conversations.filter((conversation) =>
        conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Xử lý khi không có cuộc trò chuyện nào
    const hasConversations = filteredConversations.length > 0;

    return (
        <div className="h-full flex flex-col border-r">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold mb-4">Danh sách tin nhắn</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder='Tìm kiếm tin nhắn'
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                {!hasConversations ? (
                    <div className="flex flex-col items-center justify-center h-32 p-4">
                        <p className="text-muted-foreground text-center">
                            Không tìm thấy cuộc trò chuyện nào
                        </p>
                    </div>
                ) : (
                    <div className="p-2">
                        {filteredConversations.map((conversation) => (
                            <motion.div
                                key={conversation.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelectConversation(conversation.id)}
                                className={`flex items-center p-2 rounded-lg cursor-pointer mb-1 ${activeConversationId === conversation.id
                                    ? 'bg-primary/10'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 mr-3">
                                        <AvatarImage src={conversation.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {conversation.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {conversation.isOnline && (
                                        <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold truncate">{conversation.name}</h3>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(conversation.timestamp), 'HH:mm')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground truncate">
                                            {conversation.lastMessage || 'Chưa có tin nhắn nào'}
                                        </p>
                                        {conversation.unread > 0 && (
                                            <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                                                {conversation.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="p-4 border-t">
                <button
                    className="flex items-center justify-center w-full p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    onClick={onNewConversation}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Tin nhắn mới
                </button>
            </div>
        </div>
    );
};

export default ConversationList;
