import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Mic, MicOff, Camera, CameraOff, PhoneOff,
    Monitor, Maximize2, Minimize2, MoreVertical,
    Volume2, VolumeX
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

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
    isMuted: boolean;
    isVideoOff: boolean;
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
    isMuted,
    isVideoOff
}) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isPiP, setIsPiP] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [callTime, setCallTime] = useState<number>(0);
    const [showControls, setShowControls] = useState<boolean>(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Set local and remote streams to video elements
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [localStream, remoteStream]);

    // Handle auto-hide controls
    useEffect(() => {
        if (callStatus === 'connected') {
            startControlsTimer();
        }

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [callStatus]);

    // Start timer for connected call
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (callStatus === 'connected') {
            interval = setInterval(() => {
                setCallTime(prev => prev + 1);
            }, 1000);
        } else {
            setCallTime(0);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [callStatus]);

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
                        <video
                            ref={remoteVideoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                        />
                    )}

                    {/* Call duration display */}
                    {callStatus === 'connected' && (
                        <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="text-white text-sm">{formatCallTime(callTime)}</span>
                        </div>
                    )}

                    {/* Local video (small overlay) */}
                    <div className="absolute top-4 right-4 w-1/4 sm:w-1/5 aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                        <video
                            ref={localVideoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted
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

                {/* Call controls footer */}
                <div className={`bg-gray-900 p-3 sm:p-5 transition-opacity duration-300 ${callStatus === 'connected' && !showControls ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-1 sm:space-x-3">
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
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white hidden sm:flex"
                                onClick={togglePiP}
                            >
                                <Monitor className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
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
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white"
                            >
                                <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-gray-800 hover:bg-gray-700 text-white"
                            >
                                <MoreVertical className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VideoCallDialog;