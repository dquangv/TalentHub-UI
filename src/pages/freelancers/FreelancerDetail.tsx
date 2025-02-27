import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  Calendar,
  } from 'lucide-react';
import api from '@/api/axiosConfig';

const FreelancerDetail = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerDetail = async () => {
      try {
        const response = await api.get(`/v1/freelancers/detail?id=${id}`);
        setFreelancer(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching freelancer detail: ", error);
        setLoading(false);
      }
    };

    fetchFreelancerDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible>
            <Card className="p-8 mb-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={freelancer?.avatar || "/placeholder-avatar.png"}
                      alt={freelancer?.name}
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/10"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2 text-gray-900">{freelancer?.name}</h1>
                      <p className="text-xl text-primary mb-4">
                        {freelancer?.title}
                      </p>
                      <div className="flex flex-wrap gap-6 text-gray-600 mb-4">
                        <div className="flex items-center group">
                          <MapPin className="w-5 h-5 mr-2 text-primary" />
                          <span className="group-hover:text-primary transition-colors">
                            {freelancer?.location}
                          </span>
                        </div>
                        <div className="flex items-center group">
                          <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
                          <span className="group-hover:text-primary transition-colors">
                            {freelancer?.rating.toFixed(1)} ({freelancer?.completeProject} dự án)
                          </span>
                        </div>
                        <div className="flex items-center group">
                          <Briefcase className="w-5 h-5 mr-2 text-primary" />
                          <span className="group-hover:text-primary transition-colors">
                            ${freelancer?.hourlyRate}/giờ
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Liên hệ ngay
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-white shadow-sm">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
                <TabsTrigger value="education">Học vấn</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Giới thiệu</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">{freelancer?.overview}</p>

                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Kỹ năng chuyên môn</h3>
                  <div className="flex flex-wrap gap-2">
                    {freelancer?.skills.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="px-4 py-2 text-sm hover:bg-primary hover:text-white transition-colors cursor-default"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="experience">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  {freelancer?.experiences?.length > 0 ? (
                    <div className="space-y-8">
                      {freelancer.experiences.map((exp, index) => (
                        <div key={index} className="flex gap-6 group">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-3 mt-1">
                              <span className="font-medium">{exp.company}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {exp.period}
                              </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có kinh nghiệm làm việc
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="space-y-8">
                    {freelancer?.educations.map((edu, index) => (
                      <div key={index} className="flex gap-6 group">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <GraduationCap className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{edu.school.schoolName}</h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-3 mt-1">
                            <span className="font-medium">{edu.degree.degreeTitle}</span>
                            <span>•</span>
                            <span className="font-medium text-primary">{edu.major.majorName}</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{edu.description}</p>
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