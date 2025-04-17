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
import { Badge } from '@/components/ui/badge';
import { FreelancerForClient } from './chatApiService';
import { useNavigate } from 'react-router-dom';
import chatApiService from './chatApiService';
import { motion } from 'framer-motion';

interface FreelancerSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string | number;
    embedded?: boolean; // Add embedded property
}

const FreelancerSelectionModal: React.FC<FreelancerSelectionModalProps> = ({
    isOpen,
    onClose,
    clientId,
    embedded = false
}) => {
    const [freelancers, setFreelancers] = useState<FreelancerForClient[]>([]);
    const [filteredFreelancers, setFilteredFreelancers] = useState<FreelancerForClient[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Load freelancers when the modal opens
    useEffect(() => {
        if (isOpen && clientId) {
            loadFreelancers();
        }
    }, [isOpen, clientId]);

    // Filter freelancers when search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredFreelancers(freelancers);
        } else {
            const filtered = freelancers.filter(freelancer =>
                freelancer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredFreelancers(filtered);
        }
    }, [searchQuery, freelancers]);

    const loadFreelancers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await chatApiService.getFreelancersForClient(clientId);
            setFreelancers(data);
            setFilteredFreelancers(data);
        } catch (err) {
            console.error('Failed to load freelancers:', err);
            setError('Failed to load freelancers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFreelancerSelect = (freelancer: FreelancerForClient) => {
        onClose();
        navigate(`/messaging?contactId=${freelancer.userId}`, { replace: true });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Applied':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'Viewed':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const renderStarRating = (rating: number) => {
        const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                    if (star <= roundedRating) {
                        // Full star
                        return <span key={star} className="text-yellow-500">★</span>;
                    } else if (star - 0.5 === roundedRating) {
                        // Half star
                        return <span key={star} className="text-yellow-500">⯨</span>;
                    } else {
                        // Empty star
                        return <span key={star} className="text-gray-300">★</span>;
                    }
                })}
                <span className="ml-1 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
            </div>
        );
    };

    // Content of the modal
    const FreelancerContent = () => (
        <>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm theo tên..."
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
                        onClick={loadFreelancers}
                    >
                        Thử lại
                    </Button>
                </div>
            ) : filteredFreelancers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'Không tìm thấy freelancer phù hợp' : 'Chưa có freelancer nào ứng tuyển'}
                </div>
            ) : (
                <ScrollArea className={embedded ? "h-[40vh]" : "h-[50vh]"} >
                    <div className="space-y-4">
                        {filteredFreelancers.map((freelancer) => (
                            <motion.div
                                key={freelancer.userId}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="border rounded-lg p-4 hover:bg-accent cursor-pointer"
                                onClick={() => handleFreelancerSelect(freelancer)}
                            >
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={freelancer.avatar} alt={freelancer.fullName} />
                                        <AvatarFallback>{freelancer.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3
                                                className="font-semibold cursor-pointer hover:text-primary"
                                                onClick={() => handleFreelancerSelect(freelancer)}
                                            >
                                                {freelancer.fullName}
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-primary"
                                                onClick={() => handleFreelancerSelect(freelancer)}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="mt-1">{renderStarRating(freelancer.rating)}</div>
                                        <div className="mt-2">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                Đã ứng tuyển {freelancer.jobs.length} công việc của bạn (click để xem chi tiết):
                                            </p>
                                            <div className="flex flex-col gap-2">
                                                {freelancer.jobs.slice(0, 3).map((job) => (
                                                    <div
                                                        key={job.id}
                                                        className="flex items-center justify-between border rounded-md p-1 px-2 text-xs hover:bg-accent/50 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`/client/applicants/${job.id}`, '_blank');
                                                        }}
                                                    >
                                                        <span className="truncate mr-2">{job.title}</span>
                                                        <Badge className={getStatusColor(job.status)}>
                                                            {job.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                                {freelancer.jobs.length > 3 && (
                                                    <div className="text-center">
                                                        <Badge variant="outline">
                                                            +{freelancer.jobs.length - 3} công việc khác
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </>
    );

    // If embedded, return only content
    if (embedded) {
        return <FreelancerContent />;
    }

    // Otherwise, wrap in Dialog
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Danh sách freelancer ứng tuyển</DialogTitle>
                    <DialogDescription>
                        Nhấn vào tên freelancer hoặc biểu tượng tin nhắn để nhắn tin. Nhấn vào tên công việc để xem chi tiết ứng viên.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tên..."
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
                            onClick={loadFreelancers}
                        >
                            Thử lại
                        </Button>
                    </div>
                ) : filteredFreelancers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        {searchQuery ? 'Không tìm thấy freelancer phù hợp' : 'Chưa có freelancer nào ứng tuyển'}
                    </div>
                ) : (
                    <ScrollArea className="h-[50vh] pr-4">
                        <div className="space-y-4">
                            {filteredFreelancers.map((freelancer) => (
                                <motion.div
                                    key={freelancer.userId}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="border rounded-lg p-4 hover:bg-accent cursor-pointer"
                                    onClick={() => handleFreelancerSelect(freelancer)}
                                >
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={freelancer.avatar} alt={freelancer.fullName} />
                                            <AvatarFallback>{freelancer.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3
                                                    className="font-semibold cursor-pointer hover:text-primary"
                                                    onClick={() => handleFreelancerSelect(freelancer)}
                                                >
                                                    {freelancer.fullName}
                                                </h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-primary"
                                                    onClick={() => handleFreelancerSelect(freelancer)}
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="mt-1">{renderStarRating(freelancer.rating)}</div>
                                            <div className="mt-2">
                                                <p className="text-xs text-muted-foreground mb-1">
                                                    Đã ứng tuyển {freelancer.jobs.length} công việc của bạn (click để xem chi tiết):
                                                </p>
                                                <div className="flex flex-col gap-2">
                                                    {freelancer.jobs.slice(0, 3).map((job) => (
                                                        <div
                                                            key={job.id}
                                                            className="flex items-center justify-between border rounded-md p-1 px-2 text-xs hover:bg-accent/50 cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open(`/client/applicants/${job.id}`, '_blank');
                                                            }}
                                                        >
                                                            <span className="truncate mr-2">{job.title}</span>
                                                            <Badge className={getStatusColor(job.status)}>
                                                                {job.status}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                    {freelancer.jobs.length > 3 && (
                                                        <div className="text-center">
                                                            <Badge variant="outline">
                                                                +{freelancer.jobs.length - 3} công việc khác
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FreelancerSelectionModal;