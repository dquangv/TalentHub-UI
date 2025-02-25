import { Outlet } from 'react-router-dom';

const ChatLayout = () => {
    return (
        <div className="chat-container h-screen w-full">
            <Outlet />
        </div>
    );
};

export default ChatLayout;