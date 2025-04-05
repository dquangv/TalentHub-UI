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
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Search, Filter, Clock, DollarSign, Briefcase, MapPin, Calendar, Send } from 'lucide-react';

const AppliedJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'interviewing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

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

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Công việc đã ứng tuyển</h1>
            <p className="text-muted-foreground">
              Theo dõi trạng thái ứng tuyển và quản lý các công việc bạn đã nộp hồ sơ
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

        {/* Search and Filter */}
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
                  <SelectItem value="applied">Đã ứng tuyển</SelectItem>
                  <SelectItem value="rejected">Bị từ chối</SelectItem>
                  <SelectItem value="approved">Được chấp thuận</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
              {/* <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button> */}
            </div>
          </Card>
        </FadeInWhenVisible>

        {/* Applied Jobs List */}
        <div className="space-y-6">
          {appliedJobs.map((job, index) => (
            <FadeInWhenVisible key={job.id} delay={index * 0.1}>
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Link to={`/jobs/${job.id}`} className="hover:underline">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                      </Link>
                      <Badge className={getStatusColor(job.status)}>
                        {getStatusText(job.status)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {job.budget}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Ứng tuyển: {job.appliedDate}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Button asChild>
                        <Link to={`/jobs/${job.id}`}>Xem chi tiết</Link>
                      </Button>
                      {job.status === 'interviewing' && (
                        <Button variant="outline">Xem lịch phỏng vấn</Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Empty State */}
        {appliedJobs.length === 0 && (
          <FadeInWhenVisible>
            <Card className="p-12 text-center">
              <Send className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Chưa có công việc đã ứng tuyển</h3>
              <p className="text-muted-foreground mb-6">
                Bạn chưa ứng tuyển vào công việc nào. Hãy bắt đầu tìm kiếm và ứng tuyển vào những công việc phù hợp với bạn.
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
    label: 'Tổng số đã ứng tuyển',
    value: '12',
    icon: <Send className="w-8 h-8 text-primary" />,
  },
  {
    label: 'Đang chờ phản hồi',
    value: '5',
    icon: <Clock className="w-8 h-8 text-yellow-500" />,
  },
  {
    label: 'Đang phỏng vấn',
    value: '3',
    icon: <Users className="w-8 h-8 text-blue-500" />,
  },
  {
    label: 'Đã chấp nhận',
    value: '2',
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
  },
];

const appliedJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'TP. Hồ Chí Minh',
    type: 'Toàn thời gian',
    duration: '6 tháng',
    budget: '80-100 triệu',
    status: 'interviewing',
    appliedDate: '15/03/2024',
    description: 'Chúng tôi đang tìm kiếm một Frontend Developer senior có kinh nghiệm để tham gia vào dự án phát triển nền tảng thương mại điện tử...',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Hà Nội',
    type: 'Dự án',
    duration: '3 tháng',
    budget: '40-50 triệu',
    status: 'pending',
    appliedDate: '14/03/2024',
    description: 'Tìm kiếm UI/UX Designer có kinh nghiệm thiết kế giao diện người dùng cho ứng dụng mobile trong lĩnh vực fintech...',
    skills: ['Figma', 'UI Design', 'Mobile Design', 'Prototyping'],
  },
  {
    id: 3,
    title: 'Backend Developer',
    company: 'Fintech Solutions',
    location: 'Đà Nẵng',
    type: 'Dự án',
    duration: '4 tháng',
    budget: '60-70 triệu',
    status: 'accepted',
    appliedDate: '13/03/2024',
    description: 'Cần Backend Developer có kinh nghiệm phát triển API và microservices cho hệ thống thanh toán...',
    skills: ['Node.js', 'MongoDB', 'Docker', 'Microservices'],
  },
];

export default AppliedJobs;