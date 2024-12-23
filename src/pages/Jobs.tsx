import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Search, Filter, Clock, DollarSign, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Search Section */}
        <div className="mb-12">
          <FadeInWhenVisible>
            <h1 className="text-3xl font-bold text-center mb-8">
              Tìm kiếm việc làm Freelance
            </h1>
          </FadeInWhenVisible>
          <div className="max-w-2xl mx-auto">
            <FadeInWhenVisible delay={0.2}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Tìm kiếm việc làm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs.map((job, index) => (
            <FadeInWhenVisible key={job.id} delay={index * 0.1}>
              <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <Badge variant={job.type === 'Toàn thời gian' ? 'default' : 'secondary'}>
                        {job.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {job.budget}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button><Link to={`/jobs/${job.id}`}>Xem hồ sơ</Link></Button>
                    <Button variant="outline">Lưu việc làm</Button>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem thêm việc làm
          </Button>
        </div>
      </div>
    </div>
  );
};

const jobs = [
  {
    id: 1,
    title: 'Phát triển website thương mại điện tử',
    company: 'Tech Solutions Inc.',
    type: 'Dự án',
    duration: '3 tháng',
    budget: '50-70 triệu',
    description: 'Cần freelancer có kinh nghiệm phát triển website thương mại điện tử sử dụng React và Node.js...',
    skills: ['React', 'Node.js', 'MongoDB', 'Redux'],
  },
  {
    id: 2,
    title: 'Thiết kế UI/UX cho ứng dụng di động',
    company: 'Creative Studio',
    type: 'Bán thời gian',
    duration: '2 tháng',
    budget: '30-40 triệu',
    description: 'Tìm kiếm designer có kinh nghiệm thiết kế UI/UX cho ứng dụng di động trong lĩnh vực giáo dục...',
    skills: ['Figma', 'UI Design', 'Mobile Design', 'Prototyping'],
  },
  {
    id: 3,
    title: 'Chiến dịch Digital Marketing',
    company: 'Growth Marketing',
    type: 'Toàn thời gian',
    duration: '6 tháng',
    budget: '80-100 triệu',
    description: 'Cần chuyên gia Digital Marketing có kinh nghiệm lên kế hoạch và thực hiện chiến dịch marketing...',
    skills: ['Facebook Ads', 'Google Ads', 'SEO', 'Content Marketing'],
  },
  {
    id: 4,
    title: 'Phát triển ứng dụng di động React Native',
    company: 'Mobile App Inc.',
    type: 'Dự án',
    duration: '4 tháng',
    budget: '60-80 triệu',
    description: 'Tìm kiếm developer có kinh nghiệm phát triển ứng dụng di động đa nền tảng bằng React Native...',
    skills: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
  },
  {
    id: 5,
    title: 'Sản xuất video quảng cáo',
    company: 'Media Production',
    type: 'Dự án',
    duration: '1 tháng',
    budget: '20-30 triệu',
    description: 'Cần freelancer có kinh nghiệm sản xuất video quảng cáo cho thương hiệu thời trang...',
    skills: ['After Effects', 'Premiere Pro', 'Motion Graphics', '3D Animation'],
  },
];

export default Jobs;