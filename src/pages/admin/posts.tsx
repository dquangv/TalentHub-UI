import { DataTable } from "@/components/admin/data-table/data-table";
import { postColumns } from "@/components/admin/data-table/columns";
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import { Button } from "antd";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PostsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    type: "ban" | "unban";
    jobId: number;
  } | null>(null);

  async function fetchJobs() {
    const response = await api.get("/v1/jobs/admin");
    console.log("response ", response.data);
    if (response.status === 200) {
      setJobs(response.data);
      setFilteredJobs(response.data);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = [...jobs];

    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(job => job.categoryName === categoryFilter);
    }

    if (emailFilter) {
      filtered = filtered.filter(job => 
        job.clientEmail.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [statusFilter, categoryFilter, emailFilter, jobs]);

  const handleBan = async (jobId: number) => {
    try {
      await api.post(`/v1/jobs/admin/ban?jobId=${jobId}`);
      fetchJobs();
    } catch (error) {
      console.error("Error banning job:", error);
    }
  };

  const handleUnban = async (jobId: number) => {
    try {
      await api.post(`/v1/jobs/admin/unban?jobId=${jobId}`);
      fetchJobs();
    } catch (error) {
      console.error("Error unbanning job:", error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;

    if (selectedAction.type === "ban") {
      await handleBan(selectedAction.jobId);
    } else {
      await handleUnban(selectedAction.jobId);
    }
    setShowConfirmDialog(false);
    setSelectedAction(null);
  };

  const uniqueStatuses = ['all'].concat(
    jobs.map(job => job.status)
      .filter((status, index, self) => self.indexOf(status) === index)
  );
  
  const uniqueCategories = ['all'].concat(
    jobs.map(job => job.categoryName)
      .filter((category, index, self) => self.indexOf(category) === index)
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Bài viết</h2>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {uniqueStatuses.map(status => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "Tất cả trạng thái" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "Tất cả danh mục" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Tìm theo email khách hàng"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction?.type === "ban"
                ? "Bạn có chắc chắn muốn khóa bài viết này?"
                : "Bạn có chắc chắn muốn mở khóa bài viết này?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {selectedAction?.type === "ban" ? "Khóa" : "Mở khóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataTable 
        columns={[
          ...postColumns,
          {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => {
              const id = row.getValue("id");
              const status = row.getValue("status");
              const isBanned = (status === "Bị cấm");
              
              if (status === "Đóng") {
                return null;
              }

              return (
                <div className="flex space-x-2">
                  {isBanned ? (
                    <Button
                      onClick={() => {
                        setSelectedAction({ type: "unban", jobId: id });
                        setShowConfirmDialog(true);
                      }}
                      variant="outline"
                      className="text-green-600"
                    >
                      Mở khóa
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setSelectedAction({ type: "ban", jobId: id });
                        setShowConfirmDialog(true);
                      }}
                      variant="outline"
                      className="text-red-600"
                    >
                      Khóa
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]} 
        data={filteredJobs}
      />
    </div>
  );
}