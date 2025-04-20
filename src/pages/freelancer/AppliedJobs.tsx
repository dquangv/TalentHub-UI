import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Filter,
  Clock,
  DollarSign,
  Briefcase,
  Calendar,
  Send,
  Star,
  User,
} from "lucide-react";
import api from "@/api/axiosConfig";
import { notification } from "antd";

const AppliedJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const navigate = useNavigate();

  const fetchAppliedJobs = async () => {
    const data = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (!data?.freelancerId) {
      navigate("/login");
      return;
    }
    try {
      const response = await api.get(
        `/v1/jobs/ApplyJobs/${data?.freelancerId}`
      );
      setAppliedJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "interviewing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Applied":
        return "Đã ứng tuyển";
      case "Rejected":
        return "Bị từ chối";
      case "Approved":
        return "Được chấp thuận";
      // case 'cancelled':
      //   return 'Đã hủy';
      // case 'Completed':
      //   return 'Hoàn thành';
      default:
        return status;
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedJobId) return;

    const reviewData = {
      rating: rating,
      note: note,
    };

    try {
      const response = await api.post(
        `/v1/jobs/${selectedJobId}/client/review`,
        reviewData
      );
      notification.success({
        message: "Thành công",
        description: "Đánh giá đã được gửi thành công",
      });
      setReviewDialogOpen(false);
      setRating(0);
      setNote("");
      fetchAppliedJobs();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể gửi đánh giá",
      });
      console.error("Error submitting review:", error);
    }
  };

  const StarRating = ({
    rating,
    setRating,
  }: {
    rating: number;
    setRating: (value: number) => void;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  const filteredJobs = appliedJobs.filter((job) => {
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || job.status?.toLowerCase() == statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Công việc đã ứng tuyển</h1>
            <p className="text-muted-foreground">
              Theo dõi trạng thái ứng tuyển và quản lý các công việc bạn đã nộp
              hồ sơ
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Search and Filter */}
        <FadeInWhenVisible delay={0.2}>
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm công việc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="applied">Đã ứng tuyển</SelectItem>
                  <SelectItem value="rejected">Bị từ chối</SelectItem>
                  <SelectItem value="approved">Được chấp thuận</SelectItem>
                  {/* <SelectItem value="cancelled">Đã hủy</SelectItem> */}
                </SelectContent>
              </Select>
              {/* <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button> */}
            </div>
          </Card>
        </FadeInWhenVisible>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs?.map((job, index) => (
              <FadeInWhenVisible key={job.id} delay={index * 0.1}>
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Link to={`/jobs/${job.id}`} className="hover:underline">
                          <h3 className="text-xl font-semibold">{job.jobTitle}</h3>
                        </Link>
                      </div>

                      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.companyName}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {job.hourWork} giờ
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.fromPrice} - {job.toPrice} VND
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Đã ứng tuyển: {job.createdTimeFormatted || "Không xác định"}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skillNames?.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {job.status === "interviewing" && (
                          <Button variant="outline">Xem lịch phỏng vấn</Button>
                        )}
                        {job.status === "Approved" && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setReviewDialogOpen(true);
                            }}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Đánh giá
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {getStatusText(job.status)}
                      </Badge>
                      <Button asChild>
                        <Link to={`/jobs/${job.id}`}>Xem chi tiết</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </FadeInWhenVisible>
            ))
          ) : (
            <div className="text-center py-12">
              Không có công việc đã ứng tuyển nào.
            </div>
          )}
        </div>
        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <FadeInWhenVisible>
            <Card className="p-12 text-center">
              <Send className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Chưa có công việc đã ứng tuyển
              </h3>
              <p className="text-muted-foreground mb-6">
                Bạn chưa ứng tuyển vào công việc nào. Hãy bắt đầu tìm kiếm và
                ứng tuyển vào những công việc phù hợp với bạn.
              </p>
              <Button asChild>
                <Link to="/jobs">Tìm việc ngay</Link>
              </Button>
            </Card>
          </FadeInWhenVisible>
        )}

        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Đánh giá công việc:{" "}
                {appliedJobs.find((job) => job.id === selectedJobId)?.jobTitle}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Điểm đánh giá (1-5 sao)
                </label>
                <StarRating rating={rating} setRating={setRating} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ghi chú
                </label>
                <Textarea
                  placeholder="Nhập ghi chú về công việc"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleReviewSubmit}>Gửi đánh giá</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AppliedJobs;
