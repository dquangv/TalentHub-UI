import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { reportColumns } from "@/components/admin/data-table/columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertCircle, Briefcase, Calendar, FileText, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const data = [
  {
    id: "REP001",
    reporterId: "USER123",
    reporterName: "Nguyễn Văn A",
    reason: "Nội dung không phù hợp",
    reportedAt: "2024-03-20T08:00:00Z",
    jobId: "JOB123",
    jobTitle: "Senior React Developer",
    jobPoster: "Công ty ABC",
    jobDescription: "Chúng tôi đang tìm kiếm một Senior React Developer với ít nhất 5 năm kinh nghiệm...",
    jobBudget: "2000-3000 USD",
    jobLocation: "Hồ Chí Minh",
    jobType: "Full-time",
    status: "pending",
    adminReason: "",
    processedAt: null,
  },
  {
    id: "REP002",
    reporterId: "USER124",
    reporterName: "Trần Thị B",
    reason: "Lừa đảo",
    reportedAt: "2024-03-19T15:30:00Z",
    jobId: "JOB124",
    jobTitle: "UI/UX Designer",
    jobPoster: "Công ty XYZ",
    jobDescription: "Cần tuyển UI/UX Designer có kinh nghiệm thiết kế mobile app...",
    jobBudget: "1500-2500 USD",
    jobLocation: "Hà Nội",
    jobType: "Remote",
    status: "banned",
    adminReason: "Vi phạm nghiêm trọng điều khoản sử dụng",
    processedAt: "2024-03-19T16:45:00Z",
  },
  {
    id: "REP003",
    reporterId: "USER125",
    reporterName: "Lê Văn C",
    reason: "Spam",
    reportedAt: "2024-03-18T10:20:00Z",
    jobId: "JOB125",
    jobTitle: "PHP Developer",
    jobPoster: "Công ty DEF",
    jobDescription: "Tuyển PHP Developer có kinh nghiệm làm việc với Laravel...",
    jobBudget: "1000-2000 USD",
    jobLocation: "Đà Nẵng",
    jobType: "Part-time",
    status: "ignored",
    adminReason: "Không vi phạm quy định",
    processedAt: "2024-03-18T11:30:00Z",
  },
    {
    id: "REP001",
    reporterId: "USER123",
    reporterName: "Nguyễn Văn A",
    reason: "Nội dung không phù hợp",
    reportedAt: "2024-03-20T08:00:00Z",
    jobId: "JOB123",
    jobTitle: "Senior React Developer",
    jobPoster: "Công ty ABC",
    jobDescription: "Chúng tôi đang tìm kiếm một Senior React Developer với ít nhất 5 năm kinh nghiệm...",
    jobBudget: "2000-3000 USD",
    jobLocation: "Hồ Chí Minh",
    jobType: "Full-time",
    status: "pending",
    adminReason: "",
    processedAt: null,
  },
  {
    id: "REP002",
    reporterId: "USER124",
    reporterName: "Trần Thị B",
    reason: "Lừa đảo",
    reportedAt: "2024-03-19T15:30:00Z",
    jobId: "JOB124",
    jobTitle: "UI/UX Designer",
    jobPoster: "Công ty XYZ",
    jobDescription: "Cần tuyển UI/UX Designer có kinh nghiệm thiết kế mobile app...",
    jobBudget: "1500-2500 USD",
    jobLocation: "Hà Nội",
    jobType: "Remote",
    status: "banned",
    adminReason: "Vi phạm nghiêm trọng điều khoản sử dụng",
    processedAt: "2024-03-19T16:45:00Z",
  },
  {
    id: "REP003",
    reporterId: "USER125",
    reporterName: "Lê Văn C",
    reason: "Spam",
    reportedAt: "2024-03-18T10:20:00Z",
    jobId: "JOB125",
    jobTitle: "PHP Developer",
    jobPoster: "Công ty DEF",
    jobDescription: "Tuyển PHP Developer có kinh nghiệm làm việc với Laravel...",
    jobBudget: "1000-2000 USD",
    jobLocation: "Đà Nẵng",
    jobType: "Part-time",
    status: "ignored",
    adminReason: "Không vi phạm quy định",
    processedAt: "2024-03-18T11:30:00Z",
  },  {
    id: "REP001",
    reporterId: "USER123",
    reporterName: "Nguyễn Văn A",
    reason: "Nội dung không phù hợp",
    reportedAt: "2024-03-20T08:00:00Z",
    jobId: "JOB123",
    jobTitle: "Senior React Developer",
    jobPoster: "Công ty ABC",
    jobDescription: "Chúng tôi đang tìm kiếm một Senior React Developer với ít nhất 5 năm kinh nghiệm...",
    jobBudget: "2000-3000 USD",
    jobLocation: "Hồ Chí Minh",
    jobType: "Full-time",
    status: "pending",
    adminReason: "",
    processedAt: null,
  },
  {
    id: "REP002",
    reporterId: "USER124",
    reporterName: "Trần Thị B",
    reason: "Lừa đảo",
    reportedAt: "2024-03-19T15:30:00Z",
    jobId: "JOB124",
    jobTitle: "UI/UX Designer",
    jobPoster: "Công ty XYZ",
    jobDescription: "Cần tuyển UI/UX Designer có kinh nghiệm thiết kế mobile app...",
    jobBudget: "1500-2500 USD",
    jobLocation: "Hà Nội",
    jobType: "Remote",
    status: "banned",
    adminReason: "Vi phạm nghiêm trọng điều khoản sử dụng",
    processedAt: "2024-03-19T16:45:00Z",
  },
  {
    id: "REP003",
    reporterId: "USER125",
    reporterName: "Lê Văn C",
    reason: "Spam",
    reportedAt: "2024-03-18T10:20:00Z",
    jobId: "JOB125",
    jobTitle: "PHP Developer",
    jobPoster: "Công ty DEF",
    jobDescription: "Tuyển PHP Developer có kinh nghiệm làm việc với Laravel...",
    jobBudget: "1000-2000 USD",
    jobLocation: "Đà Nẵng",
    jobType: "Part-time",
    status: "ignored",
    adminReason: "Không vi phạm quy định",
    processedAt: "2024-03-18T11:30:00Z",
  },  {
    id: "REP001",
    reporterId: "USER123",
    reporterName: "Nguyễn Văn A",
    reason: "Nội dung không phù hợp",
    reportedAt: "2024-03-20T08:00:00Z",
    jobId: "JOB123",
    jobTitle: "Senior React Developer",
    jobPoster: "Công ty ABC",
    jobDescription: "Chúng tôi đang tìm kiếm một Senior React Developer với ít nhất 5 năm kinh nghiệm...",
    jobBudget: "2000-3000 USD",
    jobLocation: "Hồ Chí Minh",
    jobType: "Full-time",
    status: "pending",
    adminReason: "",
    processedAt: null,
  },
  {
    id: "REP002",
    reporterId: "USER124",
    reporterName: "Trần Thị B",
    reason: "Lừa đảo",
    reportedAt: "2024-03-19T15:30:00Z",
    jobId: "JOB124",
    jobTitle: "UI/UX Designer",
    jobPoster: "Công ty XYZ",
    jobDescription: "Cần tuyển UI/UX Designer có kinh nghiệm thiết kế mobile app...",
    jobBudget: "1500-2500 USD",
    jobLocation: "Hà Nội",
    jobType: "Remote",
    status: "banned",
    adminReason: "Vi phạm nghiêm trọng điều khoản sử dụng",
    processedAt: "2024-03-19T16:45:00Z",
  },
  {
    id: "REP003",
    reporterId: "USER125",
    reporterName: "Lê Văn C",
    reason: "Spam",
    reportedAt: "2024-03-18T10:20:00Z",
    jobId: "JOB125",
    jobTitle: "PHP Developer",
    jobPoster: "Công ty DEF",
    jobDescription: "Tuyển PHP Developer có kinh nghiệm làm việc với Laravel...",
    jobBudget: "1000-2000 USD",
    jobLocation: "Đà Nẵng",
    jobType: "Part-time",
    status: "ignored",
    adminReason: "Không vi phạm quy định",
    processedAt: "2024-03-18T11:30:00Z",
  },  {
    id: "REP001",
    reporterId: "USER123",
    reporterName: "Nguyễn Văn A",
    reason: "Nội dung không phù hợp",
    reportedAt: "2024-03-20T08:00:00Z",
    jobId: "JOB123",
    jobTitle: "Senior React Developer",
    jobPoster: "Công ty ABC",
    jobDescription: "Chúng tôi đang tìm kiếm một Senior React Developer với ít nhất 5 năm kinh nghiệm...",
    jobBudget: "2000-3000 USD",
    jobLocation: "Hồ Chí Minh",
    jobType: "Full-time",
    status: "pending",
    adminReason: "",
    processedAt: null,
  },
  {
    id: "REP002",
    reporterId: "USER124",
    reporterName: "Trần Thị B",
    reason: "Lừa đảo",
    reportedAt: "2024-03-19T15:30:00Z",
    jobId: "JOB124",
    jobTitle: "UI/UX Designer",
    jobPoster: "Công ty XYZ",
    jobDescription: "Cần tuyển UI/UX Designer có kinh nghiệm thiết kế mobile app...",
    jobBudget: "1500-2500 USD",
    jobLocation: "Hà Nội",
    jobType: "Remote",
    status: "banned",
    adminReason: "Vi phạm nghiêm trọng điều khoản sử dụng",
    processedAt: "2024-03-19T16:45:00Z",
  },
  {
    id: "REP003",
    reporterId: "USER125",
    reporterName: "Lê Văn C",
    reason: "Spam",
    reportedAt: "2024-03-18T10:20:00Z",
    jobId: "JOB125",
    jobTitle: "PHP Developer",
    jobPoster: "Công ty DEF",
    jobDescription: "Tuyển PHP Developer có kinh nghiệm làm việc với Laravel...",
    jobBudget: "1000-2000 USD",
    jobLocation: "Đà Nẵng",
    jobType: "Part-time",
    status: "ignored",
    adminReason: "Không vi phạm quy định",
    processedAt: "2024-03-18T11:30:00Z",
  },  {
    id: "REP001",
    reporterId: "USER123",
    reporterName: "Nguyễn Văn A",
    reason: "Nội dung không phù hợp",
    reportedAt: "2024-03-20T08:00:00Z",
    jobId: "JOB123",
    jobTitle: "Senior React Developer",
    jobPoster: "Công ty ABC",
    jobDescription: "Chúng tôi đang tìm kiếm một Senior React Developer với ít nhất 5 năm kinh nghiệm...",
    jobBudget: "2000-3000 USD",
    jobLocation: "Hồ Chí Minh",
    jobType: "Full-time",
    status: "pending",
    adminReason: "",
    processedAt: null,
  },
  {
    id: "REP002",
    reporterId: "USER124",
    reporterName: "Trần Thị B",
    reason: "Lừa đảo",
    reportedAt: "2024-03-19T15:30:00Z",
    jobId: "JOB124",
    jobTitle: "UI/UX Designer",
    jobPoster: "Công ty XYZ",
    jobDescription: "Cần tuyển UI/UX Designer có kinh nghiệm thiết kế mobile app...",
    jobBudget: "1500-2500 USD",
    jobLocation: "Hà Nội",
    jobType: "Remote",
    status: "banned",
    adminReason: "Vi phạm nghiêm trọng điều khoản sử dụng",
    processedAt: "2024-03-19T16:45:00Z",
  },
  {
    id: "REP003",
    reporterId: "USER125",
    reporterName: "Lê Văn C",
    reason: "Spam",
    reportedAt: "2024-03-18T10:20:00Z",
    jobId: "JOB125",
    jobTitle: "PHP Developer",
    jobPoster: "Công ty DEF",
    jobDescription: "Tuyển PHP Developer có kinh nghiệm làm việc với Laravel...",
    jobBudget: "1000-2000 USD",
    jobLocation: "Đà Nẵng",
    jobType: "Part-time",
    status: "ignored",
    adminReason: "Không vi phạm quy định",
    processedAt: "2024-03-18T11:30:00Z",
  },  {
    id: "REP001",
    reporterId: "USER123",
    reporterName: "Nguyễn Văn A",
    reason: "Nội dung không phù hợp",
    reportedAt: "2024-03-20T08:00:00Z",
    jobId: "JOB123",
    jobTitle: "Senior React Developer",
    jobPoster: "Công ty ABC",
    jobDescription: "Chúng tôi đang tìm kiếm một Senior React Developer với ít nhất 5 năm kinh nghiệm...",
    jobBudget: "2000-3000 USD",
    jobLocation: "Hồ Chí Minh",
    jobType: "Full-time",
    status: "pending",
    adminReason: "",
    processedAt: null,
  },
  {
    id: "REP002",
    reporterId: "USER124",
    reporterName: "Trần Thị B",
    reason: "Lừa đảo",
    reportedAt: "2024-03-19T15:30:00Z",
    jobId: "JOB124",
    jobTitle: "UI/UX Designer",
    jobPoster: "Công ty XYZ",
    jobDescription: "Cần tuyển UI/UX Designer có kinh nghiệm thiết kế mobile app...",
    jobBudget: "1500-2500 USD",
    jobLocation: "Hà Nội",
    jobType: "Remote",
    status: "banned",
    adminReason: "Vi phạm nghiêm trọng điều khoản sử dụng",
    processedAt: "2024-03-19T16:45:00Z",
  },
  {
    id: "REP003",
    reporterId: "USER125",
    reporterName: "Lê Văn C",
    reason: "Spam",
    reportedAt: "2024-03-18T10:20:00Z",
    jobId: "JOB125",
    jobTitle: "PHP Developer",
    jobPoster: "Công ty DEF",
    jobDescription: "Tuyển PHP Developer có kinh nghiệm làm việc với Laravel...",
    jobBudget: "1000-2000 USD",
    jobLocation: "Đà Nẵng",
    jobType: "Part-time",
    status: "ignored",
    adminReason: "Không vi phạm quy định",
    processedAt: "2024-03-18T11:30:00Z",
  },  {
    id: "REP001",
    reporterId: "USER123",
    reporterName: "Nguyễn Văn A",
    reason: "Nội dung không phù hợp",
    reportedAt: "2024-03-20T08:00:00Z",
    jobId: "JOB123",
    jobTitle: "Senior React Developer",
    jobPoster: "Công ty ABC",
    jobDescription: "Chúng tôi đang tìm kiếm một Senior React Developer với ít nhất 5 năm kinh nghiệm...",
    jobBudget: "2000-3000 USD",
    jobLocation: "Hồ Chí Minh",
    jobType: "Full-time",
    status: "pending",
    adminReason: "",
    processedAt: null,
  },
  {
    id: "REP002",
    reporterId: "USER124",
    reporterName: "Trần Thị B",
    reason: "Lừa đảo",
    reportedAt: "2024-03-19T15:30:00Z",
    jobId: "JOB124",
    jobTitle: "UI/UX Designer",
    jobPoster: "Công ty XYZ",
    jobDescription: "Cần tuyển UI/UX Designer có kinh nghiệm thiết kế mobile app...",
    jobBudget: "1500-2500 USD",
    jobLocation: "Hà Nội",
    jobType: "Remote",
    status: "banned",
    adminReason: "Vi phạm nghiêm trọng điều khoản sử dụng",
    processedAt: "2024-03-19T16:45:00Z",
  },
  {
    id: "REP003",
    reporterId: "USER125",
    reporterName: "Lê Văn C",
    reason: "Spam",
    reportedAt: "2024-03-18T10:20:00Z",
    jobId: "JOB125",
    jobTitle: "PHP Developer",
    jobPoster: "Công ty DEF",
    jobDescription: "Tuyển PHP Developer có kinh nghiệm làm việc với Laravel...",
    jobBudget: "1000-2000 USD",
    jobLocation: "Đà Nẵng",
    jobType: "Part-time",
    status: "ignored",
    adminReason: "Không vi phạm quy định",
    processedAt: "2024-03-18T11:30:00Z",
  },
];
export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminReason, setAdminReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAction = (report: any) => {
    setSelectedReport(report);
    setAdminReason("");
    setIsDialogOpen(true);
  };

  const handleBan = () => {
    console.log("Banned:", selectedReport.id, "Reason:", adminReason);
    setIsDialogOpen(false);
  };

  const handleIgnore = () => {
    console.log("Ignored:", selectedReport.id);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Tố Cáo</h2>
          <p className="text-muted-foreground mt-2">
            Xem và xử lý các báo cáo vi phạm từ người dùng
          </p>
        </div>
      </div>

      <DataTable 
        columns={reportColumns} 
        data={data}
        onAction={handleAction}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] sm:max-h-[650px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Chi tiết tố cáo
            </DialogTitle>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              {/* Job Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Thông tin bài đăng</h3>
                </div>
                <div className="grid gap-4 rounded-lg border p-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{selectedReport.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground">{selectedReport.jobPoster}</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">ID:</span>
                        <span className="ml-2 font-medium">{selectedReport.jobId}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ngân sách:</span>
                        <span className="ml-2 font-medium">{selectedReport.jobBudget}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Địa điểm:</span>
                      <span className="ml-2 font-medium">{selectedReport.jobLocation}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mô tả:</span>
                      <p className="mt-1 text-sm">{selectedReport.jobDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Thông tin tố cáo</h3>
                </div>
                <div className="grid gap-4 rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Người tố cáo:</span>
                      </div>
                      <p className="font-medium">{selectedReport.reporterName}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Thời gian:</span>
                      </div>
                      <p className="font-medium">
                        {new Date(selectedReport.reportedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Lý do tố cáo:</span>
                      <p className="mt-1 font-medium">{selectedReport.reason}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Trạng thái và Xử lý</h3>
                  </div>
                  <Badge
                    variant={
                      selectedReport.status === "banned"
                        ? "destructive"
                        : selectedReport.status === "ignored"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {selectedReport.status === "banned"
                      ? "Đã cấm"
                      : selectedReport.status === "ignored"
                      ? "Đã bỏ qua"
                      : "Chưa xử lý"}
                  </Badge>
                </div>

                {selectedReport.status !== "pending" ? (
                  <div className="rounded-lg border p-4">
                    <div className="grid gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Thời gian xử lý:</span>
                        <span className="ml-2 font-medium">
                          {new Date(selectedReport.processedAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      {selectedReport.adminReason && (
                        <div>
                          <span className="text-muted-foreground">Lý do xử lý:</span>
                          <p className="mt-1">{selectedReport.adminReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminReason">Lý do xử lý</Label>
                      <Textarea
                        id="adminReason"
                        placeholder="Nhập lý do xử lý..."
                        value={adminReason}
                        onChange={(e) => setAdminReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        onClick={handleIgnore}
                      >
                        Bỏ qua
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleBan}
                      >
                        Cấm
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}