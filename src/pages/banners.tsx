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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { notification } from "antd";
import api from "@/api/axiosConfig";
import { bannerColumns } from "@/components/admin/data-table/columns";

export function BannersPage() {
  const [data, setData] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    vendor: "",
    price: "",
    status: "true",
    image: null as File | null,
    logo: null as File | null,
    startTime: "",
    endTime: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormData((prevData) => ({ ...prevData, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, vendor, price, status, image, logo, startTime, endTime } = formData;

    if (!title || !vendor || !price || !startTime || !endTime) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập đủ thông tin!",
      });
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      notification.error({
        message: "Lỗi",
        description: "Thời gian kết thúc phải sau thời gian bắt đầu!",
      });
      return;
    }

    if (parseFloat(price) <= 0) {
      notification.error({
        message: "Lỗi",
        description: "Giá phải lớn hơn 0!",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", title);
      formDataToSend.append("vendor", vendor);
      formDataToSend.append("price", price);
      formDataToSend.append("status", status);
      if (image) formDataToSend.append("image", image);
      if (logo) formDataToSend.append("logo", logo);
      formDataToSend.append("startTime", startTime);
      formDataToSend.append("endTime", endTime);

      let response;
      if (editingBanner) {
        response = await api.put(
          `/v1/banners/${editingBanner.id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        notification.success({
          message: "Cập nhật Banner thành công",
          description: "Banner đã được cập nhật thành công",
        });
      } else {
        response = await api.post("/v1/banners", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          });
        notification.success({
          message: "Thêm Banner thành công",
          description: "Banner đã được thêm thành công",
        });
      }

      setData((prevData) => {
        if (editingBanner) {
          return prevData.map((banner) =>
            banner.id === editingBanner.id ? response.data : banner
          );
        } else {
          return [response.data, ...prevData];
        }
      });

      setDialogOpen(false);
      setEditingBanner(null);
      clearFormData();
    } catch (error) {
      notification.error({
        message: "Lỗi khi thêm/cập nhật banner",
        description: "Có lỗi khi thêm hoặc cập nhật banner.",
      });
    }
  };

  const handleEdit = (banner: any) => {
    const formatDate = (dateString: string) => {
      return dateString.split("T")[0];
    };

    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      vendor: banner.vendor,
      price: banner.price.toString(),
      status: String(banner.status),
      image: null,
      logo: null,
      startTime: formatDate(banner.startTime),
      endTime: formatDate(banner.endTime),
    });
    setImagePreview(banner.image);
    setLogoPreview(banner.logo);
    setDialogOpen(true);
  };

  const handleDelete = async (bannerId: string) => {
    try {
      await api.delete(`/v1/banners/${bannerId}`);
      setData((prevData) =>
        prevData.filter((banner) => banner.id !== bannerId)
      );
      notification.success({
        message: "Xóa Banner thành công",
        description: "Banner đã được xóa thành công",
      });
    } catch (error) {
      notification.error({
        message: "Lỗi khi xóa banner",
        description: "Có lỗi khi xóa banner.",
      });
    }
  };

  const clearFormData = () => {
    setFormData({
      title: "",
      vendor: "",
      price: "",
      status: "true",
      image: null,
      logo: null,
      startTime: "",
      endTime: "",
    });
    setImagePreview(null);
    setLogoPreview(null);
    setEditingBanner(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Banner</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) clearFormData();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-white z-10 py-2">
              <DialogTitle>
                {editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner Mới"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6 py-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề banner"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Nhà cung cấp</Label>
                <Input
                  id="vendor"
                  placeholder="Nhập tên nhà cung cấp"
                  value={formData.vendor}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Giá</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Nhập giá banner"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                <Input
                  id="startTime"
                  type="date"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Thời gian kết thúc</Label>
                <Input
                  id="endTime"
                  type="date"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
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
                        alt="Image Preview"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => document.getElementById("logo")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Tải logo lên
                    </Button>
                  </div>
                  {logoPreview && (
                    <div className="relative aspect-square w-24 overflow-hidden rounded-lg border">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Đang hiển thị</SelectItem>
                    <SelectItem value="false">Đã ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingBanner ? "Lưu thay đổi" : "Lưu"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={[
          ...bannerColumns,
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
        ]}
        data={data}
      />
    </div>
  );
}

export default BannersPage;