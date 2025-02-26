import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    position?: 'left' | 'right';
    children: React.ReactNode;
    title?: string;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
    isOpen,
    onClose,
    position = 'left',
    children,
    title,
}) => {
    const { theme } = useTheme();

    // Prevent body scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle escape key to close drawer
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const drawerVariants = {
        hidden: {
            x: position === 'left' ? '-100%' : '100%',
            transition: { type: 'tween', duration: 0.25 }
        },
        visible: {
            x: 0,
            transition: { type: 'tween', duration: 0.25 }
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={backdropVariants}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className={`fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} z-50 h-full w-4/5 max-w-xs
                      bg-background shadow-lg ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
                      ${position === 'left' ? 'border-r' : 'border-l'} flex flex-col`}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={drawerVariants}
                    >
                        {/* Header */}
                        {(title || onClose) && (
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                {title && <h3 className="font-semibold text-base">{title}</h3>}
                                <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-auto">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileDrawer;