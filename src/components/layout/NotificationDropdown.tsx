import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const notifications = [
  {
    id: 1,
    title: 'Có người ứng tuyển vào công việc của bạn',
    time: '5 phút trước',
    read: false,
  },
  {
    id: 2,
    title: 'Dự án của bạn đã được duyệt',
    time: '1 giờ trước',
    read: false,
  },
  {
    id: 3,
    title: 'Bạn có tin nhắn mới',
    time: '2 giờ trước',
    read: true,
  },
  {
    id: 4,
    title: 'Cập nhật trạng thái thanh toán',
    time: '1 ngày trước',
    read: true,
  },
];

const NotificationDropdown = () => {
  const unreadCount = notifications.filter((n) => !n.read).length;

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
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 ${!notification.read ? 'bg-primary/5' : ''
                  }`}
              >
                <p className="text-sm font-medium">{notification.title}</p>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;