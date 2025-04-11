import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MessageSquare,
    PlusCircle,
    Settings,
    Edit,
    Trash,
    Send,
    BarChart,
    RefreshCw,
    Plus
} from 'lucide-react';
import { Empty, notification } from 'antd';
import chatbotService, {
    ChatIntent,
    ChatResponse,
    ChatTrainingPhrase,
    UnprocessedQuery,
    ChatbotStats,
    IntentDTO,
    ResponseDTO,
    ProcessQueryDTO
} from '@/api/chatbotService';

const ChatbotManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState("test");
    const [chatMessage, setChatMessage] = useState("");
    const [sessionId, setSessionId] = useState(`session-${Date.now()}`);
    const [chatHistory, setChatHistory] = useState<Array<{ message: string; isBot: boolean; intent?: string; confidence?: number }>>([]);
    const [loading, setLoading] = useState(false);
    const [intents, setIntents] = useState<ChatIntent[]>([]);
    const [selectedIntent, setSelectedIntent] = useState<ChatIntent | null>(null);
    const [newIntent, setNewIntent] = useState<IntentDTO>({
        intentName: '',
        description: '',
        trainingPhrases: [''],
        responses: [''],
        requiresDbQuery: false,
        dbQuery: ''
    });

    const [unprocessedQueries, setUnprocessedQueries] = useState<UnprocessedQuery[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<UnprocessedQuery | null>(null);
    const [processingData, setProcessingData] = useState<ProcessQueryDTO>({
        queryId: 0,
        intentName: '',
        responseText: '',
        requiresDbQuery: false,
        queryTemplate: ''
    });

    const [stats, setStats] = useState<ChatbotStats | null>(null);

    const [intentDialogOpen, setIntentDialogOpen] = useState(false);
    const [responseDialogOpen, setResponseDialogOpen] = useState(false);
    const [deleteIntentDialogOpen, setDeleteIntentDialogOpen] = useState(false);
    const [deleteResponseDialogOpen, setDeleteResponseDialogOpen] = useState(false);
    const [editIntentDialogOpen, setEditIntentDialogOpen] = useState(false);
    const [editResponseDialogOpen, setEditResponseDialogOpen] = useState(false);

    const [selectedResponse, setSelectedResponse] = useState<ChatResponse | null>(null);
    const [editResponse, setEditResponse] = useState<ResponseDTO>({
        responseText: '',
        requiresDbQuery: false,
        queryTemplate: ''
    });
    const [newIntentName, setNewIntentName] = useState<string>('');
    const [processingLoading, setProcessingLoading] = useState(false);

    useEffect(() => {
        fetchIntents();
        fetchUnprocessedQueries();
        fetchStatistics();
    }, []);

    const fetchIntents = async () => {
        try {
            const data = await chatbotService.getAllIntents();
            setIntents(data);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to fetch intents' });
            console.error(error);
        }
    };

    const fetchUnprocessedQueries = async () => {
        try {
            const data = await chatbotService.getUnprocessedQueries(20);
            setUnprocessedQueries(data);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to fetch unprocessed queries' });
            console.error(error);
        }
    };

    const fetchStatistics = async () => {
        try {
            const data = await chatbotService.getStatistics();
            setStats(data);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to fetch statistics' });
            console.error(error);
        }
    };

    const fetchIntentDetails = async (intentId: number) => {
        try {
            const data = await chatbotService.getIntentDetails(intentId);
            setSelectedIntent(data);
            console.log(data);

            return data;
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to fetch intent details' });
            console.error(error);
            return null;
        }
    };

    const sendMessage = async () => {
        if (!chatMessage.trim()) return;
        setChatHistory(prev => [...prev, { message: chatMessage, isBot: false }]);
        setLoading(true);

        try {
            const response = await chatbotService.processMessage(sessionId, chatMessage);
            setChatHistory(prev => [
                ...prev,
                {
                    message: response.message,
                    isBot: true,
                    intent: response.detectedIntentName || undefined,
                    confidence: response.confidence
                }
            ]);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to get response from chatbot' });
            console.error(error);
            setChatHistory(prev => [
                ...prev,
                { message: "Sorry, I encountered an error processing your request.", isBot: true }
            ]);
        } finally {
            setLoading(false);
            setChatMessage("");
        }
    };

    const resetChat = () => {
        setChatHistory([]);
        setSessionId(`session-${Date.now()}`);
    };
    const handleAddIntent = async () => {
        try {
            await chatbotService.addIntent(newIntent);
            notification.success({ message: 'Success', description: 'Intent added successfully' });
            fetchIntents();
            setIntentDialogOpen(false);
            resetNewIntent();
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to add intent' });
            console.error(error);
        }
    };

    const handleUpdateIntent = async (intentId: number) => {
        if (!selectedIntent) return;
        try {
            const intentDTO: Partial<IntentDTO> = {
                intentName: selectedIntent.intentName,
                description: selectedIntent.description,
                trainingPhrases: selectedIntent.trainingPhrases?.map(p => p.text) || []
            };

            await chatbotService.updateIntent(intentId, intentDTO);
            notification.success({ message: 'Success', description: 'Intent updated successfully' });
            fetchIntents();
            setEditIntentDialogOpen(false);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to update intent' });
            console.error(error);
        }
    };

    const handleDeleteIntent = async () => {
        if (!selectedIntent) return;

        try {
            await chatbotService.deleteIntent(selectedIntent.id);
            notification.success({ message: 'Success', description: 'Intent deleted successfully' });
            fetchIntents();
            setDeleteIntentDialogOpen(false);
            setSelectedIntent(null);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to delete intent' });
            console.error(error);
        }
    };

    const handleAddResponse = async () => {
        if (!selectedIntent) return;

        try {
            await chatbotService.addResponse(selectedIntent.id, { ...editResponse, responseText: editResponse.text, text: undefined });
            notification.success({ message: 'Success', description: 'Response added successfully' });
            const updatedIntent = await fetchIntentDetails(selectedIntent.id);
            setSelectedIntent(updatedIntent);
            setResponseDialogOpen(false);
            resetEditResponse();
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to add response' });
            console.error(error);
        }
    };

    const handleUpdateResponse = async () => {
        if (!selectedResponse) return;

        try {
            await chatbotService.updateResponse(selectedResponse.id, { ...editResponse, responseText: editResponse.text, text: undefined });
            notification.success({ message: 'Success', description: 'Response updated successfully' });
            if (selectedIntent) {
                const updatedIntent = await fetchIntentDetails(selectedIntent.id);
                setSelectedIntent(updatedIntent);
            }
            setEditResponseDialogOpen(false);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to update response' });
            console.error(error);
        }
    };

    const handleDeleteResponse = async () => {
        if (!selectedResponse) return;

        try {
            await chatbotService.deleteResponse(selectedResponse.id);
            notification.success({ message: 'Success', description: 'Response deleted successfully' });
            if (selectedIntent) {
                const updatedIntent = await fetchIntentDetails(selectedIntent.id);
                setSelectedIntent(updatedIntent);
            }
            setDeleteResponseDialogOpen(false);
            setSelectedResponse(null);
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to delete response' });
            console.error(error);
        }
    };

    const handleProcessQuery = async () => {
        if (!selectedQuery) return;

        setProcessingLoading(true); // Bắt đầu loading
        try {
            // Tạo dữ liệu cho API
            const queryData: ProcessQueryDTO = {
                queryId: selectedQuery.id,
                intentName: processingData.intentName === 'new_intent' ? newIntentName : processingData.intentName,
                text: processingData.text,
                requiresDbQuery: processingData.requiresDbQuery,
                queryTemplate: processingData.queryTemplate
            };

            await chatbotService.processUnrecognizedQuery(queryData);
            notification.success({ message: 'Success', description: 'Query processed successfully' });
            fetchUnprocessedQueries();
            fetchIntents();
            setSelectedQuery(null);
            resetProcessingData();
            setNewIntentName('');
        } catch (error) {
            notification.error({ message: 'Error', description: 'Failed to process query' });
            console.error(error);
        } finally {
            setProcessingLoading(false); // Kết thúc loading dù thành công hay thất bại
        }
    };


    const resetNewIntent = () => {
        setNewIntent({
            intentName: '',
            description: '',
            trainingPhrases: [''],
            responses: [''],
            requiresDbQuery: false,
            dbQuery: ''
        });
    };

    const resetEditResponse = () => {
        setEditResponse({
            text: '',
            requiresDbQuery: false,
            queryTemplate: ''
        });
    };

    const resetProcessingData = () => {
        setProcessingData({
            queryId: 0,
            intentName: '',
            text: '',
            requiresDbQuery: false,
            queryTemplate: ''
        });
    };

    const handleSelectIntent = async (intentId: number) => {
        await fetchIntentDetails(intentId);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý ChatBot</h1>
                <Button onClick={() => fetchStatistics()} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="test">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Kiểm Tra ChatBot
                    </TabsTrigger>
                    <TabsTrigger value="training">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Huấn Luyện
                    </TabsTrigger>
                    <TabsTrigger value="intents">
                        <Settings className="h-4 w-4 mr-2" />
                        Quản Lý Intent
                    </TabsTrigger>
                    <TabsTrigger value="statistics">
                        <BarChart className="h-4 w-4 mr-2" />
                        Thống Kê
                    </TabsTrigger>
                </TabsList>

                {/* Test ChatBot Tab */}
                <TabsContent value="test">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Test ChatBot</CardTitle>
                                <CardDescription>
                                    Thử chức năng của chat bot với nhiều câu hỏi khác nhau.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col h-[500px]">
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md mb-4">
                                        {chatHistory.length === 0 ? (
                                            <div className="text-center text-muted-foreground py-12">
                                                <Empty description="Chưa có tin nhắn nào. Bắt đầu cuộc hội thoại mới" />
                                            </div>
                                        ) : (
                                            chatHistory.map((chat, index) => (
                                                <div key={index} className={`flex ${chat.isBot ? 'justify-start' : 'justify-end'}`}>
                                                    <div
                                                        className={`max-w-[80%] rounded-lg p-3 ${chat.isBot
                                                            ? 'bg-secondary text-secondary-foreground'
                                                            : 'bg-primary text-primary-foreground'
                                                            }`}
                                                    >
                                                        <p>{chat.message}</p>
                                                        {chat.isBot && chat.intent && (
                                                            <div className="mt-1 text-xs">
                                                                <span className="opacity-70">Ý định: {chat.intent} </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Input
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        />
                                        <Button onClick={sendMessage} disabled={loading || !chatMessage.trim()}>
                                            <Send className="h-4 w-4 mr-2" />
                                            Gửi
                                        </Button>
                                        <Button variant="outline" onClick={resetChat}>
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                {/* Training Tab */}
                <TabsContent value="training">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Câu hỏi chưa được xử lý</CardTitle>
                                <CardDescription>
                                    Đây là các câu hỏi của người dùng chưa được xử lý với các ý định nghiệp vụ.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nội dung</TableHead>
                                                <TableHead>Tần suất</TableHead>
                                                <TableHead>Người dùng</TableHead>
                                                <TableHead>Created At</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {unprocessedQueries.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8">
                                                        <Empty description="Chưa có câu hỏi nào chưa được xử lý" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                unprocessedQueries.map((query) => (
                                                    <TableRow key={query.id}>
                                                        <TableCell className="font-medium max-w-xs truncate">
                                                            {query.text}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary">{query.frequency}</Badge>
                                                        </TableCell>
                                                        <TableCell>{query.userEmail || "Anonymous"}</TableCell>
                                                        <TableCell>
                                                            {new Date(query.createdAt).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedQuery(query);
                                                                    setProcessingData({
                                                                        ...processingData,
                                                                        queryId: query.id
                                                                    });
                                                                }}
                                                            >
                                                                Process
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchUnprocessedQueries()}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {selectedQuery && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Xử lý câu hỏi</CardTitle>
                                    <CardDescription>Xử lý câu hỏi này để có thể trả lời vào những lần sau</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Selected Query</Label>
                                            <div className="p-3 bg-muted rounded-md mt-1">{selectedQuery.text}</div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Assign to Intent</Label>
                                            <Select
                                                value={processingData.intentName}
                                                onValueChange={(value) => {
                                                    // Khi chọn tạo intent mới, reset giá trị của newIntentName
                                                    if (value === 'new_intent') {
                                                        setNewIntentName('');
                                                    }
                                                    setProcessingData({ ...processingData, intentName: value });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select intent" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ignored_query">Bỏ qua câu hỏi này</SelectItem>
                                                    {intents.map((intent) => (
                                                        <SelectItem key={intent.id} value={intent.intentName}>
                                                            {intent.intentName}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="new_intent">+ Tạo mới Intent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {processingData.intentName && processingData.intentName !== 'ignored_query' && (
                                            <>
                                                {processingData.intentName === 'new_intent' && (
                                                    <div className="space-y-2">
                                                        <Label>Tên intent mới</Label>
                                                        <Input
                                                            value={newIntentName}
                                                            onChange={(e) => setNewIntentName(e.target.value)}
                                                            placeholder="Nhập tên intent mới"
                                                        />
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <Label>Câu trả lời</Label>
                                                    <Textarea
                                                        value={processingData.text}
                                                        onChange={(e) => setProcessingData({ ...processingData, text: e.target.value })}
                                                        placeholder="Nhập câu trả lời"
                                                        rows={3}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="flex justify-between mt-4">
                                            <Button variant="outline" onClick={() => setSelectedQuery(null)}>
                                                Đóng
                                            </Button>
                                            <Button
                                                onClick={handleProcessQuery}
                                                disabled={processingLoading || (
                                                    processingData.intentName === 'new_intent' && !newIntentName.trim()
                                                )}
                                            >
                                                {processingLoading ? (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>Xử lý câu hỏi</>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Intents Management Tab */}
                <TabsContent value="intents">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle>Intents</CardTitle>
                                <Button variant="outline" size="sm" onClick={() => setIntentDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tạo intent mới
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[600px] pr-4">
                                    <div className="space-y-2">
                                        {intents.length === 0 ? (
                                            <div className="text-center py-4 text-muted-foreground">
                                                <Empty description="Chưa có intent nào" />
                                            </div>
                                        ) : (
                                            intents.map((intent) => (
                                                <div
                                                    key={intent.id}
                                                    className={`p-3 rounded-md cursor-pointer transition-colors ${selectedIntent?.id === intent.id
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-secondary hover:bg-secondary/80'
                                                        }`}
                                                    onClick={() => handleSelectIntent(intent.id)}
                                                >
                                                    <div className="font-medium">{intent.intentName}</div>
                                                    {intent.description && (
                                                        <div className="text-sm opacity-90 truncate">
                                                            {intent.description}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            {selectedIntent ? (
                                <>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div>
                                            <CardTitle>{selectedIntent.intentName}</CardTitle>
                                            <CardDescription>{selectedIntent.description}</CardDescription>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => setEditIntentDialogOpen(true)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Chỉnh sửa
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => setDeleteIntentDialogOpen(true)}>
                                                <Trash className="h-4 w-4 mr-2" />
                                                Xóa
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Cụm từ huấn luyện</h3>
                                                <div className="space-y-2">
                                                    {selectedIntent.trainingPhrases && selectedIntent.trainingPhrases.length > 0 ? (
                                                        selectedIntent.trainingPhrases.map((phrase, index) => (
                                                            <div key={index} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                                                                <span>{phrase.text}</span>
                                                                <Badge variant="outline">{phrase.frequency || 1}</Badge>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-4 text-muted-foreground">
                                                            <Empty description="Chưa có cụm từ huấn luyện nào cho intents này" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-lg font-medium">Câu trả lời</h3>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            resetEditResponse();
                                                            setResponseDialogOpen(true);
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Thêm câu trả lời
                                                    </Button>
                                                </div>

                                                <div className="space-y-3">
                                                    {selectedIntent.responses && selectedIntent.responses.length > 0 ? (
                                                        selectedIntent.responses.map((response) => (
                                                            <div key={response.id} className="border rounded-md p-3">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="space-y-1 flex-1">
                                                                        <p>{response.text}</p>
                                                                        {/* {response.requiresDbQuery && (
                                                                            <div className="mt-2">
                                                                                <Badge>DB Query</Badge>
                                                                                <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                                                                                    {response.queryTemplate}
                                                                                </pre>
                                                                            </div>
                                                                        )} */}
                                                                    </div>
                                                                    <div className="flex space-x-1 ml-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => {
                                                                                setSelectedResponse(response);
                                                                                setEditResponse({
                                                                                    text: response.text,
                                                                                    requiresDbQuery: response.requiresDbQuery,
                                                                                    queryTemplate: response.queryTemplate || '',
                                                                                });
                                                                                setEditResponseDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => {
                                                                                setSelectedResponse(response);
                                                                                setDeleteResponseDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            <Trash className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-4 text-muted-foreground">
                                                            No responses found for this intent.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full py-12 text-center">
                                    <div className="space-y-2">
                                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <h3 className="text-lg font-medium">No Intent Selected</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Select an intent from the list or create a new one to view its details.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </TabsContent>
                {/* Statistics Tab */}
                <TabsContent value="statistics">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalConversations || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Unrecognized Queries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.unrecognizedQueries || 0}</div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 xl:col-span-4">
                            <CardHeader>
                                <CardTitle>Top Intents</CardTitle>
                                <CardDescription>Most frequently detected intents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {stats?.topIntents && stats.topIntents.length > 0 ? (
                                    <div className="space-y-8">
                                        {stats.topIntents.map((item, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-medium">{item.intent}</div>
                                                    <div className="text-sm text-muted-foreground">{item.count} matches</div>
                                                </div>
                                                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{
                                                            width: `${(item.count / Math.max(...stats.topIntents.map(i => i.count))) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No data available. Start using the chatbot to generate statistics.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* New Intent Dialog */}
            <Dialog open={intentDialogOpen} onOpenChange={setIntentDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Intent</DialogTitle>
                        <DialogDescription>
                            Add a new intent with training phrases and responses.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="intentName">Intent Name</Label>
                            <Input
                                id="intentName"
                                value={newIntent.intentName}
                                onChange={(e) => setNewIntent({ ...newIntent, intentName: e.target.value })}
                                placeholder="Enter intent name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="intentDescription">Description (optional)</Label>
                            <Textarea
                                id="intentDescription"
                                value={newIntent.description}
                                onChange={(e) => setNewIntent({ ...newIntent, description: e.target.value })}
                                placeholder="Enter intent description"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Training Phrases</Label>
                            {newIntent.trainingPhrases.map((phrase, index) => (
                                <div key={index} className="flex space-x-2">
                                    <Input
                                        value={phrase}
                                        onChange={(e) => {
                                            const updated = [...newIntent.trainingPhrases];
                                            updated[index] = e.target.value;
                                            setNewIntent({ ...newIntent, trainingPhrases: updated });
                                        }}
                                        placeholder={`Training phrase ${index + 1}`}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            const updated = newIntent.trainingPhrases.filter((_, i) => i !== index);
                                            setNewIntent({ ...newIntent, trainingPhrases: updated });
                                        }}
                                        disabled={newIntent.trainingPhrases.length <= 1}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => {
                                    setNewIntent({
                                        ...newIntent,
                                        trainingPhrases: [...newIntent.trainingPhrases, ''],
                                    });
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Phrase
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Responses</Label>
                            {newIntent.responses.map((response, index) => (
                                <div key={index} className="flex space-x-2">
                                    <Textarea
                                        value={response}
                                        onChange={(e) => {
                                            const updated = [...newIntent.responses];
                                            updated[index] = e.target.value;
                                            setNewIntent({ ...newIntent, responses: updated });
                                        }}
                                        placeholder={`Response ${index + 1}`}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            const updated = newIntent.responses.filter((_, i) => i !== index);
                                            setNewIntent({ ...newIntent, responses: updated });
                                        }}
                                        disabled={newIntent.responses.length <= 1}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => {
                                    setNewIntent({
                                        ...newIntent,
                                        responses: [...newIntent.responses, ''],
                                    });
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Response
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="newRequiresDbQuery"
                                    checked={newIntent.requiresDbQuery}
                                    onCheckedChange={(checked) =>
                                        setNewIntent({ ...newIntent, requiresDbQuery: checked as boolean })
                                    }
                                />
                                <Label htmlFor="newRequiresDbQuery">Requires Database Query</Label>
                            </div>
                            {newIntent.requiresDbQuery && (
                                <Textarea
                                    value={newIntent.dbQuery}
                                    onChange={(e) => setNewIntent({ ...newIntent, dbQuery: e.target.value })}
                                    placeholder="Enter SQL query (use {{placeholder}} for dynamic values)"
                                />
                            )}
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-between">
                        <Button variant="outline" onClick={() => {
                            setIntentDialogOpen(false);
                            resetNewIntent();
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddIntent}
                            disabled={!newIntent.intentName || newIntent.trainingPhrases.some(p => !p) || newIntent.responses.some(r => !r)}
                        >
                            Create Intent
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Intent Dialog */}
            <Dialog open={editIntentDialogOpen} onOpenChange={setEditIntentDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Intent</DialogTitle>
                        <DialogDescription>
                            Update intent details and training phrases.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedIntent && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="editIntentName">Intent Name</Label>
                                <Input
                                    id="editIntentName"
                                    value={selectedIntent.intentName}
                                    onChange={(e) =>
                                        setSelectedIntent({ ...selectedIntent, intentName: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editIntentDescription">Description</Label>
                                <Textarea
                                    id="editIntentDescription"
                                    value={selectedIntent.description}
                                    onChange={(e) =>
                                        setSelectedIntent({ ...selectedIntent, description: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Training Phrases</Label>
                                {selectedIntent.trainingPhrases && selectedIntent.trainingPhrases.map((phrase, index) => (
                                    <div key={index} className="flex space-x-2">
                                        <Input
                                            value={phrase.text}
                                            onChange={(e) => {
                                                const updated = [...selectedIntent.trainingPhrases!];
                                                updated[index] = { ...phrase, text: e.target.value };
                                                setSelectedIntent({ ...selectedIntent, trainingPhrases: updated });
                                            }}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                const updated = selectedIntent.trainingPhrases!.filter((_, i) => i !== index);
                                                setSelectedIntent({ ...selectedIntent, trainingPhrases: updated });
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2"
                                    onClick={() => {
                                        const newPhrase: ChatTrainingPhrase = {
                                            id: 0,
                                            text: '',
                                            isProcessed: true,
                                            frequency: 1,
                                            createdAt: new Date().toISOString()
                                        };
                                        setSelectedIntent({
                                            ...selectedIntent,
                                            trainingPhrases: [...(selectedIntent.trainingPhrases || []), newPhrase],
                                        });
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Phrase
                                </Button>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditIntentDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => selectedIntent && handleUpdateIntent(selectedIntent.id)}
                            disabled={!selectedIntent?.intentName}
                        >
                            Update Intent
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Intent Confirmation */}
            <AlertDialog open={deleteIntentDialogOpen} onOpenChange={setDeleteIntentDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the intent "{selectedIntent?.intentName}" and all associated training phrases and responses.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteIntent} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add Response Dialog */}
            <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Response</DialogTitle>
                        <DialogDescription>
                            Add a new response for the intent "{selectedIntent?.intentName}".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="text">Response Text</Label>
                            <Textarea
                                id="text"
                                value={editResponse.text}
                                onChange={(e) => setEditResponse({ ...editResponse, text: e.target.value })}
                                placeholder="Enter response text"
                                rows={4}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="addRequiresDbQuery"
                                checked={editResponse.requiresDbQuery}
                                onCheckedChange={(checked) =>
                                    setEditResponse({ ...editResponse, requiresDbQuery: checked as boolean })
                                }
                            />
                            <Label htmlFor="addRequiresDbQuery">Requires Database Query</Label>
                        </div>
                        {editResponse.requiresDbQuery && (
                            <div className="space-y-2">
                                <Label htmlFor="queryTemplate">SQL Query Template</Label>
                                <Textarea
                                    id="queryTemplate"
                                    value={editResponse.queryTemplate}
                                    onChange={(e) => setEditResponse({ ...editResponse, queryTemplate: e.target.value })}
                                    placeholder="Enter SQL query (use {{placeholder}} for dynamic values)"
                                    rows={4}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setResponseDialogOpen(false);
                            resetEditResponse();
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddResponse}
                            disabled={!editResponse.text ||
                                (editResponse.requiresDbQuery && !editResponse.queryTemplate)}
                        >
                            Add Response
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Response Dialog */}
            <Dialog open={editResponseDialogOpen} onOpenChange={setEditResponseDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Response</DialogTitle>
                        <DialogDescription>
                            Update the response for the intent "{selectedIntent?.intentName}".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edittext">Response Text</Label>
                            <Textarea
                                id="edittext"
                                value={editResponse.text}
                                onChange={(e) => setEditResponse({ ...editResponse, text: e.target.value })}
                                placeholder="Enter response text"
                                rows={4}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="editRequiresDbQuery"
                                checked={editResponse.requiresDbQuery}
                                onCheckedChange={(checked) =>
                                    setEditResponse({ ...editResponse, requiresDbQuery: checked as boolean })
                                }
                            />
                            <Label htmlFor="editRequiresDbQuery">Requires Database Query</Label>
                        </div>
                        {editResponse.requiresDbQuery && (
                            <div className="space-y-2">
                                <Label htmlFor="editQueryTemplate">SQL Query Template</Label>
                                <Textarea
                                    id="editQueryTemplate"
                                    value={editResponse.queryTemplate}
                                    onChange={(e) => setEditResponse({ ...editResponse, queryTemplate: e.target.value })}
                                    placeholder="Enter SQL query (use {{placeholder}} for dynamic values)"
                                    rows={4}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditResponseDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateResponse}
                            disabled={!editResponse.text ||
                                (editResponse.requiresDbQuery && !editResponse.queryTemplate)}
                        >
                            Update Response
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Response Confirmation */}
            <AlertDialog open={deleteResponseDialogOpen} onOpenChange={setDeleteResponseDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Response</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this response? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteResponse} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ChatbotManagement;

