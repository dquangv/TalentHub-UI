import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Menu, X } from 'lucide-react';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';

// Import existing components
import { MessageProvider, useMessages } from './ChatComponents/MessageContext';
import ConversationList from './ChatComponents/ConversationList';
import ChatHeader from './ChatComponents/ChatHeader';
import ChatContent from './ChatComponents/ChatContent';
import ChatInput from './ChatComponents/ChatInput';
import EmptyState from './ChatComponents/EmptyState';
import MessageInfoPanel from './ChatComponents/MessageInfoPanel';
import ConnectionStatus from './ChatComponents/ConnectionStatus';

// Dialog component for creating a new conversation
const NewConversationDialog = ({ open, onClose, onCreateConversation }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onCreateConversation(name);
            setName('');
            onClose();
        }
    };

    const handleClose = () => {
        setName('');
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md mx-auto sm:max-w-md">
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
                            autoFocus
                        />
                    </div>
                    <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-end">
                        <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                            Hủy
                        </Button>
                        <Button type="submit" disabled={!name.trim()} className="w-full sm:w-auto">
                            Tạo
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Main component that uses MessageContext
const MessagingContent = () => {
    const {
        conversations,
        activeConversationId,
        messages,
        isConnected,
        setActiveConversationId,
        sendMessage,
        createNewConversation,
        markAsRead
    } = useMessages();

    const [isNewConversationDialogOpen, setIsNewConversationDialogOpen] = useState(false);
    const [showInfoPanel, setShowInfoPanel] = useState(false);
    const [showConversationList, setShowConversationList] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Check viewport dimensions on initial load and resize
    const checkViewportSize = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
        setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);

        // Ensure conversation list is visible on larger screens
        if (window.innerWidth >= 768) {
            setShowConversationList(true);
        }
    }, []);

    // Initialize and set up resize listener
    useEffect(() => {
        checkViewportSize();

        const handleResize = () => {
            checkViewportSize();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [checkViewportSize]);

    // Toggle sidebar on mobile/tablet
    const toggleConversationList = () => {
        setShowConversationList(prev => !prev);
        // Close info panel if opening conversation list on mobile
        if (!showConversationList && isMobile && showInfoPanel) {
            setShowInfoPanel(false);
        }
    };

    // Find the active conversation
    const activeConversation = conversations.find(conv => conv.id === activeConversationId);

    // Handle creating a new conversation
    const handleCreateNewConversation = (name) => {
        const newId = createNewConversation(name);
        setActiveConversationId(newId);
        // Close mobile conversation list when selecting a new one
        if (isMobile) {
            setShowConversationList(false);
        }
    };

    // Handle selecting conversation on mobile/tablet
    const handleSelectConversation = (id) => {
        setActiveConversationId(id);
        // Close mobile conversation list when selecting one
        if (isMobile) {
            setShowConversationList(false);
        }
        // Close info panel if it was open
        if (showInfoPanel && (isMobile || isTablet)) {
            setShowInfoPanel(false);
        }
    };

    // Handle sending messages, with connection check
    const handleSendMessage = (content) => {
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
        // On mobile/tablet, close the conversation list if info panel is shown
        if ((isMobile || isTablet) && !showInfoPanel) {
            setShowConversationList(false);
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] py-2 sm:py-4 md:py-6">
            <div className="container h-full px-2 mx-auto md:px-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                    <FadeInWhenVisible>
                        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Tin nhắn</h1>
                    </FadeInWhenVisible>

                    {/* Mobile menu toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={toggleConversationList}
                    >
                        {showConversationList ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                <FadeInWhenVisible delay={0.1}>
                    <Card className="flex flex-col h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] overflow-hidden lg:flex-row">
                        {/* Conversation list (left sidebar) - toggleable on mobile/tablet */}
                        <div
                            className={`
                                ${showConversationList ? 'block' : 'hidden'} 
                                md:block w-full md:w-80 lg:w-72 xl:w-80 md:flex-shrink-0 md:border-r
                                ${isMobile ? 'fixed inset-0 z-50 pt-16 bg-background' : 'relative z-10'}
                                h-[calc(100vh-8rem)] md:h-auto
                            `}
                        >
                            {isMobile && showConversationList && (
                                <div className="absolute top-2 right-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleConversationList}
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}
                            <ConversationList
                                conversations={conversations}
                                activeConversationId={activeConversationId}
                                onSelectConversation={handleSelectConversation}
                                onNewConversation={() => setIsNewConversationDialogOpen(true)}
                            />
                        </div>

                        {/* Chat area (main content) */}
                        <div
                            className={`
                                flex-1 flex flex-col h-full overflow-hidden
                                ${(isMobile && showConversationList) ? 'hidden' : 'flex'}
                                ${(showInfoPanel && (isMobile || isTablet)) ? 'hidden' : 'flex'}
                            `}
                        >
                            {activeConversation ? (
                                <>
                                    <ChatHeader
                                        name={activeConversation.name}
                                        avatar={activeConversation.avatar}
                                        isOnline={activeConversation.isOnline}
                                        lastSeen={activeConversation.lastSeen}
                                        onInfoClick={toggleInfoPanel}
                                        onBackClick={isMobile ? toggleConversationList : undefined}
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <ChatContent
                                            messages={messages}
                                            currentUserId={localStorage.getItem('userId') || ''}
                                        />
                                    </div>
                                    <ChatInput
                                        onSendMessage={handleSendMessage}
                                    />
                                </>
                            ) : (
                                <EmptyState
                                    title="Chọn cuộc trò chuyện"
                                    description="Chọn một cuộc trò chuyện từ danh sách hoặc tạo cuộc trò chuyện mới."
                                    icon={<MessageSquare className="w-10 h-10 md:h-12 md:w-12 text-primary" />}
                                    actionLabel="Tạo cuộc trò chuyện mới"
                                    onAction={() => setIsNewConversationDialogOpen(true)}
                                />
                            )}
                        </div>

                        {/* Info panel (right sidebar) - conditionally rendered */}
                        {showInfoPanel && activeConversation && (
                            <div
                                className={`
                                    ${(isMobile || isTablet) ? 'fixed inset-0 z-50 bg-background' : 'hidden lg:block'}
                                    lg:w-72 xl:w-80 lg:flex-shrink-0
                                `}
                            >
                                <MessageInfoPanel
                                    contact={{
                                        id: activeConversation.id,
                                        name: activeConversation.name,
                                        avatar: activeConversation.avatar,
                                        isOnline: activeConversation.isOnline,
                                        description: "TalentHub User"
                                    }}
                                    onClose={toggleInfoPanel}
                                    isMobile={isMobile || isTablet}
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
const MessagingPage = () => {
    return (
        <MessageProvider>
            <MessagingContent />
        </MessageProvider>
    );
};

export default MessagingPage;