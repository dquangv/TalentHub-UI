import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Video,
  MapPin,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  User,
} from 'lucide-react';

const AppointmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Lịch phỏng vấn</h1>
            <p className="text-muted-foreground">
              Quản lý các cuộc phỏng vấn với nhà tuyển dụng
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Stats */}
        <FadeInWhenVisible delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  {stat.icon}
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </FadeInWhenVisible>

        {/* Filters */}
        <FadeInWhenVisible delay={0.2}>
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm cuộc hẹn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
            </div>
          </Card>
        </FadeInWhenVisible>

        {/* Appointments Table */}
        <FadeInWhenVisible delay={0.3}>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Công việc</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Hình thức</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  {/* <TableHead>Trạng thái</TableHead> */}
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.jobType}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          {appointment.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {appointment.type === 'online' ? (
                          <Video className="w-4 h-4 text-blue-500" />
                        ) : (
                          <MapPin className="w-4 h-4 text-green-500" />
                        )}
                        {appointment.type === 'online' ? 'Trực tuyến' : 'Trực tiếp'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {appointment.clientName}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Badge
                        variant={
                          appointment.status === 'upcoming'
                            ? 'default'
                            : appointment.status === 'completed'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {getStatusText(appointment.status)}
                      </Badge>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {/* {appointment.status === 'upcoming' && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )} */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeInWhenVisible>

        {/* Empty State */}
        {appointments.length === 0 && (
          <FadeInWhenVisible>
            <Card className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Chưa có cuộc hẹn nào</h3>
              <p className="text-muted-foreground mb-6">
                Bạn chưa có cuộc hẹn phỏng vấn nào. Hãy tiếp tục ứng tuyển vào các công việc phù hợp.
              </p>
              <Button asChild>
                <Link to="/jobs">Tìm việc ngay</Link>
              </Button>
            </Card>
          </FadeInWhenVisible>
        )}
      </div>
    </div>
  );
};

const stats = [
  {
    label: 'Tổng cuộc hẹn',
    value: '12',
    icon: <Calendar className="w-8 h-8 text-primary" />,
  },
  {
    label: 'Sắp diễn ra',
    value: '5',
    icon: <Clock className="w-8 h-8 text-blue-500" />,
  },
  {
    label: 'Đã hoàn thành',
    value: '6',
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
  },
  {
    label: 'Đã hủy',
    value: '1',
    icon: <XCircle className="w-8 h-8 text-red-500" />,
  },
];

const appointments = [
  {
    id: 1,
    jobTitle: 'Senior Frontend Developer',
    jobType: 'Toàn thời gian',
    company: 'Tech Solutions Inc.',
    date: '20/03/2024',
    time: '10:00 - 11:00',
    type: 'online',
    status: 'upcoming',
    clientName: 'Nguyen Van A',

  },
  {
    id: 2,
    jobTitle: 'UI/UX Designer',
    jobType: 'Dự án',
    company: 'Creative Studio',
    date: '21/03/2024',
    time: '14:00 - 15:00',
    type: 'offline',
    status: 'upcoming',
    clientName: 'Nguyen Van C',

  },
  {
    id: 3,
    jobTitle: 'Backend Developer',
    jobType: 'Toàn thời gian',
    company: 'Tech Corp',
    date: '15/03/2024',
    time: '09:00 - 10:00',
    type: 'online',
    status: 'completed',
    clientName: 'Nguyen Van E',

  },
  {
    id: 4,
    jobTitle: 'Mobile Developer',
    jobType: 'Dự án',
    company: 'App Solutions',
    date: '14/03/2024',
    time: '15:00 - 16:00',
    type: 'offline',
    status: 'cancelled',
    clientName: 'Nguyen Van D',

  },
];

const getStatusText = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'Sắp diễn ra';
    case 'completed':
      return 'Đã hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

export default AppointmentList;