// websocketService.ts (Đã sửa)
import SockJS from 'sockjs-client/dist/sockjs';
import * as Stomp from '@stomp/stompjs';
import { SignalRequest, SignalResponse } from './webRTCService';

// Existing interfaces remain the same
export interface MessageRequest {
    senderId: string;
    receiverId: string;
    content: string;
}

export interface MessageResponse {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    receiverId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface ReadMessageRequest {
    receiverId: string;
    senderId: string;
}

export interface UserStatusUpdate {
    userId: string;
    isOnline: boolean;
}

export interface WebSocketCallbacks {
    onMessageReceived: (message: MessageResponse) => void;
    onReadReceiptReceived: (receipt: ReadMessageRequest) => void;
    onStatusReceived: (status: UserStatusUpdate) => void;
    onConnectionEstablished: () => void;
    onConnectionLost: () => void;
}

class WebSocketService {
    private stompClient: Stomp.Client | null = null;
    private userId: string | null = null;
    private callbacks: WebSocketCallbacks | null = null;
    private connected: boolean = false;
    private reconnectAttempts: number = 0;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private readonly MAX_RECONNECT_ATTEMPTS: number = 5;
    private callSubscriptions: Map<string, (response: SignalResponse) => void> = new Map();

    // Connect WebSocket
    connect(userId: string, callbacks: WebSocketCallbacks): void {
        // Nếu đã có kết nối với cùng userId, chỉ cập nhật callbacks
        if (this.connected && this.stompClient && this.userId === userId) {
            console.log('WebSocket already connected with same userId, updating callbacks');
            this.callbacks = callbacks;
            // Gọi callback onConnectionEstablished để thông báo kết nối đã sẵn sàng
            callbacks.onConnectionEstablished();
            return;
        }

        // Nếu đang có kết nối với userId khác, đóng kết nối cũ trước khi tạo mới
        if (this.stompClient) {
            this.disconnect();
        }

        // Reset reconnection attempts
        this.reconnectAttempts = 0;
        this.userId = userId;
        this.callbacks = callbacks;

        // Create SockJS connection with additional configuration
        const socket = new SockJS('https://nevertheless-initial-js-occupations.trycloudflare.com/ws');

        socket.onopen = () => {
            console.log("✅ SockJS connection opened");
        };
        socket.onerror = (error) => {
            console.error("❌ SockJS error:", error);
        };
        socket.onclose = () => {
            console.warn("⚠ SockJS connection closed");
        };

        // Create STOMP client
        this.stompClient = new Stomp.Client({
            webSocketFactory: () => socket,
            connectHeaders: {},
            debug: (str) => {
                // Comment này để giảm debug logs
                // console.log('[WebSocket Debug]:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // Configure connection events
        this.stompClient.onConnect = this.handleConnect;
        this.stompClient.onStompError = this.handleStompError;
        this.stompClient.onDisconnect = this.handleDisconnect;

        // Activate connection
        this.stompClient.activate();
    }

    // Handle successful connection
    private handleConnect = (frame: any): void => {
        if (!this.stompClient || !this.userId || !this.callbacks) return;

        console.log('Connected to WebSocket');
        this.connected = true;
        this.reconnectAttempts = 0;

        // Xóa bỏ timer reconnect nếu có
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        // Notify server of connection
        this.stompClient.publish({
            destination: "/app/chat.connect",
            body: JSON.stringify(this.userId)
        });

        // Subscribe to personal messages
        this.stompClient.subscribe(`/queue/messages/${this.userId}`, (message) => {
            try {
                const receivedMessage = JSON.parse(message.body);
                this.callbacks?.onMessageReceived(receivedMessage);
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        // Subscribe to read receipts
        this.stompClient.subscribe(`/queue/read-receipts/${this.userId}`, (receipt) => {
            try {
                const readReceipt = JSON.parse(receipt.body);
                this.callbacks?.onReadReceiptReceived(readReceipt);
            } catch (error) {
                console.error('Error processing read receipt:', error);
            }
        });

        // Subscribe to user status
        this.stompClient.subscribe('/topic/status', (status) => {
            try {
                const statusData = JSON.parse(status.body);
                const userId = Math.abs(Number(statusData)).toString();
                const isOnline = Number(statusData) > 0;

                this.callbacks?.onStatusReceived({
                    userId: userId,
                    isOnline: isOnline
                });
            } catch (error) {
                console.error('Error processing status:', error);
            }
        });

        // Subscribe to WebRTC call signals if any were registered before connection
        this.callSubscriptions.forEach((callback, userId) => {
            this.subscribeToCallInternal(userId, callback);
        });

        // Call connection established callback
        this.callbacks.onConnectionEstablished();
    }

    // Handle STOMP error
    private handleStompError = (frame: any): void => {
        console.error('STOMP Error:', frame);
        this.handleDisconnect();
    }

    // Handle disconnection
    private handleDisconnect = (): void => {
        this.connected = false;

        // Notify about connection loss
        this.callbacks?.onConnectionLost();

        // Try to reconnect if not exceeded max attempts
        if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (Attempt ${this.reconnectAttempts})`);

            // Wait before trying again
            this.reconnectTimer = setTimeout(() => {
                if (this.userId && this.callbacks) {
                    this.connect(this.userId, this.callbacks);
                }
            }, 5000 * this.reconnectAttempts);
        }
    }

    // Subscribe to WebRTC call signals
    subscribeToCall(userId: string, callback: (response: SignalResponse) => void): void {
        // Store callback for reconnections
        this.callSubscriptions.set(userId, callback);

        // If connected, subscribe immediately
        if (this.connected && this.stompClient) {
            this.subscribeToCallInternal(userId, callback);
        }
    }

    // Internal method to subscribe to call signals
    private subscribeToCallInternal(userId: string, callback: (response: SignalResponse) => void): void {
        if (!this.stompClient) return;

        // Kiểm tra nếu đã đăng ký subscription cho userId này rồi thì không đăng ký lại
        this.stompClient.subscribe(`/queue/call/${userId}`, (message) => {
            try {
                const signalResponse = JSON.parse(message.body);
                callback(signalResponse);
            } catch (error) {
                console.error('Error processing call signal:', error);
            }
        });
    }

    // Send WebRTC signal
    sendSignal(request: SignalRequest): void {
        if (!this.stompClient || !this.connected) {
            console.error('Cannot send signal: WebSocket not connected');
            return;
        }

        this.stompClient.publish({
            destination: "/app/chat.signal",
            body: JSON.stringify(request)
        });
    }

    // Send message
    sendMessage(receiverId: string, content: string): void {
        if (!this.stompClient || !this.userId || !this.connected) {
            console.error('Cannot send message: WebSocket not connected');
            return;
        }

        const messageRequest: MessageRequest = {
            senderId: this.userId,
            receiverId: receiverId,
            content: content
        };

        this.stompClient.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(messageRequest)
        });
    }

    // Mark message as read
    markAsRead(senderId: string): void {
        if (!this.stompClient || !this.userId || !this.connected) {
            console.error('Cannot mark as read: WebSocket not connected');
            return;
        }

        const readRequest: ReadMessageRequest = {
            receiverId: this.userId,
            senderId: senderId
        };

        this.stompClient.publish({
            destination: "/app/chat.read",
            body: JSON.stringify(readRequest)
        });
    }

    // Disconnect
    disconnect(): void {
        if (this.stompClient && this.userId && this.connected) {
            // Notify server of disconnection
            this.stompClient.publish({
                destination: "/app/chat.disconnect",
                body: JSON.stringify(this.userId)
            });

            // Deactivate connection
            this.stompClient.deactivate();
            this.connected = false;

            // Xóa timer reconnect nếu tồn tại
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }

            console.log("WebSocket disconnected");
        }
    }

    // Check connection status
    isConnected(): boolean {
        return this.connected;
    }
}

const websocketService = new WebSocketService();
export default websocketService;