import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, X, UserCog, Users } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Conversation } from './MessageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import FreelancerSelectionModal from './FreelancerSelectionModal';
import AdminSelectionModal from './AdminSelectionModal';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

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
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isFreelancerModalOpen, setIsFreelancerModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isMultiTabModalOpen, setIsMultiTabModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isClient, setIsClient] = useState(false);
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Get user info from localStorage
    useEffect(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                setCurrentUserId(userInfo.userId);

                // Set user roles - properly check for roles
                const hasAdminRole = userInfo.isAdmin || userInfo.role === 'ADMIN';
                const hasFreelancerRole = userInfo.freelancerId || userInfo.role === 'FREELANCER';

                setIsAdmin(hasAdminRole);
                setIsFreelancer(hasFreelancerRole && !hasAdminRole);
                setIsClient(!hasFreelancerRole && !hasAdminRole);

                console.log('User roles:', {
                    isAdmin: hasAdminRole,
                    isFreelancer: hasFreelancerRole && !hasAdminRole,
                    isClient: !hasFreelancerRole && !hasAdminRole
                });
            } catch (e) {
                console.error('Error parsing userInfo:', e);
            }
        }
    }, []);

    const handleConversationClick = (conversationId: string) => {
        onSelectConversation(conversationId);
        navigate(`/messaging?contactId=${conversationId}`, { replace: true });
    };

    const filteredConversations = conversations.filter((conversation) =>
        conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const hasConversations = filteredConversations.length > 0;

    const clearSearch = () => {
        setSearchQuery('');
    };

    // Multi-tab modal component
    const ClientChatModal = () => {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setIsMultiTabModalOpen(false)}>
                <div className="bg-background rounded-lg shadow-lg w-full max-w-lg overflow-hidden"
                    onClick={(e) => e.stopPropagation()}>
                    <Tabs defaultValue="freelancers" className="w-full">
                        <div className="px-4 pt-4 pb-2">
                            <h3 className="text-lg font-semibold mb-3">Bắt đầu cuộc trò chuyện mới</h3>
                            <TabsList className="grid grid-cols-2 w-full">
                                <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
                                <TabsTrigger value="admins">Admins</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="freelancers" className="p-4 pt-2">
                            <FreelancerSelectionModal
                                isOpen={true}
                                onClose={() => setIsMultiTabModalOpen(false)}
                                clientId={currentUserId}
                                embedded={true}
                            />
                        </TabsContent>

                        <TabsContent value="admins" className="p-4 pt-2">
                            <AdminSelectionModal
                                isOpen={true}
                                onClose={() => setIsMultiTabModalOpen(false)}
                                embedded={true}
                            />
                        </TabsContent>

                        <div className="border-t p-3 flex justify-end">
                            <Button variant="outline" onClick={() => setIsMultiTabModalOpen(false)}>
                                Đóng
                            </Button>
                        </div>
                    </Tabs>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col border-r">
            <div className="p-3 md:p-4 border-b">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Danh sách tin nhắn</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm tin nhắn"
                        className="pl-9 pr-8 text-sm py-1.5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1">
                {!hasConversations ? (
                    <div className="flex flex-col items-center justify-center h-32 p-4">
                        <p className="text-muted-foreground text-center text-sm">
                            {searchQuery ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có cuộc trò chuyện nào'}
                        </p>
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                className="mt-2 text-xs p-2 h-auto"
                                onClick={clearSearch}
                            >
                                Xóa tìm kiếm
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="p-2">
                        {filteredConversations.map((conversation) => (
                            <motion.div
                                key={conversation.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleConversationClick(conversation.id)}
                                className={`flex items-center p-2 rounded-lg cursor-pointer mb-1 ${activeConversationId === conversation.id
                                    ? 'bg-primary/10 border-l-4 border-primary'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-2 md:mr-3">
                                        <AvatarImage src={conversation.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {conversation.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {conversation.isOnline && (
                                        <span className="absolute bottom-0 right-1 md:right-2 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-green-500 border-2 border-background"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold truncate text-sm md:text-base">{conversation.name}</h3>
                                        <span className="text-[10px] md:text-xs text-muted-foreground ml-1 flex-shrink-0">
                                            {format(new Date(conversation.timestamp), 'HH:mm')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs md:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-[180px] md:max-w-[140px] lg:max-w-[200px]">
                                            {conversation.lastMessage || 'Chưa có tin nhắn nào'}
                                        </p>
                                        {conversation.unread > 0 && (
                                            <motion.span
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ repeat: 3, duration: 0.3 }}
                                                className="bg-primary text-primary-foreground text-[10px] md:text-xs rounded-full h-4 min-w-4 md:h-5 md:min-w-5 flex items-center justify-center px-1 ml-1 flex-shrink-0"
                                            >
                                                {conversation.unread}
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="p-3 md:p-4">
                {/* Admin doesn't have a new message button */}
                {!isAdmin && (
                    <Button
                        className="flex items-center justify-center w-full p-1.5 md:p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
                        onClick={() => {
                            if (isFreelancer) {
                                // Freelancer can only chat with admins
                                setIsAdminModalOpen(true);
                            } else if (isClient) {
                                // Client gets the tab interface
                                setIsMultiTabModalOpen(true);
                            }
                        }}
                    >
                        <Plus className="h-4 w-4 mr-1 md:mr-2" />
                        {isFreelancer ? 'Admin hỗ trợ' : 'Tin nhắn mới'}
                    </Button>
                )}
            </div>

            {/* Regular AdminSelectionModal for Freelancers */}
            {isFreelancer && (
                <AdminSelectionModal
                    isOpen={isAdminModalOpen}
                    onClose={() => setIsAdminModalOpen(false)}
                />
            )}

            {/* Multi-tab modal for clients */}
            {isMultiTabModalOpen && <ClientChatModal />}
        </div>
    );
};

export default ConversationList;