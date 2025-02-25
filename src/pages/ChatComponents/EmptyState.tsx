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
    icon = <MessageSquarePlus className="h-12 w-12 text-primary" />,
    actionLabel = 'Cuộc trò chuyện mới',
    onAction,
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
                {icon}
            </motion.div>

            <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl font-semibold mb-3"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground max-w-md mb-8"
            >
                {description}
            </motion.p>

            {onAction && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Button onClick={onAction} className="px-6">
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        {actionLabel}
                    </Button>
                </motion.div>
            )}
        </div>
    );
};

export default EmptyState;