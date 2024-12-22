import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Card } from '@/components/ui/card';
import { Users, Shield, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeInWhenVisible>
            <h1 className="text-4xl font-bold mb-6">Về TalentHub</h1>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.2}>
            <p className="text-xl text-muted-foreground">
              Chúng tôi là nền tảng kết nối freelancer và doanh nghiệp hàng đầu tại Việt Nam,
              mang đến cơ hội việc làm và phát triển sự nghiệp cho cộng đồng freelancer.
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <FadeInWhenVisible key={value.title} delay={index * 0.1}>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Mission Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.2}>
            <p className="text-lg text-muted-foreground">
              Chúng tôi tin rằng mọi người đều có quyền làm việc một cách linh hoạt và độc lập.
              Sứ mệnh của chúng tôi là tạo ra một môi trường làm việc công bằng và hiệu quả,
              nơi các freelancer có thể phát triển sự nghiệp và doanh nghiệp tìm được đối tác
              phù hợp cho các dự án của họ.
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold mb-12">Đội ngũ của chúng tôi</h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <FadeInWhenVisible key={member.name} delay={index * 0.1}>
                <div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground mb-2">{member.position}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const values = [
  {
    title: 'Chất lượng',
    description: 'Cam kết mang đến dịch vụ chất lượng và đảm bảo sự hài lòng',
    icon: <Award className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Tin cậy',
    description: 'Xây dựng môi trường làm việc đáng tin cậy và minh bạch',
    icon: <Shield className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Cộng đồng',
    description: 'Tạo dựng cộng đồng freelancer chuyên nghiệp và năng động',
    icon: <Users className="w-6 h-6 text-primary" />,
  },
  {
    title: 'Tận tâm',
    description: 'Luôn lắng nghe và hỗ trợ khách hàng một cách tận tâm',
    icon: <Heart className="w-6 h-6 text-primary" />,
  },
];

const team = [
  {
    name: 'Đinh Quốc Huy',
    position: 'Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    description: 'Hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và khởi nghiệp',
  },
  {
    name: 'Đinh Quốc Tiến',
    position: 'Developer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    description: 'Chuyên gia marketing với kinh nghiệm phát triển thương hiệu',
  },
  {
    name: 'Bùi Minh Quang',
    position: 'Developer',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    description: 'Nhiều năm kinh nghiệm phát triển sản phẩm và UX design',
  },
  {
    name: 'Vũ Đăng Quang',
    position: 'Developer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    description: 'Chuyên gia marketing với kinh nghiệm phát triển thương hiệu',
  },
  {
    name: 'Võ Thanh Tùng',
    position: 'Developer',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    description: 'Nhiều năm kinh nghiệm phát triển sản phẩm và UX design',
  },
];

export default About;