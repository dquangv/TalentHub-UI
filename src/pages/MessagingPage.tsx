import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageProvider, useMessages } from './ChatComponents/MessageContext';
import ConversationList from './ChatComponents/ConversationList';
import ChatHeader from './ChatComponents/ChatHeader';
import ChatContent from './ChatComponents/ChatContent';
import ChatInput from './ChatComponents/ChatInput';
import EmptyState from './ChatComponents/EmptyState';

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
        setActiveConversationId,
        sendMessage,
        createNewConversation
    } = useMessages();

    const [isNewConversationDialogOpen, setIsNewConversationDialogOpen] = useState(false);

    // Find the active conversation
    const activeConversation = conversations.find(conv => conv.id === activeConversationId);

    // Handle creating a new conversation
    const handleCreateNewConversation = (name: string) => {
        const newId = createNewConversation(name);
        setActiveConversationId(newId);
    };

    return (
        <div className="py-6">
            <div className="container mx-auto px-4">
                <FadeInWhenVisible>
                    <h1 className="text-3xl font-bold mb-6">Tin nhắn</h1>
                </FadeInWhenVisible>

                <FadeInWhenVisible delay={0.1}>
                    <Card className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 min-h-[calc(100vh-200px)]">
                        {/* Conversation list (left sidebar) */}
                        <div className="md:col-span-1 border-r">
                            <ConversationList
                                conversations={conversations}
                                activeConversationId={activeConversationId}
                                onSelectConversation={setActiveConversationId}
                                onNewConversation={() => setIsNewConversationDialogOpen(true)}
                            />
                        </div>

                        {/* Chat area (main content) */}
                        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-[calc(100vh-200px)]">
                            {activeConversation ? (
                                <>
                                    <ChatHeader
                                        name={activeConversation.name}
                                        avatar={activeConversation.avatar}
                                        isOnline={activeConversation.isOnline}
                                        lastSeen={activeConversation.lastSeen}
                                    />
                                    <ChatContent
                                        messages={messages}
                                    />
                                    <ChatInput
                                        onSendMessage={sendMessage}
                                    />
                                </>
                            ) : (
                                <EmptyState
                                    title="Chọn cuộc trò chuyện"
                                    description="Chọn một cuộc trò chuyện từ danh sách bên trái hoặc tạo cuộc trò chuyện mới."
                                    icon={<MessageSquare className="h-8 w-8 text-primary" />}
                                    actionLabel="Tạo cuộc trò chuyện mới"
                                    onAction={() => setIsNewConversationDialogOpen(true)}
                                />
                            )}
                        </div>
                    </Card>
                </FadeInWhenVisible>
            </div>

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
    return (
        <MessageProvider>
            <MessagingContent />
        </MessageProvider>
    );
};

export default MessagingPage;