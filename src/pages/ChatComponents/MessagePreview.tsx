import { useState } from 'react';

const conversations = [
    {
        id: '1',
        name: 'Nguyễn Văn A',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastMessage: 'Hey, how are you doing?',
        timestamp: '10:15',
        unread: 2,
        isOnline: true,
    },
    {
        id: '2',
        name: 'Trần Thị B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastMessage: 'Can we meet tomorrow?',
        timestamp: '09:30',
        unread: 0,
        isOnline: false,
    },
    {
        id: '3',
        name: 'Lê Văn C',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastMessage: 'Thanks for your help!',
        timestamp: 'Hôm qua',
        unread: 0,
        isOnline: true,
    },
];

// Sample messages
const messages = [
    {
        id: '1',
        content: 'Xin chào, bạn khỏe không?',
        timestamp: '10:00',
        isMe: false,
        isRead: true,
        sender: 'Nguyễn Văn A',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: '2',
        content: 'Tôi khỏe, cảm ơn bạn! Còn bạn thì sao?',
        timestamp: '10:02',
        isMe: true,
        isRead: true,
    },
    {
        id: '3',
        content: 'Tôi cũng tốt. Tôi muốn trao đổi về dự án mới.',
        timestamp: '10:05',
        isMe: false,
        isRead: true,
        sender: 'Nguyễn Văn A',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: '4',
        content: 'Được chứ, bạn có ý tưởng gì?',
        timestamp: '10:07',
        isMe: true,
        isRead: true,
    },
    {
        id: '5',
        content: 'Tôi đang nghĩ về một ứng dụng kết nối freelancer và doanh nghiệp.',
        timestamp: '10:10',
        isMe: false,
        isRead: true,
        sender: 'Nguyễn Văn A',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: '6',
        content: 'Nghe có vẻ thú vị! Chúng ta có thể gặp nhau để thảo luận chi tiết hơn không?',
        timestamp: '10:12',
        isMe: true,
        isRead: false,
    },
];

// Icons for the sidebar
const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const Avatar = ({ src, alt, online }: any) => (
    <div className="relative">
        <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
        {online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
    </div>
);

const MessengerPreview = () => {
    const [activeConversation, setActiveConversation] = useState(conversations[0]);
    const [inputValue, setInputValue] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            // In a real app, this would send the message
            setInputValue('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 rounded-lg shadow-xl border border-gray-200">
            <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-8">
                    <span className="text-white font-bold">T</span>
                </div>
                <div className="flex flex-col items-center space-y-6 mt-4">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                        <MessageIcon />
                    </div>
                    <div className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                        <UserIcon />
                    </div>
                    <div className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                        <PhoneIcon />
                    </div>
                </div>
            </div>

            <div className="w-72 bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold mb-3">Tin nhắn</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            className="w-full py-2 pl-3 pr-10 rounded-lg bg-gray-100 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100%-80px)]">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`p-3 flex items-center cursor-pointer hover:bg-gray-50 ${activeConversation.id === conversation.id ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => setActiveConversation(conversation)}
                        >
                            <Avatar
                                src={conversation.avatar}
                                alt={conversation.name}
                                online={conversation.isOnline}
                            />
                            <div className="ml-3 flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold truncate">{conversation.name}</h3>
                                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                                    {conversation.unread > 0 && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                                            {conversation.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center">
                        <Avatar
                            src={activeConversation.avatar}
                            alt={activeConversation.name}
                            online={activeConversation.isOnline}
                        />
                        <div className="ml-3">
                            <h2 className="font-semibold">{activeConversation.name}</h2>
                            <p className="text-xs text-gray-500">
                                {activeConversation.isOnline ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </div>
                    <button
                        className={`p-2 rounded-full ${showInfo ? 'bg-blue-50 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        <InfoIcon />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex mb-4 ${message.isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            {!message.isMe && (
                                <div className="mr-2">
                                    <img
                                        src={message.avatar}
                                        alt={message.sender}
                                        className="w-8 h-8 rounded-full"
                                    />
                                </div>
                            )}
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${message.isMe
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <p>{message.content}</p>
                                <div
                                    className={`text-xs mt-1 ${message.isMe ? 'text-blue-100' : 'text-gray-500'
                                        } text-right`}
                                >
                                    {message.timestamp}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end space-x-2">
                        <div className="flex-1 rounded-lg border border-gray-300 bg-white p-3 min-h-[60px] focus-within:border-blue-500">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="w-full resize-none outline-none text-gray-800"
                                rows={1}
                            />
                        </div>
                        <button
                            className={`p-3 rounded-full ${inputValue.trim()
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                                }`}
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                        >
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* Info panel (conditionally rendered) */}
            {showInfo && (
                <div className="w-72 bg-white border-l border-gray-200 p-4">
                    <div className="text-center mb-6">
                        <img
                            src={activeConversation.avatar}
                            alt={activeConversation.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4"
                        />
                        <h3 className="text-xl font-semibold">{activeConversation.name}</h3>
                        <p className="text-sm text-gray-500">
                            {activeConversation.isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>

                    <div className="flex justify-around mb-6">
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-2">Tùy chọn</h4>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Thông báo</span>
                            <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                                <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Ẩn cuộc trò chuyện</span>
                            <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button className="w-full py-2 text-red-500 hover:bg-red-50 rounded-lg">
                            Chặn người dùng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessengerPreview;
