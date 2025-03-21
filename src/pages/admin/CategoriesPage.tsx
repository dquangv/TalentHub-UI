import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle, Trash2, Edit2 } from "lucide-react";
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

const categoryColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "categoryTitle",
    header: "Tên danh mục",
  },
  {
    accessorKey: "quantityFreelancer",
    header: "Số lượng freelancer",
  },
  {
    accessorKey: "quantityJob",
    header: "Số lượng công việc",
  },
];

export function CategoriesPage() {
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState({ categoryTitle: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/v1/categories");
        setData(response.data);
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải danh sách danh mục",
          description: "Có lỗi xảy ra khi tải dữ liệu từ server.",
        });
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryTitle.trim()) {
      notification.error({ message: "Lỗi", description: "Tên danh mục không được để trống!" });
      return;
    }

    try {
      let response;
      if (editingCategory) {
        response = await api.put(`/v1/categories/${editingCategory.id}`, formData);
        notification.success({ message: "Cập nhật thành công", description: "Danh mục đã được cập nhật." });
      } else {
        response = await api.post("/v1/categories", formData);
        notification.success({ message: "Thêm thành công", description: "Danh mục đã được thêm." });
      }

      setData((prevData) => {
        if (editingCategory) {
          return prevData.map((category) =>
            category.id === editingCategory.id ? response.data : category
          );
        } else {
          return [response.data, ...prevData];
        }
      });

      setDialogOpen(false);
      setEditingCategory(null);
      setFormData({ categoryTitle: "" });
    } catch (error) {
      notification.error({
        message: "Lỗi khi thêm/cập nhật danh mục",
        description: "Có lỗi xảy ra khi lưu thông tin.",
      });
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({ categoryTitle: category.categoryTitle });
    setDialogOpen(true);
  };

  const handleDelete = (categoryId: string, quantityFreelancer: number, quantityJob: number) => {
    if (quantityFreelancer > 0 || quantityJob > 0) {
      Modal.confirm({
        title: "Xóa danh mục",
        content: "Danh mục này có freelancer hoặc công việc. Bạn có chắc chắn muốn xóa không?",
        onOk: async () => {
          try {
            await api.delete(`/v1/categories/${categoryId}`);
            setData((prevData) => prevData.filter((category) => category.id !== categoryId));
            notification.success({ message: "Xóa thành công", description: "Danh mục đã bị xóa." });
          } catch (error) {
            notification.error({ message: "Lỗi khi xóa", description: "Không thể xóa danh mục này." });
          }
        },
      });
    } else {
      Modal.confirm({
        title: "Xóa danh mục",
        content: "Bạn có chắc chắn muốn xóa không?",
        onOk: async () => {
          try {
            await api.delete(`/v1/categories/${categoryId}`);
            setData((prevData) => prevData.filter((category) => category.id !== categoryId));
            notification.success({ message: "Xóa thành công", description: "Danh mục đã bị xóa." });
          } catch (error) {
            notification.error({ message: "Lỗi khi xóa", description: "Không thể xóa danh mục này." });
          }
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Danh mục</h2>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingCategory(null);
              setFormData({ categoryTitle: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục Mới"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="categoryTitle">Tên danh mục</Label>
                <Input
                  id="categoryTitle"
                  placeholder="Nhập tên danh mục"
                  value={formData.categoryTitle}
                  onChange={(e) => setFormData({ categoryTitle: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingCategory ? "Lưu thay đổi" : "Lưu"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Input */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Tìm kiếm..."
          className="max-w-sm"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>

      {/* DataTable */}
      <DataTable
        columns={[
          ...categoryColumns,
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
              const id = row.getValue("id");
              const quantityFreelancer = row.getValue("quantityFreelancer");
              const quantityJob = row.getValue("quantityJob");
              return (
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(row.original)} variant="outline" className="text-blue-600">
                    Chỉnh sửa
                  </Button>
                  <Button
                    onClick={() => handleDelete(id, quantityFreelancer, quantityJob)}
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
        data={data.filter((category) => category.categoryTitle.toLowerCase().includes(filterValue.toLowerCase()))}
      />
    </div>
  );
}

export default CategoriesPage;
