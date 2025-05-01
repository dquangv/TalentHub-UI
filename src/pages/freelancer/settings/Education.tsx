import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Plus,
  GraduationCap,
  Trash2,
  Loader2,
  CalendarIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/api/axiosConfig";
import { notification } from "antd";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import AutofillInput from "@/components/AutofillInput";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingEffect from "@/components/ui/LoadingEffect";

interface Education {
  id: number;
  startDate: string;
  endDate: string;
  description: string;
  school: School;
  degree: Degree;
  major: Major;
  freelancer?: any;
}

interface School {
  id: number;
  schoolName: string;
}

interface Degree {
  id: number;
  degreeTitle: string;
}

interface Major {
  id: number;
  majorName: string;
}

interface EducationForm {
  id: number;
  startDate: string;
  endDate: string;
  description: string;
  schoolId: number;
  schoolName: string;
  degreeId: number;
  degreeTitle: string;
  majorId: number;
  majorName: string;
}

const Education = () => {
  const { t } = useLanguage();
  const [education, setEducation] = useState<EducationForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState(true);
  const [savingIds, setSavingIds] = useState<number[]>([]);
  const [currentlyStudying, setCurrentlyStudying] = useState<
    Record<number, boolean>
  >({});
  const freelancerId =
    JSON.parse(localStorage.getItem("userInfo") || "{}").freelancerId || 1;

  useEffect(() => {
    const fetchEducationData = async () => {
      setFetching(true);
      try {
        const educationResponse = await api.get(
          `/v1/educations/freelancer/${freelancerId}`
        );
        if (educationResponse.status === 200) {
          const educationData = educationResponse.data.map(
            (edu: Education) => ({
              id: edu.id,
              startDate: edu.startDate,
              endDate: edu.endDate,
              description: edu.description,
              schoolId: edu.school.id,
              schoolName: edu.school.schoolName,
              degreeId: edu.degree.id,
              degreeTitle: edu.degree.degreeTitle,
              majorId: edu.major.id,
              majorName: edu.major.majorName,
            })
          );
          setEducation(educationData);

          const studyingState: Record<number, boolean> = {};
          educationData.forEach((edu) => {
            studyingState[edu.id] = edu.endDate === null;
          });
          setCurrentlyStudying(studyingState);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải dữ liệu học vấn. Vui lòng thử lại sau.",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchEducationData();
  }, [freelancerId]);
  const formatDateForDisplay = (dateString: string | null) => {
    if (!dateString) return "Hiện tại";
    try {
      const date = new Date(dateString);
      return format(date, "MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const formatDateForApi = (date: Date) => {
    return date.toISOString();
  };

  const addEducation = useCallback(() => {
    const newId = Date.now();
    const newEducation = {
      id: newId,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      description: "",
      schoolId: 0,
      schoolName: "",
      degreeId: 0,
      degreeTitle: "",
      majorId: 0,
      majorName: "",
    };
    setEducation((prevEducation) => [...prevEducation, newEducation]);
    setCurrentlyStudying((prev) => ({ ...prev, [newId]: false }));
  }, []);

  const removeEducation = useCallback(
    async (id: number) => {
      const existingRecord = education.find(
        (edu) => edu.id === id && edu.id < Date.now() - 86400000
      );

      if (existingRecord) {
        try {
          setSavingIds((prev) => [...prev, id]);
          const response = await api.delete(`/v1/educations/${id}`);
          if (response.status === 204) {
            notification.success({
              message: "Thành công",
              description: "Xóa thông tin học vấn thành công!",
            });
            setEducation((prevEducation) =>
              prevEducation.filter((edu) => edu.id !== id)
            );
          }
        } catch (error) {
          console.error("Error deleting education:", error);
          notification.error({
            message: "Lỗi",
            description:
              "Không thể xóa thông tin học vấn. Vui lòng thử lại sau.",
          });
        } finally {
          setSavingIds((prev) => prev.filter((itemId) => itemId !== id));
        }
      } else {
        setEducation((prevEducation) =>
          prevEducation.filter((edu) => edu.id !== id)
        );
      }
    },
    [education]
  );

  const updateEducationField = useCallback(
    (id: number, field: string, value: any) => {
      setEducation((prevEducation) =>
        prevEducation.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu
        )
      );

      console.log(`Updated ${field} to ${value} for education ${id}`);
    },
    []
  );
  const handleCurrentlyStudyingChange = useCallback(
    (id: number, checked: boolean) => {
      setCurrentlyStudying((prev) => ({ ...prev, [id]: checked }));
      if (checked) {
        updateEducationField(id, "endDate", null);
      } else {
        updateEducationField(id, "endDate", new Date().toISOString());
      }
    },
    [updateEducationField]
  );
  const handleAutofillChange = useCallback(
    (
      id: number,
      field: "school" | "degree" | "major",
      itemId: number,
      itemName: string
    ) => {
      console.log(
        `Autofill change for ${field}: ID=${itemId}, Name=${itemName}`
      );

      setEducation((prevEducation) => {
        return prevEducation.map((edu) => {
          if (edu.id === id) {
            const updatedEdu = { ...edu };

            if (field === "school") {
              updatedEdu.schoolId = itemId;
              updatedEdu.schoolName = itemName;
            } else if (field === "degree") {
              updatedEdu.degreeId = itemId;
              updatedEdu.degreeTitle = itemName;
            } else if (field === "major") {
              updatedEdu.majorId = itemId;
              updatedEdu.majorName = itemName;
            }

            console.log("Updated education entry:", updatedEdu);
            return updatedEdu;
          }
          return edu;
        });
      });
    },
    []
  );

  const saveEducation = useCallback(
    async (eduId: number) => {
      try {
        const edu = education.find((e) => e.id === eduId);

        if (!edu) {
          console.error(`Could not find education with ID ${eduId} to save`);
          notification.error({
            message: "Lỗi",
            description:
              "Không thể lưu thông tin học vấn. Dữ liệu không được tìm thấy.",
          });
          return;
        }

        setSavingIds((prev) => [...prev, eduId]);

        console.log("Saving education data:", edu);

        const educationData = {
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
          schoolId: edu.schoolId,
          degreeId: edu.degreeId,
          majorId: edu.majorId,
          freelancerId: freelancerId,
        };

        console.log("Payload being sent to server:", educationData);

        let response;
        if (edu.id < Date.now() - 86400000) {
          response = await api.put(`/v1/educations/${edu.id}`, educationData);
        } else {
          response = await api.post("/v1/educations", educationData);
        }

        if (response.status === 200 || response.status === 201) {
          notification.success({
            message: "Thành công",
            description: "Lưu thông tin học vấn thành công!",
          });
          console.log("Server response after saving:", response.data);
          if (edu.id >= Date.now() - 86400000 && response.data) {
            let newId;
            if (response.data.data && response.data.data.id) {
              newId = response.data.data.id;
            } else if (response.data.id) {
              newId = response.data.id;
            }

            if (newId) {
              console.log("Updated education ID from", edu.id, "to", newId);

              setEducation((prevEducation) =>
                prevEducation.map((e) =>
                  e.id === edu.id ? { ...e, id: newId } : e
                )
              );
            }
          }
        }
      } catch (error) {
        console.error("Error saving education:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể lưu thông tin học vấn. Vui lòng thử lại sau.",
        });
      } finally {
        setSavingIds((prev) => prev.filter((id) => id !== eduId));
      }
    },
    [education, freelancerId]
  );

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingEffect />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {education.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            Chưa có thông tin học vấn
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Bạn chưa có thông tin học vấn nào. Hãy thêm thông tin học vấn để
            hoàn thiện hồ sơ của bạn.
          </p>
        </div>
      )}
      {education.map((edu, index) => {
        const isSaving = savingIds.includes(edu.id);

        return (
          <FadeInWhenVisible key={edu.id} delay={index * 0.1}>
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">{t("Education")}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => saveEducation(edu.id)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeEducation(edu.id)}
                    disabled={isSaving}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("School")}</label>
                  <AutofillInput
                    entityType="school"
                    value={edu.schoolId}
                    initialText={edu.schoolName}
                    onChange={(id, name) =>
                      handleAutofillChange(edu.id, "school", id, name)
                    }
                    placeholder="Chọn hoặc nhập tên trường"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Certificate")}
                  </label>
                  <AutofillInput
                    entityType="degree"
                    value={edu.degreeId}
                    initialText={edu.degreeTitle}
                    onChange={(id, name) =>
                      handleAutofillChange(edu.id, "degree", id, name)
                    }
                    placeholder="Chọn hoặc nhập loại bằng cấp"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Chuyên ngành</label>
                  <AutofillInput
                    entityType="major"
                    value={edu.majorId}
                    initialText={edu.majorName}
                    onChange={(id, name) =>
                      handleAutofillChange(edu.id, "major", id, name)
                    }
                    placeholder="Chọn hoặc nhập tên ngành học"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Theyearbegins")}
                  </label>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                          disabled={isSaving}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {edu.startDate
                            ? formatDateForDisplay(edu.startDate)
                            : "Chọn ngày bắt đầu"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            edu.startDate ? new Date(edu.startDate) : undefined
                          }
                          onSelect={(date) =>
                            date &&
                            updateEducationField(
                              edu.id,
                              "startDate",
                              formatDateForApi(date)
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Theyearends")}
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`currently-studying-${edu.id}`}
                        checked={currentlyStudying[edu.id] || false}
                        onCheckedChange={(checked) =>
                          handleCurrentlyStudyingChange(
                            edu.id,
                            checked as boolean
                          )
                        }
                        disabled={isSaving}
                      />
                      <label
                        htmlFor={`currently-studying-${edu.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Đang học
                      </label>
                    </div>

                    {!currentlyStudying[edu.id] && (
                      <div className="flex w-full max-w-sm items-center space-x-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className="w-full justify-start text-left font-normal"
                              disabled={isSaving || currentlyStudying[edu.id]}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {edu.endDate
                                ? formatDateForDisplay(edu.endDate)
                                : "Chọn ngày kết thúc"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                edu.endDate ? new Date(edu.endDate) : undefined
                              }
                              onSelect={(date) =>
                                date &&
                                updateEducationField(
                                  edu.id,
                                  "endDate",
                                  formatDateForApi(date)
                                )
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    {currentlyStudying[edu.id] && (
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                        disabled={true}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Hiện tại
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">{t("Describe")}</label>
                  <Textarea
                    value={edu.description}
                    onChange={(e) =>
                      updateEducationField(
                        edu.id,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Mô tả chi tiết về chương trình học và thành tích"
                    rows={4}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </Card>
          </FadeInWhenVisible>
        );
      })}

      <FadeInWhenVisible delay={education.length * 0.1}>
        <Button
          variant="outline"
          className="w-full"
          onClick={addEducation}
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("Moreeducation")}
        </Button>
      </FadeInWhenVisible>
    </div>
  );
};

export default Education;
