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
  Filter,
  Star,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Clock,
} from "lucide-react";
import api from "@/api/axiosConfig";
import { Link, useParams } from "react-router-dom";
import { notification } from "antd";

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
  const { id } = useParams();

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/v1/jobs/applicants/${id}`);
      setApplicants(response.data);

      // Calculate stats
      const newStats = {
        total: response.data.length,
        Applied: response.data.filter(a => a.status === "Applied").length,
        Viewed: response.data.filter(a => a.status === "Viewed").length,
        InProgress: response.data.filter(a => a.status === "In Progress").length,
        Completed: response.data.filter(a => a.status === "Completed").length,
        Cancelled: response.data.filter(a => a.status === "Cancelled").length,
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

  const filteredApplicants = applicants.filter(applicant => {
    const fullName = `${applicant?.firstName || ''} ${applicant?.lastName || ''}`.trim().toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
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
                  {/* <TableHead>Ngày ứng tuyển</TableHead> */}
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
                          <AvatarImage src={applicant.image} alt={`${applicant.firstName} ${applicant.lastName}`} />
                          <AvatarFallback>{`${applicant.firstName?.[0] || ''}${applicant.lastName?.[0] || ''}`}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{`${applicant.firstName || ''} ${applicant.lastName || ''}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {applicant.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {applicant?.position || "Không có chuyên môn"}
                      </p>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {applicant.appliedDate}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(applicant.status)}>
                        {getStatusText(applicant.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{applicant.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeInWhenVisible>
      </div>
    </div>
  );
};

export default Applicants;