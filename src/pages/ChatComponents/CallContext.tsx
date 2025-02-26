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
    startCall: (userId: string, name: string, avatar?: string, options?: CallOptions) => void;
    acceptCall: () => void;
    rejectCall: () => void;
    endCall: () => void;
    toggleMute: () => void;
    toggleVideo: () => void;
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

    // Initialize WebRTC service
    useEffect(() => {
        if (!userId) return;

        // Define callbacks for WebRTC service
        const callbacks: WebRTCCallbacks = {
            onCallReceived: (response: SignalResponse) => {
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
                setCallStatus('connected');
                // Stop ringtone
                stopRingtone();
            },
            onCallEnded: (response: SignalResponse) => {
                handleCallEnded();
            },
            onLocalStreamReady: (stream: MediaStream) => {
                setLocalStream(stream);
            },
            onRemoteStreamReady: (stream: MediaStream) => {
                setRemoteStream(stream);
                setIsCallActive(true);
            },
            onIceCandidate: (candidate: RTCIceCandidate) => {
                // This is handled internally by the WebRTC service
            },
            onError: (error: Error) => {
                console.error('WebRTC error:', error);
                if (isInCall) {
                    handleCallEnded();
                }
            },
            onConnectionStateChange: (state: RTCPeerConnectionState) => {
                if (state === 'connected') {
                    setCallStatus('connected');
                } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                    handleCallEnded();
                }
            }
        };

        webRTCService.initialize(userId, callbacks);

        return () => {
            // Clean up - stop any active call
            if (isInCall) {
                webRTCService.endCall();
                handleCallEnded();
            }
        };
    }, [userId, isInCall]);

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
        setIsCallActive(false);
        setCallStatus('ended');
        stopRingtone();

        // Reset state after a brief delay to show the ended state
        setTimeout(() => {
            setIsInCall(false);
            setCallerInfo(null);
            setLocalStream(null);
            setRemoteStream(null);
            setIsMuted(false);
            setIsVideoOff(false);
            setCallStatus('idle');
        }, 1500);
    };

    // Start a call
    const startCall = (receiverId: string, name: string, avatar?: string, options?: CallOptions) => {
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
                setCallStatus('ringing');
            }
        }, 1000);
    };

    // Accept an incoming call
    const acceptCall = () => {
        if (!callerInfo) return;

        setCallStatus('connecting');
        stopRingtone();

        // Accept call with WebRTC service
        webRTCService.acceptCall(
            callerInfo.id,
            { type: 'offer', sdp: '' }, // This should come from the actual offer
            { enableVideo: true, enableAudio: true }
        );
    };

    // Reject an incoming call
    const rejectCall = () => {
        if (!callerInfo) return;

        stopRingtone();
        webRTCService.rejectCall(callerInfo.id);
        handleCallEnded();
    };

    // End an active call
    const endCall = () => {
        webRTCService.endCall();
        handleCallEnded();
    };

    // Toggle mute state
    const toggleMute = () => {
        setIsMuted(prev => !prev);
        webRTCService.toggleAudio(!isMuted);
    };

    // Toggle video state
    const toggleVideo = () => {
        setIsVideoOff(prev => !prev);
        webRTCService.toggleVideo(!isVideoOff);
    };

    // Context value
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
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo
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