import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { Mail, Lock, BriefcaseIcon } from 'lucide-react';
import api from '@/api/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setError('');
    setLoading(true);

    try {
      formData.status = true;
      const response = await api.post('account/register', formData);
      console.log(response);
      navigate("/login")
    } catch (err: any) {
      console.error('Error during registration:', err.response.message);
      setError('Đã xảy ra lỗi, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <FadeInWhenVisible>
            <Card className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Đăng ký tài khoản</h1>
                <p className="text-muted-foreground">
                  Tạo tài khoản để bắt đầu sự nghiệp freelance
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Mật khẩu"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <BriefcaseIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREELANCER">Freelancer</SelectItem>
                        <SelectItem value="CLIENT">Nhà tuyển dụng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="text-red-500 text-center">{error}</div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </form>

              {/* Login Link */}
              <p className="text-center mt-6 text-sm text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </Card>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default Register;
