import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import api from "@/api/axiosConfig";
import PackageForm from "./PackageForm";

interface VoucherPackage {
  id: number;
  name: string;
  price: number;
  duration: number;
  subscribers?: number;
  revenue?: number;
  numberPost?: number;
  status: boolean;
}

const defaultPackage: any = {
  name: "",
  price: 0,
  duration: 30,
  status: true,
};

export default function PricingManagement() {
  const [voucherPackages, setVoucherPackages] = useState<VoucherPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editPackage, setEditPackage] = useState<VoucherPackage | null>(null);
  const [newPackage, setNewPackage] =
    useState<Omit<VoucherPackage, "id">>(defaultPackage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVoucherPackages();
  }, []);

  const fetchVoucherPackages = async () => {
    try {
      const response = await api.get("/v1/voucher-packages");
      setVoucherPackages(response.data);
    } catch (error) {
      console.error("Error fetching voucher packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userInfo = localStorage.getItem("userInfo");
    try {
      const request = newPackage;
      request.accountId = 1;
      const response = await api.post("/v1/voucher-packages", newPackage);
      setVoucherPackages((prev) => [...prev, response.data]);
      setIsCreating(false);
      setNewPackage(defaultPackage);
    } catch (error) {
      console.error("Error creating package:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPackage) return;
  
    setIsSubmitting(true);
    try {
      const requestData = {
        name: editPackage.name,
        description: editPackage.description,
        price: editPackage.price,
        numberPost: editPackage.numberPost,
        status: editPackage.status,
        duration: editPackage.duration,
      };
  
      const response = await api.put(
        `v1/voucher-packages/update-by-name?name=${editPackage.name}`, 
        requestData
      );
  
      console.log("Update successful:", response.data);
      
      fetchVoucherPackages();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating package:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa gói dịch vụ này?")) return;

    try {
      await api.delete(`/v1/voucher-packages/${id}`);
      setVoucherPackages((prev) => prev.filter((pkg) => pkg.id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Package className="h-8 w-8" />
              Quản lý Gói dịch vụ
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý các gói dịch vụ và theo dõi hiệu quả
            </p>
          </div>
          {/* <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4" />
            Thêm gói mới
          </Button> */}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tên gói</th>
                  <th className="px-4 py-3 text-left font-medium">Giá</th>
                  <th className="px-4 py-3 text-left font-medium">Thời hạn</th>
                  <th className="px-4 py-3 text-left font-medium">Số bài đăng</th>
                  {/* <th className="px-4 py-3 text-left font-medium">
                    Trạng thái
                  </th> */}
                  <th className="px-4 py-3 text-left font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {voucherPackages?.map((pkg) => (
                  <tr
                    key={pkg?.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium">{pkg?.name}</span>
                    </td>
                    <td className="px-4 py-3 text-primary font-medium">
                      {formatCurrency(pkg?.price)}
                    </td>
                    <td className="px-4 py-3">{pkg?.duration} ngày</td>
                    <td className="px-4 py-3">{pkg?.numberPost} bài</td>
                    {/* <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pkg?.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pkg?.status ? (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        {pkg?.status ? "Đang hoạt động" : "Tạm dừng"}
                      </span>
                    </td> */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditPackage(pkg);
                            setIsEditing(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        {/* <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <PackageForm
            data={editPackage || {}}
            onChange={setEditPackage}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            title="Sửa Gói Dịch Vụ"
            description="Cập nhật thông tin gói dịch vụ. Nhấn lưu khi hoàn tất."
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <PackageForm
            data={newPackage}
            onChange={setNewPackage}
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
            title="Thêm Gói Dịch Vụ Mới"
            description="Nhập thông tin gói dịch vụ mới. Nhấn thêm mới khi hoàn tất."
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
