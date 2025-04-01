import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Briefcase, Users, TrendingUp, CheckCircle, Code, Paintbrush, PenTool } from 'lucide-react';
import AnimatedNumber from '@/components/animations/AnimatedNumber';
import { useLanguage } from '@/contexts/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useState } from 'react';
import api from '@/api/axiosConfig';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Banner {
  id: number;
  title: string;
  image: string;
  status: string;
  vendor: string;
  startTime: string;
  endTime: string;
}

interface Job {
  id: number;
  title: string;
  companyName: string;
  hourWork: number;
  fromPrice: number;
  toPrice: number;
  description: string;
  skillName: string[];
  categoryName: string;
}

const Home = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalFreelancers: 0,
    approvedFreelancerJobs: 0,
    postedJobs: 0,
    loading: true,
  });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsPremium, setJobPremium] = useState<any[]>()
  console.log(stats)
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get("statistics/home");
        if (response.success) {
          setStats({
            totalFreelancers: response.totalFreelancers || 0,
            approvedFreelancerJobs: response.approvedFreelancerJobs || 0,
            postedJobs: response.postedJobs || 0,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    const fetchBanners = async () => {
      try {
        const response = await api.get('/v1/banners');
        if (response.status === 200) {
          const today = new Date().toISOString().split('T')[0];
          const validBanners = response.data.filter(
            (banner: Banner) => banner.endTime >= today && banner.status === 'active'
          );
          setBanners(validBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    const fetchJobsPremium = async () => {
      try {
        const response = await api.get('/v1/jobs/top-6');
        if (response.status === 200) {
          setJobPremium(response.data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchJobsPremium()
    fetchStatistics();
    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get(`/v1/jobs?freelancerId=${0}`);
        if (response.status === 200) {
          const jobData: Job[] = response.data;
          const filteredJobs: { [key: string]: Job } = {};
          const categoryCount: { [key: string]: number } = {};
          let uniqueCategories = 0;

          jobData.forEach((job) => {
            const category = job.categoryName;
            if (uniqueCategories < 6) {
              if (!categoryCount[category]) {
                categoryCount[category] = 1;
                uniqueCategories++;
              }
              if (!filteredJobs[category] || job.toPrice > filteredJobs[category].toPrice) {
                filteredJobs[category] = job;
              } else if (
                job.toPrice === filteredJobs[category].toPrice &&
                job.fromPrice > filteredJobs[category].fromPrice
              ) {
                filteredJobs[category] = job;
              }
            }
          });

          setJobs(Object.values(filteredJobs));
        }
        setLoadingJobs(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <section className="relative py-[70px] bg-gradient-to-b from-primary-100 via-background to-background">
        <div className="absolute inset-x-0 bottom-0 w-full h-96">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="w-full h-full shadow-lg overflow-hidden"
          >
            {banners?.map((banner) => (
              <SwiperSlide key={banner.id}>
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              </SwiperSlide>
            ))}
            {banners?.length === 0 && (
              <>
                <SwiperSlide>
                  <img
                    src="https://cdn.pixabay.com/photo/2021/03/02/13/05/laptop-6062425_1280.jpg"
                    alt="Laptop"
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="https://www.hrmanagementapp.com/wp-content/uploads/2019/06/freelancer-2.jpg"
                    alt="Freelancer"
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="https://fthmb.tqn.com/f6uChwfNF8VyWQk02SvWhoJfnE0=/2121x1414/filters:fill(auto,1)/GettyImages-505095190-58ee7c925f9b582c4ddfc6a4.jpg"
                    alt="Work"
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              </>
            )}
          </Swiper>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <FadeInWhenVisible>
              <h1 className="text-2xl md:text-6xl font-bold pb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {t('connetWith')}
              </h1>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-xl text-muted-foreground mb-8">{t('platform')}</p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg bg-primary hover:bg-primary-600">
                  {t('postJob')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg border-primary text-primary hover:bg-primary-50 hover:text-primary"
                >
                  {t('postJob')}
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInWhenVisible>
              <Card className="p-6 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2 text-primary-700">
                  {stats.loading ? (
                    <AnimatedNumber start={0} end={50000} />
                  ) : (
                    <AnimatedNumber start={0} end={stats.totalFreelancers} />
                  )}

                </h3>
                Số lượng ứng viên
              </Card>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <Card className="p-6 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2 text-primary-700">
                  {stats.loading ? (
                    <AnimatedNumber start={0} end={50000} />
                  ) : (
                    <AnimatedNumber start={0} end={stats.postedJobs} />
                  )}

                </h3>
                Số lượng dự án
              </Card>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <Card className="p-6 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2 text-primary-700">
                  {stats.loading ? (
                    <AnimatedNumber start={0} end={50000} />
                  ) : (
                    <AnimatedNumber start={0} end={stats.approvedFreelancerJobs} />
                  )}

                </h3>
                Số lượng cộng tác
              </Card>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>
      {/* Jobs Premium */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary-50">
        <div className="container mx-auto px-6">
          <FadeInWhenVisible>
            <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-800 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Top Công Việc Nổi Bật
            </h2>
          </FadeInWhenVisible>
          {loadingJobs ? (
            <div className="text-center text-gray-500 text-lg">Đang tải công việc...</div>
          ) : jobsPremium?.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">Không có công việc nào để hiển thị.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {jobsPremium?.map((job, index) => (
                <FadeInWhenVisible key={job.id} delay={index * 0.15}>
                  <Card
                    className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 overflow-hidden group h-full"
                    style={{ height: '100%' }}
                  >
                    <div className="absolute top-3 right-3">
                      <Badge
                        className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md hover:from-red-600 hover:to-orange-600 transition-all duration-300"
                      >
                        Hot
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 via-primary-50/20 to-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-start gap-4 flex-grow h-full">
                      {job.categoryName.includes('Quản lý dự án') ? (
                        <Briefcase className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors" />
                      ) : job.categoryName.includes('Thiết kế') ? (
                        <Paintbrush className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors" />
                      ) : (
                        <Code className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors" />
                      )}
                      <div className="flex flex-col flex-grow h-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary-700 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-gray-700">Đăng bởi:</span>{' '}
                          <span className="text-gray-800">{job.companyName || 'Ẩn danh'}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-gray-700">Ngân sách:</span>{' '}
                          <span className="text-primary-600 font-medium">
                            {formatCurrency(job.fromPrice)} - {formatCurrency(job.toPrice)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-gray-700">Thời gian:</span>{' '}
                          <span className="text-gray-800">{job.hourWork} giờ</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-gray-700">Hạn ứng tuyển:</span>{' '}
                          <span className="text-primary-600 font-medium">Còn {job.remainingTimeFormatted}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{job.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skillName.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-primary-200 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className='flex-1'></div>
                        <Link to={`/jobs/${job.id}`}>

                          <Button
                            variant="outline"
                            className="w-full bg-primary-600 text-white hover:bg-primary-700 border-none rounded-lg shadow-sm transition-all duration-300"
                          >
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                    {/* <div className="mt-6">
                <Badge
                  variant="outline"
                  className="w-full text-center py-1.5 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-none rounded-lg shadow-sm hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
                >
                  {job.typePackage}
                </Badge>
              </div> */}
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12 text-primary-800">
              Khám Phá Các Dự Án Hấp Dẫn
            </h2>
          </FadeInWhenVisible>
          {loadingJobs ? (
            <div className="text-center text-muted-foreground">Đang tải công việc...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-muted-foreground">Không có công việc nào để hiển thị.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs?.map((job, index) => (
                // <FadeInWhenVisible key={job.id} delay={index * 0.1}>
                //   <Card
                //     className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30 bg-background"
                //     style={{ height: '100%' }}
                //   >
                //     <div className="flex items-start gap-4">
                //       {job.categoryName.includes('Lập trình') ? (
                //         <Code className="w-8 h-8 text-primary-600" />
                //       ) : job.categoryName.includes('Thiết kế') ? (
                //         <Paintbrush className="w-8 h-8 text-primary-600" />
                //       ) : job.categoryName.includes('Viết lách') ? (
                //         <PenTool className="w-8 h-8 text-primary-600" />
                //       ) : job.categoryName.includes('Marketing') ? (
                //         <TrendingUp className="w-8 h-8 text-primary-600" />
                //       ) : (
                //         <Briefcase className="w-8 h-8 text-primary-600" />
                //       )}
                //       <div>
                //         <h3 className="font-semibold mb-2 text-primary-700">{job.categoryName}</h3>
                //         <p className="text-sm text-muted-foreground mb-2">
                //           <span className="font-medium">Ngân sách:</span>{' '}
                //           {job.fromPrice !== undefined && job.toPrice !== undefined
                //             ? `${job.fromPrice} - ${job.toPrice}`
                //             : 'Không xác định'}
                //         </p>
                //         <p className="text-sm text-muted-foreground mb-4">Yêu cầu: {job.description}</p>
                //         <div className="flex flex-wrap gap-2">
                //           {job.skillName?.length > 0 ? (
                //             job.skillName?.map((skill) => (
                //               <Badge
                //                 key={skill}
                //                 variant="secondary"
                //                 className="bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
                //               >
                //                 {skill}
                //               </Badge>
                //             ))
                //           ) : (
                //             <Badge variant="secondary" className="bg-secondary-100 text-secondary-700">
                //               Không yêu cầu kỹ năng
                //             </Badge>
                //           )}
                //         </div>
                //       </div>
                //     </div>
                //   </Card>
                // </FadeInWhenVisible>
                <FadeInWhenVisible key={job.id} delay={index * 0.15}>
                  <Card
                    className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 overflow-hidden group h-full"
                    style={{ height: '100%' }}
                  >
                    {/* <div className="absolute top-3 right-3">
                    <Badge
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md hover:from-red-600 hover:to-orange-600 transition-all duration-300"
                    >
                      Hot
                    </Badge>
                  </div> */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 via-primary-50/20 to-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-start gap-4 flex-grow h-full">
                      {job.categoryName.includes('Quản lý dự án') ? (
                        <Briefcase className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors" />
                      ) : job.categoryName.includes('Thiết kế') ? (
                        <Paintbrush className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors" />
                      ) : (
                        <Code className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors" />
                      )}
                      <div className="flex flex-col flex-grow h-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary-700 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-gray-700">Đăng bởi:</span>{' '}
                          <span className="text-gray-800">{job.companyName || 'Ẩn danh'}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-gray-700">Ngân sách:</span>{' '}
                          <span className="text-primary-600 font-medium">
                            {formatCurrency(job.fromPrice)} - {formatCurrency(job.toPrice)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-gray-700">Thời gian:</span>{' '}
                          <span className="text-gray-800">{job.hourWork} giờ</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-gray-700">Hạn ứng tuyển:</span>{' '}
                          <span className="text-primary-600 font-medium">Còn {job.remainingTimeFormatted}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{job.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skillName.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-primary-200 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className='flex-1'></div>
                        <Link to={`/jobs/${job.id}`}>

                          <Button
                            variant="outline"
                            className="w-full bg-primary-600 text-white hover:bg-primary-700 border-none rounded-lg shadow-sm transition-all duration-300"
                          >
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                    {/* <div className="mt-6">
              <Badge
                variant="outline"
                className="w-full text-center py-1.5 text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-none rounded-lg shadow-sm hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300"
              >
                {job.typePackage}
              </Badge>
            </div> */}
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          )}
        </div>
      </section>


      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12 text-primary-800">{t('Howitworks')}</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps?.map((step, index) => (
              <FadeInWhenVisible key={step.title} delay={index * 0.2}>
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-100 transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-primary-700">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-secondary-50 via-background to-primary-50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-100/50 to-transparent"></div>
        <div className="container relative mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {t('Startlookingforafreelancertoday')}
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-lg mb-8 text-primary-600/80">
                {t('Signupforfreeandstartconnectingwithatalentedfreelancercommunity')}
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <Button
                size="lg"
                className="text-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('Registernow')}
              </Button>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>
    </div>
  );
};

const steps = [
  {
    title: 'Đăng việc miễn phí',
    description: 'Mô tả chi tiết công việc và yêu cầu của bạn',
    icon: <Briefcase className="w-8 h-8 text-primary-600" />,
  },
  {
    title: 'Nhận báo giá',
    description: 'Nhận báo giá từ các freelancer phù hợp',
    icon: <Users className="w-8 h-8 text-primary-600" />,
  },
  {
    title: 'Hoàn thành dự án',
    description: 'Làm việc và thanh toán an toàn qua hệ thống',
    icon: <CheckCircle className="w-8 h-8 text-primary-600" />,
  },
];

export default Home;