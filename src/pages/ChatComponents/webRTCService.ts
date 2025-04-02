import websocketService from './websocketService';

export interface SignalRequest {
    senderId: string;
    receiverId: string;
    type: string;
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
    screenShare?: boolean;
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
    onScreenShareEnded?: () => void; // Callback khi chia sẻ màn hình kết thúc
}

class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private screenShareStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private userId: string | null = null;
    private peerId: string | null = null; // ID của người tham gia cuộc gọi
    private callbacks: WebRTCCallbacks | null = null;
    private isScreenSharing: boolean = false;
    private iceGatheringTimeout: NodeJS.Timeout | null = null;
    private iceCandidates: RTCIceCandidate[] = [];
    private pendingOffer: RTCSessionDescriptionInit | null = null; // Lưu SDP offer nếu nhận được trước khi khởi tạo
    private pendingIceCandidates: RTCIceCandidate[] = []; // Lưu trữ tạm thời ICE candidates chưa xử lý
    private iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        // Thêm TURN servers để tăng khả năng kết nối trong môi trường NAT phức tạp
        {
            urls: 'turn:numb.viagenie.ca',
            username: 'webrtc@live.com',
            credential: 'muazkh'
        }
    ];

    // Flag để theo dõi đã gửi thông báo cuộc gọi được kết nối hay chưa
    private hasNotifiedConnected: boolean = false;

    // Initialize WebRTC with user ID and callbacks
    initialize(userId: string, callbacks: WebRTCCallbacks): void {
        console.log('Initializing WebRTC service for user', userId);
        this.userId = userId;
        this.callbacks = callbacks;

        // Subscribe to WebSocket for incoming calls
        websocketService.subscribeToCall(userId, (response: SignalResponse) => {
            this.handleIncomingSignal(response);
        });
    }

    // Handle incoming signals from WebSocket
    private handleIncomingSignal(response: SignalResponse): void {
        console.log('Received signal:', response.type, 'from', response.senderId);
        if (!this.callbacks) return;

        switch (response.type) {
            case 'offer':
                // Incoming call
                this.peerId = response.senderId;

                // Lưu SDP offer
                if (response.sdp) {
                    console.log('Storing SDP offer for later use');
                    this.pendingOffer = { type: 'offer', sdp: response.sdp };
                } else {
                    console.warn('Received offer without SDP');
                }

                this.callbacks.onCallReceived(response);
                break;

            case 'answer':
                // Call accepted
                if (this.peerConnection && response.sdp) {
                    console.log('Setting remote description from answer');
                    this.peerConnection.setRemoteDescription(
                        new RTCSessionDescription({
                            type: 'answer',
                            sdp: response.sdp
                        })
                    )
                        .then(() => {
                            console.log('Remote description set successfully');
                            // Xử lý các ICE candidates đã lưu
                            this.processPendingIceCandidates();
                            this.callbacks?.onCallAccepted(response);

                            // Đặt timeout để kiểm tra kết nối
                            setTimeout(() => this.checkMediaConnectionState(), 2000);
                        })
                        .catch(error => {
                            console.error('Error setting remote description:', error);
                            if (this.callbacks) {
                                this.callbacks.onError(error as Error);
                            }
                        });
                } else {
                    console.warn('Received answer but no peer connection or SDP');
                }
                break;

            case 'candidate':
                // New ICE candidate
                if (response.candidate) {
                    // Nếu chưa có peerConnection hoặc remoteDescription chưa được thiết lập
                    if (!this.peerConnection || !this.peerConnection.remoteDescription) {
                        console.log('Storing ICE candidate for later processing');
                        this.pendingIceCandidates.push(response.candidate as RTCIceCandidate);
                    } else {
                        console.log('Adding received ICE candidate');
                        this.peerConnection.addIceCandidate(new RTCIceCandidate(response.candidate))
                            .catch(error => console.error('Error adding received ice candidate', error));
                    }
                }
                break;

            case 'end-call':
                // Call ended
                console.log('Received end-call signal');
                this.callbacks.onCallEnded(response);
                this.resetCallState(false);
                break;
        }
    }

    // Kiểm tra tình trạng kết nối media và thông báo nếu cần
    private checkMediaConnectionState(): void {
        if (!this.peerConnection || !this.callbacks || this.hasNotifiedConnected) return;

        // Kiểm tra nếu có remote stream với video tracks
        if (this.remoteStream && this.remoteStream.getVideoTracks().length > 0) {
            const activeTracks = this.remoteStream.getVideoTracks().filter(track => track.enabled);
            console.log(`Checking media connection: ${activeTracks.length} active video tracks`);

            if (activeTracks.length > 0) {
                this.hasNotifiedConnected = true;

                // Đảm bảo UI được cập nhật
                if (this.callbacks.onConnectionStateChange) {
                    console.log('Triggering connected state from video track check');
                    this.callbacks.onConnectionStateChange('connected');

                    // Cập nhật lại remote stream để UI refresh
                    if (this.callbacks.onRemoteStreamReady && this.remoteStream) {
                        this.callbacks.onRemoteStreamReady(this.remoteStream);
                    }
                }
            } else {
                // Nếu chưa có active tracks, thử lại sau 2 giây
                setTimeout(() => this.checkMediaConnectionState(), 2000);
            }
        } else if (this.peerConnection.connectionState === 'connected') {
            // Nếu kết nối đã thành công nhưng chưa có video, vẫn thông báo connected
            // để người dùng biết cuộc gọi đã được thiết lập
            this.hasNotifiedConnected = true;
            console.log('Connection established but no video tracks yet');

            if (this.callbacks.onConnectionStateChange) {
                this.callbacks.onConnectionStateChange('connected');
            }

            // Tiếp tục kiểm tra media
            setTimeout(() => {
                // Thử refreshing remote stream
                if (this.remoteStream && this.callbacks.onRemoteStreamReady) {
                    console.log('Refreshing remote stream after connection');
                    this.callbacks.onRemoteStreamReady(this.remoteStream);
                }
            }, 2000);
        } else {
            // Thử lại sau nếu chưa kết nối
            setTimeout(() => this.checkMediaConnectionState(), 2000);
        }
    }

    // Xử lý các pending ice candidates
    private processPendingIceCandidates(): void {
        if (!this.peerConnection || !this.pendingIceCandidates.length) return;

        console.log(`Processing ${this.pendingIceCandidates.length} pending ICE candidates`);

        // Thêm tất cả các pending candidates vào peerConnection
        this.pendingIceCandidates.forEach(candidate => {
            if (this.peerConnection && this.peerConnection.remoteDescription) {
                console.log('Adding stored ICE candidate');
                this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    .catch(error => console.error('Error adding stored ice candidate', error));
            }
        });

        // Xóa tất cả các pending candidates đã xử lý
        this.pendingIceCandidates = [];
    }

    // Create peer connection with ICE servers
    private createPeerConnection(): RTCPeerConnection {
        console.log('Creating new peer connection');

        // Xóa kết nối cũ nếu tồn tại
        if (this.peerConnection) {
            this.peerConnection.close();
        }

        // Reset flag thông báo kết nối
        this.hasNotifiedConnected = false;

        // Khởi tạo ICE candidates
        this.iceCandidates = [];

        const pc = new RTCPeerConnection({
            iceServers: this.iceServers,
            iceCandidatePoolSize: 10,
            // Thêm cấu hình RTCConfiguration để tối ưu hoá kết nối
            iceTransportPolicy: 'all',
            rtcpMuxPolicy: 'require',
            bundlePolicy: 'max-bundle'
        });

        // Add local stream tracks to the connection
        if (this.localStream) {
            console.log('Adding local stream tracks to peer connection');
            this.localStream.getTracks().forEach(track => {
                if (this.localStream) {
                    pc.addTrack(track, this.localStream);
                }
            });
        }

        // Add screen share tracks if sharing screen
        if (this.screenShareStream) {
            console.log('Adding screen share tracks to peer connection');
            this.screenShareStream.getTracks().forEach(track => {
                if (this.screenShareStream) {
                    // Thêm các tracks từ screenShareStream
                    pc.addTrack(track, this.screenShareStream);

                    // Thêm listener để phát hiện khi người dùng dừng chia sẻ màn hình
                    track.addEventListener('ended', () => {
                        if (this.callbacks?.onScreenShareEnded) {
                            this.callbacks.onScreenShareEnded();
                        }
                        this.stopScreenSharing();
                    });
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
            console.log('Received remote track', event);
            console.log('Track kind:', event.track.kind);
            console.log('Track ready state:', event.track.readyState);
            console.log('Track enabled:', event.track.enabled);

            // Đảm bảo có remoteStream
            if (!this.remoteStream) {
                this.remoteStream = new MediaStream();
            }

            // Thêm track vào stream ngay lập tức
            if (!this.remoteStream.getTracks().some(t => t.id === event.track.id)) {
                console.log('Adding track to remote stream immediately', event.track.kind);
                this.remoteStream.addTrack(event.track);
            }

            // Ngay sau khi nhận được track, cập nhật UI
            if (this.callbacks) {
                setTimeout(() => {
                    if (this.callbacks && this.remoteStream) {
                        console.log('Notifying about remote stream update after track received');
                        this.callbacks.onRemoteStreamReady(this.remoteStream);

                        // Kiểm tra lại kết nối
                        this.checkMediaConnectionState();
                    }
                }, 200);
            }

            // Xử lý sự kiện unmute cho Safari
            event.track.onunmute = () => {
                console.log('Track unmuted:', event.track.kind);
                if (this.callbacks && this.remoteStream) {
                    this.callbacks.onRemoteStreamReady(this.remoteStream);
                    this.checkMediaConnectionState();
                }
            };

            // Safari đôi khi gọi sự kiện mute/unmute thay vì ended
            event.track.onmute = () => {
                console.log('Track muted:', event.track.kind);
            };

            event.track.onended = () => {
                console.log('Track ended:', event.track.kind);
            };
        };

        // Handle ICE candidate events
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Got new ICE candidate', event.candidate);
                this.iceCandidates.push(event.candidate);

                // Gửi từng candidate ngay lập tức 
                if (this.peerId) {
                    this.sendSignal({
                        senderId: this.userId!,
                        receiverId: this.peerId,
                        type: 'candidate',
                        candidate: event.candidate
                    });
                }

                if (this.callbacks) {
                    this.callbacks.onIceCandidate(event.candidate);
                }
            }
        };

        // Theo dõi trạng thái thu thập ICE candidates
        pc.onicegatheringstatechange = () => {
            console.log('ICE gathering state:', pc.iceGatheringState);
            if (pc.iceGatheringState === 'complete') {
                console.log('ICE gathering completed');
                // Khi thu thập xong, gửi tất cả candidates đã tích lũy
                this.sendPendingIceCandidates();

                // Xóa timeout nếu có
                if (this.iceGatheringTimeout) {
                    clearTimeout(this.iceGatheringTimeout);
                    this.iceGatheringTimeout = null;
                }
            }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
            console.log('Connection state changed:', pc.connectionState);
            if (this.callbacks) {
                this.callbacks.onConnectionStateChange(pc.connectionState);
            }

            // Tự động dọn dẹp khi kết nối bị closed hoặc failed
            if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                console.log('Connection failed or closed, resetting call state');
                this.resetCallState(false);
            } else if (pc.connectionState === 'connected') {
                // Khi trạng thái chuyển thành connected, kiểm tra media
                this.checkMediaConnectionState();
            }
        };

        // Theo dõi trạng thái ICE connection
        pc.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', pc.iceConnectionState);

            if (pc.iceConnectionState === 'failed') {
                console.log('ICE connection failed, attempting restart');
                // Thử kết nối lại nếu bị failed
                this.restartIce();
            } else if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
                // Thêm kiểm tra khi ice state chuyển sang connected
                setTimeout(() => this.checkMediaConnectionState(), 1000);
            }
        };

        return pc;
    }

    // Gửi tất cả ICE candidates đã tích lũy tới peer
    private sendPendingIceCandidates(): void {
        if (!this.peerId || this.iceCandidates.length === 0) return;

        console.log('Sending pending ICE candidates:', this.iceCandidates.length);

        // Gửi từng candidate đến peer
        for (const candidate of this.iceCandidates) {
            this.sendSignal({
                senderId: this.userId!,
                receiverId: this.peerId,
                type: 'candidate',
                candidate
            });
        }

        // Xóa các candidates đã gửi
        this.iceCandidates = [];
    }

    // Restart ICE khi kết nối bị lỗi
    private async restartIce(): Promise<void> {
        if (!this.peerConnection || !this.peerId) return;

        try {
            console.log('Restarting ICE connection');
            // Cập nhật lại cấu hình ICE để thử kết nối lại
            const offer = await this.peerConnection.createOffer({ iceRestart: true });
            await this.peerConnection.setLocalDescription(offer);

            // Gửi offer mới tới peer
            this.sendSignal({
                senderId: this.userId!,
                receiverId: this.peerId,
                type: 'offer',
                sdp: offer.sdp
            });

            console.log('ICE restart initiated');
        } catch (error) {
            console.error('Error restarting ICE:', error);
        }
    }

    // Start call with local media
    async startCall(receiverId: string, options: CallOptions = { enableVideo: true, enableAudio: true }): Promise<void> {
        try {
            console.log('Starting call to', receiverId, 'with options', options);
            this.peerId = receiverId;

            // Reset state từ cuộc gọi trước nếu có
            this.resetCallState(false); // Không cần giữ pendingOffer khi bắt đầu gọi

            // Get local media stream
            console.log('Requesting media with video:', options.enableVideo, 'audio:', options.enableAudio);

            try {
                this.localStream = await navigator.mediaDevices.getUserMedia({
                    video: options.enableVideo ? {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    } : false,
                    audio: options.enableAudio ? {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    } : false
                });
            } catch (err) {
                console.error('Error getting media with advanced constraints, trying simpler ones:', err);
                // Fallback với cấu hình đơn giản hơn
                this.localStream = await navigator.mediaDevices.getUserMedia({
                    video: options.enableVideo,
                    audio: options.enableAudio
                });
            }

            console.log('Local stream obtained with tracks:',
                this.localStream.getTracks().map(t => `${t.kind}:${t.enabled}`).join(', '));

            if (this.callbacks) {
                this.callbacks.onLocalStreamReady(this.localStream);
            }

            // Khởi tạo screen share nếu có yêu cầu
            if (options.screenShare) {
                await this.startScreenSharing();
            }

            // Create peer connection
            this.peerConnection = this.createPeerConnection();

            // Create offer
            console.log('Creating offer');
            const offer = await this.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            // Set local description
            console.log('Setting local description from offer');
            await this.peerConnection.setLocalDescription(offer);

            // Thiết lập timeout để gửi ICE candidates
            this.setIceGatheringTimeout();

            // Send offer to receiver
            console.log('Sending offer to receiver');
            this.sendSignal({
                senderId: this.userId!,
                receiverId,
                type: 'offer',
                sdp: offer.sdp
            });

        } catch (error) {
            console.error('Error starting call:', error);
            if (this.callbacks) {
                this.callbacks.onError(error as Error);
            }
        }
    }

    // Thiết lập timeout để gửi ICE candidates sau một khoảng thời gian
    private setIceGatheringTimeout(): void {
        // Xóa timeout cũ nếu có
        if (this.iceGatheringTimeout) {
            clearTimeout(this.iceGatheringTimeout);
        }

        // Đặt timeout để gửi ICE candidates sau 1 giây
        // Thời gian này có thể điều chỉnh tùy theo nhu cầu
        this.iceGatheringTimeout = setTimeout(() => {
            this.sendPendingIceCandidates();
        }, 1000);
    }

    // Accept an incoming call
    async acceptCall(callerId: string, offer: RTCSessionDescriptionInit, options: CallOptions = { enableVideo: true, enableAudio: true }): Promise<void> {
        try {
            console.log('Accepting call from', callerId, 'with options', options);
            this.peerId = callerId;

            // Reset state từ cuộc gọi trước nếu có
            // KHÔNG resetCallState ở đây vì nó sẽ xóa pendingOffer
            // Chỉ dọn dẹp các stream cũ
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => track.stop());
                this.localStream = null;
            }

            if (this.screenShareStream) {
                this.screenShareStream.getTracks().forEach(track => track.stop());
                this.screenShareStream = null;
            }

            // Get local media stream với retry
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
                try {
                    console.log(`Requesting media for accepting call (attempt ${attempts + 1}/${maxAttempts})`);

                    try {
                        this.localStream = await navigator.mediaDevices.getUserMedia({
                            video: options.enableVideo ? {
                                width: { ideal: 1280 },
                                height: { ideal: 720 },
                                facingMode: 'user'
                            } : false,
                            audio: options.enableAudio ? {
                                echoCancellation: true,
                                noiseSuppression: true,
                                autoGainControl: true
                            } : false
                        });
                    } catch (err) {
                        console.error('Error getting media with advanced constraints, trying simpler ones:', err);
                        // Fallback với cấu hình đơn giản hơn
                        this.localStream = await navigator.mediaDevices.getUserMedia({
                            video: options.enableVideo,
                            audio: options.enableAudio
                        });
                    }

                    console.log('Local stream obtained for accepting call with tracks:',
                        this.localStream.getTracks().map(t => `${t.kind}:${t.enabled}`).join(', '));

                    if (this.callbacks) {
                        this.callbacks.onLocalStreamReady(this.localStream);
                    }

                    break; // Thành công, thoát vòng lặp
                } catch (error) {
                    attempts++;
                    console.error(`Error getting media (attempt ${attempts}/${maxAttempts}):`, error);

                    if (attempts >= maxAttempts) {
                        throw error; // Vượt quá số lần thử, ném lỗi
                    }

                    // Chờ một lúc trước khi thử lại
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Khởi tạo screen share nếu có yêu cầu
            if (options.screenShare) {
                await this.startScreenSharing();
            }

            // Create peer connection
            this.peerConnection = this.createPeerConnection();

            // Kiểm tra xem có pendingOffer không
            if (!this.pendingOffer) {
                console.error('No pending offer found for call from', callerId);
                throw new Error('No pending offer found');
            }

            console.log('Using stored offer:', this.pendingOffer);

            // Set remote description from stored offer
            console.log('Setting remote description from stored offer');
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.pendingOffer));

            // Xử lý các ICE candidates đã lưu trữ
            this.processPendingIceCandidates();

            // Create answer
            console.log('Creating answer');
            const answer = await this.peerConnection.createAnswer();

            // Set local description
            console.log('Setting local description from answer');
            await this.peerConnection.setLocalDescription(answer);

            // Thiết lập timeout để gửi ICE candidates
            this.setIceGatheringTimeout();

            // Send answer to caller
            console.log('Sending answer to caller');
            this.sendSignal({
                senderId: this.userId!,
                receiverId: callerId,
                type: 'answer',
                sdp: answer.sdp
            });

            // Xóa pendingOffer sau khi đã xử lý
            this.pendingOffer = null;

        } catch (error) {
            console.error('Error accepting call:', error);
            if (this.callbacks) {
                this.callbacks.onError(error as Error);
            }
        }
    }

    // Reject an incoming call
    rejectCall(callerId: string): void {
        console.log('Rejecting call from', callerId);
        this.sendSignal({
            senderId: this.userId!,
            receiverId: callerId,
            type: 'end-call'
        });
        this.resetCallState(false); // Không cần giữ pendingOffer khi từ chối cuộc gọi
    }

    // End the current call
    endCall(): void {
        console.log('Ending current call');
        // Send end-call signal if in a call
        if (this.peerConnection && this.peerConnection.connectionState !== 'closed' && this.peerId) {
            this.sendSignal({
                senderId: this.userId!,
                receiverId: this.peerId,
                type: 'end-call'
            });
        }

        this.resetCallState(false); // Không cần giữ pendingOffer khi kết thúc cuộc gọi
    }

    // Reset call state
    private resetCallState(keepPendingOffer: boolean = false): void {
        console.log('Resetting call state' + (keepPendingOffer ? ' (keeping pending offer)' : ''));

        // Reset flag thông báo kết nối
        this.hasNotifiedConnected = false;

        // Xóa timeout nếu có
        if (this.iceGatheringTimeout) {
            clearTimeout(this.iceGatheringTimeout);
            this.iceGatheringTimeout = null;
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

        // Dừng chia sẻ màn hình
        this.stopScreenSharing();

        // Clear remote stream
        this.remoteStream = null;

        // Reset peer ID
        this.peerId = null;

        // Reset pending offer nếu không giữ lại
        if (!keepPendingOffer) {
            this.pendingOffer = null;
        }

        // Reset các candidates
        this.iceCandidates = [];

        // Reset pending ice candidates
        this.pendingIceCandidates = [];
    }

    // Toggle audio
    toggleAudio(enable: boolean): void {
        if (this.localStream) {
            console.log('Toggling audio:', enable);
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = enable;
            });
        }
    }

    // Toggle video
    toggleVideo(enable: boolean): void {
        if (this.localStream) {
            console.log('Toggling video:', enable);
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = enable;
            });
        }
    }

    isSharing(): boolean {
        return this.isScreenSharing;
    }
    // Các thay đổi cho startScreenSharing và stopScreenSharing trong webRTCService.ts

    // Bắt đầu chia sẻ màn hình
    async startScreenSharing(): Promise<boolean> {
        try {
            // Kiểm tra xem trình duyệt có hỗ trợ không
            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                console.error('Screen sharing not supported in this browser');
                throw new Error('Screen sharing not supported in this browser');
            }

            // Dừng chia sẻ màn hình hiện tại nếu có
            this.stopScreenSharing();

            console.log('Starting screen sharing');

            // Cấu hình chia sẻ màn hình phù hợp với nhiều trình duyệt
            const displayMediaOptions = {
                video: {
                    cursor: 'always',
                    width: { ideal: 1920, max: 1920 },
                    height: { ideal: 1080, max: 1080 },
                    frameRate: { ideal: 30, max: 30 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            };

            try {
                this.screenShareStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            } catch (err) {
                // Thử lại với cấu hình đơn giản hơn nếu thất bại
                console.log('Failed with advanced options, trying simpler configuration');
                this.screenShareStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false
                });
            }

            console.log('Screen share stream obtained with tracks:',
                this.screenShareStream.getTracks().map(t => `${t.kind}:${t.enabled}`).join(', '));

            // Thêm track từ screenShareStream vào peerConnection
            if (this.peerConnection && this.screenShareStream) {
                const videoTrack = this.screenShareStream.getVideoTracks()[0];
                if (videoTrack) {
                    console.log('Adding screen share video track to peer connection');

                    // Kiểm tra xem có thể dùng replaceTrack hay không
                    const senders = this.peerConnection.getSenders();
                    const videoSender = senders.find(sender =>
                        sender.track && sender.track.kind === 'video'
                    );

                    if (videoSender) {
                        // Lưu lại track gốc trước khi thay thế
                        const originalVideoTrack = videoSender.track;
                        if (originalVideoTrack && this.localStream) {
                            // Store original track for later restoration
                            const localVideoTracks = this.localStream.getVideoTracks();
                            if (localVideoTracks.length > 0) {
                                // Ensure we're comparing the correct track
                                const localVideoTrack = localVideoTracks[0];
                                if (localVideoTrack.id === originalVideoTrack.id) {
                                    // The tracks match, so we can proceed with replacement
                                    console.log('Replacing existing video track with screen share');
                                    await videoSender.replaceTrack(videoTrack);
                                } else {
                                    // Tracks don't match, add as a new track
                                    console.log('Adding screen share as a new track (existing track mismatch)');
                                    this.peerConnection.addTrack(videoTrack, this.screenShareStream);
                                }
                            } else {
                                // No local video tracks, just replace
                                console.log('Replacing video track with screen share (no local video tracks)');
                                await videoSender.replaceTrack(videoTrack);
                            }
                        } else {
                            // No original track, just replace
                            console.log('Replacing null track with screen share');
                            await videoSender.replaceTrack(videoTrack);
                        }
                    } else {
                        console.log('Adding new screen share track');
                        this.peerConnection.addTrack(videoTrack, this.screenShareStream);
                    }

                    // Thêm listener khi người dùng dừng chia sẻ màn hình
                    videoTrack.addEventListener('ended', () => {
                        console.log('Screen share video track ended by user');
                        if (this.callbacks?.onScreenShareEnded) {
                            this.callbacks.onScreenShareEnded();
                        }
                        this.stopScreenSharing();
                    });
                }

                // Xử lý audio track nếu có
                const audioTrack = this.screenShareStream.getAudioTracks()[0];
                if (audioTrack) {
                    console.log('Adding screen share audio track');
                    const audioSenders = this.peerConnection.getSenders().filter(
                        sender => sender.track && sender.track.kind === 'audio'
                    );

                    if (audioSenders.length > 0) {
                        console.log('Replacing existing audio track with screen share audio');
                        await audioSenders[0].replaceTrack(audioTrack);
                    } else {
                        console.log('Adding new screen share audio track');
                        this.peerConnection.addTrack(audioTrack, this.screenShareStream);
                    }
                }

                // Cập nhật offer và gửi đi
                if (this.peerId) {
                    try {
                        console.log('Creating new offer after adding screen share');
                        const offer = await this.peerConnection.createOffer();
                        await this.peerConnection.setLocalDescription(offer);

                        // Gửi offer mới tới peer
                        this.sendSignal({
                            senderId: this.userId!,
                            receiverId: this.peerId,
                            type: 'offer',
                            sdp: offer.sdp
                        });
                    } catch (error) {
                        console.error('Error creating/sending offer after screen share:', error);
                    }
                }
            }

            this.isScreenSharing = true;
            return true;
        } catch (error) {
            console.error('Error starting screen sharing:', error);
            if (this.callbacks) {
                this.callbacks.onError(error as Error);
            }
            return false;
        }
    }

    // Dừng chia sẻ màn hình
    async stopScreenSharing(): Promise<void> {
        if (this.screenShareStream) {
            console.log('Stopping screen sharing');

            // Dừng tất cả các track từ screenShareStream
            this.screenShareStream.getTracks().forEach(track => {
                track.stop();
            });

            // Nếu đang có kết nối, cần khôi phục lại video/audio ban đầu
            if (this.peerConnection && this.localStream) {
                try {
                    const senders = this.peerConnection.getSenders();

                    // Khôi phục video track
                    const videoTrack = this.localStream.getVideoTracks()[0];
                    if (videoTrack) {
                        const videoSender = senders.find(sender =>
                            sender.track && sender.track.kind === 'video'
                        );

                        if (videoSender) {
                            console.log('Restoring original video track');
                            await videoSender.replaceTrack(videoTrack);
                        } else {
                            console.log('Adding original video track (no existing sender)');
                            this.peerConnection.addTrack(videoTrack, this.localStream);
                        }
                    }

                    // Khôi phục audio track nếu cần
                    const audioTrack = this.localStream.getAudioTracks()[0];
                    if (audioTrack) {
                        const audioSender = senders.find(sender =>
                            sender.track && sender.track.kind === 'audio'
                        );

                        if (audioSender) {
                            console.log('Restoring original audio track');
                            await audioSender.replaceTrack(audioTrack);
                        }
                    }

                    // Cập nhật lại offer sau khi dừng chia sẻ màn hình
                    await this.updateOfferAfterScreenShareChange();
                } catch (error) {
                    console.error('Error restoring tracks after screen sharing:', error);
                }
            }

            this.screenShareStream = null;
            this.isScreenSharing = false;
        }
    }

    // Cập nhật lại offer sau khi thay đổi trạng thái chia sẻ màn hình
    private async updateOfferAfterScreenShareChange(): Promise<void> {
        if (!this.peerConnection || !this.peerId) return;

        try {
            console.log('Updating offer after screen share change');
            const offer = await this.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await this.peerConnection.setLocalDescription(offer);

            // Gửi offer mới tới peer
            this.sendSignal({
                senderId: this.userId!,
                receiverId: this.peerId,
                type: 'offer',
                sdp: offer.sdp
            });
        } catch (error) {
            console.error('Error updating offer after screen share change:', error);
        }
    }

    // Toggle screen sharing 
    async toggleScreenSharing(): Promise<boolean> {
        console.log('Toggle screen sharing, current state:', this.isScreenSharing);
        if (this.isScreenSharing) {
            await this.stopScreenSharing();
            return false;
        } else {
            return await this.startScreenSharing();
        }
    }

    // Send signal through WebSocket
    private sendSignal(request: SignalRequest): void {
        console.log('Sending signal:', request.type, 'to', request.receiverId);
        websocketService.sendSignal(request);
    }

    // Check if currently in a call
    isInCall(): boolean {
        return this.peerConnection !== null &&
            this.peerConnection.connectionState !== 'closed' &&
            this.peerConnection.connectionState !== 'failed';
    }

    // Lấy chất lượng kết nối hiện tại (có thể dùng để hiển thị thông tin kết nối)
    async getConnectionStats(): Promise<any> {
        if (!this.peerConnection) return null;

        try {
            const stats = await this.peerConnection.getStats();
            const result: any = {
                audio: { inbound: {}, outbound: {} },
                video: { inbound: {}, outbound: {} },
                connection: {}
            };

            stats.forEach(stat => {
                // Chỉ lấy các thông tin hữu ích
                if (stat.type === 'inbound-rtp' && stat.kind === 'audio') {
                    result.audio.inbound = {
                        packetsReceived: stat.packetsReceived,
                        packetsLost: stat.packetsLost,
                        jitter: stat.jitter,
                        bytesReceived: stat.bytesReceived
                    };
                } else if (stat.type === 'inbound-rtp' && stat.kind === 'video') {
                    result.video.inbound = {
                        packetsReceived: stat.packetsReceived,
                        packetsLost: stat.packetsLost,
                        jitter: stat.jitter,
                        bytesReceived: stat.bytesReceived,
                        framesDecoded: stat.framesDecoded,
                        frameWidth: stat.frameWidth,
                        frameHeight: stat.frameHeight
                    };
                } else if (stat.type === 'outbound-rtp' && stat.kind === 'audio') {
                    result.audio.outbound = {
                        packetsSent: stat.packetsSent,
                        bytesSent: stat.bytesSent
                    };
                } else if (stat.type === 'outbound-rtp' && stat.kind === 'video') {
                    result.video.outbound = {
                        packetsSent: stat.packetsSent,
                        bytesSent: stat.bytesSent,
                        framesSent: stat.framesSent,
                        frameWidth: stat.frameWidth,
                        frameHeight: stat.frameHeight
                    };
                } else if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
                    result.connection = {
                        currentRoundTripTime: stat.currentRoundTripTime,
                        availableOutgoingBitrate: stat.availableOutgoingBitrate,
                        localCandidateType: stat.localCandidateType,
                        remoteCandidateType: stat.remoteCandidateType
                    };
                }
            });

            return result;
        } catch (error) {
            console.error('Error getting connection stats:', error);
            return null;
        }
    }
}
const webrtcService = new WebRTCService();
export default webrtcService;