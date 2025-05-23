import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, UserCog, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import FreelancerSelectionModal from './FreelancerSelectionModal';
import AdminSelectionModal from './AdminSelectionModal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    clientId?: string;
    isClient?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'Không có cuộc trò chuyện nào',
    description = 'Bắt đầu một cuộc trò chuyện mới hoặc chọn từ danh sách bên trái.',
    icon = <MessageSquarePlus className="h-10 w-10 md:h-12 md:w-12 text-primary" />,
    actionLabel = 'Cuộc trò chuyện mới',
    onAction,
    clientId = '',
    isClient = true,
}) => {
    const [isFreelancerModalOpen, setIsFreelancerModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

    const handleActionClick = () => {
        if (onAction) {
            onAction();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 md:mb-6"
            >
                {icon}
            </motion.div>

            <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl md:text-2xl font-semibold mb-2 md:mb-3"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm md:text-base text-muted-foreground max-w-xs md:max-w-md mb-6 md:mb-8"
            >
                {description}
            </motion.p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base">
                            <MessageSquarePlus className="mr-2 h-4 w-4" />
                            {actionLabel}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        {isClient && (
                            <DropdownMenuItem onClick={() => setIsFreelancerModalOpen(true)}>
                                <Users className="h-4 w-4 mr-2" />
                                <span>Chat với Freelancer</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setIsAdminModalOpen(true)}>
                            <UserCog className="h-4 w-4 mr-2" />
                            <span>Chat với Admin</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </motion.div>

            {isClient && (
                <FreelancerSelectionModal
                    isOpen={isFreelancerModalOpen}
                    onClose={() => setIsFreelancerModalOpen(false)}
                    clientId={clientId}
                />
            )}

            <AdminSelectionModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
            />
        </div>
    );
};

export default EmptyState;