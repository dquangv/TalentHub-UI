import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Info, ChevronLeft, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import CallButton from './CallButton';
import MobileCallMenu from './MobileCallMenu';

interface ChatHeaderProps {
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
    contactId: string; // Add contactId for call functionality
    onInfoClick?: () => void;
    onBackClick?: () => void; // For mobile navigation back to conversation list
    onMenuClick?: () => void; // For mobile menu toggle
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    avatar,
    isOnline,
    lastSeen,
    contactId,
    onInfoClick,
    onBackClick,
    onMenuClick
}) => {
    return (
        <div className="flex items-center justify-between p-3 md:p-4 border-b">
            <div className="flex items-center">
                {/* Mobile navigation back button */}
                {onBackClick && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-1 md:hidden"
                        onClick={onBackClick}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                )}

                <div className="relative mr-2 md:mr-3">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 md:h-3 md:w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                </div>
                <div>
                    <h2 className="font-semibold text-sm md:text-base">{name}</h2>
                    <p className="text-xs text-muted-foreground">
                        {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen}` : 'Offline'}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-1">
                {/* Desktop action buttons */}
                <div className="hidden sm:flex items-center space-x-1">
                    {/* Audio Call Button */}
                    <CallButton
                        contactId={contactId}
                        contactName={name}
                        contactAvatar={avatar}
                        type="audio"
                    />

                    {/* Video Call Button */}
                    <CallButton
                        contactId={contactId}
                        contactName={name}
                        contactAvatar={avatar}
                        type="video"
                    />
                </div>

                {/* Info button - always visible */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 md:h-10 md:w-10"
                        onClick={onInfoClick}
                    >
                        <Info className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </Button>
                </motion.div>

                {/* Mobile call menu */}
                <div className="sm:hidden">
                    <MobileCallMenu
                        contactId={contactId}
                        contactName={name}
                        contactAvatar={avatar}
                    />
                </div>

                {/* Mobile menu button */}
                {onMenuClick && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="sm:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={onMenuClick}
                        >
                            <Menu className="h-4 w-4 text-primary" />
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ChatHeader;