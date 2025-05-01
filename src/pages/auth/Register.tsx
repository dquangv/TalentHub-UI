import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Mail,
  Lock,
  BriefcaseIcon,
  User,
  Phone,
  MapPin,
  FileText,
  Info,
  Chrome,
  Github,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import api from "@/api/axiosConfig";
import { notification } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import addressService, { Province, District, Ward } from "@/api/addressService";
import validatePhoneNumber from "@/utils/phoneValidator";
import config from "@/config";

const Register = () => {
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [phoneError, setPhoneError] = useState("");

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
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get OAuth URLs from config
  const googleAuthUrl = `${config.current.OAUTH_BASE_URL}/google`;
  const githubAuthUrl = `${config.current.OAUTH_BASE_URL}/github`;

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, phoneNumber: value });
    const validation = validatePhoneNumber(value, {
      acceptInternational: false,
    });

    if (!validation.isValid && value.trim() !== "") {
      setPhoneError(validation.message);
    } else {
      setPhoneError("");
    }
  };

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
        const provinceDetails = await addressService.getProvinceDetails(
          selectedProvince.code
        );
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
        const districtDetails = await addressService.getDistrictDetails(
          selectedDistrict.code
        );
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
        notification.warning({
          message: "Cảnh báo vị trí",
          description:
            "Không thể truy cập vị trí của bạn. Điều này có thể ảnh hưởng đến một số tính năng.",
        });
      }
    );
  }, []);

  const handleProvinceChange = async (provinceCode) => {
    const province = provinces.find(
      (p) => p.code.toString() === provinceCode.toString()
    );
    setSelectedProvince(province || null);
  };

  const handleDistrictChange = async (districtCode) => {
    const district = districts.find(
      (d) => d.code.toString() === districtCode.toString()
    );
    setSelectedDistrict(district || null);
  };

  const handleNextTab = () => {
    if (activeTab === "basicInfo") {
      // Validation logic hiện có cho tab đầu tiên
      if (
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.role
      ) {
        setError("Vui lòng điền đầy đủ thông tin cơ bản");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu không khớp");
        return;
      }
      setError("");
      setActiveTab("personalInfo");
    } else if (activeTab === "personalInfo") {
      if (!formData.firstName || !formData.lastName) {
        setError("Vui lòng điền đầy đủ họ và tên");
        return;
      }

      if (!formData.phoneNumber) {
        setError("Vui lòng nhập số điện thoại");
        return;
      }

      const phoneValidation = validatePhoneNumber(formData.phoneNumber, {
        onlyVietnam: true,
      });
      if (!phoneValidation.isValid) {
        setError(phoneValidation.message);
        return;
      }

      if (!selectedProvince || !selectedDistrict) {
        setError("Vui lòng chọn đầy đủ địa chỉ");
        return;
      }

      setError("");
      setActiveTab("professionalInfo");
    }
  };

  const handlePrevTab = () => {
    if (activeTab === "personalInfo") {
      setActiveTab("basicInfo");
    } else if (activeTab === "professionalInfo") {
      setActiveTab("personalInfo");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    if (!formData.email || !formData.password || !formData.role) {
      setError("Vui lòng điền tất cả thông tin cơ bản");
      setActiveTab("basicInfo");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      setError("Vui lòng điền tất cả thông tin cá nhân");
      setActiveTab("personalInfo");
      return;
    }

    if (!selectedProvince || !selectedDistrict) {
      setError("Vui lòng chọn đầy đủ địa chỉ");
      setActiveTab("personalInfo");
      return;
    }

    setError("");
    setLoading(true);
    const status =
      formData.role === "FREELANCER" ? "Xác thực" : "Chưa xác thực";
    try {
      const country = selectedProvince ? selectedProvince.name : "";
      const province = selectedDistrict ? selectedDistrict.name : "";
      const { confirmPassword, ...dataToSend } = formData;

      const response = await api.post("/v1/account/register", {
        ...dataToSend,
        country,
        province,
        lat: location.lat || 0,
        lng: location.lng || 0,
        status,
      });

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

      notification.success({
        message: "Đăng ký thành công",
        description: "Chào mừng bạn đến với TalentHub!",
      });

      if (formData.role === "FREELANCER") {
        navigate("/settingsfreelancer");
      } else {
        navigate("/client/profile");
        notification.info({
          message: "Thông báo",
          description: "Vui lòng kiểm tra email để xác thực tài khoản",
        });
      }
    } catch (err: any) {
      console.error("Error during login:", err);
      notification.error({
        message: "Lỗi đăng ký",
        description: err.response?.data?.message || "Đăng ký không thành công",
      });
      setError("Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-primary/10 to-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <FadeInWhenVisible>
            <Card className="p-8 shadow-lg border-opacity-50 backdrop-blur-sm bg-background/80">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 text-primary">
                  TalentHub
                </h1>
                <h2 className="text-2xl font-semibold mb-1">
                  Đăng ký tài khoản
                </h2>
                <p className="text-muted-foreground">
                  {formData.role === "FREELANCER"
                    ? "Tạo tài khoản để bắt đầu sự nghiệp freelance của bạn"
                    : formData.role === "CLIENT"
                    ? "Tạo tài khoản để tìm kiếm freelancer cho dự án của bạn"
                    : "Tạo tài khoản để bắt đầu"}
                </p>
              </div>

              {/* Social Media Registration - Top */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <a href={googleAuthUrl} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-11 border-gray-300 hover:bg-gray-50 hover:text-primary"
                    >
                      <Chrome className="mr-2 h-5 w-5" />
                      Google
                    </Button>
                  </a>
                  <a href={githubAuthUrl} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-11 border-gray-300 hover:bg-gray-50 hover:text-primary"
                    >
                      <Github className="mr-2 h-5 w-5" />
                      GitHub
                    </Button>
                  </a>
                </div>
                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-muted-foreground text-sm">
                    Hoặc đăng ký với email
                  </span>
                </div>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger
                    value="basicInfo"
                    className={
                      activeTab === "basicInfo"
                        ? "border-b-2 border-primary"
                        : ""
                    }
                  >
                    <CheckCircle
                      className={`mr-2 h-4 w-4 ${
                        activeTab !== "basicInfo" &&
                        activeTab !== "personalInfo" &&
                        activeTab !== "professionalInfo"
                          ? "opacity-40"
                          : ""
                      }`}
                    />
                    Thông tin cơ bản
                  </TabsTrigger>
                  <TabsTrigger
                    value="personalInfo"
                    className={
                      activeTab === "personalInfo"
                        ? "border-b-2 border-primary"
                        : ""
                    }
                  >
                    <CheckCircle
                      className={`mr-2 h-4 w-4 ${
                        activeTab !== "personalInfo" &&
                        activeTab !== "professionalInfo"
                          ? "opacity-40"
                          : ""
                      }`}
                    />
                    Thông tin cá nhân
                  </TabsTrigger>
                  <TabsTrigger
                    value="professionalInfo"
                    className={
                      activeTab === "professionalInfo"
                        ? "border-b-2 border-primary"
                        : ""
                    }
                  >
                    <CheckCircle
                      className={`mr-2 h-4 w-4 ${
                        activeTab !== "professionalInfo" ? "opacity-40" : ""
                      }`}
                    />
                    Thông tin chuyên môn
                  </TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basicInfo">
                  <form className="space-y-5">
                    <div className="space-y-3">
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type="password"
                          placeholder="Mật khẩu"
                          className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type="password"
                          placeholder="Xác nhận mật khẩu"
                          className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative group">
                        <BriefcaseIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Select
                          value={formData.role}
                          onValueChange={(value) =>
                            setFormData({ ...formData, role: value })
                          }
                        >
                          <SelectTrigger className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary">
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FREELANCER">
                              Freelancer
                            </SelectItem>
                            <SelectItem value="CLIENT">
                              Nhà tuyển dụng
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md mt-4 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={handleNextTab}
                        className="h-12 px-6 text-base font-medium"
                      >
                        Tiếp theo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Personal Information Tab */}
                <TabsContent value="personalInfo">
                  <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="relative group">
                          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder="Họ"
                            className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="relative group">
                          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder="Tên"
                            className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative group">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type="tel"
                          placeholder="Số điện thoại"
                          className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                          value={formData.phoneNumber}
                          onChange={handlePhoneNumberChange}
                        />
                        {phoneError && (
                          <p className="text-xs text-red-500 mt-1 ml-1">
                            {phoneError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address Selection */}
                    <div className="space-y-4">
                      <p className="text-sm font-medium text-primary">
                        Địa chỉ
                      </p>

                      <div className="space-y-3">
                        <div className="relative group">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Select
                            value={selectedProvince?.code?.toString() || ""}
                            onValueChange={handleProvinceChange}
                          >
                            <SelectTrigger className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary">
                              <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {provinces.map((province) => (
                                <SelectItem
                                  key={province.code}
                                  value={province.code.toString()}
                                >
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="relative group">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Select
                            value={selectedDistrict?.code?.toString() || ""}
                            onValueChange={handleDistrictChange}
                            disabled={!selectedProvince}
                          >
                            <SelectTrigger className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary">
                              <SelectValue placeholder="Chọn Quận/Huyện" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {districts.map((district) => (
                                <SelectItem
                                  key={district.code}
                                  value={district.code.toString()}
                                >
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md mt-4 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevTab}
                        className="h-12 px-6 text-base"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNextTab}
                        className="h-12 px-6 text-base font-medium"
                      >
                        Tiếp theo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Professional Information Tab */}
                <TabsContent value="professionalInfo">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <div className="relative group">
                        <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="Tiêu đề chuyên môn"
                          className="pl-10 h-12 rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1 ml-1">
                          {formData.role === "FREELANCER"
                            ? "Ví dụ: Lập trình viên Full-stack với 5 năm kinh nghiệm"
                            : "Ví dụ: CEO tại Công ty ABC"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="relative group">
                        <Info className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Textarea
                          placeholder="Giới thiệu bản thân"
                          className="pl-10 min-h-[120px] rounded-md ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
                          value={formData.introduction}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              introduction: e.target.value,
                            })
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1 ml-1">
                          {formData.role === "FREELANCER"
                            ? "Mô tả ngắn gọn về kỹ năng và kinh nghiệm của bạn"
                            : "Mô tả ngắn gọn về công ty hoặc dự án của bạn"}
                        </p>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md mt-4 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevTab}
                        className="h-12 px-6 text-base"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                      </Button>
                      <Button
                        type="submit"
                        className="h-12 px-6 text-base font-medium bg-primary"
                        disabled={loading}
                      >
                        {loading ? "Đang đăng ký..." : "Hoàn tất đăng ký"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Login Link */}
              <p className="text-center mt-6 text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
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
