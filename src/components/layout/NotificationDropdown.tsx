import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import * as Stomp from '@stomp/stompjs';
import { Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { serverURL } from '@/pages/ChatComponents/websocketService';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userInfoStr = localStorage.getItem("userInfo");
  const userId = userInfoStr ? JSON.parse(userInfoStr).userId : null;
  const navigate = useNavigate();

  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();
    fetchUnreadCount();
    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [userId]);

  const connectWebSocket = () => {
    const socket = new SockJS(`${serverURL}/ws`);

    const client = new Stomp.Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('Connected to notification websocket');
      client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
        const newNotification = JSON.parse(message.body);
        setNotifications((prev) => [newNotification, ...prev]);
        fetchUnreadCount();
      });
    };

    client.onStompError = (error) => {
      console.error('Notification WebSocket STOMP error:', error);
    };

    client.activate();
    stompClientRef.current = client;
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${serverURL}/api/notifications/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${serverURL}/api/notifications/unread-count/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch unread count');
      const count = await response.json();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${serverURL}/api/notifications/read/${notificationId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      fetchUnreadCount();

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (read, notificationId, url) => {
    if (!read) {
      markAsRead(notificationId);
    }
    navigate("/"+url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="icon" className="relative">
          <Bell className="absolute h-[1.2rem] w-[1.2rem] transition-all dark:rotate-0 scale-100 dark:scale-0 text-white" />
          <Bell className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 overflow-y-auto h-[400px]">
        <div className="p-2">
          <h3 className="font-semibold mb-2">Thông báo</h3>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <Empty description="Chưa có thông báo nào" />
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 ${!notification.read ? 'bg-primary/5 cursor-pointer' : ''}`}
                  onClick={() => handleNotificationClick(notification.read, notification.id, notification.url)}
                >
                  <p className="text-sm font-medium">{notification.title || notification.message}</p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time || new Date(notification.createdAt).toLocaleTimeString()}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;