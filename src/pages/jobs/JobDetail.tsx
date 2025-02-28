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
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  User,
} from "lucide-react";
import api from "@/api/axiosConfig";
import { notification } from "antd";

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
  const [error, setError] = useState("");
  const [isClient, setClient] = useState(null);
  const [jobFreelancerInfo, setJobFreelancerInfo] =
    useState<JobFreelancerInfo | null>(null);
  const navigate = useNavigate();
  console.log("data ", job);
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
          setError("Có lỗi xảy ra");
        }
        setJobFreelancerInfo(response?.data || null);
      };

      handleViewJob();
    }
  }, []);

  const handleApplyJob = async () => {
    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!data?.freelancerId) {
      navigate("/login");
    }
    const response = await api.post("/v1/jobs/apply", {
      freelancerId: data?.freelancerId,
      jobId: Number(id),
    });
    if (response.status !== 200) {
      notification.error({
        message: "Lỗi dữ liệu",
        description: response.data.message || "Dữ liệu không hợp lệ",
      });

      setError("Có lỗi xảy ra");
    }
    notification.info({
      message: "Thông báo",
      description: "Ứng tuyển thành công. Vui lòng chờ để được chấp nhận",
    });
    setJobFreelancerInfo(response?.data || null);
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

      setError("Có lỗi xảy ra");
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
      alert("có lỗi");

      setError("Có lỗi xảy ra");
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
                </div>
                {isClient == null && (
                  <div className="flex flex-col gap-2">
                    {/* Apply button */}
                    <Button
                      size="lg"
                      onClick={handleApplyJob}
                      disabled={jobFreelancerInfo?.status != null}
                    >
                      {!jobFreelancerInfo?.status
                        ? "Ứng tuyển ngay"
                        : "Ứng tuyển"}
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
                      {job.fromPrice} - {job.toPrice} VND
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
                    <p className="font-semibold">{job.hourWork} giờ/tuần</p>
                  </div>
                </div>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kinh nghiệm</p>
                    <p className="font-semibold">
                      {!job.experience ? "Không yêu cầu" : job.experience}
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
                      Số lượng ứng viên
                    </p>
                    <p className="font-semibold">{job?.totalApplicant || 0}</p>
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
                    onClick={handleApplyJob}
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
    </div>
  );
};

export default JobDetail;
