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
    Flag,
    ChevronLeft
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
    isMobile?: boolean; // Add flag for mobile view
}

const MessageInfoPanel: React.FC<MessageInfoPanelProps> = ({ contact, onClose, isMobile }) => {
    const { theme } = useTheme();

    return (
        <div className={`w-full lg:w-80 h-full flex flex-col ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} ${!isMobile ? 'border-l' : ''}`}>
            <div className="p-3 md:p-4 border-b flex items-center justify-between">
                {isMobile && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                )}
                <h3 className="font-semibold flex-1">{isMobile ? contact.name : 'Thông tin'}</h3>
                {!isMobile && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 md:p-6">
                    <div className="flex flex-col items-center mb-6">
                        <Avatar className="h-16 w-16 md:h-20 md:w-20 mb-4">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className="text-xl">
                                {contact.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg md:text-xl font-semibold">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {contact.isOnline ? 'Online' : 'Offline'}
                        </p>
                        {contact.description && (
                            <p className="text-center text-sm mt-2">{contact.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-6">
                        <Button variant="outline" size="icon" className="flex flex-col items-center justify-center h-14 md:h-16">
                            <Bell className="h-4 w-4 md:h-5 md:w-5 mb-1" />
                            <span className="text-[10px] md:text-xs">Tắt</span>
                        </Button>
                        <Button variant="outline" size="icon" className="flex flex-col items-center justify-center h-14 md:h-16">
                            <Phone className="h-4 w-4 md:h-5 md:w-5 mb-1" />
                            <span className="text-[10px] md:text-xs">Gọi</span>
                        </Button>
                        <Button variant="outline" size="icon" className="flex flex-col items-center justify-center h-14 md:h-16">
                            <Video className="h-4 w-4 md:h-5 md:w-5 mb-1" />
                            <span className="text-[10px] md:text-xs">Video</span>
                        </Button>
                        <Button variant="outline" size="icon" className="flex flex-col items-center justify-center h-14 md:h-16">
                            <Shield className="h-4 w-4 md:h-5 md:w-5 mb-1" />
                            <span className="text-[10px] md:text-xs">Riêng tư</span>
                        </Button>
                    </div>

                    <Separator className="my-4" />

                    {/* Shared media - Made responsive with fewer items on mobile */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-3">File phương tiện được chia sẻ</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {sharedMedia.slice(0, isMobile ? 5 : 8).map((item, index) => (
                                <div
                                    key={index}
                                    className="aspect-square rounded-md bg-muted overflow-hidden"
                                    style={{ backgroundImage: `url(${item})`, backgroundSize: 'cover' }}
                                ></div>
                            ))}
                            <Button variant="outline" className="aspect-square flex items-center justify-center text-xs md:text-sm">
                                Xem tất cả
                            </Button>
                        </div>
                    </div>

                    {/* Condensed shared files section for mobile */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-3">File được chia sẻ</h4>
                        <div className="space-y-2">
                            {sharedFiles.slice(0, isMobile ? 2 : 4).map((file, index) => (
                                <div key={index} className="flex items-center p-2 rounded-md bg-muted">
                                    <div className="h-8 w-8 md:h-10 md:w-10 rounded bg-primary/10 flex items-center justify-center mr-2 md:mr-3">
                                        {file.type === 'document' ? (
                                            <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                        ) : (
                                            <LinkIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs md:text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground">{file.size}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="text-xs md:text-sm w-full">
                                Xem tất cả
                            </Button>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Settings - Simplified on mobile */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold mb-3">Cài đặt</h4>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0 md:space-y-1">
                                <Label htmlFor="notifications" className="text-xs md:text-sm">Thông báo</Label>
                                <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">
                                    Nhận thông báo từ cuộc trò chuyện này
                                </p>
                            </div>
                            <Switch id="notifications" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0 md:space-y-1">
                                <Label htmlFor="readReceipts" className="text-xs md:text-sm">Xác nhận đã đọc</Label>
                                <p className="text-[10px] md:text-xs text-muted-foreground hidden md:block">
                                    Hiển thị khi tin nhắn đã được đọc
                                </p>
                            </div>
                            <Switch id="readReceipts" defaultChecked />
                        </div>

                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/10 mt-4 text-xs md:text-sm">
                            <Flag className="h-4 w-4 mr-2" />
                            Báo cáo
                        </Button>

                        <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/10 text-xs md:text-sm">
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