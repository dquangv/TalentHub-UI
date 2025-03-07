import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Camera, Phone, MapPin, Loader2 } from 'lucide-react';
import userService, { User } from '@/api/userService';
import { notification } from 'antd';
import { useLanguage } from '@/contexts/LanguageContext';

const Profile = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    title: '',
    introduction: '',
    image: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = JSON.parse(localStorage.getItem('userInfo') || '{}').userId;

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetching(true);
        const response = await userService.getUserById(userId);
        if (response.status === 200 && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.',
        });
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        title: profile.title,
        introduction: profile.introduction,
        image: profile.image,
      };

      const response = await userService.updateUser(userId, userData);

      if (response.status === 200) {
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật thông tin thành công!',
        });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật thông tin. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng chọn tệp hình ảnh hợp lệ.',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notification.error({
        message: 'Lỗi',
        description: 'Kích thước ảnh không được vượt quá 5MB.',
      });
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await userService.uploadImage(file);
      const updateResponse = await userService.updateUserImage(userId, imageUrl);

      if (updateResponse.status === 200) {
        setProfile((prev) => ({ ...prev, image: imageUrl }));
        notification.success({
          message: 'Thành công',
          description: 'Cập nhật ảnh đại diện thành công!',
        });
      } else {
        throw new Error('Failed to update user profile with new image');
      }
    } catch (error) {
      console.error('Error uploading/updating image:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.',
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải thông tin...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <FadeInWhenVisible>
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {uploadingImage ? (
                  <div className="flex items-center justify-center w-full h-full bg-muted">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={profile.image || '/placeholder-avatar.png'} alt={fullName} />
                    <AvatarFallback>
                      {profile.firstName?.charAt(0) || ''}{profile.lastName?.charAt(0) || ''}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadingImage}
              />

              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                type="button"
                onClick={handleAvatarButtonClick}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{fullName}</h2>
              <p className="text-muted-foreground">{profile.title}</p>
            </div>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeInWhenVisible delay={0.1}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{'Họ'}</label>
              <Input
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{'Tên'}</label>
              <Input
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.3}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{'Chức danh'}</label>
              <Input
                value={profile.title}
                onChange={(e) =>
                  setProfile({ ...profile, title: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.4}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Phone') || 'Số điện thoại'}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  className="pl-10"
                  value={profile.phoneNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, phoneNumber: e.target.value })
                  }
                />
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.5}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Address') || 'Địa chỉ'}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.6}>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">{'Giới thiệu'}</label>
              <Textarea
                value={profile.introduction}
                onChange={(e) => setProfile({ ...profile, introduction: e.target.value })}
                rows={4}
              />
            </div>
          </FadeInWhenVisible>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading || uploadingImage}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {'Đang lưu...'}
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};
export default Profile;