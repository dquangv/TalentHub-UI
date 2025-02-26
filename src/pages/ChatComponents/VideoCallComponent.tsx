import React, { useEffect } from 'react';
import { useCall } from './CallContext';
import VideoCallDialog from './VideoCallDialog';

const VideoCallComponent: React.FC = () => {
    const {
        isInCall,
        isOutgoingCall,
        callStatus,
        callerInfo,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo
    } = useCall();

    // Prevent scrolling on body when call is active
    useEffect(() => {
        if (isInCall) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isInCall]);

    if (!isInCall || !callerInfo) {
        return null;
    }

    return (
        <VideoCallDialog
            open={isInCall}
            isOutgoing={isOutgoingCall}
            contactName={callerInfo.name}
            contactAvatar={callerInfo.avatar}
            localStream={localStream}
            remoteStream={remoteStream}
            callStatus={callStatus as 'connecting' | 'ringing' | 'connected' | 'ended'}
            onClose={endCall}
            onAccept={acceptCall}
            onReject={rejectCall}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
        />
    );
};

export default VideoCallComponent;