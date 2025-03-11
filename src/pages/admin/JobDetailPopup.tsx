import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Flag,
  X,
} from "lucide-react";
import api from "@/api/axiosConfig";

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

interface JobDetailPopupProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailPopup: React.FC<JobDetailPopupProps> = ({
  jobId,
  isOpen,
  onClose,
}) => {
  const [job, setJob] = useState<JobDetailResponse | null>(null);
  const [error, setError] = useState("");
  const [isBanned, setIsBanned] = useState(false); 

  const fetchJobDetail = async () => {
    try {
      const response = await api.get(`/v1/jobs/detail-job/${jobId}`);
      setJob(response.data);
      setIsBanned(response.data.status === "Bị cấm"); 
      setError("");
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError("Có lỗi xảy ra khi tải thông tin công việc");
    }
  };

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetail();
    }
  }, [jobId, isOpen]);

  if (!isOpen) return null;

  const handleHide = async () => {
    try {
      await api.post(`/v1/jobs/admin/ban?jobId=${jobId}`);
      setIsBanned(true); // Update isBanned to true after successful ban
    } catch (error) {
      console.error("Error banning job:", error);
    }
  };

  const handleUnHide = async () => {
    try {
      await api.post(`/v1/jobs/admin/unban?jobId=${jobId}`);
      setIsBanned(false); // Update isBanned to false after successful unban
    } catch (error) {
      console.error("Error unbanning job:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-[10000] w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-xl">
        <ScrollArea className="h-full max-h-[90vh]">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Chi tiết công việc</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error ? (
              <div className="text-center text-destructive p-4">{error}</div>
            ) : !job ? (
              <div className="text-center p-4">Đang tải...</div>
            ) : (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                      <div className="flex flex-wrap gap-4 text-muted-foreground">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.companyName}
                        </div>
                        {job.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {job.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>
                          {job.fromPrice.toLocaleString()} -{" "}
                          {job.toPrice.toLocaleString()} VNĐ
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{job.hourWork} giờ/tuần</span>
                      </div>
                      {job.deadline && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>
                            Hạn chót:{" "}
                            {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {job.experience && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>Kinh nghiệm: {job.experience}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Kỹ năng yêu cầu</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skillNames.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Mô tả công việc</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {job.description}
                      </p>
                    </div>
                    <Button
                      onClick={isBanned ? handleUnHide : handleHide}
                      className={
                        !isBanned
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      } 
                    >
                      {isBanned ? "Mở khóa bài đăng" : "Khóa bài đăng"}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default JobDetailPopup;
