import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notification } from "antd";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Check, ChevronsUpDown, Plus, X } from "lucide-react";
import api from "@/api/axiosConfig";
import { useNavigate, useSearchParams } from "react-router-dom";

enum TypePayment {
  HOURLY = "HOURLY",
  FULL = "FULL",
}

enum StatusJob {
  OPEN = "Mở",
  POSTED = "Đã đăng",
  CLOSED = "Đóng",
  PENDING = "Chờ xử lý",
  BANNED = "Bị cấm",
  DRAFT = "Bản nháp",
}

enum ScopeJob {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

const PostJob = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  const isEditMode = !!jobId;
  const [scopeOpen, setScopeOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobData, setJobData] = useState<any>({
    title: "",
    description: "",
    scope: ScopeJob.SMALL,
    hourWork: null,
    duration: 30,
    jobOpportunity: false,
    fromPrice: 0,
    toPrice: 0,
    typePrice: "USD",
    typePayment: TypePayment.HOURLY,
    statusJob: StatusJob.OPEN,
    clientId: 1,
    categoryId: 0,
    skills: [],
  });
  const authToken = localStorage.getItem("userInfo");
  useEffect(() => {
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, [authToken]);
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);
  useEffect(() => {
    const initializeData = async () => {
      fetchCategories();
      fetchSkills();
      if (isEditMode) {
        await fetchJobDetails();
      }
    };

    initializeData();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.post(`/v1/jobs/getByID/${jobId}`);
      const jobDetails = response.data;
      setJobData({
        ...jobDetails,
        scope: jobDetails.scope,
      });
      setSelectedSkills(jobDetails.skillId || []);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải thông tin công việc",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/v1/categories");
      setCategories(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh mục",
      });
      throw error;
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await api.get("/v1/jobs/skills");
      setSkills(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể tải kỹ năng",
      });
      throw error;
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await api.post("/v1/categories", {
        categoryTitle: newCategory.trim(),
      });

      const newCategoryData = response.data;
      setCategories((prev) => [...prev, newCategoryData]);
      setJobData((prev) => ({ ...prev, categoryId: newCategoryData.id }));
      setNewCategory("");
      setCategoryOpen(false);
      notification.success({
        message: "Thành công",
        description: "Đã thêm danh mục mới",
      });
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm danh mục",
      });
    }
  };

  const handleCreateSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const response = await api.post("/v1/jobs/skills", {
        skillName: newSkill.trim(),
      });

      const newSkillData = response.data;
      setSkills((prev) => [...prev, newSkillData]);
      setSelectedSkills((prev) => [...prev, newSkillData.id]);
      setNewSkill("");
      setSkillOpen(false);
      notification.success({
        message: "Thành công",
        description: "Đã thêm kỹ năng mới",
      });
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm kỹ năng",
      });
    }
  };

  const validateJobData = (data: Partial<any>): boolean => {
    if (!data.title?.trim()) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập tiêu đề công việc",
      });
      return false;
    }
    if (!data.scope?.trim()) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập phạm vi công việc",
      });
      return false;
    }
    if (!data.hourWork) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập số giờ làm việc",
      });
      return false;
    }
    if (
      !data.fromPrice ||
      !data.toPrice ||
      data.fromPrice <= 0 ||
      data.toPrice <= 0
    ) {
      notification.error({
        message: "Lỗi",
        description: "Ngân sách không hợp lệ",
      });
      return false;
    }
    if (data.fromPrice > data.toPrice) {
      notification.error({
        message: "Lỗi",
        description: "Ngân sách từ không thể lớn hơn ngân sách đến",
      });
      return false;
    }
    if (!data.categoryId || data.categoryId === 0) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn danh mục",
      });
      return false;
    }
    if (selectedSkills.length === 0) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn ít nhất một kỹ năng",
      });
      return false;
    }
    return true;
  };

  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    const userInfo: any = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (!userInfo.clientId) {
      navigate("/");
      return;
    }
    console.log("dataaaaaaaaaa ", data);
    const submitData = {
      ...data,
      skillId: selectedSkills,
      clientId: userInfo.clientId,
    };

    if (!validateJobData(submitData)) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(`/v1/jobs/update/${jobId}`, submitData);
        if (data.statusJob == StatusJob.CLOSED) {
          notification.success({
            message: "Thành công",
            description: "Xóa bản nháp thành công",
          });
          window.location.href = "/client/post-job";
        } else {
          notification.success({
            message: "Thành công",
            description: "Cập nhật công việc thành công",
          });
        }
      } else {
        console.log("submitDta ", submitData);
        const response = await api.post("/v1/jobs/createJob", submitData);
        if (data.statusJob == StatusJob.DRAFT) {
          notification.success({
            message: "Thành công",
            description: "Lưu nháp thành công",
          });
        } else {
          notification.success({
            message: "Thành công",
            description: "Thêm công việc thành công",
          });
          console.log(response);
          api.post(`/v1/jobs/notify_by_email?jobId=${response.data.jobId}`);
          navigate(`/jobs/${response.data.jobId}`);
        }

        setJobData({
          title: "",
          description: "",
          scope: "",
          hourWork: null,
          duration: 30,
          jobOpportunity: false,
          fromPrice: 0,
          toPrice: 0,
          typePrice: "USD",
          typePayment: TypePayment.BANK,
          statusJob: StatusJob.OPEN,
          clientId: userInfo.clientId,
          categoryId: 0,
          skillIds: [],
        });
        setSelectedSkills([]);
      }
    } catch (error: any) {
      // notification.error({
      //     message: 'Lỗi',
      //     description: isEditMode ? 'Không thể cập nhật công việc' : 'Không đủ điều kiện để đăng công việc mới.\nVui lòng kiểm tra lại gói dịch vụ của bạn.'
      // });

      notification.error({
        message: "Lỗi",
        description:
          error?.response?.data?.message ||
          (isEditMode
            ? "Không thể cập nhật công việc"
            : "Không đủ điều kiện để đăng công việc mới.\nVui lòng kiểm tra lại gói dịch vụ của bạn."),
      });
      console.error("Error handling job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              {isEditMode ? "Cập nhật công việc" : "Thông tin công việc"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tiêu đề công việc *
                </label>
                <Input
                  placeholder="Nhập tiêu đề công việc"
                  value={jobData.title}
                  onChange={(e) =>
                    setJobData({ ...jobData, title: e.target.value })
                  }
                  required
                />
              </div>

              {/* {isEditMode && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Trạng thái *
                                    </label>
                                    <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={statusOpen}
                                                className="w-full justify-between"
                                            >
                                                {jobData.statusJob || "Chọn trạng thái"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandList>
                                                    {Object.values(StatusJob).map((status) => (
                                                        <CommandItem
                                                            key={status}
                                                            value={status}
                                                            onSelect={() => {
                                                                setJobData({ ...jobData, statusJob: status });
                                                                setStatusOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={`mr-2 h-4 w-4 ${jobData.statusJob === status ? "opacity-100" : "opacity-0"
                                                                    }`}
                                                            />
                                                            {status}
                                                        </CommandItem>
                                                    ))}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )} */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Danh mục *
                  </label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className="w-full justify-between"
                      >
                        {jobData.categoryId
                          ? categories.find(
                              (category) => category.id === jobData.categoryId
                            )?.categoryTitle
                          : "Chọn danh mục"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command className="w-full">
                        <CommandInput
                          placeholder="Tìm danh mục..."
                          value={newCategory}
                          onValueChange={setNewCategory}
                          className="w-full"
                        />
                        <CommandList className="w-full">
                          <CommandEmpty>
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={handleCreateCategory}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Thêm "{newCategory}"
                            </Button>
                          </CommandEmpty>
                          <CommandGroup className="w-full">
                            {categories.map((category) => (
                              <CommandItem
                                key={category.id}
                                value={category.categoryTitle}
                                className="w-full"
                                onSelect={() => {
                                  setJobData({
                                    ...jobData,
                                    categoryId: category.id,
                                  });
                                  setCategoryOpen(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    jobData.categoryId === category.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {category.categoryTitle}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phạm vi công việc *
                  </label>
                  <Popover open={scopeOpen} onOpenChange={setScopeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={scopeOpen}
                        className="w-full justify-between"
                      >
                        {(jobData.scope == "SMALL"
                          ? "Nhỏ"
                          : jobData.scope == "MEDIUM"
                          ? "Vừa"
                          : "Lớn") || "Chọn phạm vi"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command className="w-full">
                        <CommandList className="w-full">
                          {Object.values(ScopeJob).map((scope) => (
                            <CommandItem
                              key={scope}
                              value={scope}
                              className="w-full"
                              onSelect={() => {
                                setJobData({ ...jobData, scope });
                                setScopeOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  jobData.scope === scope
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {scope === ScopeJob.SMALL
                                ? "Nhỏ"
                                : scope === ScopeJob.MEDIUM
                                ? "Vừa"
                                : "Lớn"}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả</label>
                <Textarea
                  placeholder="Mô tả chi tiết yêu cầu công việc"
                  value={jobData.description}
                  onChange={(e) =>
                    setJobData({ ...jobData, description: e.target.value })
                  }
                  required
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số giờ làm việc
                  </label>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-muted-foreground mr-2" />
                    <Input
                      type="number"
                      min="0"
                      placeholder=""
                      value={jobData.hourWork || ""}
                      onChange={(e) =>
                        setJobData({
                          ...jobData,
                          hourWork: Math.max(0, parseFloat(e.target.value)),
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hình thức thanh toán *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {jobData.typePayment === TypePayment.HOURLY
                          ? "Theo giờ"
                          : "Theo dự án"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command className="w-full">
                        <CommandList className="w-full">
                          <CommandItem
                            className="w-full"
                            onSelect={() =>
                              setJobData({
                                ...jobData,
                                typePayment: TypePayment.HOURLY,
                              })
                            }
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                jobData.typePayment === TypePayment.HOURLY
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            Theo giờ
                          </CommandItem>
                          <CommandItem
                            className="w-full"
                            onSelect={() =>
                              setJobData({
                                ...jobData,
                                typePayment: TypePayment.FULL,
                              })
                            }
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                jobData.typePayment === TypePayment.FULL
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            Theo dự án
                          </CommandItem>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ngân sách từ *
                  </label>
                  <div className="flex items-center">
                    {/* <DollarSign className="w-5 h-5 text-muted-foreground mr-2" /> */}
                    VND
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={jobData.fromPrice || ""}
                      onChange={(e) =>
                        setJobData({
                          ...jobData,
                          fromPrice: Math.max(0, parseFloat(e.target.value)),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Đến *
                  </label>
                  <div className="flex items-center">
                    {/* <DollarSign className="w-5 h-5 text-muted-foreground mr-2" /> */}
                    VND
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={jobData.toPrice || ""}
                      onChange={(e) =>
                        setJobData({
                          ...jobData,
                          toPrice: Math.max(0, parseFloat(e.target.value)),
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="jobOpportunity"
                  checked={jobData.jobOpportunity}
                  onCheckedChange={(checked) =>
                    setJobData({
                      ...jobData,
                      jobOpportunity: checked as boolean,
                    })
                  }
                />
                <label
                  htmlFor="jobOpportunity"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Cơ hội hợp tác dài hạn
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Kỹ năng yêu cầu *</h2>
            <Popover open={skillOpen} onOpenChange={setSkillOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={skillOpen}
                  className="w-full justify-between"
                >
                  Thêm kỹ năng
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput
                    placeholder="Tìm kỹ năng..."
                    value={newSkill}
                    onValueChange={setNewSkill}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleCreateSkill}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm "{newSkill}"
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
                      {skills.map((skill) => (
                        <CommandItem
                          key={skill.id}
                          value={skill.skillName}
                          onSelect={() => {
                            setSelectedSkills((prev) =>
                              prev.includes(skill.id)
                                ? prev.filter((id) => id !== skill.id)
                                : [...prev, skill.id]
                            );
                            setSkillOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              selectedSkills.includes(skill.id)
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                          {skill.skillName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-2 mt-4">
              {selectedSkills.map((skillId) => {
                const skill = skills.find((s) => s.id === skillId);
                return skill ? (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() =>
                      setSelectedSkills((prev) =>
                        prev.filter((id) => id !== skill.id)
                      )
                    }
                  >
                    {skill.skillName}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ) : null;
              })}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            {isEditMode && jobData.statusJob == StatusJob.DRAFT && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-red-500 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit({ ...jobData, statusJob: StatusJob.CLOSED });
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang xóa bản nháp..." : "Xóa bản nháp"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit({ ...jobData, statusJob: StatusJob.DRAFT });
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang lưu..." : "Tiếp tục lưu nháp"}
                </Button>
              </>
            )}
            {!isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit({ ...jobData, statusJob: StatusJob.DRAFT });
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu nháp"}
              </Button>
            )}

            <Button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit({ ...jobData, statusJob: StatusJob.OPEN });
              }}
            >
              {isSubmitting
                ? "Đang xử lý..."
                : isEditMode && jobData.statusJob != StatusJob.DRAFT
                ? "Cập nhật"
                : "Đăng tin"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostJob;
