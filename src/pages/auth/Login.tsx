import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Mail, Lock, Chrome, Facebook } from "lucide-react";
import api from "@/api/axiosConfig";
import config from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { notification } from "antd";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Get user location when component mounts
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error("Error getting location: ", err);
        // notification.error({
        //   message: "Location Access Denied",
        //   description:
        //     "Please allow location access to proceed with registration.",
        // });
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/v1/auth/login", {
        ...formData,
        lat: location.lat,
        lng: location.lng,
      });

      console.log("Login successful:", response);
      const data = response.data;
      login({
        accessToken: data?.accessToken,
        userId: data?.userId,
        role: data?.role,
        freelancerId: data?.freelancerId,
        clientId: data?.clientId,
        email: data?.email,
        lat: data?.lat,
        lng: data?.lng,
      });

      navigate("/", { replace: true });
      window.location.reload();
    } catch (err: any) {
      console.error("Error during login:", err);
      notification.error({
        message: 'Lỗi đăng nhập',
        description: err.response?.data?.message || 'Đăng nhập không thành công'
      });
    } finally {
      setLoading(false);
    }
  };

  // Lấy URLs OAuth từ config
  const googleAuthUrl = `${config.current.OAUTH_BASE_URL}/google`;
  const facebookAuthUrl = `${config.current.OAUTH_BASE_URL}/facebook`;

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <FadeInWhenVisible>
            <Card className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Đăng nhập</h1>
                <p className="text-muted-foreground">
                  Chào mừng bạn trở lại với TalentHub
                </p>
              </div>

              {/* Login Form */}
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

                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-center mt-4">{error}</div>
              )}

              {/* Social Media Login */}
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-muted-foreground text-sm">
                  Hoặc đăng nhập với
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a href={googleAuthUrl} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </a>
                <a href={facebookAuthUrl} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </a>
              </div>

              <p className="text-center mt-6 text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
              <p className="text-center mt-6 text-sm text-muted-foreground">
                Bạn quên mật khẩu?{" "}
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline"
                >
                  vào đây
                </Link>
              </p>
            </Card>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default Login;