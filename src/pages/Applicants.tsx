import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Star,
  Download,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react";
import api from "@/api/axiosConfig";
import cvService from "@/api/cvService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useParams, useNavigate } from "react-router-dom";
import { notification } from "antd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

const Applicants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    Applied: 0,
    Viewed: 0,
    InProgress: 0,
    Completed: 0,
    Cancelled: 0,
  });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/v1/jobs/applicants/${id}`);
      setApplicants(response.data);

      const newStats = {
        total: response.data.length,
        Applied: response.data.filter((a) => a.status === "Applied").length,
        Viewed: response.data.filter((a) => a.status === "Viewed").length,
        InProgress: response.data.filter((a) => a.status === "In Progress").length,
        Completed: response.data.filter((a) => a.status === "Completed").length,
        Cancelled: response.data.filter((a) => a.status === "Cancelled").length,
      };
      setStats(newStats);
      setError(null);
    } catch (err) {
      setError("Error fetching applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const formatAppliedDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    // Format: hh:mm dd/mm/yyyy
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Applied":
        return "Đã ứng tuyển";
      case "Viewed":
        return "Đã xem";
      case "In Progress":
        return "Đang thực hiện";
      case "Completed":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Applied":
        return "secondary";
      case "Viewed":
        return "default";
      case "In Progress":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const handleViewCV = async (applicant) => {
    if (!applicant.cvURL) {
      notification.info({
        message: "Thông báo",
        description: "Ứng viên chưa có CV",
      });
      return;
    }

    setCurrentApplicant(applicant);
    setPreviewLoading(true);
    setPreviewVisible(true);

    try {
      const previewUrl = await cvService.previewCV(applicant.cvURL);
      setCurrentPdfUrl(previewUrl);
    } catch (error) {
      console.error("Error loading CV:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải CV. Vui lòng thử lại sau.",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleJobTitleClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleReviewSubmit = async () => {
    if (!selectedFreelancerId) return;

    const reviewData = {
      rating: rating,
      note: note,
    };

    try {
      const response = await api.post(`/v1/jobs/${selectedFreelancerId}/freelance/review`, reviewData);
      notification.success({
        message: "Thành công",
        description: "Đánh giá đã được gửi thành công",
      });
      setReviewDialogOpen(false);
      setRating(0);
      setNote("");
      fetchApplicants();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể gửi đánh giá",
      });
      console.error("Error submitting review:", error);
    }
  };

  const StarRating = ({ rating, setRating }) => {
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

  const filteredApplicants = applicants.filter((applicant) => {
    const fullName = `${applicant?.firstName || ""} ${applicant?.lastName || ""}`
      .trim()
      .toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || applicant?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  async function handleApproved(data) {
    setLoading(true);
    try {
      const response = await api.post(`/v1/jobs/approve`, data);
      notification.info({
        message: "Thành công",
        description: "Chấp thuận thành công",
      });
      fetchApplicants();
    } catch (err) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi trong quá trình chấp thuận",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleReject(data) {
    setLoading(true);
    try {
      await api.post(`/v1/jobs/reject`, data);
      notification.info({
        message: "Thành công",
        description: "Từ chối thành công",
      });
      fetchApplicants();
    } catch (err) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi trong quá trình từ chối",
      });
    } finally {
      setLoading(false);
    }
  }

  const statsCards = [
    {
      label: "Tổng ứng viên",
      value: stats.total,
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      label: "Đã hủy",
      value: stats.Cancelled,
      icon: <Clock className="w-8 h-8 text-yellow-500" />,
    },
    {
      label: "Đang thực hiện",
      value: stats.InProgress,
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    },
    {
      label: "Hoàn thành",
      value: stats.Completed,
      icon: <CheckCircle className="w-8 h-8 text-blue-500" />,
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Danh sách ứng viên</h1>
            <p className="text-muted-foreground">
              Quản lý và đánh giá các ứng viên đã ứng tuyển vào công việc của bạn
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Stats */}
        <FadeInWhenVisible delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  {stat.icon}
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </FadeInWhenVisible>

        {/* Filters */}
        <FadeInWhenVisible delay={0.2}>
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm ứng viên..."
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
                  <SelectItem value="Applied">Đã ứng tuyển</SelectItem>
                  <SelectItem value="Viewed">Đã xem</SelectItem>
                  <SelectItem value="In Progress">Đang thực hiện</SelectItem>
                  <SelectItem value="Completed">Hoàn thành</SelectItem>
                  <SelectItem value="Cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </Card>
        </FadeInWhenVisible>

        {/* Applicants Table */}
        <FadeInWhenVisible delay={0.3}>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ứng viên</TableHead>
                  <TableHead>Chuyên môn</TableHead>
                  <TableHead>Tên công việc</TableHead>
                  <TableHead>Ngày ứng tuyển</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={applicant.image}
                            alt={`${applicant.firstName} ${applicant.lastName}`}
                          />
                          <AvatarFallback>{`${applicant.firstName?.[0] || ""}${applicant.lastName?.[0] || ""
                            }`}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{`${applicant.firstName || ""} ${applicant.lastName || ""
                            }`}</p>
                          <p className="text-sm text-muted-foreground">{applicant.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {applicant?.position || "Không có chuyên môn"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-left font-medium text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={() => handleJobTitleClick(applicant.jobId)}
                      >
                        {applicant.jobTitle || "Không có tên công việc"}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {formatAppliedDate(applicant.appliedDate)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(applicant.status)}>
                        {getStatusText(applicant.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1">
                            {(!applicant.clientReviewRating || applicant.clientReviewRating === 0)
                              ? "Chưa đánh giá"
                              : applicant.clientReviewRating}
                          </span>
                        </div>
                        {applicant.clientReviewNote && (
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {applicant.clientReviewNote}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!applicant.cvURL}
                                onClick={() => handleViewCV(applicant)}
                                className="text-blue-600"
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xem CV</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                disabled={applicant.appointmentId != -1}
                                variant="outline"
                                className="text-green-600"
                              >
                                <Link to={`/appointment/${applicant.id}`}>
                                  <Clock className="w-4 h-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Đặt lịch hẹn</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                disabled={applicant.status !== "Applied"}
                                onClick={() =>
                                  handleApproved({
                                    jobId: applicant?.jobId,
                                    freelancerId: applicant?.freelancerId,
                                  })
                                }
                                size="sm"
                                variant="outline"
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Chấp nhận ứng viên</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={applicant.status !== "Applied"}
                                onClick={() =>
                                  handleReject({
                                    jobId: applicant?.jobId,
                                    freelancerId: applicant?.freelancerId,
                                  })
                                }
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Từ chối ứng viên</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={applicant.status !== "Approved"}
                                onClick={() => {
                                  setSelectedFreelancerId(applicant.id);
                                  setReviewDialogOpen(true);
                                }}
                                className="text-yellow-600"
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Đánh giá ứng viên</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeInWhenVisible>

        {/* Dialog xem CV */}
        <Dialog open={previewVisible} onOpenChange={(open) => !open && setPreviewVisible(false)}>
          <DialogContent className="max-w-5xl h-[90vh] p-0 sm:rounded-lg">
            <div className="h-full w-full p-2 bg-gray-50">
              {previewLoading ? (
                <div className="flex flex-col justify-center items-center h-full">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                  <span className="text-gray-500">Đang tải xem trước...</span>
                </div>
              ) : !currentPdfUrl ? (
                <div className="flex flex-col justify-center items-center h-full">
                  <FileText className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-gray-500">Không thể tải CV</span>
                </div>
              ) : (
                <iframe
                  src={currentPdfUrl}
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                  title="CV Preview"
                  onError={() => {
                    notification.error({
                      message: "Lỗi",
                      description: "Không thể tải xem trước CV. Vui lòng thử lại sau.",
                    });
                    setPreviewVisible(false);
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Đánh giá ứng viên: {applicants.find((a) => a.freelancerId === selectedFreelancerId)?.firstName}{" "}
                {applicants.find((a) => a.freelancerId === selectedFreelancerId)?.lastName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Điểm đánh giá (1-5 sao)</label>
                <StarRating rating={rating} setRating={setRating} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ghi chú</label>
                <Textarea
                  placeholder="Nhập ghi chú về ứng viên"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
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

export default Applicants;