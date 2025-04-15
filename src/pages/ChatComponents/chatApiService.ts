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

export interface FreelancerJob {
    id: number;
    title: string;
    status: string;
}

export interface FreelancerForClient {
    userId: number;
    fullName: string;
    avatar: string;
    rating: number;
    jobs: FreelancerJob[];
}

class ChatApiService {
    private readonly API_PATH = '/chat';
    private readonly API_FREELANCER_PATH = '/v1/freelancers';

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

    async getMessages(currentUserId: string, otherUserId: string): Promise<MessageResponse[]> {
        try {
            const result = await api.get(`${this.API_PATH}/messages/${currentUserId}/${otherUserId}`);
            return result.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    async markMessagesAsRead(readRequest: ReadMessageRequest): Promise<void> {
        try {
            await api.post(`${this.API_PATH}/messages/read`, readRequest);
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    }

    async getFreelancersForClient(clientId: string | number): Promise<FreelancerForClient[]> {
        try {
            const result = await api.get(`${this.API_FREELANCER_PATH}/client/${clientId}`);
            console.log('Freelancers for client:', result.data);
            if (result.status === 200) {
                return result.data || [];
            } else {
                throw new Error('Failed to fetch freelancers, status not 200');
            }
        } catch (error) {
            console.error('Error fetching freelancers for client:', error);
            throw error;
        }
    }
}

const chatApiService = new ChatApiService();
export default chatApiService;