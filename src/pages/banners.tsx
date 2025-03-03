import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { MoreHorizontal, PlusCircle, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { notification } from "antd";
import api from "@/api/axiosConfig";

const bannerColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      return (
        <div className="relative h-20 w-40">
          <img
            src={row.original.image}
            alt={row.original.title}
            className="absolute inset-0 h-full w-full object-cover rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "vendor",
    header: "Nhà cung cấp",
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => {
      return new Date(row.original.updatedAt).toLocaleDateString("vi-VN");
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          status === "active" 
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {status === "active" ? "Đang hiển thị" : "Đã ẩn"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function BannersPage() {
  const [data, setData] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    vendor: "",
    status: "active",
    image: null,
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get("/v1/banners");
        setData(response.data); 
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải danh sách banner",
          description: "Có lỗi khi tải dữ liệu banner từ server.",
        });
      }
    };
    fetchBanners();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prevData) => ({ ...prevData, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, vendor, status, image } = formData;

    if (!title || !vendor || !image) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập đủ thông tin!",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", title);
      formDataToSend.append("vendor", vendor);
      formDataToSend.append("status", status);
      formDataToSend.append("image", image);

      const response = await api.post("/v1/banners", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData((prevData) => [response.data, ...prevData]);
      notification.success({
        message: "Thêm Banner thành công",
        description: "Banner đã được thêm thành công",
      });
    } catch (error) {
      notification.error({
        message: "Lỗi khi thêm banner",
        description: "Có lỗi khi thêm banner mới.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Banner</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Thêm Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Thêm Banner Mới</DialogTitle>
            </DialogHeader>
            <form className="space-y-6 py-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề banner"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Nhà cung cấp</Label>
                <Input
                  id="vendor"
                  placeholder="Nhập tên nhà cung cấp"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Hình ảnh</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Tải ảnh lên
                    </Button>
                  </div>
                  {imagePreview && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  defaultValue="active"
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang hiển thị</SelectItem>
                    <SelectItem value="inactive">Đã ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Hủy
                </Button>
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={bannerColumns} data={data} />
    </div>
  );
}
