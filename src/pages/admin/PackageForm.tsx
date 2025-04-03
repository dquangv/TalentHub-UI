import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface PackageFormProps {
  data: any;
  onChange: (data: any) => void;
  onSubmit: (e: any) => void;
  onCancel: () => void;
  title: string;
  description: string;
  isSubmitting: boolean;
}

const PackageForm = ({ data, onChange, onSubmit, onCancel, title, description, isSubmitting }: PackageFormProps) => (
  <form onSubmit={onSubmit}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tên gói</label>
        <input
          type="text"
          disabled={true}
          className="w-full p-2 border rounded-md"
          value={data.name || ""}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Giá (VNĐ)</label>
        <input
          type="number"
          className="w-full p-2 border rounded-md"
          value={data.price || 0}
          onChange={(e) => onChange({ ...data, price: parseInt(e.target.value, 10) })}
          required
          min="0"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Số lương bài post</label>
        <input
          type="number"
          className="w-full p-2 border rounded-md"
          value={data.numberPost || 0}
          onChange={(e) => onChange({ ...data, numberPost: parseInt(e.target.value, 10) })}
          required
          min="0"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Thời hạn (ngày)</label>
        <input
          type="number"
          className="w-full p-2 border rounded-md"
          value={data.duration || 0}
          onChange={(e) => onChange({ ...data, duration: parseInt(e.target.value, 10) })}
          required
          min="1"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Trạng thái</label>
        <select
          className="w-full p-2 border rounded-md"
          value={data.status ? "true" : "false"}
          onChange={(e) => onChange({ ...data, status: e.target.value === "true" })}
        >
          <option value="true">Đang hoạt động</option>
          <option value="false">Tạm dừng</option>
        </select>
      </div>
    </div>

    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        Hủy
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {data.id ? 'Lưu thay đổi' : 'Thêm mới'}
      </Button>
    </DialogFooter>
  </form>
);

export default PackageForm;
