import websocketService from './websocketService';

export interface SignalRequest {
    senderId: string;
    receiverId: string;
    type: string; // 'offer', 'answer', 'candidate', 'end-call'
    sdp?: string;
    candidate?: RTCIceCandidate;
}

export interface SignalResponse {
    senderId: string;
    senderName: string;
    senderAvatar: string;
    receiverId: string;
    type: string;
    sdp?: string;
    candidate?: RTCIceCandidate;
    timestamp: string;
}

export interface CallOptions {
    enableVideo?: boolean;
    enableAudio?: boolean;
}

export interface WebRTCCallbacks {
    onCallReceived: (response: SignalResponse) => void;
    onCallAccepted: (response: SignalResponse) => void;
    onCallEnded: (response: SignalResponse) => void;
    onLocalStreamReady: (stream: MediaStream) => void;
    onRemoteStreamReady: (stream: MediaStream) => void;
    onIceCandidate: (candidate: RTCIceCandidate) => void;
    onError: (error: Error) => void;
    onConnectionStateChange: (state: RTCPeerConnectionState) => void;
}

class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private userId: string | null = null;
    private callbacks: WebRTCCallbacks | null = null;
    private iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ];

    // Initialize WebRTC with user ID and callbacks
    initialize(userId: string, callbacks: WebRTCCallbacks): void {
        this.userId = userId;
        this.callbacks = callbacks;

        // Subscribe to WebSocket for incoming calls
        websocketService.subscribeToCall(userId, (response: SignalResponse) => {
            this.handleIncomingSignal(response);
        });
    }

    // Handle incoming signals from WebSocket
    private handleIncomingSignal(response: SignalResponse): void {
        if (!this.callbacks) return;

        switch (response.type) {
            case 'offer':
                // Incoming call
                this.callbacks.onCallReceived(response);
                break;
            case 'answer':
                // Call accepted
                this.handleAnswer(response);
                this.callbacks.onCallAccepted(response);
                break;
            case 'candidate':
                // New ICE candidate
                if (response.candidate && this.peerConnection) {
                    this.peerConnection.addIceCandidate(new RTCIceCandidate(response.candidate));
                }
                break;
            case 'end-call':
                // Call ended
                this.endCall();
                this.callbacks.onCallEnded(response);
                break;
        }
    }

    // Create peer connection with ICE servers
    private createPeerConnection(): RTCPeerConnection {
        const pc = new RTCPeerConnection({
            iceServers: this.iceServers
        });

        // Add local stream tracks to the connection
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                if (this.localStream) {
                    pc.addTrack(track, this.localStream);
                }
            });
        }

        // Create remote stream placeholder
        this.remoteStream = new MediaStream();
        if (this.callbacks) {
            this.callbacks.onRemoteStreamReady(this.remoteStream);
        }

        // Handle track events (receiving remote video/audio)
        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => {
                if (this.remoteStream) {
                    this.remoteStream.addTrack(track);
                }
            });
        };

        // Handle ICE candidate events
        pc.onicecandidate = (event) => {
            if (event.candidate && this.callbacks) {
                this.callbacks.onIceCandidate(event.candidate);
            }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
            if (this.callbacks) {
                this.callbacks.onConnectionStateChange(pc.connectionState);
            }
        };

        return pc;
    }

    // Start call with local media
    async startCall(receiverId: string, options: CallOptions = { enableVideo: true, enableAudio: true }): Promise<void> {
        try {
            // Get local media stream
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: options.enableVideo,
                audio: options.enableAudio
            });

            if (this.callbacks) {
                this.callbacks.onLocalStreamReady(this.localStream);
            }

            // Create peer connection
            this.peerConnection = this.createPeerConnection();

            // Create offer
            const offer = await this.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            // Set local description
            await this.peerConnection.setLocalDescription(offer);

            // Send offer to receiver
            this.sendSignal({
                senderId: this.userId!,
                receiverId,
                type: 'offer',
                sdp: offer.sdp
            });

        } catch (error) {
            if (this.callbacks) {
                this.callbacks.onError(error as Error);
            }
        }
    }

    // Accept an incoming call
    async acceptCall(callerId: string, offer: RTCSessionDescriptionInit, options: CallOptions = { enableVideo: true, enableAudio: true }): Promise<void> {
        try {
            // Get local media stream
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: options.enableVideo,
                audio: options.enableAudio
            });

            if (this.callbacks) {
                this.callbacks.onLocalStreamReady(this.localStream);
            }

            // Create peer connection
            this.peerConnection = this.createPeerConnection();

            // Set remote description from offer
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            // Create answer
            const answer = await this.peerConnection.createAnswer();

            // Set local description
            await this.peerConnection.setLocalDescription(answer);

            // Send answer to caller
            this.sendSignal({
                senderId: this.userId!,
                receiverId: callerId,
                type: 'answer',
                sdp: answer.sdp
            });

        } catch (error) {
            if (this.callbacks) {
                this.callbacks.onError(error as Error);
            }
        }
    }

    // Reject an incoming call
    rejectCall(callerId: string): void {
        this.sendSignal({
            senderId: this.userId!,
            receiverId: callerId,
            type: 'end-call'
        });
    }

    // End the current call
    endCall(): void {
        // Send end-call signal if in a call
        if (this.peerConnection && this.peerConnection.connectionState !== 'closed') {
            // Send to the other party - we would need to store current peer ID
            // This is handled better in a full implementation
        }

        // Close peer connection
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        // Stop all local tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        // Clear remote stream
        this.remoteStream = null;
    }

    // Handle received answer
    private async handleAnswer(response: SignalResponse): Promise<void> {
        if (this.peerConnection && response.sdp) {
            await this.peerConnection.setRemoteDescription(
                new RTCSessionDescription({
                    type: 'answer',
                    sdp: response.sdp
                })
            );
        }
    }

    // Send ICE candidate to peer
    sendIceCandidate(receiverId: string, candidate: RTCIceCandidate): void {
        this.sendSignal({
            senderId: this.userId!,
            receiverId,
            type: 'candidate',
            candidate
        });
    }

    // Toggle audio
    toggleAudio(enable: boolean): void {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = enable;
            });
        }
    }

    // Toggle video
    toggleVideo(enable: boolean): void {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = enable;
            });
        }
    }

    // Send signal through WebSocket
    private sendSignal(request: SignalRequest): void {
        websocketService.sendSignal(request);

        // For redundancy or if WebSocket fails, we can also send via REST API
        // api.post('/api/chat/call/signal', request);
    }

    // Check if currently in a call
    isInCall(): boolean {
        return this.peerConnection !== null &&
            this.peerConnection.connectionState !== 'closed' &&
            this.peerConnection.connectionState !== 'failed';
    }
}

const webRTCService = new WebRTCService();
export default webRTCService;