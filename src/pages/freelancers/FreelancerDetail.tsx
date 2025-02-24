import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import {
  MapPin,
  Star,
  Briefcase,
  GraduationCap,
  MessageCircle,
} from 'lucide-react';

const FreelancerDetail = () => {
  const { id } = useParams();
  console.log('id ', id)
  // In a real app, fetch freelancer details using the id
  const freelancer = {
    name: 'Nguyễn Văn A',
    title: 'Senior Full Stack Developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'TP. Hồ Chí Minh',
    rating: 4.9,
    completedProjects: 45,
    hourlyRate: '350.000đ',
    overview:
      'Full Stack Developer với hơn 7 năm kinh nghiệm phát triển ứng dụng web. Chuyên sâu về React, Node.js và các công nghệ hiện đại...',
    skills: [
      'React',
      'Node.js',
      'TypeScript',
      'MongoDB',
      'AWS',
      'Docker',
      'Next.js',
    ],
    education: [
      {
        school: 'Đại học Bách Khoa Hà Nội',
        degree: 'Kỹ sư Công nghệ Thông tin',
        year: '2015-2019',
      },
    ],
    experience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Developer',
        period: '2019-2023',
        description:
          'Phát triển và duy trì các ứng dụng web quy mô lớn sử dụng React và Node.js...',
      },
      {
        company: 'Digital Innovation Co.',
        position: 'Full Stack Developer',
        period: '2017-2019',
        description:
          'Xây dựng các giải pháp web cho khách hàng doanh nghiệp...',
      },
    ],
    portfolio: [
      {
        title: 'E-commerce Platform',
        description: 'Nền tảng thương mại điện tử với React và Node.js',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      },
      {
        title: 'Task Management App',
        description: 'Ứng dụng quản lý công việc với React Native',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      },

    ],
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <FadeInWhenVisible>
            <Card className="p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{freelancer.name}</h1>
                      <p className="text-xl text-muted-foreground mb-4">
                        {freelancer.title}
                      </p>
                      <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {freelancer.location}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                          {freelancer.rating} (45 đánh giá)
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {freelancer.completedProjects} dự án hoàn thành
                        </div>
                      </div>

                    </div>
                    <div className="flex flex-col gap-2">
                      <Button>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Liên hệ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>

          {/* Main Content */}
          <FadeInWhenVisible delay={0.2}>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
                <TabsTrigger value="education">Học vấn</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="p-8">
                  <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>
                  <p className="text-muted-foreground mb-6">{freelancer.overview}</p>

                  <h3 className="font-semibold mb-3">Kỹ năng:</h3>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {freelancer.portfolio.map((project, index) => (
                    <Card key={index} className="overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <Card className="p-8">
                  <div className="space-y-8">
                    {freelancer.experience.map((exp, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Briefcase className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-muted-foreground mb-2">
                            {exp.company} • {exp.period}
                          </p>
                          <p className="text-muted-foreground">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card className="p-8">
                  <div className="space-y-8">
                    {freelancer.education.map((edu, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <GraduationCap className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{edu.school}</h3>
                          <p className="text-muted-foreground mb-2">
                            {edu.degree} • {edu.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetail;