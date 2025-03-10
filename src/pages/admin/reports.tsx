import { useState, useEffect } from "react";
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
import api from "@/api/axiosConfig";

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminReason, setAdminReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/v1/reported-jobs");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    
    fetchReports();
  }, []);

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
                      <div>
                        <Badge variant="outline">Lý do: {selectedReport.reasonFreelancer}</Badge>
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
                        <span className="ml-2 font-medium">{selectedReport.job.fromPrice} - {selectedReport.job.toPrice}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tên công ty:</span>
                      <span className="ml-2 font-medium">{selectedReport.job.companyName ? selectedReport.job.companyName : "Không có tên công ty"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mô tả:</span>
                      <p className="mt-1 text-sm">{selectedReport.job.description}</p>
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
                      <p className="font-medium">{selectedReport.fullName}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Thời gian:</span>
                      </div>
                      <p className="font-medium">
                        {new Date(selectedReport.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Lý do tố cáo:</span>
                      <p className="mt-1 font-medium">{selectedReport.reasonFreelancer}</p>
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
                          {selectedReport.updatedAt ? new Date(selectedReport.updatedAt).toLocaleString("vi-VN") : "Chưa xử lý"}
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
