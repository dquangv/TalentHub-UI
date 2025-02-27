import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Filter, Clock, DollarSign, Briefcase, MapPin, Calendar, Send, Users, CheckCircle } from 'lucide-react';
import api from '@/api/axiosConfig'; 
import { notification } from 'antd';

const AppliedJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate()
  const fetchAppliedJobs = async () => {
    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!data?.freelancerId) {
      navigate("/login");
    }
    try {
      const response = await api.get(`/v1/jobs/ApplyJobs/${data?.freelancerId}`);
      setAppliedJobs(response.data);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs(); 
  }, []);

  

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
            </div>
          </Card>
        </FadeInWhenVisible>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : appliedJobs.length > 0 ? (
            appliedJobs?.map((job, index) => (
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
            ))
          ) : (
            <div className="text-center py-12">Không có công việc đã ứng tuyển nào.</div>
          )}
        </div>

        {/* Empty State */}
        {appliedJobs.length === 0 && !loading && (
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

export default AppliedJobs;
