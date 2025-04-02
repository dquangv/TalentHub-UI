import api from "@/api/axiosConfig";

export interface ChatIntent {
    id: number;
    intentName: string;
    description: string;
    trainingPhrases?: ChatTrainingPhrase[];
    responses?: ChatResponse[];
}

export interface ChatResponse {
    id: number;
    responseText: string;
    requiresDbQuery: boolean;
    queryTemplate?: string;
    displayOrder: number;
}

export interface ChatTrainingPhrase {
    id: number;
    phraseText: string;
    isProcessed: boolean;
    frequency: number;
    createdAt: string;
}

export interface UnprocessedQuery {
    id: number;
    text: string;
    frequency: number;
    createdAt: string;
    userId?: number;
    userEmail?: string;
    sessionId?: string;
    timestamp?: string;
}

export interface ChatbotStats {
    totalConversations: number;
    totalMessages: number;
    averageSatisfaction: number;
    unrecognizedQueries: number;
    topIntents: { intent: string; count: number }[];
}

export interface ChatBotSettings {
    confidenceThreshold: number;
    maxResponses: number;
    fallbackStrategy: string;
    enableLearning: boolean;
}

export interface ChatResponseDTO {
    message: string;
    detectedIntent: string | null;
    detectedIntentName: string | null;
    confidence: number;
    timestamp: string;
}

export interface IntentDTO {
    intentName: string;
    description: string;
    trainingPhrases: string[];
    responses: string[];
    requiresDbQuery: boolean;
    dbQuery: string;
}

export interface ResponseDTO {
    responseText: string;
    requiresDbQuery: boolean;
    queryTemplate: string;
    displayOrder?: number;
}

export interface ProcessQueryDTO {
    queryId: number;
    intentName: string;
    responseText: string;
    requiresDbQuery: boolean;
    queryTemplate: string;
}

export interface SuggestedIntent {
    id: number;
    name: string;
    description: string;
    friendlyDescription: string;
}

export interface SuggestionsData {
    intents: SuggestedIntent[];
    questionsByIntent: Record<string, string[]>;
}

const chatbotService = {
    getAllIntents: async (): Promise<ChatIntent[]> => {
        const response = await api.get('/chatbot/intents');
        return response.data || [];
    },

    getIntentDetails: async (intentId: number): Promise<ChatIntent> => {
        const response = await api.get(`/chatbot/intent/${intentId}`);
        return response.data;
    },

    addIntent: async (intentDTO: IntentDTO): Promise<ChatIntent> => {
        const response = await api.post('/chatbot/intent', intentDTO);
        return response.data;
    },

    updateIntent: async (intentId: number, intentDTO: Partial<IntentDTO>): Promise<ChatIntent> => {
        const response = await api.put(`/chatbot/intent/${intentId}`, intentDTO);
        return response.data;
    },

    deleteIntent: async (intentId: number): Promise<void> => {
        await api.delete(`/chatbot/intent/${intentId}`);
    },

    getResponses: async (intentId: number): Promise<ChatResponse[]> => {
        const response = await api.get(`/chatbot/intent/${intentId}/responses`);
        return response.data || [];
    },

    addResponse: async (intentId: number, responseDTO: ResponseDTO): Promise<ChatResponse> => {
        const response = await api.post(`/chatbot/intent/${intentId}/response`, responseDTO);
        return response.data;
    },

    updateResponse: async (responseId: number, responseDTO: ResponseDTO): Promise<ChatResponse> => {
        const response = await api.put(`/chatbot/response/${responseId}`, responseDTO);
        return response.data;
    },

    deleteResponse: async (responseId: number): Promise<void> => {
        await api.delete(`/chatbot/response/${responseId}`);
    },

    processMessage: async (sessionId: string, message: string, userId?: number): Promise<ChatResponseDTO> => {
        const response = await api.post('/chatbot/message', {
            sessionId,
            message,
            userId
        });
        return response.data;
    },

    getUnprocessedQueries: async (limit: number = 10): Promise<UnprocessedQuery[]> => {
        const response = await api.get('/chatbot/training/unprocessed', {
            params: { limit }
        });
        return response.data || [];
    },

    processUnrecognizedQuery: async (queryDTO: ProcessQueryDTO): Promise<string> => {
        const response = await api.post('/chatbot/training/process-query', queryDTO);
        return response.data;
    },

    testQuery: async (query: string): Promise<any[]> => {
        const response = await api.post('/chatbot/test-query', query);
        return response.data || [];
    },

    getStatistics: async (): Promise<ChatbotStats> => {
        const response = await api.get('/chatbot/statistics');
        return response.data;
    },

    getSettings: async (): Promise<ChatBotSettings> => {
        const response = await api.get('/chatbot/settings');
        return response.data;
    },

    updateSettings: async (settings: ChatBotSettings): Promise<void> => {
        await api.post('/chatbot/settings', settings);
    },


    getSuggestedIntents: async (): Promise<SuggestedIntent[]> => {
        const response = await api.get('/chatbot/suggestions/intents');
        return response.data || [];
    },

    getSuggestedQuestionsForIntent: async (intentId: number): Promise<string[]> => {
        const response = await api.get(`/chatbot/suggestions/questions/${intentId}`);
        return response.data || [];
    },

    getAllSuggestions: async (): Promise<SuggestionsData> => {
        const response = await api.get('/chatbot/suggestions');
        return response.data || { intents: [], questionsByIntent: {} };
    },
};

export default chatbotService;