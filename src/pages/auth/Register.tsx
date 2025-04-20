import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Mail, Lock, BriefcaseIcon, User, Phone, MapPin, FileText, Info, Home } from "lucide-react";
import api from "@/api/axiosConfig";
import { notification } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import addressService, { Province, District, Ward } from "@/api/addressService";

const Register = () => {
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    title: "",
    introduction: "",
  });

  // Address data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await addressService.getProvinces();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        const provinceDetails = await addressService.getProvinceDetails(selectedProvince.code);
        if (provinceDetails && provinceDetails.districts) {
          setDistricts(provinceDetails.districts);
        }
      } else {
        setDistricts([]);
      }
      setSelectedDistrict(null);
      setWards([]);
      setSelectedWard(null);
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        const districtDetails = await addressService.getDistrictDetails(selectedDistrict.code);
        if (districtDetails && districtDetails.wards) {
          setWards(districtDetails.wards);
        }
      } else {
        setWards([]);
      }
      setSelectedWard(null);
    };
    fetchWards();
  }, [selectedDistrict]);

  // Get user location
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
        // notification.error({
        //   message: "Location Access Denied",
        //   description: "Please allow location access to proceed with registration.",
        // });
      }
    );
  }, []);
 const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    if (!formData.email || !formData.password || !formData.role) {
      setError("Vui lòng điền tất cả thông tin");
      return;
    }

    // if (!location.lat || !location.lng) {
    //   setError("Vui lòng cho phép địa chỉ của bạn");
    //   return;
    // }

    setError("");
    setLoading(true);

    const status = formData.role === "FREELANCER" ? "Xác thực" : "Chưa xác thực";

    try {
      const response = await api.post("/v1/account/register", {
        ...formData,
        lat: location.lat,
        lng: location.lng,
        status,
      });
      const data = response.data
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
      navigate("/");
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
                <h1 className="text-2xl font-bold mb-2">Đăng ký tài khoản</h1>
                <p className="text-muted-foreground">Tạo tài khoản để bắt đầu sự nghiệp freelance</p>
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <BriefcaseIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
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
                {error && <div className="text-red-500 text-center">{error}</div>}

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
              </form>

              {/* Login Link */}
              <p className="text-center mt-6 text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
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
