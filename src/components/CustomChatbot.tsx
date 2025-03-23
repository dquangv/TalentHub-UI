import React, { useState, useEffect, useRef } from 'react';
import chatbotService, { ChatResponseDTO, SuggestedIntent } from '@/api/chatbotService';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X, Send, MessageSquare, ArrowLeft, Info, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
}

const CustomChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [sessionId, setSessionId] = useState<string>('');
    const [userId, setUserId] = useState<number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [suggestedIntents, setSuggestedIntents] = useState<SuggestedIntent[]>([]);
    const [suggestedQuestions, setSuggestedQuestions] = useState<Record<string, string[]>>({});
    const [selectedIntentId, setSelectedIntentId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Lấy userId từ localStorage
    useEffect(() => {
        try {
            const userInfoString = localStorage.getItem('userInfo');
            if (userInfoString) {
                const userInfo = JSON.parse(userInfoString);
                if (userInfo.userId) {
                    setUserId(Number(userInfo.userId));
                }
            }
        } catch (error) {
            console.error('Error parsing userInfo from localStorage:', error);
        }
    }, []);

    // Tạo session ID khi component được mount
    useEffect(() => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
    }, []);

    // Lấy gợi ý khi component được mount
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const suggestions = await chatbotService.getAllSuggestions();
                setSuggestedIntents(suggestions.intents || []);
                setSuggestedQuestions(suggestions.questionsByIntent || {});
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions();
    }, []);

    // Thêm welcome message khi chatbot được mở lần đầu
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage: Message = {
                id: uuidv4(),
                text: 'Xin chào! Tôi là trợ lý ảo của TalentHub. Tôi có thể giúp bạn tìm kiếm công việc phù hợp với kỹ năng, cung cấp thông tin về các kỹ năng đang hot, hoặc số lượng công việc theo danh mục. Bạn cần hỗ trợ gì?',
                isBot: true,
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, messages.length]);

    // Focus vào input khi mở chatbot
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Scroll xuống dưới cùng khi có tin nhắn mới
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Xử lý gửi tin nhắn
    const handleSendMessage = async (message: string = inputMessage) => {
        if (!message.trim()) return;

        // Thêm tin nhắn người dùng vào danh sách
        const userMessage: Message = {
            id: uuidv4(),
            text: message,
            isBot: false,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Gửi tin nhắn đến server
            const response = await chatbotService.processMessage(sessionId, message, userId);

            // Thêm phản hồi từ chatbot vào danh sách
            const botMessage: Message = {
                id: uuidv4(),
                text: response.message,
                isBot: true,
                timestamp: new Date(response.timestamp || new Date()),
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Thêm thông báo lỗi
            const errorMessage: Message = {
                id: uuidv4(),
                text: 'Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.',
                isBot: true,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Chọn intent gợi ý
    const handleSelectIntent = (intentId: number) => {
        setSelectedIntentId(intentId);
    };

    // Chọn câu hỏi gợi ý
    const handleSelectQuestion = (question: string) => {
        setInputMessage(question);
        handleSendMessage(question);
        setSelectedIntentId(null);
    };

    // Format timestamp
    const formatTimestamp = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chatbot button */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-10 right-0 bg-white rounded-full px-4 py-1.5 shadow-md text-sm font-medium text-primary flex items-center whitespace-nowrap"
                    >
                        <span>Trợ lý TalentHub</span>
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="ml-1.5"
                        >
                            👋
                        </motion.div>
                    </motion.div>
                )}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => setIsOpen(!isOpen)}
                                variant="default"
                                size="icon"
                                className="h-14 w-14 rounded-full shadow-lg relative overflow-hidden"
                            >
                                {isOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <img src="/favicon.png" alt="TalentHub" className="h-8 w-8 object-contain" />
                                )}
                                {!isOpen && (
                                    <span className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full border-2 border-white"></span>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>{isOpen ? 'Đóng trợ lý ảo' : 'Mở trợ lý TalentHub'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </motion.div>

            {/* Chatbot popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-full sm:w-96 max-w-full mt-4"
                    >
                        <Card className="border-2 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[500px]">
                            {/* Chatbot header */}
                            <CardHeader className="py-3 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-1.5 rounded-full flex items-center justify-center">
                                            <img src="/favicon.png" alt="TalentHub" className="h-5 w-5 object-contain" />
                                        </div>
                                        <CardTitle className="text-base font-medium">TalentHub Trợ lý</CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-primary-foreground hover:bg-primary/90 rounded-full"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            {/* Chatbot messages */}
                            <CardContent className="flex-1 p-0 overflow-hidden">
                                <ScrollArea className="h-full px-4 py-3">
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * Math.min(index, 3) }}
                                            className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                                        >
                                            {message.isBot && (
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0">
                                                    <img src="/favicon.png" alt="TalentHub" className="h-5 w-5 object-contain" />
                                                </div>
                                            )}
                                            <div
                                                className={cn(
                                                    "rounded-2xl px-4 py-2.5 max-w-[85%]",
                                                    message.isBot
                                                        ? "bg-muted text-foreground rounded-tl-sm"
                                                        : "bg-primary text-primary-foreground rounded-tr-sm"
                                                )}
                                            >
                                                <div className="text-sm leading-relaxed">{message.text}</div>
                                                <div className={cn(
                                                    "text-xs mt-1 text-right",
                                                    message.isBot ? "text-muted-foreground" : "text-primary-foreground/70"
                                                )}>
                                                    {formatTimestamp(message.timestamp)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start mb-4">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                                <img src="/favicon.png" alt="TalentHub" className="h-5 w-5 object-contain" />
                                            </div>
                                            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                                                <div className="flex space-x-2">
                                                    <div className="h-2 w-2 rounded-full bg-primary/30 animate-pulse"></div>
                                                    <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="h-2 w-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} className="h-1"></div>
                                </ScrollArea>
                            </CardContent>

                            {/* Suggested intents */}
                            {!selectedIntentId && suggestedIntents.length > 0 && (
                                <div className="px-4 py-3 border-t bg-muted/30">
                                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                                        <Info className="h-3 w-3 mr-1" /> Bạn có thể hỏi về:
                                    </p>
                                    <div className="overflow-x-auto pb-2">
                                        <div className="flex gap-2 min-w-max">
                                            {suggestedIntents.map((intent) => (
                                                <Badge
                                                    key={intent.id}
                                                    variant="secondary"
                                                    className="cursor-pointer px-3 py-1.5 text-xs font-normal hover:bg-secondary/80 whitespace-nowrap flex-shrink-0"
                                                    onClick={() => handleSelectIntent(intent.id)}
                                                >
                                                    {intent.friendlyDescription}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Suggested questions for selected intent */}
                            {selectedIntentId && suggestedQuestions[selectedIntentId] && (
                                <div className="px-4 py-3 border-t bg-muted/30">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs font-medium text-muted-foreground flex items-center">
                                            <Info className="h-3 w-3 mr-1" /> Câu hỏi gợi ý:
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs flex items-center gap-1 text-primary hover:bg-primary/10 rounded-full"
                                            onClick={() => setSelectedIntentId(null)}
                                        >
                                            <ArrowLeft className="h-3 w-3" />
                                            Quay lại
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                                        {suggestedQuestions[selectedIntentId]?.map((question, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                className="justify-start h-auto py-2.5 px-3 font-normal text-sm  text-left rounded-xl"
                                                onClick={() => handleSelectQuestion(question)}
                                            >
                                                {question}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input area */}
                            <CardFooter className="p-3 border-t">
                                <div className="flex w-full gap-2 items-center">
                                    <Input
                                        ref={inputRef}
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 bg-muted/50 border-muted rounded-full px-4 py-2 h-12 focus-visible:ring-primary"
                                    />
                                    <Button
                                        variant="default"
                                        size="icon"
                                        className="h-12 w-12 rounded-full shadow-sm"
                                        onClick={() => handleSendMessage()}
                                        disabled={isLoading || !inputMessage.trim()}
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomChatbot;