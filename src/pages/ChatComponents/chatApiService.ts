import api from "@/api/axiosConfig";

export interface ConversationSummary {
    userId: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    isOnline: boolean;
    lastSeen: string | null;
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

class ChatApiService {
    private readonly API_PATH = '/chat';

    // Fetch user's recent conversations
    async getConversations(userId: string): Promise<ConversationSummary[]> {
        try {
            const result = await api.get(`${this.API_PATH}/conversations/${userId}`);

            return result.data.map((conversation: any) => ({
                ...conversation,
                timestamp: new Date(conversation.timestamp)
            }));
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    // Fetch message history between two users
    async getMessages(currentUserId: string, otherUserId: string): Promise<MessageResponse[]> {
        try {
            const result = await api.get(`${this.API_PATH}/messages/${currentUserId}/${otherUserId}`);
            return result.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    // Mark messages as read via API
    async markMessagesAsRead(readRequest: ReadMessageRequest): Promise<void> {
        try {
            await api.post(`${this.API_PATH}/messages/read`, readRequest);
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    }
}

// Singleton instance
const chatApiService = new ChatApiService();
export default chatApiService;