import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    X,
    Bell,
    Phone,
    Video,
    FileText,
    Link as LinkIcon,
    Shield,
    Flag
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/components/theme-provider';

interface MessageInfoPanelProps {
    contact: {
        id: string;
        name: string;
        avatar?: string;
        isOnline: boolean;
        description?: string;
    };
    onClose: () => void;
}

const MessageInfoPanel: React.FC<MessageInfoPanelProps> = ({ contact, onClose }) => {
    const { theme } = useTheme();

    return (
        <div className={`border-l w-80 h-full flex flex-col ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Thông tin</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <Avatar className="h-20 w-20 mb-4">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className="text-xl">
                                {contact.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {contact.isOnline ? 'Online' : 'Offline'}
                        </p>
                        {contact.description && (
                            <p className="text-center text-sm mt-2">{contact.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-6">
                        <Button variant="outline" size="icon" className="flex flex-col items-center justify-center h-16">
                            <Bell className="h-5 w-5 mb-1" />
                            <span className="text-xs">Tắt</span>
                        </Button>
                        <Button variant="outline" size="icon" className="flex flex-col items-center justify-center h-16">
                            <Phone className="h-5 w-5 mb-1" />
                            <span className="text-xs">Gọi</span>
                        </Button>
                        <Button variant="outline" size="icon" className="flex flex-col items-center justify-center h-16">
                            <Video className="h-5 w-5 mb-1" />
                            <span className="text-xs">Video</span>
                        </Button>
                        <Button variant="outline" size="icon" className="flex flex-col items-center justify-center h-16">
                            <Shield className="h-5 w-5 mb-1" />
                            <span className="text-xs">Riêng tư</span>
                        </Button>
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-3">File phương tiện được chia sẻ</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {sharedMedia.map((item, index) => (
                                <div
                                    key={index}
                                    className="aspect-square rounded-md bg-muted overflow-hidden"
                                    style={{ backgroundImage: `url(${item})`, backgroundSize: 'cover' }}
                                ></div>
                            ))}
                            <Button variant="outline" className="aspect-square flex items-center justify-center">
                                <span className="text-sm">Xem tất cả</span>
                            </Button>
                        </div>
                    </div>

                    {/* Shared Files */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-3">File được chia sẻ</h4>
                        <div className="space-y-2">
                            {sharedFiles.map((file, index) => (
                                <div key={index} className="flex items-center p-2 rounded-md bg-muted">
                                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center mr-3">
                                        {file.type === 'document' ? (
                                            <FileText className="h-5 w-5 text-primary" />
                                        ) : (
                                            <LinkIcon className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{file.size}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="text-sm w-full">
                                Xem tất cả
                            </Button>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Settings */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold mb-3">Cài đặt</h4>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="notifications">Thông báo</Label>
                                <p className="text-xs text-muted-foreground">Nhận thông báo từ cuộc trò chuyện này</p>
                            </div>
                            <Switch id="notifications" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="autoArchive">Lưu trữ tự động</Label>
                                <p className="text-xs text-muted-foreground">Tự động lưu trữ cuộc trò chuyện không hoạt động</p>
                            </div>
                            <Switch id="autoArchive" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="readReceipts">Xác nhận đã đọc</Label>
                                <p className="text-xs text-muted-foreground">Hiển thị khi tin nhắn đã được đọc</p>
                            </div>
                            <Switch id="readReceipts" defaultChecked />
                        </div>

                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/10 mt-4">
                            <Flag className="h-4 w-4 mr-2" />
                            Báo cáo
                        </Button>

                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/10">
                            <X className="h-4 w-4 mr-2" />
                            Chặn người dùng
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

// Sample data
const sharedMedia = [
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
    'https://images.unsplash.com/photo-1574279606130-09958dc756f7',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
];

const sharedFiles = [
    { name: 'Project_Proposal.pdf', size: '2.3 MB', type: 'document' },
    { name: 'Meeting_Notes.docx', size: '1.5 MB', type: 'document' },
    { name: 'Product_Demo.mp4', size: '12.8 MB', type: 'video' },
    { name: 'Website_Link.url', size: '1 KB', type: 'link' },
];

export default MessageInfoPanel;