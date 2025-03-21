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
    accessorKey: "schoolName",
    header: "Tên Trường",
  },
  {
    accessorKey: "quantityEducation",
    header: "Số lượng người dùng",
  },
];

export function SchoolsPage() {
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState({ schoolName: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get("/v1/schools");
        setData(response.data);
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải danh sách trường",
          description: "Có lỗi xảy ra khi tải dữ liệu từ server.",
        });
      }
    };
    fetchSchools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName.trim()) {
      notification.error({ message: "Lỗi", description: "Tên trường không được để trống!" });
      return;
    }

    try {
      let response;
      if (editingSchool) {
        response = await api.put(`/v1/schools/${editingSchool.id}`, formData);
        notification.success({ message: "Cập nhật thành công", description: "Trường học đã được cập nhật." });
      } else {
        response = await api.post("/v1/schools", formData);
        notification.success({ message: "Thêm thành công", description: "Trường học đã được thêm." });
      }

      setData((prevData) => {
        if (editingSchool) {
          return prevData.map((school) =>
            school.id === editingSchool.id ? response.data : school
          );
        } else {
          return [response.data, ...prevData];
        }
      });

      setDialogOpen(false);
      setEditingSchool(null);
      setFormData({ schoolName: "" });
    } catch (error) {
      notification.error({
        message: "Lỗi khi thêm/cập nhật trường học",
        description: "Có lỗi xảy ra khi lưu thông tin.",
      });
    }
  };

  const handleEdit = (school: any) => {
    setEditingSchool(school);
    setFormData({ schoolName: school.schoolName });
    setDialogOpen(true);
  };

  const handleDelete = (schoolId: string, quantityEducation: number) => {
    if (quantityEducation > 0) {
      Modal.confirm({
        title: "Xác nhận xóa",
        content: "Trường này có người dùng. Hành động này sẽ xóa toàn bộ các liên quan và không thể thu hồi. Bạn chắc chắn muốn xóa không?",
        onOk: async () => {
          try {
            await api.delete(`/v1/schools/${schoolId}`);
            setData((prevData) => prevData.filter((school) => school.id !== schoolId));
            notification.success({ message: "Xóa thành công", description: "Trường học đã bị xóa." });
          } catch (error) {
            notification.error({ message: "Lỗi khi xóa", description: "Không thể xóa trường học này." });
          }
        },
      });
    } else {
      Modal.confirm({
        title: "Xác nhận xóa",
        content: "Bạn chắc chắn muốn xóa trường này?",
        onOk: async () => {
          try {
            await api.delete(`/v1/schools/${schoolId}`);
            setData((prevData) => prevData.filter((school) => school.id !== schoolId));
            notification.success({ message: "Xóa thành công", description: "Trường học đã bị xóa." });
          } catch (error) {
            notification.error({ message: "Lỗi khi xóa", description: "Không thể xóa trường học này." });
          }
        },
      });
    }
  };

  const filteredData = data.filter((school) =>
    school.schoolName.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Trường Học</h2>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingSchool(null);
              setFormData({ schoolName: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {editingSchool ? "Chỉnh sửa Trường" : "Thêm Trường"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSchool ? "Chỉnh sửa Trường" : "Thêm Trường Mới"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="schoolName">Tên Trường</Label>
                <Input
                  id="schoolName"
                  placeholder="Nhập tên trường"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ schoolName: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingSchool ? "Lưu thay đổi" : "Lưu"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Input */}
      <div className="flex items-center mb-4">
        <Label htmlFor="filter" className="mr-2">Tìm kiếm Trường:</Label>
        <Input
          id="filter"
          placeholder="Nhập tên trường"
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
              const quantity = row.getValue("quantityEducation");
              return (
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(row.original)} variant="outline" className="text-blue-600">
                    Chỉnh sửa
                  </Button>
                  <Button
                    onClick={() => handleDelete(id, quantity)}
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
        data={filteredData}
      />
    </div>
  );
}

export default SchoolsPage;
