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
import { notification } from "antd";
import api from "@/api/axiosConfig";

const skillColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "skillName",
    header: "Tên kỹ năng",
  },
  {
    accessorKey: "quantityFreelancerSkill",
    header: "Số lượng freelancer",
  },
  {
    accessorKey: "quantityJobSkill",
    header: "Số lượng công việc",
  }
];

export function SkillsPage() {
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState({ skillName: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get("/v1/jobs/skills");
        setData(response.data); 
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải danh sách kỹ năng",
          description: "Có lỗi xảy ra khi tải dữ liệu từ server.",
        });
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skillName.trim()) {
      notification.error({ message: "Lỗi", description: "Tên kỹ năng không được để trống!" });
      return;
    }

    try {
      let response;
      if (editingSkill) {
        response = await api.put(`/v1/jobs/skills/${editingSkill.id}`, formData);
        notification.success({ message: "Cập nhật thành công", description: "Kỹ năng đã được cập nhật." });
      } else {
        response = await api.post("/v1/jobs/skills", formData);
        notification.success({ message: "Thêm thành công", description: "Kỹ năng mới đã được thêm." });
      }

      setData((prevData) => {
        if (editingSkill) {
          return prevData.map((skill) =>
            skill.id === editingSkill.id ? response.data : skill
          );
        } else {
          return [response.data, ...prevData];
        }
      });

      setDialogOpen(false);
      setEditingSkill(null);
      setFormData({ skillName: "" });
    } catch (error) {
      notification.error({
        message: "Lỗi khi thêm/cập nhật kỹ năng",
        description: "Có lỗi xảy ra khi lưu thông tin.",
      });
    }
  };

  const handleEdit = (skill: any) => {
    setEditingSkill(skill);
    setFormData({ skillName: skill.skillName });
    setDialogOpen(true);
  };

  const handleDelete = async (skillId: string) => {
    try {
      await api.delete(`/v1/jobs/skills/${skillId}`);
      setData((prevData) => prevData.filter((skill) => skill.id !== skillId));
      notification.success({ message: "Xóa thành công", description: "Kỹ năng đã bị xóa." });
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa", description: "Không thể xóa kỹ năng này." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Kỹ Năng</h2>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingSkill(null);
              setFormData({ skillName: "" });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {editingSkill ? "Chỉnh sửa kỹ năng" : "Thêm kỹ năng"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Chỉnh sửa kỹ năng" : "Thêm kỹ năng Mới"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="skillName">Tên kỹ năng</Label>
                <Input
                  id="skillName"
                  placeholder="Nhập tên kỹ năng"
                  value={formData.skillName}
                  onChange={(e) => setFormData({ skillName: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingSkill ? "Lưu thay đổi" : "Lưu"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={[
                ...skillColumns,
                {
                  id: "actions",
                  header: "Actions",
                  cell: ({ row }) => {
                    const id = row.getValue("id");
                    return (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit(row.original)} 
                          variant="outline"
                          className="text-blue-600"
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          onClick={() => handleDelete(id)} 
                          variant="outline"
                          className="text-red-600"
                        >
                          Xóa
                        </Button>
                      </div>
                    );
                  },
                },
              ]} data={data} />
    </div>
  );
}

export default SkillsPage;
