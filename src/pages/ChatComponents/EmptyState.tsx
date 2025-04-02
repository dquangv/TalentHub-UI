// EmptyState.tsx - Optimized for responsiveness
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'Không có cuộc trò chuyện nào',
    description = 'Bắt đầu một cuộc trò chuyện mới hoặc chọn từ danh sách bên trái.',
    icon = <MessageSquarePlus className="h-10 w-10 md:h-12 md:w-12 text-primary" />,
    actionLabel = 'Cuộc trò chuyện mới',
    onAction,
}) => {
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

            {onAction && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Button onClick={onAction} className="px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base">
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        {actionLabel}
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default EmptyState;