import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Clock,
  DollarSign,
  Briefcase,
  Calendar,
  Users,
  User,
  Flag,
  FileText,
  CheckCircle,
  Loader2,
  Plus,
} from "lucide-react";
import api from "@/api/axiosConfig";
import cvService, { CV } from "@/api/cvService";
import { notification } from "antd";
import ReportDialog from "@/components/report/ReportDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobDetailResponse {
  title: string;
  companyName: string;
  location?: string;
  type: string;
  fromPrice: number;
  toPrice: number;
  hourWork: number;
  description: string;
  skillNames: string[];
  experience?: string;
  deadline?: string;
  totalApplicants?: number;
  duration?: number;
  scope?: string;
  jobOpportunity?: boolean;
}

interface JobFreelancerInfo {
  id: number;
  status: string;
  jobId: number;
  freelancerId: number;
  saved: boolean;
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetailResponse | null>(null);
  const [isClient, setClient] = useState(null);
  const [jobFreelancerInfo, setJobFreelancerInfo] =
    useState<JobFreelancerInfo | null>(null);
  const [cvs, setCVs] = useState<CV[]>([]);
  const [cvPreviews, setCvPreviews] = useState<{ [key: number]: string }>({});
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const freelancerId = JSON.parse(
    localStorage.getItem("userInfo") || "{}"
  ).freelancerId;

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await api.get(`/v1/jobs/detail-job/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetail();
  }, [id]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (data.clientId) {
      setClient(data.clientId);
    } else {
      if (!data?.freelancerId) {
        navigate("/login");
      }

      const handleViewJob = async () => {
        const response = await api.post("/v1/jobs/view", {
          freelancerId: data?.freelancerId,
          jobId: Number(id),
        });
        if (response.status !== 200) {
          notification.error({
            message: "Lỗi",
            description: response.message || "Dữ liệu không hợp lệ",
          });
        }
        setJobFreelancerInfo(response?.data || null);
      };

      handleViewJob();
    }
  }, []);

  const fetchCVs = async () => {
    try {
      const response = await cvService.getCVsByFreelancerId(freelancerId);
      if (response.data) {
        setCVs(response.data);

        const previewsObj: { [key: number]: string } = {};
        for (const cv of response.data) {
          try {
            const previewUrl = await cvService.previewCV(cv.url);
            previewsObj[cv.id] = previewUrl;
          } catch (error) {
            console.error(`Error creating preview for CV ${cv.id}:`, error);
          }
        }
        setCvPreviews(previewsObj);
      }
    } catch (error) {
      console.error("Error loading CV list:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách CV. Vui lòng thử lại sau.",
      });
    }
  };

  const handleOpenApplyDialog = () => {
    fetchCVs();
    setIsApplyDialogOpen(true);
  };

  const handleUploadCV = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      notification.error({
        message: "Lỗi",
        description: "Chỉ cho phép upload file PDF",
      });
      return;
    }

    try {
      setUploading(true);
      await cvService.uploadCV(file, freelancerId);
      notification.success({
        message: "Thành công",
        description: "Upload CV thành công",
      });
      await fetchCVs();
    } catch (error) {
      console.error("Error uploading CV:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể upload CV. Vui lòng thử lại sau.",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const handlePreviewCV = (cv: CV) => {
    const previewUrl = cvPreviews[cv.id];
  };
  const handleApplyJob = async () => {
    if (!selectedCvId) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng chọn CV",
      });
      return;
    }

    try {
      const response = await api.post("/v1/jobs/apply", {
        jobId: Number(id),
        freelancerId: freelancerId,
        cvId: selectedCvId,
      });

      if (response.status !== 200) {
        notification.error({
          message: "Lỗi dữ liệu",
          description: response.data.message || "Dữ liệu không hợp lệ",
        });
        notification.error({
          message: "Lỗi dữ liệu",
          description: response.message || "Dữ liệu không hợp lệ",
        });
        return;
      }

      notification.info({
        message: "Thông báo",
        description: "Ứng tuyển thành công. Vui lòng chờ để được chấp nhận",
      });

      setJobFreelancerInfo(response?.data || null);
      setIsApplyDialogOpen(false);
    } catch (error) {
      console.error("Error applying for job:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể ứng tuyển. Vui lòng thử lại sau.",
      });
    }
  };

  const handleSaveJob = async () => {
    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!data?.freelancerId) {
      navigate("/login");
    }
    const response = await api.post("/v1/jobs/save", {
      freelancerId: data?.freelancerId,
      jobId: Number(id),
    });
    if (response.status !== 200) {
      notification.error({
        message: "Lỗi dữ liệu",
        description: response.message || "Dữ liệu không hợp lệ",
      });
    }
    notification.info({
      message: "Thông báo",
      description: "Lưu việc thành công",
    });
    setJobFreelancerInfo(response?.data || null);
  };

  const handleUnSaveJob = async () => {
    const response = await api.post("/v1/jobs/unsave", {
      freelancerId: jobFreelancerInfo?.freelancerId,
      jobId: Number(id),
    });
    if (response.status !== 200) {
      notification.error({
        message: "Lỗi dữ liệu",
        description: response.message || "Dữ liệu không hợp lệ",
      });
    }
    notification.info({
      message: "Thông báo",
      description: "Hủy lưu việc thành công",
    });
    setJobFreelancerInfo(response?.data || null);
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <FadeInWhenVisible>
            <Card className="p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.companyName}
                    </div>
                    <Link to={`/client/${job.clientId}`}>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {job.firstName + " " + job.lastName}
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">Mức độ dự án: {job.scope}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">{!job.jobOpportunity ? "" : "Cơ hội hợp tác lâu dài"}</Badge>
                  </div>
                </div>
                {isClient == null && (
                  <div className="flex flex-col gap-2">
                    {/* Apply button */}
                    <Button
                      size="lg"
                      onClick={handleOpenApplyDialog}
                      disabled={jobFreelancerInfo?.status != null}
                    >
                      {!jobFreelancerInfo?.status
                        ? "Ứng tuyển ngay"
                        : "Đã ứng tuyển"}
                    </Button>

                    {/* Save/Unsave job button */}
                    <Button
                      variant="outline"
                      onClick={
                        jobFreelancerInfo?.saved
                          ? handleUnSaveJob
                          : handleSaveJob
                      }
                    >
                      {jobFreelancerInfo?.saved ? "Hủy lưu" : "Lưu việc làm"}
                    </Button>
                    <ReportDialog
                      itemId={String(id)}
                      itemType="job"
                      itemTitle={job.title}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-muted-foreground w-full d-flex gap-2"
                      >
                        <Flag className="w-4 h-4" />
                        <div> Báo cáo</div>
                      </Button>
                    </ReportDialog>
                  </div>
                )}
              </div>
            </Card>
          </FadeInWhenVisible>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FadeInWhenVisible delay={0.1}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngân sách</p>
                    <p className="font-semibold">
                      {new Intl.NumberFormat("vi-VN").format(job.fromPrice)} -{" "}
                      {new Intl.NumberFormat("vi-VN").format(job.toPrice)} VND
                    </p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Số giờ làm việc
                    </p>
                    <p className="font-semibold">{job.hourWork} giờ/ngày</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Thời hạn</p>
                    <p className="font-semibold">
                      {!job.duration ? "Không yêu cầu" : job.duration} ngày
                    </p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.4}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Đã ứng tuyển
                    </p>
                    <p className="font-semibold">{job?.totalApplicants || 0}</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>
          </div>

          {/* Description Section */}
          <FadeInWhenVisible delay={0.5}>
            <Card className="p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Mô tả công việc</h2>
              <p className="text-muted-foreground mb-6">{job.description}</p>

              <h3 className="font-semibold mb-3">Kỹ năng yêu cầu:</h3>
              <div className="flex flex-wrap gap-2">
                {job?.skillNames?.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              {isClient == null && (
                <div className="text-center">
                  <Button
                    size="lg"
                    className="px-8 mt-8 w-full"
                    onClick={handleOpenApplyDialog}
                    disabled={jobFreelancerInfo?.status != null}
                  >
                    {!jobFreelancerInfo?.status
                      ? "Ứng tuyển ngay"
                      : jobFreelancerInfo?.status}
                  </Button>
                </div>
              )}
            </Card>
          </FadeInWhenVisible>
        </div>
      </div>

      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="w-full max-w-[1000px] max-h-[90vh] p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            <div className="col-span-1 p-6 border-r overflow-y-auto max-h-[80vh]">
              <DialogHeader className="mb-4">
                <DialogTitle>Chọn CV để ứng tuyển</DialogTitle>
                <DialogDescription>
                  Chọn một CV để gửi kèm với đơn ứng tuyển công việc {job.title}
                </DialogDescription>
              </DialogHeader>

              {cvs.length === 0 ? (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Chưa có CV nào</h3>
                  <p className="text-gray-500 mb-6">
                    Bạn chưa có CV nào trong hệ thống. Hãy tải lên CV để ứng
                    tuyển.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cvs.map((cv) => (
                    <div
                      key={cv.id}
                      className={`
                  border rounded-lg p-4 cursor-pointer transition-all flex justify-between items-center
                  ${
                    selectedCvId === cv.id
                      ? "border-primary bg-primary/10"
                      : "hover:bg-gray-50"
                  }
                `}
                      onClick={() => setSelectedCvId(cv.id)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="font-medium truncate max-w-[200px]">
                          {cv.title || "CV không đặt tên"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewCV(cv);
                          }}
                        ></Button>
                        {selectedCvId === cv.id && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <input
                  type="file"
                  id="cv-upload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleUploadCV}
                  disabled={uploading}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("cv-upload")?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Tải CV mới
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="col-span-2 p-6">
              <div className="h-[70vh] border rounded-lg overflow-hidden">
                {selectedCvId ? (
                  cvPreviews[selectedCvId] ? (
                    <iframe
                      src={cvPreviews[selectedCvId]}
                      width="100%"
                      height="100%"
                      style={{
                        border: "none",
                        borderRadius: "8px",
                      }}
                      title={`CV Preview: ${
                        cvs.find((cv) => cv.id === selectedCvId)?.title ||
                        "Untitled"
                      }`}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                      <span>Đang tải preview...</span>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    Chọn một CV để xem trước
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsApplyDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleApplyJob} disabled={!selectedCvId}>
                  Ứng tuyển
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetail;
