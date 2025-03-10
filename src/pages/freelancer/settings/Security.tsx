import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Lock, Key, Shield, Loader2, Mail } from 'lucide-react';
import { notification } from 'antd';
import userService from '@/api/userService';
const PASSWORD_PATTERN = /^.{6,}$/;

const Security = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);

  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpProcessing, setOtpProcessing] = useState(false);

  const [otpTimer, setOtpTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: '',
    email: '',
    otp: '',
    newPwd: '',
    confirmPwd: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      current: '',
      new: '',
      confirm: '',
      email: '',
      otp: '',
      newPwd: '',
      confirmPwd: '',
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

  // Send OTP for password reset
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error
    setErrors({
      ...errors,
      email: '',
    });

    // Validate email
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Vui lòng nhập email' }));
      return;
    }

    try {
      setOtpSending(true);

      const response = await userService.sendOtp(email);

      if (response.status === 200) {
        notification.success({
          message: 'Thành công',
          description: `Mã OTP đã được gửi đến ${email}`,
        });
        setShowOtpForm(true);

        // Start the resend timer (60 seconds)
        setOtpTimer(60);
        setTimerActive(true);
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể gửi mã OTP. Vui lòng kiểm tra email và thử lại.',
      });
    } finally {
      setOtpSending(false);
    }
  };

  // Reset password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      ...errors,
      otp: '',
      newPwd: '',
      confirmPwd: '',
    });

    // Validation
    let hasError = false;

    if (!otp) {
      setErrors(prev => ({ ...prev, otp: 'Vui lòng nhập mã OTP' }));
      hasError = true;
    }

    if (!newPassword) {
      setErrors(prev => ({ ...prev, newPwd: 'Vui lòng nhập mật khẩu mới' }));
      hasError = true;
    } else if (!PASSWORD_PATTERN.test(newPassword)) {
      setErrors(prev => ({ ...prev, newPwd: 'Mật khẩu phải có ít nhất 6 ký tự' }));
      hasError = true;
    }

    if (!confirmNewPassword) {
      setErrors(prev => ({ ...prev, confirmPwd: 'Vui lòng xác nhận mật khẩu' }));
      hasError = true;
    } else if (newPassword !== confirmNewPassword) {
      setErrors(prev => ({ ...prev, confirmPwd: 'Mật khẩu xác nhận không trùng khớp' }));
      hasError = true;
    }

    if (hasError) return;

    try {
      setOtpProcessing(true);

      const response = await userService.resetPassword({
        code: otp,
        email: email,
        newPassword: newPassword,
      });

      if (response.status === 200) {
        notification.success({
          message: 'Thành công',
          description: 'Đặt lại mật khẩu thành công!',
        });

        // Reset form and state
        setShowOtpForm(false);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);

      if (error.response?.status === 400) {
        notification.error({
          message: 'Lỗi',
          description: 'Mã OTP không đúng hoặc đã hết hạn.',
        });
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Đã xảy ra lỗi khi đặt lại mật khẩu.',
        });
      }
    } finally {
      setOtpProcessing(false);
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

            <div className="flex items-center justify-between">
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
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowOtpForm(prev => !prev)}
              >
                Quên mật khẩu?
              </Button>
            </div>
          </form>
        </Card>
      </FadeInWhenVisible>

      {/* Forgot Password / Reset Password Card */}
      {showOtpForm && (
        <FadeInWhenVisible delay={0.1}>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Đặt lại mật khẩu</h3>
            </div>

            {/* Step 1: Enter email and request OTP */}
            {!otp && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      className="pl-10"
                      placeholder="Nhập email đã đăng ký"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={otpSending}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <Button type="submit" disabled={otpSending}>
                  {otpSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi mã...
                    </>
                  ) : (
                    'Gửi mã OTP'
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Enter OTP and new password */}
            {otp || (showOtpForm && email) ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mã OTP</label>
                  <Input
                    type="text"
                    placeholder="Nhập mã OTP đã nhận"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={otpProcessing}
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-500 mt-1">{errors.otp}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      className="pl-10"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={otpProcessing}
                    />
                  </div>
                  {errors.newPwd && (
                    <p className="text-sm text-red-500 mt-1">{errors.newPwd}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      className="pl-10"
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={otpProcessing}
                    />
                  </div>
                  {errors.confirmPwd && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmPwd}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={otpProcessing}>
                    {otpProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đặt lại mật khẩu'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSendOtp(new Event('click') as unknown as React.FormEvent)}
                    disabled={otpSending || !email || timerActive}
                  >
                    {otpSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi lại...
                      </>
                    ) : timerActive ? (
                      `Gửi lại mã (${otpTimer}s)`
                    ) : (
                      'Gửi lại mã'
                    )}
                  </Button>
                </div>
              </form>
            ) : null}
          </Card>
        </FadeInWhenVisible>
      )}

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