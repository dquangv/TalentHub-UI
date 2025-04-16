import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, MessageSquare } from 'lucide-react';
import { AdminUser } from './chatApiService';
import { useNavigate } from 'react-router-dom';
import chatApiService from './chatApiService';
import { motion } from 'framer-motion';

interface AdminSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    embedded?: boolean;
}

const AdminSelectionModal: React.FC<AdminSelectionModalProps> = ({
    isOpen,
    onClose,
    embedded = false,
}) => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [filteredAdmins, setFilteredAdmins] = useState<AdminUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Load admins when the modal opens
    useEffect(() => {
        if (isOpen) {
            loadAdmins();
        }
    }, [isOpen]);

    // Filter admins when search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredAdmins(admins);
        } else {
            const filtered = admins.filter(admin => {
                const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
                return fullName.includes(searchQuery.toLowerCase()) ||
                    admin.title.toLowerCase().includes(searchQuery.toLowerCase());
            });
            setFilteredAdmins(filtered);
        }
    }, [searchQuery, admins]);

    const loadAdmins = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await chatApiService.getActiveAdmins();
            setAdmins(data);
            setFilteredAdmins(data);
        } catch (err) {
            console.error('Failed to load admins:', err);
            setError('Không thể tải danh sách admin. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminSelect = (admin: AdminUser) => {
        onClose();
        navigate(`/messaging?contactId=${admin.id}`, { replace: true });
    };

    const AdminContent = () => (
        <>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm theo tên hoặc chức vụ..."
                    className="pl-9 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">
                    <p>{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={loadAdmins}
                    >
                        Thử lại
                    </Button>
                </div>
            ) : filteredAdmins.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'Không tìm thấy admin phù hợp' : 'Không có admin nào đang hoạt động'}
                </div>
            ) : (
                <ScrollArea className={embedded ? "h-[40vh]" : "h-[50vh]"} className="pr-4">
                    <div className="space-y-4">
                        {filteredAdmins.map((admin) => (
                            <motion.div
                                key={admin.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="border rounded-lg p-4 hover:bg-accent cursor-pointer"
                                onClick={() => handleAdminSelect(admin)}
                            >
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={admin.image} alt={`${admin.firstName} ${admin.lastName}`} />
                                        <AvatarFallback>{`${admin.firstName[0]}${admin.lastName[0]}`}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3
                                                className="font-semibold cursor-pointer hover:text-primary"
                                            >
                                                {admin.firstName} {admin.lastName}
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAdminSelect(admin);
                                                }}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-primary mt-1">{admin.title}</p>
                                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                                            <span>{admin.province}, {admin.country}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                            {admin.introduction}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </>
    );

    if (embedded) {
        return <AdminContent />;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Danh sách Admin hỗ trợ</DialogTitle>
                    <DialogDescription>
                        Chọn một admin để nhắn tin hoặc yêu cầu hỗ trợ.
                    </DialogDescription>
                </DialogHeader>
                <AdminContent />
            </DialogContent>
        </Dialog>
    );
};

export default AdminSelectionModal;