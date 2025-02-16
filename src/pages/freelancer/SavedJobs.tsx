import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Search, Briefcase, Clock, DollarSign, MapPin, Bookmark, Calendar } from 'lucide-react';

const SavedJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Công việc đã lưu</h1>
            <p className="text-muted-foreground">
              Quản lý danh sách công việc bạn quan tâm và muốn ứng tuyển sau
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Search and Filter */}
        <FadeInWhenVisible delay={0.1}>
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
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </Card>
        </FadeInWhenVisible>

        {/* Saved Jobs List */}
        <div className="space-y-6">
          {savedJobs.map((job, index) => (
            <FadeInWhenVisible key={job.id} delay={index * 0.1}>
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Link to={`/jobs/${job.id}`} className="hover:underline">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Badge variant={job.type === 'Toàn thời gian' ? 'default' : 'secondary'}>
                          {job.type}
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-primary">
                          <Bookmark className="w-5 h-5 fill-current" />
                        </Button>
                      </div>
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
                        Lưu: {job.savedDate}
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
                      <Button variant="outline">Ứng tuyển ngay</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Empty State */}
        {savedJobs.length === 0 && (
          <FadeInWhenVisible>
            <Card className="p-12 text-center">
              <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Chưa có công việc đã lưu</h3>
              <p className="text-muted-foreground mb-6">
                Bạn chưa lưu công việc nào. Hãy khám phá các cơ hội việc làm và lưu lại những công việc bạn quan tâm.
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

const savedJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'TP. Hồ Chí Minh',
    type: 'Toàn thời gian',
    duration: '6 tháng',
    budget: '80-100 triệu',
    savedDate: '15/03/2024',
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
    savedDate: '14/03/2024',
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
    savedDate: '13/03/2024',
    description: 'Cần Backend Developer có kinh nghiệm phát triển API và microservices cho hệ thống thanh toán...',
    skills: ['Node.js', 'MongoDB', 'Docker', 'Microservices'],
  },
];

export default SavedJobs;