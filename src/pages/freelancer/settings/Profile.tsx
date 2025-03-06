import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Camera, MapPin, Star, Briefcase, DollarSign } from 'lucide-react';
import api from '@/api/axiosConfig';
import { notification } from 'antd';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    location: '',
    overview: '',
    avatar: '',
    rating: 0,
    completeProject: 0,
    hourlyRate: 0,
    skills: [] as string[]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (userInfo.freelancerId) {
          const response = await api.get(`/v1/freelancers/detail?id=${userInfo.freelancerId}`);
          if (response.status === 200 && response.data) {
            setProfile({
              name: response.data.name || '',
              title: response.data.title || '',
              location: response.data.location || '',
              overview: response.data.overview || '',
              avatar: response.data.avatar || '',
              rating: response.data.rating || 0,
              completeProject: response.data.completeProject || 0,
              hourlyRate: response.data.hourlyRate || 0,
              skills: response.data.skills || []
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (userInfo.freelancerId) {
        // API call to update profile would go here
        // await api.put(`/v1/freelancers/${userInfo.freelancerId}`, profile);
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật thông tin hồ sơ thành công'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật hồ sơ. Vui lòng thử lại sau.'
      });
    }
  };

  const handleSkillChange = (skillsString: string) => {
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfile({ ...profile, skills: skillsArray });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <FadeInWhenVisible>
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar ? `http://localhost:8080/api/v1/files/${profile.avatar}` : undefined} alt={profile.name} />
                <AvatarFallback>{profile.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.title}</p>
            </div>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FadeInWhenVisible delay={0.1}>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Đánh giá</p>
                <p className="font-medium">{profile.rating}/5</p>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Dự án hoàn thành</p>
                <p className="font-medium">{profile.completeProject}</p>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.3}>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Giá theo giờ</p>
                <p className="font-medium">${profile.hourlyRate}/giờ</p>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeInWhenVisible delay={0.4}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên</label>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.5}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chức danh</label>
              <Input
                value={profile.title}
                onChange={(e) =>
                  setProfile({ ...profile, title: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.6}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa điểm</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                />
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.7}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Giá theo giờ (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  className="pl-10"
                  value={profile.hourlyRate}
                  onChange={(e) =>
                    setProfile({ ...profile, hourlyRate: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.8}>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Kỹ năng</label>
              <Input
                value={profile.skills.join(', ')}
                onChange={(e) => handleSkillChange(e.target.value)}
                placeholder="Nhập các kỹ năng, phân cách bằng dấu phẩy"
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.9}>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Giới thiệu</label>
              <Textarea
                value={profile.overview}
                onChange={(e) => setProfile({ ...profile, overview: e.target.value })}
                rows={4}
              />
            </div>
          </FadeInWhenVisible>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">Lưu thay đổi</Button>
        </div>
      </Card>
    </form>
  );
};

export default Profile;