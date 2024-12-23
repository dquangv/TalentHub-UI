import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Lock, Key, Shield } from 'lucide-react';

const Security = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change
    console.log(passwords);
  };

  return (
    <div className="space-y-6">
      <FadeInWhenVisible>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Đổi mật khẩu</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>

            <Button type="submit">Cập nhật mật khẩu</Button>
          </form>
        </Card>
      </FadeInWhenVisible>

      <FadeInWhenVisible delay={0.2}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Bảo mật tài khoản</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Xác thực hai yếu tố</p>
                <p className="text-sm text-muted-foreground">
                  Thêm lớp bảo mật bổ sung cho tài khoản của bạn
                </p>
              </div>
              <Button variant="outline">Thiết lập</Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Phiên đăng nhập</p>
                <p className="text-sm text-muted-foreground">
                  Quản lý các thiết bị đang đăng nhập
                </p>
              </div>
              <Button variant="outline">Xem</Button>
            </div>
          </div>
        </Card>
      </FadeInWhenVisible>
    </div>
  );
};

export default Security;