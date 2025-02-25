import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Video, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    avatar,
    isOnline,
    lastSeen
}) => {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
                <div className="relative mr-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                </div>
                <div>
                    <h2 className="font-semibold">{name}</h2>
                    <p className="text-xs text-muted-foreground">
                        {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen}` : 'Offline'}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-1">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Phone className="h-5 w-5 text-primary" />
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Video className="h-5 w-5 text-primary" />
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Info className="h-5 w-5 text-primary" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default ChatHeader;
