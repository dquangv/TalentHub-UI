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
        isScreenSharing,
        callQuality,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        toggleScreenShare
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

    // Thêm log để debug
    useEffect(() => {
        console.log('Call status changed:', {
            isInCall,
            callStatus,
            callerInfo: callerInfo ? `${callerInfo.id}:${callerInfo.name}` : 'none'
        });
    }, [isInCall, callStatus, callerInfo]);

    if (!isInCall || !callerInfo) {
        console.log('No active call to display');
        return null;
    }

    const handleAcceptCall = () => {
        console.log('Call accepted in VideoCallComponent');
        acceptCall();
    };

    const handleRejectCall = () => {
        console.log('Call rejected in VideoCallComponent');
        rejectCall();
    };

    const handleEndCall = () => {
        console.log('Call ended in VideoCallComponent');
        endCall();
    };

    return (
        <VideoCallDialog
            open={isInCall}
            isOutgoing={isOutgoingCall}
            contactName={callerInfo.name}
            contactAvatar={callerInfo.avatar}
            localStream={localStream}
            remoteStream={remoteStream}
            callStatus={callStatus as 'connecting' | 'ringing' | 'connected' | 'ended'}
            onClose={handleEndCall}
            onAccept={handleAcceptCall}
            onReject={handleRejectCall}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            isScreenSharing={isScreenSharing}
            callQuality={callQuality}
        />
    );
};

export default VideoCallComponent;