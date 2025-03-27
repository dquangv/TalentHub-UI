// Updated ChatInput.tsx with mobile viewport fixes
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Smile, Paperclip, Mic, Image, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);

    // Auto resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(textareaRef.current.scrollHeight, 150); // Cap max height
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [message]);

    // Monitor viewport height changes to detect mobile keyboard
    useEffect(() => {
        const checkKeyboard = () => {
            if (window.visualViewport) {
                const keyboardOpen = window.innerHeight - window.visualViewport.height > 150;
                setIsMobileKeyboardOpen(keyboardOpen);
            }
        };

        window.visualViewport?.addEventListener('resize', checkKeyboard);
        window.addEventListener('resize', checkKeyboard);

        return () => {
            window.visualViewport?.removeEventListener('resize', checkKeyboard);
            window.removeEventListener('resize', checkKeyboard);
        };
    }, []);

    const handleSendMessage = async () => {
        if (message.trim()) {
            setIsSending(true);
            try {
                onSendMessage(message);
                setMessage('');

                // Reset textarea height
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
            } finally {
                setIsSending(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`border-t px-2 sm:px-4 py-2 sm:py-3 chat-input-container ${isMobileKeyboardOpen ? 'keyboard-open' : ''}`}>
            <div className="flex items-end space-x-2">
                <div className="flex-1 rounded-lg border bg-background">
                    <div className="flex space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
                            <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                <Image className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            </Button>
                        </motion.div>
                    </div>
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Nhập tin nhắn...'
                        className="min-h-10 border-0 focus-visible:ring-0 resize-none px-2 py-1 text-sm sm:text-base"
                        rows={1}
                        style={{
                            overflow: 'auto',
                            maxHeight: '150px' // Cap the max height
                        }}
                    />
                </div>

                <div className="flex space-x-1 sm:space-x-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="hidden sm:block">
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                            <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isSending}
                            size="icon"
                            className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                        >
                            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                            {isSending && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-t-transparent border-primary rounded-full"></span>
                                </span>
                            )}
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;