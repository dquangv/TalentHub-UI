import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Menu, Info, } from 'lucide-react';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { MessageProvider, useMessages } from './ChatComponents/MessageContext';
import { CallProvider, useCall } from './ChatComponents/CallContext';
import ConversationList from './ChatComponents/ConversationList';
import ChatHeader from './ChatComponents/ChatHeader';
import ChatContent from './ChatComponents/ChatContent';
import ChatInput from './ChatComponents/ChatInput';
import EmptyState from './ChatComponents/EmptyState';
import MessageInfoPanel from './ChatComponents/MessageInfoPanel';
import ConnectionStatus from './ChatComponents/ConnectionStatus';
import MobileDrawer from './ChatComponents/MobileDrawer';
import VideoCallDialog from './ChatComponents/VideoCallDialog';
import { useSearchParams } from 'react-router-dom';
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

const MessagingContent = ({ contactId }) => {
    const {
        conversations,
        activeConversationId,
        checkAndCreateConversation,
        messages,
        isConnected,
        setActiveConversationId,
        sendMessage,
        createNewConversation,
        markAsRead
    } = useMessages();
    useEffect(() => {
        if (contactId) {
            checkAndCreateConversation(contactId);
        }
    }, [contactId, checkAndCreateConversation]);
    const {
        isInCall,
        isCallActive,
        isOutgoingCall,
        callStatus,
        callerInfo,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo
    } = useCall();

    const [isNewConversationDialogOpen, setIsNewConversationDialogOpen] = useState(false);
    const [showInfoPanel, setShowInfoPanel] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // State for mobile drawers
    const [showConversationDrawer, setShowConversationDrawer] = useState(false);
    const [showInfoDrawer, setShowInfoDrawer] = useState(false);

    // Check viewport dimensions on initial load and resize
    const checkViewportSize = useCallback(() => {
        const mobile = window.innerWidth < 768;
        const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;

        setIsMobile(mobile);
        setIsTablet(tablet);

        // On desktop, we always show the conversation list in the layout
        // (not as a drawer)
        if (!mobile) {
            setShowConversationDrawer(false);
        }
    }, []);
    useEffect(() => {
        const handleSelectConversation = (event: CustomEvent<any>) => {
            const { conversationId } = event.detail;
            if (conversationId) {
                setActiveConversationId(conversationId);
            }
        };

        window.addEventListener('select-conversation', handleSelectConversation as EventListener);

        return () => {
            window.removeEventListener('select-conversation', handleSelectConversation as EventListener);
        };
    }, [setActiveConversationId]);
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

    const toggleConversationDrawer = () => {
        setShowConversationDrawer(prev => !prev);
        if (!showConversationDrawer && showInfoDrawer) {
            setShowInfoDrawer(false);
        }
    };

    const toggleInfoPanel = () => {
        if (isMobile || isTablet) {
            setShowInfoDrawer(prev => !prev);
            if (!showInfoDrawer && showConversationDrawer) {
                setShowConversationDrawer(false);
            }
        } else {
            setShowInfoPanel(prev => !prev);
        }
    };

    const activeConversation = conversations.find(conv => conv.id === activeConversationId);

    const handleCreateNewConversation = (name) => {
        const newId = createNewConversation(name);
        setActiveConversationId(newId);
        if (isMobile) {
            setShowConversationDrawer(false);
        }
    };

    // Handle selecting conversation
    const handleSelectConversation = (id) => {
        setActiveConversationId(id);
        // Close mobile drawer when selecting one
        if (isMobile) {
            setShowConversationDrawer(false);
        }
        // Close info panel if it was open on tablet
        if (showInfoPanel && isTablet) {
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

    const handleEndCall = () => {
        endCall();
    };

    useEffect(() => {
        if (activeConversationId) {
            markAsRead(activeConversationId);
        }
    }, [activeConversationId, markAsRead]);

    return (
        <div className="h-[calc(100vh-4rem)] py-2 sm:py-4 md:py-6">
            <div className="container h-full px-2 mx-auto md:px-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                    <FadeInWhenVisible>
                        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Tin nhắn</h1>
                    </FadeInWhenVisible>

                    {/* Mobile buttons */}
                    <div className="flex md:hidden space-x-2">
                        {/* Info button - only show when a conversation is active */}
                        {activeConversationId && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleInfoPanel}
                            >
                                <Info className="w-5 h-5" />
                            </Button>
                        )}

                        {/* Conversation list button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleConversationDrawer}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <FadeInWhenVisible delay={0.1}>
                    <Card className="flex flex-col h-[calc(100vh-8rem)] max-h-[calc(100vh-8rem)] overflow-hidden lg:flex-row">
                        {!isMobile && (
                            <div className="w-full md:w-80 lg:w-72 xl:w-80 md:flex-shrink-0 md:border-r h-auto">
                                <ConversationList
                                    conversations={conversations}
                                    activeConversationId={activeConversationId}
                                    onSelectConversation={handleSelectConversation}
                                    onNewConversation={() => setIsNewConversationDialogOpen(true)}
                                />
                            </div>
                        )}

                        <div
                            className={`
                                flex-1 flex flex-col h-full overflow-hidden
                                ${(showInfoPanel && !isMobile && !isTablet) ? 'lg:pr-80' : ''}
                            `}
                        >
                            {activeConversation ? (
                                <>
                                    <ChatHeader
                                        name={activeConversation.name}
                                        avatar={activeConversation.avatar}
                                        isOnline={activeConversation.isOnline}
                                        lastSeen={activeConversation.lastSeen}
                                        contactId={activeConversation.id}
                                        onInfoClick={toggleInfoPanel}
                                        onBackClick={isMobile ? toggleConversationDrawer : undefined}
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

                        {showInfoPanel && !isMobile && !isTablet && activeConversation && (
                            <div className="hidden lg:block lg:w-72 xl:w-80 lg:flex-shrink-0 lg:border-l">
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

            {isMobile && (
                <MobileDrawer
                    isOpen={showConversationDrawer}
                    onClose={() => setShowConversationDrawer(false)}
                    position="left"
                    title="Danh sách tin nhắn"
                >
                    <ConversationList
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelectConversation={handleSelectConversation}
                        onNewConversation={() => {
                            setIsNewConversationDialogOpen(true);
                            setShowConversationDrawer(false);
                        }}
                    />
                </MobileDrawer>
            )}

            {(isMobile || isTablet) && activeConversation && (
                <MobileDrawer
                    isOpen={showInfoDrawer}
                    onClose={() => setShowInfoDrawer(false)}
                    position="right"
                    title={activeConversation.name}
                >
                    <MessageInfoPanel
                        contact={{
                            id: activeConversation.id,
                            name: activeConversation.name,
                            avatar: activeConversation.avatar,
                            isOnline: activeConversation.isOnline,
                            description: "TalentHub User"
                        }}
                        onClose={() => setShowInfoDrawer(false)}
                    />
                </MobileDrawer>
            )}

            {isInCall && callerInfo && (
                <VideoCallDialog
                    open={isInCall}
                    isOutgoing={isOutgoingCall}
                    contactName={callerInfo.name}
                    contactAvatar={callerInfo.avatar}
                    localStream={localStream}
                    remoteStream={remoteStream}
                    callStatus={callStatus}
                    onClose={handleEndCall}
                    onAccept={acceptCall}
                    onReject={rejectCall}
                    onToggleMute={toggleMute}
                    onToggleVideo={toggleVideo}
                    isMuted={isMuted}
                    isVideoOff={isVideoOff}
                />
            )}

            {isMobile && !showConversationDrawer && !showInfoDrawer && (
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg md:hidden z-30 bg-primary text-primary-foreground"
                    onClick={() => setIsNewConversationDialogOpen(true)}
                >
                    <MessageSquare className="h-5 w-5" />
                </Button>
            )}

            <ConnectionStatus />

            <NewConversationDialog
                open={isNewConversationDialogOpen}
                onClose={() => setIsNewConversationDialogOpen(false)}
                onCreateConversation={handleCreateNewConversation}
            />
        </div>
    );
};
const MessagingPage = () => {
    const userInfoStr = localStorage.getItem('userInfo');
    const userId = userInfoStr ? JSON.parse(userInfoStr).userId || '' : '';
    const [searchParams] = useSearchParams();
    const contactId = searchParams.get('contactId') || '';
    const [hasInitialized, setHasInitialized] = useState(false);

    return (
        <MessageProvider initialContactId={contactId}>
            <CallProvider userId={userId}>
                <MessagingContent
                    contactId={contactId}
                    hasInitialized={hasInitialized}
                    setHasInitialized={setHasInitialized}
                />
            </CallProvider>
        </MessageProvider>
    );
};


export default MessagingPage;