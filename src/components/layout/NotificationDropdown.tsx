import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Empty } from 'antd';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = JSON.parse(localStorage.getItem("userInfo") || "{}").userId;
  const BASE_URL = 'http://localhost:8080';
  let stompClient = null;

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    connectWebSocket();
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const socket = new SockJS(`${BASE_URL}/ws`);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log('user id ', userId)
      stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
        const newNotification = JSON.parse(message.body);
        setNotifications((prev) => [newNotification, ...prev]);
        fetchUnreadCount();
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
    });
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/unread-count/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch unread count');
      const count = await response.json();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/read/${notificationId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
      <DropdownMenuContent align="end" className="w-80">
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
                  onClick={() => !notification.read && markAsRead(notification.id)}
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