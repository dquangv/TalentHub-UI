import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { AlertTriangle, Calendar } from "lucide-react";
import api from "@/api/axiosConfig";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const ReportsOfJob = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/v1/reported-jobs/by-job/${id}`);
      setReports(response.data);
      setError(null);
    } catch (err) {
      setError("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [id]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "REPORTED":
        return "warning";
      case "RESOLVED":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "REPORTED":
        return "Đang giải quyết";
      case "RESOLVED":
        return "Đã giải quyết";
      case "IN_PROGRESS":
        return "Đang giải quyết";
      default:
        return status;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <FadeInWhenVisible>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Báo cáo vi phạm</h1>
            <p className="text-muted-foreground">
              Danh sách các báo cáo vi phạm về công việc này
            </p>
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1}>
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{reports?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Tổng số báo cáo</p>
              </div>
            </div>
          </Card>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.2}>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người báo cáo</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Ngày báo cáo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={report.image} alt={report.fullName} />
                          <AvatarFallback>{report.fullName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{report.fullName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{report.reasonFreelancer}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {format(new Date(report.createdAt), 'dd/MM/yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(report.status)}>
                        {getStatusText(report.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {reports?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">Chưa có báo cáo nào</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </FadeInWhenVisible>
      </div>
    </div>
  );
};

export default ReportsOfJob;