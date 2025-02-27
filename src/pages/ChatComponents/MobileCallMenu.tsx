import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Phone, Video } from 'lucide-react';
import { useCall } from './CallContext';

interface MobileCallMenuProps {
    contactId: string;
    contactName: string;
    contactAvatar?: string;
}

const MobileCallMenu: React.FC<MobileCallMenuProps> = ({
    contactId,
    contactName,
    contactAvatar
}) => {
    const { startCall, isInCall } = useCall();

    const handleAudioCall = () => {
        if (isInCall) {
            alert('Bạn đang trong một cuộc gọi khác. Vui lòng kết thúc cuộc gọi trước khi bắt đầu cuộc gọi mới.');
            return;
        }
        startCall(contactId, contactName, contactAvatar, { enableAudio: true, enableVideo: false });
    };

    const handleVideoCall = () => {
        if (isInCall) {
            alert('Bạn đang trong một cuộc gọi khác. Vui lòng kết thúc cuộc gọi trước khi bắt đầu cuộc gọi mới.');
            return;
        }
        startCall(contactId, contactName, contactAvatar, { enableAudio: true, enableVideo: true });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <MoreVertical className="h-4 w-4 text-primary" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleAudioCall} className="cursor-pointer">
                    <Phone className="mr-2 h-4 w-4 text-primary" />
                    <span>Gọi thoại</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleVideoCall} className="cursor-pointer">
                    <Video className="mr-2 h-4 w-4 text-primary" />
                    <span>Gọi video</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MobileCallMenu;