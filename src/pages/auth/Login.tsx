import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Mail, Lock, Chrome, Facebook, ShieldCheck } from "lucide-react";
import api from "@/api/axiosConfig";
import config from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { notification } from "antd";

const Login = () => {
  // Form data for initial login
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 2FA related states
  const [showMfaForm, setShowMfaForm] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [tempToken, setTempToken] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User location
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Get user location on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error("Error getting location: ", err);
      }
    );
  }, []);

  // Handle initial login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Địa chỉ email không hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Địa chỉ email không hợp lệ");
      setLoading(false)
      return;
    }

    try {
      const response = await api.post("/v1/auth/login", {
        ...formData,
        lat: location.lat || 0,
        lng: location.lng || 0,
      });

      const data = response.data;

      // Check if 2FA is required
      if (data.requiresMfa) {
        // Store temporary token and email for 2FA verification
        setTempToken(data.tempToken);
        setShowMfaForm(true);
        notification.info({
          message: "Xác thực hai lớp",
          description: "Vui lòng nhập mã xác thực từ ứng dụng xác thực của bạn",
        });
      } else {
        // Login successful without 2FA
        await login({
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
      }
    } catch (err) {
      console.error("Error during login:", err);

      // Display error message
      const errorMessage =
        err.response?.data?.message || "Thông tin đăng nhập không chính xác";
      setError(errorMessage);

      notification.error({
        message: "Lỗi đăng nhập",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA verification form submission
  const handleMfaSubmit = async (e) => {
    e.preventDefault();

    if (!mfaCode) {
      setError("Vui lòng nhập mã xác thực");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/v1/auth/verify-mfa", {
        email: formData.email,
        tempToken: tempToken,
        mfaCode: mfaCode,
        lat: location.lat || 0,
        lng: location.lng || 0,
      });

      const data = response.data;

      // Login successful after 2FA verification
      await login({
        accessToken: data?.accessToken,
        userId: data?.userId,
        role: data?.role,
        freelancerId: data?.freelancerId,
        clientId: data?.clientId,
        email: data?.email,
        lat: data?.lat,
        lng: data?.lng,
      });

      // Reset MFA form
      setMfaCode("");
      setTempToken("");
      setShowMfaForm(false);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error during MFA verification:", err);

      // Display error message
      const errorMessage =
        err.response?.data?.message || "Mã xác thực không đúng";
      setError(errorMessage);

      notification.error({
        message: "Lỗi đăng nhập",
        description:
          err.response?.data?.message || "Thông tin đăng nhập không chính xác",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form when switching between login and MFA form
  const handleBackToLogin = () => {
    setShowMfaForm(false);
    setMfaCode("");
    setError("");
  };

  // Get OAuth URLs from config
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

              {!showMfaForm ? (
                // Regular login form
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
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

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>
              ) : (
                // 2FA Verification Form
                <form onSubmit={handleMfaSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Mã xác thực 2FA"
                        className="pl-10"
                        value={mfaCode}
                        onChange={(e) =>
                          setMfaCode(
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        autoFocus
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                      />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Nhập mã 6 số từ ứng dụng Google Authenticator hoặc Microsoft
                    Authenticator
                  </p>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang xác thực..." : "Xác thực"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={handleBackToLogin}
                    disabled={loading}
                  >
                    Quay lại
                  </Button>
                </form>
              )}

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-center mt-4">{error}</div>
              )}

              {/* Social Media Login - only shown in regular login form */}
              {!showMfaForm && (
                <>
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

                  <div className="mt-6 space-y-2">
                    <p className="text-center text-sm text-muted-foreground">
                      Chưa có tài khoản?{" "}
                      <Link
                        to="/register"
                        className="text-primary hover:underline"
                      >
                        Đăng ký ngay
                      </Link>
                    </p>
                    <p className="text-center text-sm text-muted-foreground">
                      Bạn quên mật khẩu?{" "}
                      <Link
                        to="/forgot-password"
                        className="text-primary hover:underline"
                      >
                        Click vào đây
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </Card>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default Login;
