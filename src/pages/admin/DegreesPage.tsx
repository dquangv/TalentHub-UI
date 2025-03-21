import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { MoreHorizontal, PlusCircle, Trash2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notification, Modal } from "antd";
import api from "@/api/axiosConfig";

const schoolColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "degreeTitle",
    header: "Tên bằng cấp",
  },
  {
    accessorKey: "quantityEducation",
    header: "Số lượng người dùng",
  },
];

export function DegreesPage() {
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState({ degreeTitle: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDegree, setEditingDegree] = useState<any | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await api.get("/v1/degrees");
        setData(response.data);
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải danh sách bằng cấp",
          description: "Có lỗi xảy ra khi tải dữ liệu từ server.",
        });
      }
    };
    fetchDegrees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degreeTitle.trim()) {
      notification.error({ message: "Lỗi", description: "Tên bằng cấp không được để trống!" });
      return;
    }

    try {
      let response;
      if (editingDegree) {
        response = await api.put(`/v1/degrees/${editingDegree.id}`, formData);
        notification.success({ message: "Cập nhật thành công", description: "Bằng cấp học đã được cập nhật." });
      } else {
        response = await api.post("/v1/degrees", formData);
        notification.success({ message: "Thêm thành công", description: "Bằng cấp học đã được thêm." });
      }

      setData((prevData) => {
        if (editingDegree) {
          return prevData.map((degree) =>
            degree.id === editingDegree.id ? response.data : degree
          );
        } else {
          return [response.data, ...prevData];
        }
      });

      setDialogOpen(false);
      setEditingDegree(null);
      setFormData({ degreeTitle: "" });
    } catch (error) {
      notification.error({
        message: "Lỗi khi thêm/cập nhật bằng cấp học",
        description: "Có lỗi xảy ra khi lưu thông tin.",
      });
    }
  };

  const handleEdit = (degree: any) => {
    setEditingDegree(degree);
    setFormData({ degreeTitle: degree.degreeTitle });
    setDialogOpen(true);
  };

  const handleDelete = (degreeId: string, quantityEducation: number) => {
    if (quantityEducation > 0) {
      Modal.confirm({
        title: "Xóa bằng cấp",
        content: "Bằng cấp này có người dùng. Hành động này sẽ xóa toàn bộ các liên quan và không thể thu hồi. Bạn có chắc chắn muốn xóa không?",
        onOk: async () => {
          try {
            await api.delete(`/v1/degrees/${degreeId}`);
            setData((prevData) => prevData.filter((degree) => degree.id !== degreeId));
            notification.success({ message: "Xóa thành công", description: "Bằng cấp học đã bị xóa." });
          } catch (error) {
            notification.error({ message: "Lỗi khi xóa", description: "Không thể xóa bằng cấp học này." });
          }
        },
      });
    } else {
      Modal.confirm({
        title: "Xóa bằng cấp",
        content: "Bạn có chắc chắn muốn xóa không?",
        onOk: async () => {
          try {
            await api.delete(`/v1/degrees/${degreeId}`);
            setData((prevData) => prevData.filter((degree) => degree.id !== degreeId));
            notification.success({ message: "Xóa thành công", description: "Bằng cấp học đã bị xóa." });
          } catch (error) {
            notification.error({ message: "Lỗi khi xóa", description: "Không thể xóa bằng cấp học này." });
          }
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Bằng Cấp Học</h2>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingDegree(null);
              setFormData({ degreeTitle: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {editingDegree ? "Chỉnh sửa bằng cấp" : "Thêm bằng cấp"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingDegree ? "Chỉnh sửa bằng cấp" : "Thêm bằng cấp Mới"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="degreeTitle">Tên bằng cấp</Label>
                <Input
                  id="degreeTitle"
                  placeholder="Nhập tên bằng cấp"
                  value={formData.degreeTitle}
                  onChange={(e) => setFormData({ degreeTitle: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingDegree ? "Lưu thay đổi" : "Lưu"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Tìm kiếm..."
          className="max-w-sm"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      <DataTable
        columns={[
          ...schoolColumns,
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
              const id = row.getValue("id");
              const quantityEducation = row.getValue("quantityEducation");
              return (
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(row.original)} variant="outline" className="text-blue-600">
                    Chỉnh sửa
                  </Button>
                  <Button
                    onClick={() => handleDelete(id, quantityEducation)}
                    variant="outline"
                    className="text-red-600"
                  >
                    Xóa
                  </Button>
                </div>
              );
            },
          },
        ]}
        data={data.filter((degree) => degree.degreeTitle.toLowerCase().includes(filterValue.toLowerCase()))}
      />
    </div>
  );
}

export default DegreesPage;
