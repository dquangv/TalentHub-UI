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
  CheckCircle,
  Download,
  Calendar,
  Briefcase,
  User,
  AlertCircle,
  Ban,
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react";
import api from "@/api/axiosConfig";
import { notification } from "antd";
import * as XLSX from "xlsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PostedJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "postedDate",
    direction: "desc",
  });
  const [stats, setStats] = useState({
    total: 0,
    OPEN: 0,
    POSTED: 0,
    CLOSED: 0,
    BANNED: 0,
    DRAFT: 0,
  });
  const clientId = JSON.parse(localStorage.getItem("userInfo") || "{}").clientId;

  const handleExportData = () => {
    const exportData = sortedJobs.map(job => ({
      "Tiêu đề": job.title || "",
      "Loại công việc": job.type || "",
      "Số ứng viên": job.applicants || 0,
      "Ngày đăng": job.postedDate ? new Date(job.postedDate).toLocaleDateString('vi-VN') : "",
      "Thời gian còn lại": job.remainingTimeFormatted || "",
      "Trạng thái": getStatusText(job.status) || "",
      "Mô tả": job.description || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet['!cols'] = [
      { wch: 30 }, 
      { wch: 20 }, 
      { wch: 15 }, 
      { wch: 15 }, 
      { wch: 20 }, 
      { wch: 15 }, 
      { wch: 50 }, 
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách công việc");

    const fileName = `Cong_Viec_Da_Dang_${new Date().toLocaleString('vi-VN').replace(/[:/]/g, '-')}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    notification.success({
      message: "Xuất dữ liệu thành công",
      description: "Danh sách công việc đã được xuất ra file Excel"
    });
  };


  const fetchJobs = async () => {
    try {
      const response = await api.get(`/v1/jobs/PostedJobs/${clientId}`);
      setJobs(response.data);

      // Calculate stats, excluding DRAFT status for total count
      const newStats = {
        total: response.data.filter(job => job.status !== "DRAFT").length,
        OPEN: response.data.filter((job) => job.status === "OPEN").length,
        POSTED: response.data.filter((job) => job.status === "POSTED").length,
        CLOSED: response.data.filter((job) => job.status === "CLOSED").length,
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
      case "BANNED":
        return "destructive"; // Changed to destructive for BANNED status
      case "DRAFT":
        return "outline";
      default:
        return "default";
    }
  };

  // Custom styling for badges to ensure different colors
  const getStatusBadgeStyle = (status) => {
    if (status === "BANNED") {
      return { backgroundColor: "#ef4444", color: "white" }; // Red color for banned
    }
    if (status === "DRAFT") {
      return { backgroundColor: "#f3f4f6", color: "#6b7280", borderColor: "#d1d5db" }; // Light gray for draft
    }
    return {}; // Default styles for other statuses
  };

  // Hàm sắp xếp
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;

      if (key === 'applicants' || key === 'remainingTimeInHours') {
        return direction === 'asc'
          ? a[key] - b[key]
          : b[key] - a[key];
      }

      if (key === 'postedDate' || key === 'endDate') {
        return direction === 'asc'
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }

      return direction === 'asc'
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });
  };

  // Hàm xử lý sắp xếp khi click vào header
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Hàm hiển thị icon sắp xếp
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }

    return sortConfig.direction === 'asc'
      ? <ArrowUp className="ml-1 w-4 h-4" />
      : <ArrowDown className="ml-1 w-4 h-4" />;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Áp dụng sắp xếp vào dữ liệu đã lọc
  const sortedJobs = sortData(filteredJobs, sortConfig.key, sortConfig.direction);

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
      label: "Bản nháp",
      value: stats.DRAFT,
      icon: <Edit2 className="w-8 h-8 text-blue-500" />,
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
              <h1 className="text-3xl font-bold mb-2">Quản lý bài đăng</h1>
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
                  <SelectItem value="BANNED">Bị cấm</SelectItem>
                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportData}>
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
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort('title')}
                  >
                    <div className="flex items-center">
                      Công việc
                      {getSortIcon('title')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort('applicants')}
                  >
                    <div className="flex items-center">
                      Ứng viên
                      {getSortIcon('applicants')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort('postedDate')}
                  >
                    <div className="flex items-center">
                      Ngày đăng
                      {getSortIcon('postedDate')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort('remainingTimeInHours')}
                  >
                    <div className="flex items-center">
                      Thời gian còn lại
                      {getSortIcon('remainingTimeInHours')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Trạng thái
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedJobs.map((job) => (
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
                        {new Date(job.postedDate).toLocaleDateString('vi-VN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        {job.remainingTimeFormatted}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(job.status)}
                        style={getStatusBadgeStyle(job.status)}
                      >
                        {getStatusText(job.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-amber-600"
                                disabled={!["OPEN", "POSTED", "BANNED"].includes(job.status)}
                              >
                                <Link
                                  to={["OPEN", "POSTED", "BANNED"].includes(job.status) ? `/reports-job/${job.id}` : "#"}
                                  className={!["OPEN", "POSTED", "BANNED"].includes(job.status) ? "pointer-events-none" : ""}
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Danh sách tố cáo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Applicants button */}
                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600"
                                disabled={!["OPEN", "POSTED"].includes(job.status)}
                              >
                                <Link
                                  to={["OPEN", "POSTED"].includes(job.status) ? `/client/applicants/${job.id}` : "#"}
                                  className={!["OPEN", "POSTED"].includes(job.status) ? "pointer-events-none" : ""}
                                >
                                  <Users className="w-4 h-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Danh sách ứng viên</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* View details button */}
                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!["OPEN", "POSTED", "CLOSED", "BANNED"].includes(job.status)}
                              >
                                <Link
                                  to={["OPEN", "POSTED", "CLOSED", "BANNED"].includes(job.status) ? `/jobs/${job.id}` : "#"}
                                  className={!["OPEN", "POSTED", "CLOSED", "BANNED"].includes(job.status) ? "pointer-events-none" : ""}
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xem chi tiết</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Edit button */}
                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!["OPEN", "POSTED", "DRAFT"].includes(job.status)}
                              >
                                <Link
                                  to={["OPEN", "POSTED", "DRAFT"].includes(job.status) ? `/client/post-job?id=${job.id}` : "#"}
                                  className={!["OPEN", "POSTED", "DRAFT"].includes(job.status) ? "pointer-events-none" : ""}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Chỉnh sửa</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Delete button */}
                        <TooltipProvider delayDuration={5}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                disabled={!["OPEN", "POSTED", "DRAFT"].includes(job.status)}
                                onClick={["OPEN", "POSTED", "DRAFT"].includes(job.status) ? () => handleDelete(job.id) : undefined}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xóa</p>
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

        {/* Empty State */}
        {sortedJobs.length === 0 && !loading && (
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