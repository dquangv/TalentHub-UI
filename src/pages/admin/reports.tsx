import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { reportColumns } from "@/components/admin/data-table/columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertCircle, Briefcase, Calendar, FileText, User, Edit2, X, Image as ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/axiosConfig";
import JobDetailPopup from "./JobDetailPopup";

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminReason, setAdminReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("IN_PROGRESS");
  const [data, setData] = useState<any[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const fetchReports = async () => {
    try {
      const response = await api.get("/v1/reported-jobs");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
  
  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = (report: any) => {
    setSelectedReport(report);
    setAdminReason(report.adminReason || "");
    setSelectedStatus(report.status || "REPORTED");
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      await api.put(`/v1/reported-jobs/${selectedReport.id}`, {
        status: selectedStatus,
        reasonAdmin: adminReason,
      });
      
      const response = await api.get("/v1/reported-jobs");
      setData(response.data);
      
      setIsEditMode(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setAdminReason(selectedReport.adminReason || "");
    setSelectedStatus(selectedReport.status || "REPORTED");
  };

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [jobId, setJobId] = useState<string>("");

  const openJobDetailPopup = (id: string) => {
    setJobId(id);
    setPopupOpen(true);
  };

  const closeJobDetailPopup = () => {
    setPopupOpen(false);
    fetchReports()
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusVietnamese = (status: string) => {

    switch (status) {
      case "RESOLVED":
        return "Đã giải quyết";
      case "IN_PROGRESS":
        return "Đang xử lý";
      default:
        return  "Đã báo cáo";
    }
  }

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

      <Dialog open={isDialogOpen && !isPopupOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] sm:max-h-[650px] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Chi tiết tố cáo
              </DialogTitle>
              {!isEditMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
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
                      <span className="text-muted-foreground">Mô tả:</span>
                      <p className="mt-1 text-sm">{selectedReport.job.description}</p>
                    </div>
                    <div>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-muted-foreground hover:text-primary"
                        onClick={() => openJobDetailPopup(selectedReport.jobId)}
                      >
                        Xem chi tiết
                      </Button>
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
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Mô tả tố cáo:</span>
                      <p className="mt-1 font-medium">{selectedReport.description}</p>
                    </div>
                    {selectedReport.image && (
                      <div className="col-span-2 space-y-2">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Hình ảnh minh chứng:
                        </span>
                        <div className="relative group">
                          <div className="overflow-hidden rounded-lg border border-gray-200 w-fit">
                            <img 
                              src={selectedReport.image} 
                              alt="Report evidence" 
                              className="w-[150px] h-[150px] object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                              onClick={() => setIsImageModalOpen(true)}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => setIsImageModalOpen(true)}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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
                  {!isEditMode && (
                    <Badge variant={getStatusBadgeVariant(selectedReport.status)}>
                      {getStatusVietnamese(selectedReport.status)}
                    </Badge>
                  )}
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  {isEditMode ? (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Trạng thái</Label>
                          <Select
                            value={selectedStatus}
                            onValueChange={setSelectedStatus}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IN_PROGRESS">Đang xử lý</SelectItem>
                              <SelectItem value="RESOLVED">Đã giải quyết</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                          Hủy
                        </Button>
                        <Button onClick={handleSave}>
                          Lưu thay đổi
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-0 overflow-hidden bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            {selectedReport?.image && (
              <img
                src={selectedReport.image}
                alt="Report evidence"
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <JobDetailPopup jobId={jobId} isOpen={isPopupOpen} onClose={closeJobDetailPopup} />
    </div>
  );
}

export default ReportsPage;