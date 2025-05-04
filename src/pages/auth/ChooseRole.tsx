import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { BriefcaseIcon } from "lucide-react";
import { notification } from "antd";
import api from "@/api/axiosConfig";
import { useAuth } from "@/contexts/AuthContext";

const ChooseRole = () => {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { login } = useAuth();
  useEffect(() => {
    const queryParams = new URLSearchParams(locationHook.search);
    const emailFromUrl = queryParams.get("email");

    if (emailFromUrl) {
      setFormData((prevData) => ({
        ...prevData,
        email: emailFromUrl,
      }));
    }

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
        //   description: "Please allow location access to proceed with registration.",
        // });
      }
    );
  }, [locationHook.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!location.lat || !location.lng) {
    //   setError("Vui lòng cho phép địa chỉ của bạn");
    //   return;
    // }

    setError("");
    setLoading(true);

    try {
      const queryParams = new URLSearchParams({
        email: formData.email,
        role: formData.role,
        lat: location.lat?.toString() || "",
        lng: location.lng?.toString() || "",
      });

      const response = await api.post(
        `/v1/account/choose-role?${queryParams.toString()}`
      );
      login(response.data);

      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) {
        notification.error({
          message: "Lỗi",
          description: "Không tìm thấy thông tin người dùng",
        });
        return navigate("/login");
      }

      const userInfo = JSON.parse(userInfoStr);
      const email = userInfo.email;

      try {
        const res = await fetch(
          `http://localhost:5000/api/check-face-registered?userId=${email}`
        );
        const data = await res.json();

        if (!data.registered) {
          notification.info({
            message: "Chưa đăng ký khuôn mặt",
            description: "Vui lòng đăng ký khuôn mặt để xác thực.",
          });
          return navigate("/face-capture");
        } else {
          if (formData.role == "FREELANCER") {
            navigate("/settingsfreelancer");
          } else {
            navigate("/client/profile");

            notification.info({
              message: "Thông báo",
              description: "Vui lòng kiểm tra email để xác thực tài khoản",
            });
          }

          notification.success({
            message: "Đăng ký thành công",
            description: "Chào mừng bạn đến với TalentHub!",
          });
        }
      } catch (err) {
        console.error("Lỗi kiểm tra đăng ký:", err);
        notification.error({
          message: "Lỗi kiểm tra khuôn mặt",
          description: "Không thể kiểm tra thông tin đăng ký.",
        });
      }
    } catch (err: any) {
      setError("Đã xảy ra lỗi, vui lòng thử lại sau.");
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
                <h1 className="text-2xl font-bold mb-2">Chọn vai trò</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
              </form>
            </Card>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
