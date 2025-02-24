import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'antd';
import { notification } from 'antd'
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import {
  Video,
  MapPin,
  Clock,
  Users,
  Link,
  Building2,
  CheckCircle,
} from 'lucide-react';
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
const Appointment = () => {
  const [appointmentType, setAppointmentType] = useState<'online' | 'offline'>('online');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: '1',
    time: '',
    duration: '30',
    topic: '',
    description: '',
    location: '',
    meetingLink: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notification.info({
      message: 'Đặt lịch thành công',
      description: 'Chúng tôi sẽ gửi email xác nhận cho bạn',
    });
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30'
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">Đặt lịch hẹn</h1>
              <p className="text-muted-foreground">
                Đặt lịch hẹn trực tuyến hoặc gặp mặt trực tiếp với chúng tôi
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Appointment Type Selection */}
          <FadeInWhenVisible delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${appointmentType === 'online' ? 'ring-2 ring-primary' : ''
                  }`}
                onClick={() => setAppointmentType('online')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Họp trực tuyến</h3>
                    <p className="text-sm text-muted-foreground">
                      Qua Google Meet hoặc Zoom
                    </p>
                  </div>
                  {appointmentType === 'online' && (
                    <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </Card>

              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${appointmentType === 'offline' ? 'ring-2 ring-primary' : ''
                  }`}
                onClick={() => setAppointmentType('offline')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Gặp trực tiếp</h3>
                    <p className="text-sm text-muted-foreground">
                      Tại văn phòng của chúng tôi
                    </p>
                  </div>
                  {appointmentType === 'offline' && (
                    <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </Card>
            </div>
          </FadeInWhenVisible>

          {/* Main Form */}
          <FadeInWhenVisible delay={0.2}>
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Họ và tên</label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Số điện thoại</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Số người tham gia</label>
                      <Select
                        value={formData.participants}
                        onValueChange={(value) =>
                          setFormData({ ...formData, participants: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn số người" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} người
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Meeting Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Chi tiết cuộc họp</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ngày họp</label>
                      <Calendar fullscreen={false}
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Thời gian bắt đầu</label>
                        <Select
                          value={formData.time}
                          onValueChange={(value) =>
                            setFormData({ ...formData, time: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thời gian" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Thời lượng</label>
                        <Select
                          value={formData.duration}
                          onValueChange={(value) =>
                            setFormData({ ...formData, duration: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thời lượng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 phút</SelectItem>
                            <SelectItem value="60">1 giờ</SelectItem>
                            <SelectItem value="90">1 giờ 30 phút</SelectItem>
                            <SelectItem value="120">2 giờ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meeting Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Nội dung cuộc họp</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Chủ đề</label>
                      <Input
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({ ...formData, topic: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mô tả chi tiết</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Location/Link */}
                {appointmentType === 'offline' ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Địa điểm</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Địa chỉ văn phòng</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          value="123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh"
                          disabled
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Tầng 15, Tòa nhà The Sun Avenue
                      </p>
                    </div>
                  </div>
                ) : ""}

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                  Xác nhận đặt lịch
                </Button>
              </form>
            </Card>
          </FadeInWhenVisible>

          {/* Additional Information */}
          <FadeInWhenVisible delay={0.3}>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Giờ làm việc</h3>
                    <p className="text-sm text-muted-foreground">
                      T2-T6: 9:00 - 18:00
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Số người tối đa</h3>
                    <p className="text-sm text-muted-foreground">
                      8 người/cuộc họp
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Link className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hỗ trợ kỹ thuật</h3>
                    <p className="text-sm text-muted-foreground">
                      Luôn sẵn sàng hỗ trợ
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default Appointment;