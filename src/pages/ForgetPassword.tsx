import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Mail, ArrowLeft, Lock, KeyRound } from 'lucide-react';

type Step = 'email' | 'code' | 'password';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('code');
      toast({
        title: 'Mã xác thực đã được gửi',
        description: 'Vui lòng kiểm tra email của bạn',
      });
    }, 1500);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (code === '1234') {
        setCurrentStep('password');
      } else {
        toast({
          title: 'Mã không hợp lệ',
          description: 'Vui lòng kiểm tra lại mã xác thực',
          variant: 'destructive',
        });
      }
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Mật khẩu không khớp',
        description: 'Vui lòng kiểm tra lại mật khẩu xác nhận',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Đặt lại mật khẩu thành công',
        description: 'Vui lòng đăng nhập với mật khẩu mới',
      });
      navigate('/login');
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Quên mật khẩu?</h1>
              <p className="text-muted-foreground">
                Đừng lo lắng! Chỉ cần nhập email của bạn và chúng tôi sẽ gửi mã xác thực.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              </Button>

              <div className="text-center">
                <Button variant="link" asChild className="text-muted-foreground">
                  <Link to="/login" className="inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại đăng nhập
                  </Link>
                </Button>
              </div>
            </form>
          </>
        );

      case 'code':
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Nhập mã xác thực</h1>
              <p className="text-muted-foreground mb-2">
                Chúng tôi đã gửi mã xác thực đến email {email}
              </p>
              <p className="text-sm text-muted-foreground">
                Không nhận được mã?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setCurrentStep('email')}
                >
                  Gửi lại
                </Button>
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Nhập mã xác thực"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={4}
                required
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  className="text-muted-foreground"
                  onClick={() => setCurrentStep('email')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              </div>
            </form>
          </>
        );

      case 'password':
        return (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h1>
              <p className="text-muted-foreground">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Mật khẩu mới"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </Button>
            </form>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <FadeInWhenVisible>
            <Card className="p-8">{renderStepContent()}</Card>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;