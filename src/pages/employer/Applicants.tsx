import { useState } from 'react';
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
import { Search, Filter, Star, Download, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

const Applicants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Danh sách ứng viên</h1>
            <p className="text-muted-foreground">
              Quản lý và đánh giá các ứng viên đã ứng tuyển vào công việc của bạn
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
                  placeholder="Tìm kiếm ứng viên..."
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
                  <SelectItem value="pending">Đang chờ</SelectItem>
                  <SelectItem value="interviewing">Phỏng vấn</SelectItem>
                  <SelectItem value="accepted">Đã chấp nhận</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </Card>
        </FadeInWhenVisible>

        {/* Applicants Table */}
        <FadeInWhenVisible delay={0.3}>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ứng viên</TableHead>
                  <TableHead>Vị trí ứng tuyển</TableHead>
                  <TableHead>Ngày ứng tuyển</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={applicant.avatar}
                          alt={applicant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{applicant.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {applicant.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{applicant.position}</p>
                      <p className="text-sm text-muted-foreground">
                        {applicant.department}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {applicant.appliedDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          applicant.status === 'accepted'
                            ? 'success'
                            : applicant.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {getStatusText(applicant.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{applicant.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-600">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeInWhenVisible>
      </div>
    </div>
  );
};

const stats = [
  {
    label: 'Tổng ứng viên',
    value: '245',
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    label: 'Chờ duyệt',
    value: '45',
    icon: <Clock className="w-8 h-8 text-yellow-500" />,
  },
  {
    label: 'Đã chấp nhận',
    value: '82',
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
  },
  {
    label: 'Từ chối',
    value: '18',
    icon: <XCircle className="w-8 h-8 text-red-500" />,
  },
];

const applicants = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    position: 'Senior Frontend Developer',
    department: 'Engineering',
    appliedDate: '15/03/2024',
    status: 'pending',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    position: 'UI/UX Designer',
    department: 'Design',
    appliedDate: '14/03/2024',
    status: 'interviewing',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    position: 'Backend Developer',
    department: 'Engineering',
    appliedDate: '13/03/2024',
    status: 'accepted',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    position: 'Product Manager',
    department: 'Product',
    appliedDate: '12/03/2024',
    status: 'rejected',
    rating: 3.5,
  },
];

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Đang chờ';
    case 'interviewing':
      return 'Phỏng vấn';
    case 'accepted':
      return 'Đã chấp nhận';
    case 'rejected':
      return 'Từ chối';
    default:
      return status;
  }
};

export default Applicants;