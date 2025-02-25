import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';


// Import chat components
import { MessageProvider, useMessages } from './ChatComponents/MessageContext';
import ConversationList from './ChatComponents/ConversationList';
import ChatHeader from './ChatComponents/ChatHeader';
import ChatContent from './ChatComponents/ChatContent';
import ChatInput from './ChatComponents/ChatInput';
import EmptyState from './ChatComponents/EmptyState';
import MessageInfoPanel from './ChatComponents/MessageInfoPanel';
import websocketService from './ChatComponents/websocketService';
import chatApiService from './ChatComponents/chatApiService';

// Component to show connection status
const ConnectionStatus: React.FC = () => {
    const { isConnected, reconnecting } = useMessages();

    if (isConnected) {
        return null; // Don't show anything when connected
    }

    return (
        <Alert variant="destructive" className="fixed bottom-4 right-4 max-w-md z-50 flex items-center">
            {reconnecting ? (
                <>
                    <AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
                    <AlertDescription>
                        Đang kết nối lại với máy chủ...
                    </AlertDescription>
                </>
            ) : (
                <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>
                        Mất kết nối. Vui lòng kiểm tra kết nối mạng của bạn.
                    </AlertDescription>
                </>
            )}
        </Alert>
    );
};

// Dialog component for creating a new conversation
const NewConversationDialog: React.FC<{
    open: boolean;
    onClose: () => void;
    onCreateConversation: (name: string) => void;
}> = ({ open, onClose, onCreateConversation }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreateConversation(name);
            setName('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tạo cuộc trò chuyện mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="py-4">
                        <Input
                            placeholder="Tên người nhận"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mb-4"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={!name.trim()}>
                            Tạo
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Main component that uses MessageContext
const MessagingContent: React.FC = () => {
    const {
        conversations,
        activeConversationId,
        messages,
        isConnected,
        reconnecting,
        setActiveConversationId,
        sendMessage,
        createNewConversation,
        markAsRead
    } = useMessages();

    const [isNewConversationDialogOpen, setIsNewConversationDialogOpen] = useState(false);
    const [showInfoPanel, setShowInfoPanel] = useState(false);

    // Find the active conversation
    const activeConversation = conversations.find(conv => conv.id === activeConversationId);

    // Handle creating a new conversation
    const handleCreateNewConversation = (name: string) => {
        const newId = createNewConversation(name);
        setActiveConversationId(newId);
    };

    // Handle sending messages, with connection check
    const handleSendMessage = (content: string) => {
        if (!isConnected) {
            alert('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối mạng của bạn.');
            return;
        }
        sendMessage(content);
    };

    // Mark messages as read when active conversation changes
    useEffect(() => {
        if (activeConversationId) {
            markAsRead(activeConversationId);
        }
    }, [activeConversationId, markAsRead]);

    // Toggle info panel
    const toggleInfoPanel = () => {
        setShowInfoPanel(prevState => !prevState);
    };

    return (
        <div className="py-6">
            <div className="container mx-auto px-4">
                <FadeInWhenVisible>
                    <h1 className="text-3xl font-bold mb-6">Tin nhắn</h1>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.1}>
                    <Card className="flex flex-col md:flex-row min-h-[calc(100vh-200px)]">
                        {/* Conversation list (left sidebar) */}
                        <div className="w-full md:w-80 flex-shrink-0 border-r">
                            <ConversationList
                                conversations={conversations}
                                activeConversationId={activeConversationId}
                                onSelectConversation={setActiveConversationId}
                                onNewConversation={() => setIsNewConversationDialogOpen(true)}
                            />
                        </div>

                        {/* Chat area (main content) */}
                        <div className="flex-1 flex flex-col h-[calc(100vh-200px)]">
                            {activeConversation ? (
                                <>
                                    <ChatHeader
                                        name={activeConversation.name}
                                        avatar={activeConversation.avatar}
                                        isOnline={activeConversation.isOnline}
                                        lastSeen={activeConversation.lastSeen}
                                        onInfoClick={toggleInfoPanel}
                                    />
                                    <ChatContent
                                        messages={messages}
                                        currentUserId={localStorage.getItem('userId') || ''}
                                    />
                                    <ChatInput
                                        onSendMessage={handleSendMessage}
                                    />
                                </>
                            ) : (
                                <EmptyState
                                    title="Chọn cuộc trò chuyện"
                                    description="Chọn một cuộc trò chuyện từ danh sách bên trái hoặc tạo cuộc trò chuyện mới."
                                    icon={<MessageSquare className="h-12 w-12 text-primary" />}
                                    actionLabel="Tạo cuộc trò chuyện mới"
                                    onAction={() => setIsNewConversationDialogOpen(true)}
                                />
                            )}
                        </div>

                        {/* Info panel (right sidebar) - conditionally rendered */}
                        {showInfoPanel && activeConversation && (
                            <div className="hidden md:block w-80 flex-shrink-0">
                                <MessageInfoPanel
                                    contact={{
                                        id: activeConversation.id,
                                        name: activeConversation.name,
                                        avatar: activeConversation.avatar,
                                        isOnline: activeConversation.isOnline,
                                        description: "TalentHub User"
                                    }}
                                    onClose={toggleInfoPanel}
                                />
                            </div>
                        )}
                    </Card>
                </FadeInWhenVisible>
            </div>

            {/* Show connection status alerts */}
            <ConnectionStatus />

            {/* Dialog to create new conversation */}
            <NewConversationDialog
                open={isNewConversationDialogOpen}
                onClose={() => setIsNewConversationDialogOpen(false)}
                onCreateConversation={handleCreateNewConversation}
            />
        </div>
    );
};

// Wrapper component that provides MessageContext
const MessagingPage: React.FC = () => {
    // Check if user ID exists in localStorage and log services initialization
    useEffect(() => {
        let userId = JSON.parse(localStorage.getItem('userInfo') || '').userId;
        console.log('User ID:', userId);
        console.log('WebSocket Service initialized:', websocketService);
        console.log('Chat API Service initialized:', chatApiService);
    }, []);

    return (
        <MessageProvider>
            <MessagingContent />
        </MessageProvider>
    );
};

export default MessagingPage;