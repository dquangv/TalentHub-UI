import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Mic, MicOff, Camera, CameraOff, PhoneOff,
    Monitor, Maximize2, Minimize2, MoreVertical,
    Volume2, VolumeX, Share2, Wifi, WifiOff
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface VideoCallDialogProps {
    open: boolean;
    isOutgoing: boolean;
    contactName: string;
    contactAvatar?: string;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    callStatus: 'connecting' | 'ringing' | 'connected' | 'ended';
    onClose: () => void;
    onAccept?: () => void;
    onReject?: () => void;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    onToggleScreenShare?: () => Promise<boolean>; // Thêm chức năng chia sẻ màn hình
    isMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing?: boolean; // Thêm trạng thái chia sẻ màn hình
    callQuality?: any; // Thêm thông tin về chất lượng cuộc gọi
}

const VideoCallDialog: React.FC<VideoCallDialogProps> = ({
    open,
    isOutgoing,
    contactName,
    contactAvatar,
    localStream,
    remoteStream,
    callStatus,
    onClose,
    onAccept,
    onReject,
    onToggleMute,
    onToggleVideo,
    onToggleScreenShare,
    isMuted,
    isVideoOff,
    isScreenSharing = false,
    callQuality
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isPiP, setIsPiP] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [callTime, setCallTime] = useState<number>(0);
    const [showControls, setShowControls] = useState<boolean>(true);
    const [showStats, setShowStats] = useState<boolean>(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cập nhật xử lý video streams trong VideoCallDialog.tsx

    useEffect(() => {
        console.log('Stream refs updated:',
            'localStream:', localStream?.getTracks().map(t => `${t.kind}:${t.enabled}`).join(','),
            'remoteStream:', remoteStream?.getTracks().map(t => `${t.kind}:${t.enabled}`).join(',')
        );

        // Xử lý local stream
        if (localVideoRef.current && localStream) {
            console.log('Setting local video source');

            // Đảm bảo local video đã sẵn sàng
            localVideoRef.current.srcObject = localStream;

            // Safari đòi hỏi bạn chủ động gọi load() trước play()
            localVideoRef.current.load();

            // Thêm delay ngắn trước khi gọi play() để Safari có thời gian xử lý
            setTimeout(() => {
                if (localVideoRef.current) {
                    const playPromise = localVideoRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(err => {
                            console.warn('Could not play local video automatically:', err);
                            // Có thể đây là Safari yêu cầu tương tác người dùng, hiển thị thông báo
                            console.log('Trying to play local video again after error');
                            setTimeout(() => {
                                if (localVideoRef.current) {
                                    localVideoRef.current.play().catch(e =>
                                        console.warn('Second attempt to play local video failed:', e)
                                    );
                                }
                            }, 500);
                        });
                    }
                }
            }, 100);
        }

        // Xử lý remote stream - Safari cần xử lý đặc biệt
        if (remoteVideoRef.current && remoteStream) {
            console.log('Setting remote video source, tracks:', remoteStream.getTracks().length);

            // Kiểm tra xem có video track hay không
            const hasVideoTracks = remoteStream.getVideoTracks().length > 0;
            console.log('Remote stream has video tracks:', hasVideoTracks);

            // Đặt srcObject kể cả khi chưa có tracks - Safari sẽ cập nhật khi tracks được thêm vào
            remoteVideoRef.current.srcObject = remoteStream;

            // Safari đòi hỏi bạn chủ động gọi load() trước play()
            remoteVideoRef.current.load();

            // Thêm delay ngắn trước khi gọi play() để Safari có thời gian xử lý
            setTimeout(() => {
                if (remoteVideoRef.current) {
                    const playPromise = remoteVideoRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(err => {
                            console.warn('Could not play remote video automatically:', err);
                            // Thông báo cho người dùng nếu cần thiết
                            console.log('Trying to play remote video again after error');
                            setTimeout(() => {
                                if (remoteVideoRef.current) {
                                    remoteVideoRef.current.play().catch(e =>
                                        console.warn('Second attempt to play remote video failed:', e)
                                    );
                                }
                            }, 500);
                        });
                    }
                }
            }, 100);
        }
    }, [localStream, remoteStream]);

    // Thêm useEffect để kiểm tra định kỳ nếu tracks đã được thêm nhưng video không hiển thị
    useEffect(() => {
        // Phát hiện Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

        if ((isSafari || isIOS) && callStatus === 'connected') {
            console.log('Safari/iOS detected, applying special handling');

            // Thêm xử lý đặc biệt cho Safari nếu cần
            const checkVideoInterval = setInterval(() => {
                if (remoteVideoRef.current && remoteStream) {
                    const videoTracks = remoteStream.getVideoTracks();
                    if (videoTracks.length > 0 && videoTracks[0].enabled) {
                        console.log('Video track is enabled in Safari, ensuring playback');
                        remoteVideoRef.current.play().catch(e => console.log('Safari play error:', e));
                    }
                }
            }, 1000);

            return () => clearInterval(checkVideoInterval);
        }
    }, [callStatus, remoteStream]);

    // Format call time as mm:ss
    const formatCallTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle picture-in-picture mode
    const togglePiP = async (): Promise<void> => {
        if (remoteVideoRef.current) {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                    setIsPiP(false);
                } else if (remoteVideoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
                    await remoteVideoRef.current.requestPictureInPicture();
                    setIsPiP(true);
                }
            } catch (error) {
                console.error('PiP error:', error);
            }
        }
    };

    // Toggle fullscreen mode
    const toggleFullscreen = (): void => {
        const dialogElement = document.querySelector('.call-dialog-content') as HTMLElement;

        if (!dialogElement) return;

        if (!document.fullscreenElement) {
            dialogElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            }).catch(err => {
                console.error('Exit fullscreen error:', err);
            });
        }
    };

    // Toggle call stats
    const toggleStats = (): void => {
        setShowStats(prev => !prev);
    };

    // Start timer to auto-hide controls
    const startControlsTimer = (): void => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        setShowControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 5000);
    };

    // Show controls on movement
    const handleMouseMove = (): void => {
        if (callStatus === 'connected') {
            startControlsTimer();
        }
    };

    // Đánh giá chất lượng cuộc gọi
    const getCallQualityStatus = (): { status: 'good' | 'medium' | 'poor', text: string } => {
        if (!callQuality) return { status: 'medium', text: 'Chất lượng không xác định' };

        // Lấy thông tin từ callQuality để đánh giá
        const connection = callQuality.connection;

        if (!connection || !connection.currentRoundTripTime) {
            return { status: 'medium', text: 'Đang đánh giá...' };
        }

        // Thời gian round trip (ms)
        const rtt = connection.currentRoundTripTime * 1000;

        if (rtt < 150) {
            return { status: 'good', text: 'Chất lượng tốt' };
        } else if (rtt < 300) {
            return { status: 'medium', text: 'Chất lượng trung bình' };
        } else {
            return { status: 'poor', text: 'Chất lượng kém' };
        }
    };

    const qualityInfo = getCallQualityStatus();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="call-dialog-content max-w-full sm:max-w-screen-md h-[calc(100vh-2rem)] sm:h-[80vh] p-0 flex flex-col overflow-hidden"
                onMouseMove={handleMouseMove}
                onTouchStart={handleMouseMove}
            >
                {/* Main video container */}
                <div className="flex-1 bg-black relative overflow-hidden">
                    {/* Connection status overlay */}
                    {callStatus !== 'connected' && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
                            <Avatar className="h-20 w-20 sm:h-28 sm:w-28 mb-4">
                                <AvatarImage src={contactAvatar} alt={contactName} />
                                <AvatarFallback className="text-xl sm:text-2xl">
                                    {contactName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{contactName}</h3>
                            <p className="text-white/80 text-md sm:text-lg mb-8">
                                {isOutgoing ? (
                                    callStatus === 'ringing' ? 'Đang gọi...' : 'Đang kết nối...'
                                ) : (
                                    'Đang gọi đến...'
                                )}
                            </p>

                            {/* Call controls for incoming call */}
                            {!isOutgoing && callStatus !== 'ended' && (
                                <div className="flex space-x-4 sm:space-x-8">
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-14 w-14 rounded-full"
                                            onClick={onReject}
                                        >
                                            <PhoneOff className="h-6 w-6" />
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button
                                            variant="default"
                                            size="icon"
                                            className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
                                            onClick={onAccept}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                        </Button>
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Remote video (main) */}
                    {callStatus === 'connected' && (
                        <div className="w-full h-full">
                            <video
                                ref={remoteVideoRef}
                                className="w-full h-full object-cover"
                                autoPlay
                                playsInline
                                muted={false}
                                style={{ backgroundColor: '#000' }}
                            />

                            {remoteStream && remoteStream.getVideoTracks().length > 0 && remoteVideoRef.current && remoteVideoRef.current.videoWidth === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                    <p className="text-white text-lg">Đang chờ video...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Call duration and quality display */}
                    {callStatus === 'connected' && (
                        <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} flex items-center gap-2`}>
                            <span className="text-white text-sm">{formatCallTime(callTime)}</span>

                            {/* Hiển thị chất lượng cuộc gọi */}
                            <span className="ml-2 flex items-center">
                                {qualityInfo.status === 'good' && <Wifi className="h-4 w-4 text-green-400" />}
                                {qualityInfo.status === 'medium' && <Wifi className="h-4 w-4 text-yellow-400" />}
                                {qualityInfo.status === 'poor' && <WifiOff className="h-4 w-4 text-red-400" />}
                            </span>
                        </div>
                    )}

                    {/* Local video (small overlay) */}
                    <div className="absolute top-4 right-4 w-1/4 sm:w-1/5 aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                        <video
                            ref={localVideoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted={true} // Local video phải được muted để tránh echo
                            style={{ backgroundColor: '#111' }}
                        />
                        {isVideoOff && (
                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>YOU</AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                    </div>
                </div>

                {/* Screen sharing indicator */}
                {isScreenSharing && (
                    <div className="absolute bottom-4 right-4 bg-primary/80 text-primary-foreground px-3 py-1 rounded-full text-xs flex items-center">
                        <Monitor className="h-3 w-3 mr-1" />
                        Đang chia sẻ màn hình
                    </div>
                )}

                {/* Call stats panel */}
                {showStats && callQuality && (
                    <div className="absolute bottom-20 right-4 bg-background/90 p-3 rounded-lg shadow-lg text-xs max-w-xs">
                        <h4 className="font-semibold mb-2">Thông tin cuộc gọi</h4>
                        <div className="space-y-1">
                            {callQuality.connection && (
                                <>
                                    <p>RTT: {callQuality.connection.currentRoundTripTime ? (callQuality.connection.currentRoundTripTime * 1000).toFixed(0) + 'ms' : 'N/A'}</p>
                                    <p>Bitrate: {callQuality.connection.availableOutgoingBitrate ? Math.round(callQuality.connection.availableOutgoingBitrate / 1000) + 'kbps' : 'N/A'}</p>
                                </>
                            )}
                            {callQuality.video && callQuality.video.inbound && (
                                <>
                                    <p>Độ phân giải: {callQuality.video.inbound.frameWidth || '?'} x {callQuality.video.inbound.frameHeight || '?'}</p>
                                    <p>Gói nhận: {callQuality.video.inbound.packetsReceived || 0}, Mất: {callQuality.video.inbound.packetsLost || 0}</p>
                                </>
                            )}
                        </div>
                        <button onClick={toggleStats} className="text-xs text-primary mt-2">Đóng</button>
                    </div>
                )}

                {/* Call controls footer */}
                <div className={`bg-gray-900 p-3 sm:p-5 transition-opacity duration-300 ${callStatus === 'connected' && !showControls ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-1 sm:space-x-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white"
                                            onClick={onToggleMute}
                                        >
                                            {isMuted ? (
                                                <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />
                                            ) : (
                                                <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isMuted ? 'Bật microphone' : 'Tắt microphone'}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white"
                                            onClick={onToggleVideo}
                                        >
                                            {isVideoOff ? (
                                                <CameraOff className="h-5 w-5 sm:h-6 sm:w-6" />
                                            ) : (
                                                <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isVideoOff ? 'Bật camera' : 'Tắt camera'}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Screen sharing button */}
                            {onToggleScreenShare && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`rounded-full h-10 w-10 sm:h-12 sm:w-12 ${isScreenSharing ? 'bg-primary text-primary-foreground' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                                                onClick={onToggleScreenShare}
                                            >
                                                <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {isScreenSharing ? 'Dừng chia sẻ màn hình' : 'Chia sẻ màn hình'}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white hidden sm:flex"
                                            onClick={togglePiP}
                                        >
                                            <Monitor className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isPiP ? 'Thoát chế độ PiP' : 'Chế độ hình trong hình'}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white hidden sm:flex"
                                            onClick={toggleFullscreen}
                                        >
                                            {isFullscreen ? (
                                                <Minimize2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                            ) : (
                                                <Maximize2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="destructive"
                                size="lg"
                                className="rounded-full px-6 py-6 h-10 sm:h-12"
                                onClick={onClose}
                            >
                                <PhoneOff className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                                <span className="hidden sm:inline">Kết thúc</span>
                            </Button>
                        </motion.div>

                        <div className="flex space-x-1 sm:space-x-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white"
                                            onClick={toggleStats}
                                        >
                                            <Wifi className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Thông tin kết nối
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white"
                                        >
                                            <MoreVertical className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Thêm tùy chọn
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default VideoCallDialog;