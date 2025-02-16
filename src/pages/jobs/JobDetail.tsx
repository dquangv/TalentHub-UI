import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import {
  Clock,
  DollarSign,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
} from 'lucide-react';

const JobDetail = () => {
  // const { id } = useParams();
  // In a real app, fetch job details using the id
  const job = {
    title: 'Senior Full Stack Developer',
    company: 'Tech Solutions Inc.',
    location: 'TP. Hồ Chí Minh',
    type: 'Dự án',
    duration: '6 tháng',
    budget: '80-100 triệu',
    experience: '5 năm',
    level: 'Senior',
    deadline: '30/04/2024',
    description:
      'Chúng tôi đang tìm kiếm một Full Stack Developer senior có kinh nghiệm để tham gia vào dự án phát triển nền tảng thương mại điện tử quy mô lớn...',
    requirements: [
      'Tối thiểu 5 năm kinh nghiệm phát triển web',
      'Thành thạo React, Node.js, và TypeScript',
      'Kinh nghiệm với microservices và container',
      'Kỹ năng tối ưu hiệu suất và bảo mật',
    ],
    benefits: [
      'Mức lương cạnh tranh',
      'Lịch làm việc linh hoạt',
      'Cơ hội học hỏi và phát triển',
      'Môi trường làm việc chuyên nghiệp',
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'MongoDB'],
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <FadeInWhenVisible>
            <Card className="p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="outline">{job.level}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="lg">Ứng tuyển ngay</Button>
                  <Button variant="outline">Lưu việc làm</Button>
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FadeInWhenVisible delay={0.1}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngân sách</p>
                    <p className="font-semibold">{job.budget}</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-semibold">{job.duration}</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kinh nghiệm</p>
                    <p className="font-semibold">{job.experience}</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.4}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hạn nộp</p>
                    <p className="font-semibold">{job.deadline}</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          </div>

          {/* Description Section */}
          <FadeInWhenVisible delay={0.5}>
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Mô tả công việc</h2>
              <p className="text-muted-foreground mb-6">{job.description}</p>

              <h3 className="font-semibold mb-3">Yêu cầu:</h3>
              <ul className="space-y-2 mb-6">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold mb-3">Quyền lợi:</h3>
              <ul className="space-y-2 mb-6">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold mb-3">Kỹ năng yêu cầu:</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </FadeInWhenVisible>

          {/* Apply Button */}
          <FadeInWhenVisible delay={0.6}>
            <div className="text-center">
              <Button size="lg" className="px-8">
                Ứng tuyển ngay
              </Button>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;