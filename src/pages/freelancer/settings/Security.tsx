import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Lock, Key, Shield, Loader2 } from 'lucide-react';
import { notification } from 'antd';
import userService from '@/api/userService';
const PASSWORD_PATTERN = /^.{3,}$/;

const Security = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      current: '',
      new: '',
      confirm: '',
    });

    const userEmail = JSON.parse(localStorage.getItem('userInfo') || '{}').email;
    let hasError = false;
    if (!userEmail) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể xác định email người dùng. Vui lòng đăng nhập lại.',
      });
      return;
    }

    if (!passwords.current) {
      setErrors(prev => ({ ...prev, current: 'Vui lòng nhập mật khẩu hiện tại' }));
      hasError = true;
    }

    if (!passwords.new) {
      setErrors(prev => ({ ...prev, new: 'Vui lòng nhập mật khẩu mới' }));
      hasError = true;
    } else if (!PASSWORD_PATTERN.test(passwords.new)) {
      setErrors(prev => ({ ...prev, new: 'Mật khẩu phải có ít nhất 6 ký tự' }));
      hasError = true;
    }

    if (!passwords.confirm) {
      setErrors(prev => ({ ...prev, confirm: 'Vui lòng xác nhận mật khẩu' }));
      hasError = true;
    } else if (passwords.new !== passwords.confirm) {
      setErrors(prev => ({ ...prev, confirm: 'Mật khẩu xác nhận không trùng khớp' }));
      hasError = true;
    }

    if (hasError) return;

    // Submit password change
    try {
      setLoading(true);

      const response = await userService.changePassword({
        email: userEmail,
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      if (response.status === 200) {
        notification.success({
          message: 'Thành công',
          description: 'Mật khẩu đã được cập nhật.',
        });

        // Reset form
        setPasswords({
          current: '',
          new: '',
          confirm: '',
        });
      }
    } catch (error: any) {
      console.error('Error changing password:', error);

      if (error.response?.status === 400) {
        notification.error({
          message: 'Lỗi',
          description: 'Mật khẩu hiện tại không đúng.',
        });
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Đã xảy ra lỗi khi cập nhật mật khẩu.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FadeInWhenVisible>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Đổi mật khẩu</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu hiện tại</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
              </div>
              {errors.current && (
                <p className="text-sm text-red-500 mt-1">{errors.current}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
              </div>
              {errors.new && (
                <p className="text-sm text-red-500 mt-1">{errors.new}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>
              {errors.confirm && (
                <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật mật khẩu'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </FadeInWhenVisible>
    </div>
  );
};

export default Security;