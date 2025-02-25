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

    // Auto resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

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
        <div className="border-t px-4 py-3">
            <div className="flex items-end space-x-2">
                <div className="flex-1 rounded-lg border bg-background">
                    <div className="flex space-x-2 px-3 py-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Smile className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Paperclip className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Image className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </motion.div>
                    </div>
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Nhập tin nhắn...'
                        className="min-h-12 border-0 focus-visible:ring-0 resize-none"
                        rows={1}
                        style={{ overflow: 'auto' }} // Cho phép scroll khi vượt quá maxRows
                    />
                </div>

                <div className="flex space-x-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                            <Mic className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isSending}
                            size="icon"
                            className="rounded-full h-10 w-10"
                        >
                            <Send className="h-5 w-5" />
                            {isSending && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-primary rounded-full"></span>
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