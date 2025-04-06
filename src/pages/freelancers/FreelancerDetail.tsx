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
  Clock,
  Clock1,
} from 'lucide-react';
import api from '@/api/axiosConfig';
import GoogleMapComponent from '@/components/MapComponent';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const FreelancerDetail = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchFreelancerDetail = async () => {
      try {
        const response = await api.get(`/v1/freelancers/detail?id=${id}`);
        console.log(response.data);

        setFreelancer(response.data);
        api.get(`/v1/jobs/freelancer-job/details/${id}`)
        const jobsResponse = await api.get(`/v1/jobs/freelancer-job/details/${id}`);
        console.log('jobResponse', jobsResponse)
        setJobs(jobsResponse.data || []);
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
    if (!dateString) return 'Hiện tại';
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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
                    <Avatar
                      src={freelancer?.avatar || undefined}
                      alt={freelancer?.name}
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/10"
                    >
                      <AvatarFallback
                        className="bg-primary/10 text-primary text-[10px] md:text-xs"
                      >
                        {freelancer?.name?.slice(0, 2).toUpperCase() || 'UN'}
                      </AvatarFallback>
                    </Avatar>
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
                            {freelancer?.province}, {freelancer?.country}
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
                            {freelancer?.hourlyRate !== null && freelancer?.hourlyRate !== undefined
                              ? freelancer?.hourlyRate.toLocaleString()
                              : 'Chưa có'}{' '}
                            VND/giờ
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="lg"
                        className="shadow-md hover:shadow-lg transition-shadow"
                        onClick={() => window.open(`/messaging`, '_blank')}
                      >
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
                <TabsTrigger value="projects">Dự án</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>

              </TabsList>

              <TabsContent value="overview">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Giới thiệu</h2>
                  <div className="mb-4">
                    <span className="font-medium text-gray-700">Lĩnh vực: </span>
                    <span className="text-primary">{freelancer?.categoryTitle}</span>
                  </div>
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
                              <span className="font-medium">{exp.companyName}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
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
              <TabsContent value="projects">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  {freelancer?.projects?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {freelancer.projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-video bg-gray-100 relative">
                            {project.image && (
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                                  e.target.parentNode.innerHTML = '<div class="text-gray-400"><Briefcase className="w-16 h-16 mx-auto" /></div>';
                                }}
                              />
                            )}
                            {!project.image && (
                              <div className="w-full h-full flex items-center justify-center">
                                <Briefcase className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{project.title}</h3>
                            <div className="mb-3">
                              <Badge variant="outline" className="text-xs">
                                {project.tech}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm flex items-center"
                              >
                                <span>Xem dự án</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Chưa có dự án nào được thêm vào
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
              <TabsContent value="reviews">
                <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="space-y-6">
                    {jobs.map((job, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{job.projectName}</h3>
                            <p className="text-gray-600 mt-1">{job.scope}</p>
                          </div>
                          {job.rating && (
                            <div className="flex items-center">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="ml-1 font-semibold">{job.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock1 className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Số giờ làm: {job.hourWork} giờ</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Bắt đầu: {formatDate(job.startDate)}</span>
                          </div>
                          {job.endDate && (
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span>Kết thúc: {formatDate(job.endDate)}</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-600">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Khách hàng: {job.clientName}</span>
                          </div>
                        </div>

                        {job.note && (
                          <div className="mt-4">
                            <p className="text-gray-600 italic">{job.note}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {jobs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Chưa có đánh giá nào
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </FadeInWhenVisible>
        </div>
      </div>
      {/* <GoogleMapComponent otherLocation = {{lat: freelancer?.lat, lng: freelancer?.lng, label: freelancer?.name}}/> */}
    </div>
  );
};

export default FreelancerDetail;