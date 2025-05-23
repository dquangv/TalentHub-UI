import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Camera, Phone, Loader2, Plus, X, Code, Star } from "lucide-react";
import userService, { User } from "@/api/userService";
import skillService, { Skill, FreelancerSkill } from "@/api/skillService";
import { notification } from "antd";
import { useLanguage } from "@/contexts/LanguageContext";
import freelancerService from "@/api/freelancerService";
import AutofillInput from "@/components/AutofillInput";
import LocationSelector from "./LocationSelector";
import api from "@/api/axiosConfig";
import validatePhoneNumber from "@/utils/phoneValidator";

const Profile = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<User>({
    id: 0,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: null,
    province: null,
    title: "",
    introduction: "",
    image: "",
    role: "",
  });
  const [freelancerProfile, setFreelancerProfile] = useState<any>(null);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryName, setCategoryName] = useState<string>("");
  const [updatingCategory, setUpdatingCategory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [prevCategory, setPrevCategory] = useState<any>();
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [freelancerSkills, setFreelancerSkills] = useState<FreelancerSkill[]>(
    []
  );
  const [phoneError, setPhoneError] = useState<string>("");

  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [isAddingNewSkill, setIsAddingNewSkill] = useState<boolean>(false);
  const [loadingSkills, setLoadingSkills] = useState<boolean>(false);
  const [skillInputKey, setSkillInputKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = JSON.parse(localStorage.getItem("userInfo") || "{}").userId;
  const freelancerId = JSON.parse(
    localStorage.getItem("userInfo") || "{}"
  ).freelancerId;
  const fullName = `${profile.firstName || ""} ${
    profile.lastName || ""
  }`.trim();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetching(true);
        const response = await userService.getUserById(userId);
        if (response.status === 200 && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        notification.error({
          message: "Lỗi",
          description:
            "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
        });
      } finally {
        setFetching(false);
      }
    };

    const fetchFreelancerData = async () => {
      try {
        const response = await freelancerService.getFreelancerById(
          freelancerId
        );
        if (response.status === 200 && response.data) {
          setFreelancerProfile(response.data);
          setHourlyRate(response.data.hourlyRate);
          setRating(response.data.rating || 0);
          setCategoryName(response.data.categoryName || "");
          setPrevCategory(response.data.categoryName || "");
        }
      } catch (error) {
        console.error("Error fetching freelancer data:", error);
        notification.error({
          message: "Lỗi",
          description:
            "Không thể tải thông tin freelancer. Vui lòng thử lại sau.",
        });
      }
    };

    const fetchSkillsData = async () => {
      try {
        setLoadingSkills(true);
        const allSkillsResponse = await skillService.getAllSkills();
        if (allSkillsResponse.status === 200 && allSkillsResponse.data) {
          setAvailableSkills(allSkillsResponse.data);
        }
        const freelancerSkillsResponse = await skillService.getFreelancerSkills(
          freelancerId
        );
        if (
          freelancerSkillsResponse.status === 200 &&
          freelancerSkillsResponse.data
        ) {
          setFreelancerSkills(freelancerSkillsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching skills data:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin kỹ năng. Vui lòng thử lại sau.",
        });
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchUserData();
    fetchFreelancerData();
    fetchSkillsData();
  }, [userId, freelancerId]);

  const handleHourlyRateUpdate = async () => {
    try {
      setLoading(true);

      const response = await freelancerService.updateHourlyRate(
        freelancerId,
        hourlyRate
      );
    } catch (error) {
      console.error("Error updating hourly rate:", error);
      notification.error({
        message: "Lỗi",
        description:
          "Không thể cập nhật lương mong muốn. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (id: number, name: string) => {
    if (id > 0) {
      try {
        setUpdatingCategory(true);
        setCategoryId(id);
        setCategoryName(name);

        const response = await freelancerService.updateFreelancerCategory(
          freelancerId,
          id
        );

        if (response.status === 200 && response.data) {
          setCategoryName(response.data.categoryName);
          notification.success({
            message: "Thành công",
            description: "Cập nhật lĩnh vực thành công!",
          });
        }
      } catch (error) {
        console.error("Error updating category:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể cập nhật lĩnh vực. Vui lòng thử lại sau.",
        });
      } finally {
        setUpdatingCategory(false);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetching(true);
        const response = await userService.getUserById(userId);
        if (response.status === 200 && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        notification.error({
          message: "Lỗi",
          description:
            "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
        });
      } finally {
        setFetching(false);
      }
    };

    const fetchSkillsData = async () => {
      try {
        setLoadingSkills(true);
        const allSkillsResponse = await skillService.getAllSkills();
        if (allSkillsResponse.status === 200 && allSkillsResponse.data) {
          setAvailableSkills(allSkillsResponse.data);
        }
        const freelancerSkillsResponse = await skillService.getFreelancerSkills(
          freelancerId
        );
        if (
          freelancerSkillsResponse.status === 200 &&
          freelancerSkillsResponse.data
        ) {
          setFreelancerSkills(freelancerSkillsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching skills data:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin kỹ năng. Vui lòng thử lại sau.",
        });
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchUserData();
    fetchSkillsData();
  }, [userId, freelancerId]);
  const formatCurrency = (value: number): string => {
    if (!value && value !== 0) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.phoneNumber.trim() !== "") {
      const phoneValidation = validatePhoneNumber(profile.phoneNumber, {
        onlyVietnam: true,
      });
      if (!phoneValidation.isValid) {
        notification.error({
          message: "Lỗi",
          description: phoneValidation.message,
        });
        return;
      }

      profile.phoneNumber = phoneValidation.phoneNumber;
    }
    try {
      setLoading(true);

      const userData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        country: profile.country,
        province: profile.province,
        title: profile.title,
        introduction: profile.introduction,
        image: profile.image,
      };

      const response = await userService.updateUser(userId, userData);

      await handleHourlyRateUpdate();

      if (response.status === 200) {
        notification.success({
          message: "Thành công",
          description: "Cập nhật thông tin thành công!",
        });
        console.log("prevCategory", prevCategory);
        console.log("categoryName", categoryName);
        if (prevCategory != categoryName) {
          const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
          console.log(userInfo?.freelancerId);
          api.get(
            "/v1/clients/notify-for-clients?freelancerId=" +
              userInfo?.freelancerId
          );
        }
        setPrevCategory(categoryName);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn tệp hình ảnh hợp lệ.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notification.error({
        message: "Lỗi",
        description: "Kích thước ảnh không được vượt quá 5MB.",
      });
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await userService.uploadImage(file);
      const updateResponse = await userService.updateUserImage(
        userId,
        imageUrl
      );

      if (updateResponse.status === 200) {
        setProfile((prev) => ({ ...prev, image: imageUrl }));
        notification.success({
          message: "Thành công",
          description: "Cập nhật ảnh đại diện thành công!",
        });
      } else {
        throw new Error("Failed to update user profile with new image");
      }
    } catch (error) {
      console.error("Error uploading/updating image:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.",
      });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleAddSkill = async () => {
    if (!selectedSkillId) return;

    try {
      setLoadingSkills(true);
      const response = await skillService.addSkillToFreelancer(
        freelancerId,
        selectedSkillId
      );

      if (response.status === 201 && response.data) {
        setFreelancerSkills([...freelancerSkills, response.data]);
        setSelectedSkillId(null);

        setSkillInputKey((prev) => prev + 1);

        notification.success({
          message: "Thành công",
          description: "Thêm kỹ năng thành công!",
        });
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm kỹ năng. Vui lòng thử lại sau.",
      });
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    try {
      setLoadingSkills(true);
      const response = await skillService.removeSkillFromFreelancer(
        freelancerId,
        skillId
      );

      if (response.status === 200) {
        setFreelancerSkills(
          freelancerSkills.filter((skill) => skill.skillId !== skillId)
        );
        notification.success({
          message: "Thành công",
          description: "Xóa kỹ năng thành công!",
        });
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa kỹ năng. Vui lòng thử lại sau.",
      });
    } finally {
      setLoadingSkills(false);
    }
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setProfile({ ...profile, phoneNumber: value });

    if (value.trim() !== "") {
      const validation = validatePhoneNumber(value, {
        onlyVietnam: true,
        acceptInternational: false,
      });

      if (!validation.isValid) {
        setPhoneError(validation.message);
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <FadeInWhenVisible>
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {uploadingImage ? (
                  <div className="flex items-center justify-center w-full h-full bg-muted">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <AvatarImage
                      src={profile.image || "/placeholder-avatar.png"}
                      alt={fullName}
                    />
                    <AvatarFallback>
                      {profile.firstName?.charAt(0) || ""}
                      {profile.lastName?.charAt(0) || ""}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadingImage}
              />

              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                type="button"
                onClick={handleAvatarButtonClick}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{fullName}</h2>
              <p className="text-muted-foreground">{profile.title}</p>
            </div>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeInWhenVisible delay={0.1}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Họ"}</label>
              <Input
                value={profile.firstName}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Tên"}</label>
              <Input
                value={profile.lastName}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.25}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lĩnh vực</label>
                {updatingCategory && (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                )}
              </div>
              <AutofillInput
                entityType="category"
                value={categoryId}
                initialText={categoryName}
                onChange={handleCategoryChange}
                placeholder="Chọn hoặc nhập lĩnh vực"
                disabled={updatingCategory}
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.25}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Lương mong muốn (VNĐ/Giờ)
                </label>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  value={formatCurrency(hourlyRate)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^\d]/g, "");
                    setHourlyRate(numericValue ? Number(numericValue) : 0);
                  }}
                  onBlur={() => {
                    const formatted = formatCurrency(hourlyRate);
                    const inputElement =
                      document.activeElement as HTMLInputElement;
                    if (inputElement) inputElement.value = formatted;
                  }}
                  placeholder="Nhập lương theo giờ"
                />
              </div>
            </div>
          </FadeInWhenVisible>

          {rating > 0 && (
            <FadeInWhenVisible delay={0.26}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Đánh giá</label>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                </div>
              </div>
            </FadeInWhenVisible>
          )}
          <FadeInWhenVisible delay={0.3}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Chức danh"}</label>
              <Input
                value={profile.title}
                onChange={(e) =>
                  setProfile({ ...profile, title: e.target.value })
                }
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.4}>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("Phone") || "Số điện thoại"}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  className={`pl-10 ${
                    phoneError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  value={profile.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              {phoneError && (
                <div className="text-red-500 text-xs mt-1">{phoneError}</div>
              )}
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.5}>
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Vị trí"}</label>
              <LocationSelector
                countryId={profile.country}
                provinceId={profile.province}
                onCountryChange={(country) => {
                  console.log("Province/City selected:", country);
                  setProfile((prev) => ({ ...prev, country: country }));
                }}
                onProvinceChange={(province) => {
                  console.log("District selected:", province);
                  setProfile((prev) => ({ ...prev, province: province }));
                }}
                disabled={loading}
              />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.6}>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">{"Giới thiệu"}</label>
              <Textarea
                value={profile.introduction}
                onChange={(e) =>
                  setProfile({ ...profile, introduction: e.target.value })
                }
                rows={4}
              />
            </div>
          </FadeInWhenVisible>

          {/* Professional Skills Section */}
          <FadeInWhenVisible delay={0.7}>
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-primary" />
                <label className="text-sm font-medium">
                  Kỹ năng chuyên môn
                </label>
              </div>

              <div className="mb-4">
                <div className="bg-muted/40 rounded-md p-3">
                  {freelancerSkills.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Code className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Chưa có kỹ năng nào được thêm
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Thêm kỹ năng để tăng khả năng tìm kiếm của nhà tuyển
                        dụng
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {freelancerSkills.map((skill) => (
                        <FadeInWhenVisible key={skill.id} delay={0.05}>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 py-2 px-3 transition-all hover:bg-primary/10"
                          >
                            {skill.skillName}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full ml-1 p-0 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleRemoveSkill(skill.skillId)}
                              disabled={loadingSkills}
                              title="Xóa kỹ năng"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        </FadeInWhenVisible>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AutofillInput
                    key={skillInputKey}
                    entityType="skill"
                    value={selectedSkillId || 0}
                    initialText=""
                    onChange={(id, name) => {
                      if (id > 0) {
                        setSelectedSkillId(id);
                        handleAddSkill();
                      }
                    }}
                    placeholder="Nhập hoặc chọn kỹ năng"
                    disabled={loadingSkills}
                    excludeIds={freelancerSkills.map((skill) => skill.skillId)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSkill}
                    disabled={!selectedSkillId || loadingSkills}
                    className="flex-shrink-0"
                  >
                    {loadingSkills ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={loading || uploadingImage || loadingSkills}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {"Đang lưu..."}
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default Profile;
