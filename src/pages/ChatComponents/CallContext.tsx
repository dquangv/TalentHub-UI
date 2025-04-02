import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import webRTCService, {
    WebRTCCallbacks,
    SignalResponse,
    CallOptions
} from './webRTCService';

interface CallContextType {
    isInCall: boolean;
    isCallActive: boolean;
    isOutgoingCall: boolean;
    callStatus: 'idle' | 'connecting' | 'ringing' | 'connected' | 'ended';
    callerInfo: {
        id: string;
        name: string;
        avatar?: string;
    } | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing: boolean;
    callQuality: any;
    startCall: (userId: string, name: string, avatar?: string, options?: CallOptions) => void;
    acceptCall: () => void;
    rejectCall: () => void;
    endCall: () => void;
    toggleMute: () => void;
    toggleVideo: () => void;
    toggleScreenShare: () => Promise<boolean>;
}

const CallContext = createContext<CallContextType>({} as CallContextType);

interface CallProviderProps {
    children: ReactNode;
    userId: string;
}

export const CallProvider: React.FC<CallProviderProps> = ({ children, userId }) => {
    const [isInCall, setIsInCall] = useState<boolean>(false);
    const [isCallActive, setIsCallActive] = useState<boolean>(false);
    const [isOutgoingCall, setIsOutgoingCall] = useState<boolean>(false);
    const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'ringing' | 'connected' | 'ended'>('idle');
    const [callerInfo, setCallerInfo] = useState<{
        id: string;
        name: string;
        avatar?: string;
    } | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
    const [callQuality, setCallQuality] = useState<any>(null);

    // Stats polling interval
    const [statsInterval, setStatsInterval] = useState<NodeJS.Timeout | null>(null);

    // Initialize WebRTC service
    useEffect(() => {
        if (!userId) return;

        console.log('Initializing WebRTC service for user', userId);

        // Define callbacks for WebRTC service
        const callbacks: WebRTCCallbacks = {
            onCallReceived: (response: SignalResponse) => {
                console.log('Call received from', response.senderId);
                setCallerInfo({
                    id: response.senderId,
                    name: response.senderName,
                    avatar: response.senderAvatar
                });
                setIsInCall(true);
                setIsOutgoingCall(false);
                setCallStatus('ringing');
                // Play ringtone here
                playRingtone();
            },
            onCallAccepted: (response: SignalResponse) => {
                console.log('Call accepted by', response.senderId);
                setCallStatus('connected');
                // Stop ringtone
                stopRingtone();
            },
            onCallEnded: (response: SignalResponse) => {
                console.log('Call ended by', response?.senderId || 'system');
                handleCallEnded();
            },
            onLocalStreamReady: (stream: MediaStream) => {
                console.log('Local stream ready with tracks:',
                    stream.getTracks().map(t => `${t.kind}:${t.enabled}`).join(', '));
                // Đảm bảo setLocalStream gọi với stream mới, để useEffect trong VideoCallDialog được kích hoạt
                setLocalStream(null);
                setTimeout(() => setLocalStream(stream), 0);
            },
            onRemoteStreamReady: (stream: MediaStream) => {
                console.log('Remote stream ready with tracks:',
                    stream.getTracks().map(t => `${t.kind}:${t.enabled}`).join(', '));
                // Đảm bảo setRemoteStream gọi với stream mới, để useEffect trong VideoCallDialog được kích hoạt
                setRemoteStream(null);
                setTimeout(() => {
                    setRemoteStream(stream);
                    setIsCallActive(true);
                }, 0);
            },
            onIceCandidate: (candidate: RTCIceCandidate) => {
                // This is handled internally by the WebRTC service
                console.log('ICE candidate received');
            },
            onError: (error: Error) => {
                console.error('WebRTC error:', error);
                if (isInCall) {
                    handleCallEnded();
                }
            },
            onConnectionStateChange: (state: RTCPeerConnectionState) => {
                console.log('Connection state changed to', state);
                if (state === 'connected') {
                    setCallStatus('connected');
                    // Bắt đầu thu thập thông tin chất lượng cuộc gọi
                    startStatsPolling();
                } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                    handleCallEnded();
                }
            },
            onScreenShareEnded: () => {
                // Cập nhật trạng thái khi người dùng dừng chia sẻ màn hình
                console.log('Screen share ended');
                setIsScreenSharing(false);
                // Hiển thị thông báo nếu cần
                // toast.info('Chia sẻ màn hình đã kết thúc');
            }
        };

        webRTCService.initialize(userId, callbacks);

        return () => {
            // Clean up - stop any active call
            if (isInCall) {
                webRTCService.endCall();
                handleCallEnded();
            }

            // Xóa interval nếu có
            if (statsInterval) {
                clearInterval(statsInterval);
            }
        };
    }, [userId]);

    // Thu thập định kỳ thông tin về chất lượng cuộc gọi
    const startStatsPolling = () => {
        // Xóa interval cũ nếu có
        if (statsInterval) {
            clearInterval(statsInterval);
        }

        // Đặt interval mới (mỗi 2 giây)
        const interval = setInterval(async () => {
            if (!isInCall || callStatus !== 'connected') {
                clearInterval(interval);
                return;
            }

            const stats = await webRTCService.getConnectionStats();
            if (stats) {
                setCallQuality(stats);
            }
        }, 2000);

        setStatsInterval(interval);
    };

    // Play ringtone sound
    const playRingtone = () => {
        // Implement ringtone playing logic
        // Can use HTML5 Audio API or an audio element
        // Example:
        const audio = new Audio('/path/to/ringtone.mp3');
        audio.loop = true;
        audio.play().catch(err => console.warn('Could not play ringtone', err));
    };

    // Stop ringtone sound
    const stopRingtone = () => {
        // Implement ringtone stopping logic
    };

    // Handle call ending
    const handleCallEnded = () => {
        console.log('Handling call end');
        setIsCallActive(false);
        setCallStatus('ended');
        stopRingtone();

        // Dừng thu thập thống kê
        if (statsInterval) {
            clearInterval(statsInterval);
            setStatsInterval(null);
        }

        // Reset state after a brief delay to show the ended state
        setTimeout(() => {
            console.log('Resetting call UI state');
            setIsInCall(false);
            setCallerInfo(null);
            setLocalStream(null);
            setRemoteStream(null);
            setIsMuted(false);
            setIsVideoOff(false);
            setIsScreenSharing(false);
            setCallQuality(null);
            setCallStatus('idle');
        }, 1500);
    };

    // Start a call
    const startCall = (receiverId: string, name: string, avatar?: string, options?: CallOptions) => {
        console.log('Starting call to', receiverId);
        setCallerInfo({
            id: receiverId,
            name,
            avatar
        });
        setIsInCall(true);
        setIsOutgoingCall(true);
        setCallStatus('connecting');

        // Initiate call with WebRTC service
        webRTCService.startCall(receiverId, options || { enableVideo: true, enableAudio: true });

        // Update status after a brief timeout to simulate ringing
        setTimeout(() => {
            if (callStatus === 'connecting') {
                console.log('Call is now ringing');
                setCallStatus('ringing');
            }
        }, 1000);
    };

    // Accept an incoming call
    const acceptCall = () => {
        if (!callerInfo) {
            console.error('Cannot accept call: No caller info');
            return;
        }

        console.log('Accepting call from', callerInfo.id);
        setCallStatus('connecting');
        stopRingtone();

        // Accept call with WebRTC service
        // Không cần truyền SDP offer bởi vì nó đã được lưu trong pendingOffer
        webRTCService.acceptCall(
            callerInfo.id,
            { type: 'offer', sdp: '' }, // Giá trị này sẽ bị bỏ qua, pendingOffer sẽ được sử dụng thay thế
            { enableVideo: true, enableAudio: true }
        );
    };

    // Reject an incoming call
    const rejectCall = () => {
        if (!callerInfo) {
            console.error('Cannot reject call: No caller info');
            return;
        }

        console.log('Rejecting call from', callerInfo.id);
        stopRingtone();
        webRTCService.rejectCall(callerInfo.id);
        handleCallEnded();
    };

    // End an active call
    const endCall = () => {
        console.log('Ending call');
        webRTCService.endCall();
        handleCallEnded();
    };

    // Toggle mute state
    const toggleMute = () => {
        console.log('Toggling mute:', !isMuted);
        setIsMuted(prev => !prev);
        webRTCService.toggleAudio(!isMuted);
    };

    // Toggle video state
    const toggleVideo = () => {
        console.log('Toggling video:', !isVideoOff);
        setIsVideoOff(prev => !prev);
        webRTCService.toggleVideo(!isVideoOff);
    };

    // Toggle screen sharing
    const toggleScreenShare = async (): Promise<boolean> => {
        try {
            console.log('Toggling screen share');
            const result = await webRTCService.toggleScreenSharing();
            setIsScreenSharing(result);
            return result;
        } catch (error) {
            console.error('Error toggling screen share:', error);
            return false;
        }
    };

    const value: CallContextType = {
        isInCall,
        isCallActive,
        isOutgoingCall,
        callStatus,
        callerInfo,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        isScreenSharing,
        callQuality,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare
    };

    return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

// Hook to use call context
export const useCall = (): CallContextType => {
    const context = useContext(CallContext);
    if (!context) {
        throw new Error('useCall must be used within a CallProvider');
    }
    return context;
};