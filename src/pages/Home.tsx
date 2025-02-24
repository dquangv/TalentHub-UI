import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Briefcase, Users, TrendingUp, CheckCircle, Code, Paintbrush, PenTool, Video, LineChart } from 'lucide-react';
import AnimatedNumber from '@/components/animations/AnimatedNumber';
import { useLanguage } from '@/contexts/LanguageContext';
import CustomDialogflowMessenger from '@/components/CustomDialogflowMessenger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
const Home = () => {
  const { t } = useLanguage();
  return (
    <div>
      {/* Hero Section - Gradient từ primary sang secondary nhẹ nhàng */}
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
                alt="Laptop"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="https://fthmb.tqn.com/f6uChwfNF8VyWQk02SvWhoJfnE0=/2121x1414/filters:fill(auto,1)/GettyImages-505095190-58ee7c925f9b582c4ddfc6a4.jpg"
                alt="Laptop"
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <FadeInWhenVisible>
              <h1 className=" text-2xl md:text-6xl font-bold pb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {t('connetWith')}
              </h1>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-xl text-muted-foreground mb-8">
                {t('platform')}
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg bg-primary hover:bg-primary-600">
                  {t('postJob')}
                </Button>
                <Button size="lg" variant="outline" className="text-lg border-primary text-primary hover:bg-primary-50 hover:text-primary">
                  {t('postJob')}
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInWhenVisible>
              <Card className="p-6 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2 text-primary-700"><AnimatedNumber start={25000} end={50000} />+</h3>
                <p className="text-muted-foreground"> {t('projectDones')}</p>
              </Card>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <Card className="p-6 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2 text-primary-700"><AnimatedNumber start={25000} end={50000} />+</h3>
                <p className="text-muted-foreground">{t('projectDones')}</p>
              </Card>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <Card className="p-6 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2 text-primary-700"><AnimatedNumber start={25000} end={50000} />+</h3>
                <p className="text-muted-foreground">{t('Featuredareas')}</p>
              </Card>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12 text-primary-800">{t('Featuredareas')}</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-100">
            {categories.map((category, index) => (
              <FadeInWhenVisible key={category.title} delay={index * 0.1}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30 bg-background h-100" style={{height: '100%'}}>
                  <div className="flex items-start gap-4">
                    {category.icon}
                    <div>
                      <h3 className="font-semibold mb-2 text-primary-700">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-secondary-100 text-secondary-700 hover:bg-secondary-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12 text-primary-800">{t('Howitworks')}</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
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

      {/* CTA Section */}
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
      <CustomDialogflowMessenger />
    </div>
  );
};

const categories = [
  {
    title: 'Lập trình & Công nghệ',
    description: 'Phát triển web, mobile app, và các giải pháp phần mềm',
    icon: <Code className="w-8 h-8 text-primary-600" />,
    skills: ['React', 'Node.js', 'Python', 'Mobile App'],
  },
  {
    title: 'Thiết kế & Đồ họa',
    description: 'Thiết kế web, logo, và các sản phẩm đồ họa',
    icon: <Paintbrush className="w-8 h-8 text-primary-600" />,
    skills: ['UI/UX', 'Branding', 'Illustration', 'Motion'],
  },
  {
    title: 'Digital Marketing',
    description: 'Quảng cáo, SEO, và chiến lược marketing online',
    icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
    skills: ['SEO', 'Social Media', 'Google Ads', 'Content'],
  },
  {
    title: 'Viết lách & Biên dịch',
    description: 'Viết content, dịch thuật, và biên tập',
    icon: <PenTool className="w-8 h-8 text-primary-600" />,
    skills: ['Copywriting', 'Translation', 'Content Writing', 'Proofreading'],
  },
  {
    title: 'Video & Animation',
    description: 'Sản xuất video, motion graphics, và animation',
    icon: <Video className="w-8 h-8 text-primary-600" />,
    skills: ['After Effects', 'Premiere Pro', '3D Animation', 'Motion Graphics'],
  },
  {
    title: 'Kinh doanh & Tư vấn',
    description: 'Tư vấn kinh doanh, kế toán, và phân tích',
    icon: <LineChart className="w-8 h-8 text-primary-600" />,
    skills: ['Business Plan', 'Financial Analysis', 'Consulting', 'Research'],
  },
];

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