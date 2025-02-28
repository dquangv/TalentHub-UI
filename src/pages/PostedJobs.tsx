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
} from "lucide-react";
import api from "@/api/axiosConfig";

const PostedJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/v1/jobs/PostedJobs/2");

        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang tuyển";
      case "closed":
        return "Đã đóng";
      case "draft":
        return "Bản nháp";
      default:
        return status;
    }
  };

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
              <Link to="/employer/post-job">
                <Plus className="w-4 h-4 mr-2" />
                Đăng tin mới
              </Link>
            </Button>
          </div>
        </FadeInWhenVisible>

        {/* Loading or Error State */}
        {loading && (
          <div className="text-center mb-8">
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Filters */}
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
                  <SelectItem value="active">Đang tuyển</SelectItem>
                  <SelectItem value="closed">Đã đóng</SelectItem>
                  <SelectItem value="draft">Bản nháp</SelectItem>
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
                {jobs
                  .filter(
                    (job) =>
                      statusFilter === "all" || job.status === statusFilter
                  )
                  .map((job) => (
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
                        <Badge
                          variant={
                            job.status === "active"
                              ? "default"
                              : job.status === "closed"
                              ? "secondary"
                              : "outline"
                          }
                        >
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
                            <Link to={`/appointment/${job.id}`}>
                            
                            <Clock className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Link to={`/jobs/${job.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
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
        {jobs.length === 0 && !loading && !error && (
          <FadeInWhenVisible>
            <Card className="p-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Chưa có công việc nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Bạn chưa đăng tin tuyển dụng nào. Hãy bắt đầu đăng tin để tìm
                kiếm ứng viên phù hợp.
              </p>
              <Button asChild>
                <Link to="/employer/post-job">
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
