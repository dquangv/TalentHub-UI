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
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Calendar,
  Briefcase,
} from 'lucide-react';

const PostedJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Công việc đã đăng</h1>
              <p className="text-muted-foreground">
                Quản lý và theo dõi các tin tuyển dụng của bạn
              </p>
            </div>
            <Button asChild>
              <Link to="/employer/post-job">
                <Plus className="w-4 h-4 mr-2" />
                Đăng tin mới
              </Link>
            </Button>
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
                  placeholder="Tìm kiếm công việc..."
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
                  <SelectItem value="active">Đang tuyển</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
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

        {/* Jobs Table */}
        <FadeInWhenVisible delay={0.3}>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Công việc</TableHead>
                  <TableHead>Ứng viên</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead>Hạn nộp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{job.applicants} ứng viên</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {job.postedDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        {job.deadline}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === 'active'
                            ? 'default'
                            : job.status === 'closed'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {getStatusText(job.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeInWhenVisible>

        {/* Empty State */}
        {jobs.length === 0 && (
          <FadeInWhenVisible>
            <Card className="p-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Chưa có công việc nào</h3>
              <p className="text-muted-foreground mb-6">
                Bạn chưa đăng tin tuyển dụng nào. Hãy bắt đầu đăng tin để tìm kiếm ứng viên phù hợp.
              </p>
              <Button asChild>
                <Link to="/employer/post-job">
                  <Plus className="w-4 h-4 mr-2" />
                  Đăng tin mới
                </Link>
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
    label: 'Tổng tin đăng',
    value: '24',
    icon: <Briefcase className="w-8 h-8 text-primary" />,
  },
  {
    label: 'Đang tuyển',
    value: '12',
    icon: <Clock className="w-8 h-8 text-green-500" />,
  },
  {
    label: 'Tổng ứng viên',
    value: '156',
    icon: <Users className="w-8 h-8 text-blue-500" />,
  },
  {
    label: 'Đã tuyển',
    value: '32',
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
  },
];

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    type: 'Toàn thời gian',
    applicants: 45,
    postedDate: '15/03/2024',
    deadline: '15/04/2024',
    status: 'active',
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    type: 'Dự án',
    applicants: 28,
    postedDate: '14/03/2024',
    deadline: '14/04/2024',
    status: 'active',
  },
  {
    id: 3,
    title: 'Backend Developer',
    type: 'Toàn thời gian',
    applicants: 36,
    postedDate: '13/03/2024',
    deadline: '13/04/2024',
    status: 'closed',
  },
  {
    id: 4,
    title: 'Product Manager',
    type: 'Toàn thời gian',
    applicants: 0,
    postedDate: '12/03/2024',
    deadline: '12/04/2024',
    status: 'draft',
  },
];

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Đang tuyển';
    case 'closed':
      return 'Đã đóng';
    case 'draft':
      return 'Bản nháp';
    default:
      return status;
  }
};

export default PostedJobs;