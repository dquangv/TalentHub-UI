import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Calendar,
  Briefcase,
  User,
  AlertCircle,
  Ban,
} from "lucide-react";
import api from "@/api/axiosConfig";
import { notification } from "antd";

const PostedJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    OPEN: 0,
    POSTED: 0,
    CLOSED: 0,
    Pending: 0,
    BANNED: 0,
    DRAFT: 0,
  });
  const clientId = JSON.parse(localStorage.getItem("userInfo") || "{}").clientId;
  const fetchJobs = async () => {
    try {
      const response = await api.get(`/v1/jobs/PostedJobs/${clientId}`);
      setJobs(response.data);

      const newStats = {
        total: response.data.length,
        OPEN: response.data.filter((job) => job.status === "OPEN").length,
        POSTED: response.data.filter((job) => job.status === "POSTED").length,
        CLOSED: response.data.filter((job) => job.status === "CLOSED").length,
        Pending: response.data.filter((job) => job.status === "Pending")
          .length,
        BANNED: response.data.filter((job) => job.status === "BANNED").length,
        DRAFT: response.data.filter((job) => job.status === "DRAFT").length,
      };
      setStats(newStats);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {


    fetchJobs();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "OPEN":
        return "Mở";
      case "POSTED":
        return "Đã đăng";
      case "CLOSED":
        return "Đóng";
      case "Pending":
        return "Chờ xử lý";
      case "BANNED":
        return "Bị cấm";
      case "DRAFT":
        return "Bản nháp";
      default:
        return status;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "OPEN":
        return "default";
      case "POSTED":
        return "success";
      case "CLOSED":
        return "secondary";
      case "Pending":
        return "warning";
      case "BANNED":
        return "destructive";
      case "DRAFT":
        return "outline";
      default:
        return "default";
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    try {
      await api.delete(`/v1/jobs/${id}`)
      notification.success({
        message: "Thành công",
        description: "Xóa thành công"
      })
      fetchJobs();

    } catch (e) {
      notification.success({
        message: "Thất bại",
        description: "Xóa thất bại"
      })
    }
  }

  const statsCards = [
    {
      label: "Tổng tin đăng",
      value: stats.total,
      icon: <Briefcase className="w-8 h-8 text-primary" />,
    },
    {
      label: "Đang mở",
      value: stats.OPEN + stats.POSTED,
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    },
    {
      label: "Chờ xử lý",
      value: stats.Pending,
      icon: <AlertCircle className="w-8 h-8 text-yellow-500" />,
    },
    {
      label: "Đã đóng/Bị cấm",
      value: stats.CLOSED + stats.BANNED,
      icon: <Ban className="w-8 h-8 text-red-500" />,
    },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInWhenVisible>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Công việc đã đăng</h1>
              <p className="text-muted-foreground">
                Quản lý và theo dõi các tin tuyển dụng của bạn
              </p>
            </div>
            <Button asChild>
              <Link to="/client/post-job">
                <Plus className="w-4 h-4 mr-2" />
                Đăng tin mới
              </Link>
            </Button>
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
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </FadeInWhenVisible>

        {loading && (
          <div className="text-center mb-8">
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Filters */}
        <FadeInWhenVisible delay={0.2}>
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tiêu đề, loại công việc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="OPEN">Mở</SelectItem>
                  <SelectItem value="POSTED">Đã đăng</SelectItem>
                  <SelectItem value="CLOSED">Đóng</SelectItem>
                  <SelectItem value="Pending">Chờ xử lý</SelectItem>
                  <SelectItem value="BANNED">Bị cấm</SelectItem>
                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </Card>
        </FadeInWhenVisible>

        {/* Jobs Table */}
        <FadeInWhenVisible delay={0.3}>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Công việc</TableHead>
                  <TableHead>Ứng viên</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{job.applicants} ứng viên</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {job.postedDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {getStatusText(job.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600"
                        >
                          <Link to={`/client/applicants/${job.id}`}>
                            <User className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Link to={`/jobs/${job.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Link to={`/client/post-job?id=${job.id}`}>
                            <Edit2 className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </FadeInWhenVisible>

        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <FadeInWhenVisible>
            <Card className="p-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "Không tìm thấy công việc nào"
                  : "Chưa có công việc nào"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Không tìm thấy công việc nào phù hợp với bộ lọc của bạn."
                  : "Bạn chưa đăng tin tuyển dụng nào. Hãy bắt đầu đăng tin để tìm kiếm ứng viên phù hợp."}
              </p>
              <Button asChild>
                <Link to="/client/post-job">
                  <Plus className="w-4 h-4 mr-2" />
                  Đăng tin mới
                </Link>
              </Button>
            </Card>
          </FadeInWhenVisible>
        )}
      </div>
    </div>
  );
};

export default PostedJobs;
