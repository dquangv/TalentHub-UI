import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    MessageSquare,
    Phone,
    Video,
    Users,
    Settings,
    Bell,
    Archive,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/theme-provider';

interface MessengerSidebarProps {
    expanded: boolean;
    toggleExpanded: () => void;
}

const MessengerSidebar: React.FC<MessengerSidebarProps> = ({
    expanded,
    toggleExpanded,
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<string>('messages');

    // Animation variants for the sidebar
    const sidebarVariants = {
        expanded: { width: 240 },
        collapsed: { width: 72 },
    };

    const iconButtons = [
        { id: 'messages', icon: <MessageSquare />, label: 'Tin nhắn' },
        { id: 'calls', icon: <Phone />, label: 'Cuộc gọi' },
        { id: 'video', icon: <Video />, label: 'Video call' },
        { id: 'groups', icon: <Users />, label: 'Nhóm' },
        { id: 'notifications', icon: <Bell />, label: 'Thông báo' },
        { id: 'archive', icon: <Archive />, label: 'Lưu trữ' },
        { id: 'settings', icon: <Settings />, label: 'Cài đặt' },
    ];

    return (
        <motion.div
            className={`flex flex-col h-full border-r bg-background ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}
            initial={expanded ? 'expanded' : 'collapsed'}
            animate={expanded ? 'expanded' : 'collapsed'}
            variants={sidebarVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80" />
                        <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    {expanded && (
                        <div className="ml-3">
                            <p className="text-sm font-medium">User Name</p>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={toggleExpanded}
                >
                    {expanded ? (
                        <ChevronLeft className="h-5 w-5" />
                    ) : (
                        <ChevronRight className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Navigation Icons */}
            <div className="flex-1">
                <div className="py-4">
                    {iconButtons.map((button) => (
                        <Button
                            key={button.id}
                            variant={activeTab === button.id ? 'secondary' : 'ghost'}
                            className={`w-full justify-start rounded-none py-3 px-3 mb-1 ${expanded ? 'justify-start' : 'justify-center'
                                }`}
                            onClick={() => setActiveTab(button.id)}
                        >
                            <span className={`${button.id === activeTab ? 'text-primary' : ''}`}>
                                {button.icon}
                            </span>
                            {expanded && (
                                <span className="ml-3 text-sm">{button.label}</span>
                            )}
                        </Button>
                    ))}
                </div>
            </div>


            {/* Bottom Section */}
            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className={`w-full ${expanded ? 'justify-start' : 'justify-center'}`}
                >
                    <MoreHorizontal className="h-5 w-5" />
                    {expanded && <span className="ml-3 text-sm">Thêm</span>}
                </Button>
            </div>
        </motion.div>
    );
};



export default MessengerSidebar;
