import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeInWhenVisible>
            <h1 className="text-4xl font-bold mb-6">Liên hệ với chúng tôi</h1>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.2}>
            <p className="text-xl text-muted-foreground">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi
              nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào.
            </p>
          </FadeInWhenVisible>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <FadeInWhenVisible>
              <h2 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h2>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.1}>
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">support@talenthub.com</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-2">Điện thoại</h3>
                    <p className="text-muted-foreground">1900 1234</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold mb-2">Địa chỉ</h3>
                    <p className="text-muted-foreground">
                      123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          </div>

          {/* Contact Form */}
          <FadeInWhenVisible delay={0.4}>
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6">Gửi tin nhắn</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Input
                    placeholder="Tiêu đề"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Nội dung tin nhắn"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Gửi tin nhắn
                </Button>
              </form>
            </Card>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default Contact;