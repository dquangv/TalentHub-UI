import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Search, Briefcase, Users, TrendingUp, Star, CheckCircle, Code, Paintbrush, PenTool, Video, LineChart } from 'lucide-react';
import AnimatedNumber from '@/components/animations/AnimatedNumber';


const Home = () => {
  return (
    <div>
      <section className="relative py-20 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <FadeInWhenVisible>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Kết nối với Freelancer tài năng tại Việt Nam
              </h1>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-xl text-muted-foreground mb-8">
                Nền tảng freelance hàng đầu kết nối doanh nghiệp với freelancer chuyên nghiệp
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg">
                  Tìm Freelancer
                </Button>
                <Button size="lg" variant="outline" className="text-lg">
                  Đăng việc miễn phí
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
              <Card className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2"><AnimatedNumber start={25000} end={50000} />+</h3>
                <p className="text-muted-foreground">Freelancer tài năng</p>
              </Card>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <Card className="p-6 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2"><AnimatedNumber start={25000} end={50000} />+</h3>
                <p className="text-muted-foreground">Dự án đã hoàn thành</p>
              </Card>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <Card className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-3xl font-bold mb-2"><AnimatedNumber start={25000} end={50000} />+</h3>
                <p className="text-muted-foreground">Doanh nghiệp tin tưởng</p>
              </Card>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12">Lĩnh vực nổi bật</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <FadeInWhenVisible key={category.title} delay={index * 0.1}>
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    {category.icon}
                    <div>
                      <h3 className="font-semibold mb-2">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
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

      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12">Cách thức hoạt động</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <FadeInWhenVisible key={step.title} delay={index * 0.2}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold mb-6">
                Bắt đầu tìm kiếm freelancer ngay hôm nay
              </h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-lg mb-8 text-primary-foreground/80">
                Đăng ký miễn phí và bắt đầu kết nối với cộng đồng freelancer tài năng
              </p>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <Button size="lg" variant="secondary" className="text-lg">
                Đăng ký ngay
              </Button>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>
    </div>
  );
};

const categories = [
  {
    title: 'Lập trình & Công nghệ',
    description: 'Phát triển web, mobile app, và các giải pháp phần mềm',
    icon: <Code className="w-8 h-8 text-primary" />,
    skills: ['React', 'Node.js', 'Python', 'Mobile App'],
  },
  {
    title: 'Thiết kế & Đồ họa',
    description: 'Thiết kế web, logo, và các sản phẩm đồ họa',
    icon: <Paintbrush className="w-8 h-8 text-primary" />,
    skills: ['UI/UX', 'Branding', 'Illustration', 'Motion'],
  },
  {
    title: 'Digital Marketing',
    description: 'Quảng cáo, SEO, và chiến lược marketing online',
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    skills: ['SEO', 'Social Media', 'Google Ads', 'Content'],
  },
  {
    title: 'Viết lách & Biên dịch',
    description: 'Viết content, dịch thuật, và biên tập',
    icon: <PenTool className="w-8 h-8 text-primary" />,
    skills: ['Copywriting', 'Translation', 'Content Writing', 'Proofreading'],
  },
  {
    title: 'Video & Animation',
    description: 'Sản xuất video, motion graphics, và animation',
    icon: <Video className="w-8 h-8 text-primary" />,
    skills: ['After Effects', 'Premiere Pro', '3D Animation', 'Motion Graphics'],
  },
  {
    title: 'Kinh doanh & Tư vấn',
    description: 'Tư vấn kinh doanh, kế toán, và phân tích',
    icon: <LineChart className="w-8 h-8 text-primary" />,
    skills: ['Business Plan', 'Financial Analysis', 'Consulting', 'Research'],
  },
];

const steps = [
  {
    title: 'Đăng việc miễn phí',
    description: 'Mô tả chi tiết công việc và yêu cầu của bạn',
    icon: <Briefcase className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Nhận báo giá',
    description: 'Nhận báo giá từ các freelancer phù hợp',
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: 'Hoàn thành dự án',
    description: 'Làm việc và thanh toán an toàn qua hệ thống',
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
  },
];

export default Home;