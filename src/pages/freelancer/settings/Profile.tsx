import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Camera, Mail, Phone, MapPin } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn A',
    title: 'Senior Frontend Developer',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    location: 'TP. Hồ Chí Minh',
    bio: 'Frontend Developer với hơn 5 năm kinh nghiệm...',
    avatar: 'https://github.com/shadcn.png',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.log(profile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <FadeInWhenVisible>
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar} alt={profile.fullName} />
                <AvatarFallback>NA</AvatarFallback>
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
              <h2 className="text-2xl font-bold">{profile.fullName}</h2>
              <p className="text-muted-foreground">{profile.title}</p>
            </div>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeInWhenVisible delay={0.1}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Họ và tên</label>
              <Input
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
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

          <FadeInWhenVisible delay={0.3}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  className="pl-10"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.4}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  className="pl-10"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.5}>
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

          <FadeInWhenVisible delay={0.6}>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Giới thiệu</label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
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