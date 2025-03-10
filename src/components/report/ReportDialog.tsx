import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Flag, CheckCircle2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosConfig";
import { Input } from "../ui/input";

interface ReportDialogProps {
  itemId: string;
  itemType: "job" | "freelancer" | "client";
  itemTitle: string;
  children: React.ReactNode;
}

const ReportDialog = ({
  itemId,
  itemType,
  itemTitle,
  children,
}: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    details: "",
  });
  const [errors, setErrors] = useState({
    reason: "",
    details: "",
  });

  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      reason: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let tempErrors = { reason: "", details: "" };

    if (!formData.reason) {
      tempErrors.reason = "Vui lòng chọn lý do báo cáo";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    console.log(userInfo);
    if (!userInfo?.freelancerId) {
      setIsSubmitting(false);

      navigate("/");
      return;
    }
    const requestData = {
      freelancerId: userInfo.freelancerId,
      jobId: itemId,
      reasonFreelancer: formData.reason,
      reasonAdmin: "",
      status: "REPORTED",
      description: formData.details || "",
    };

    try {
      await api.post("/v1/reported-jobs", requestData);

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      setIsSubmitting(false);
    }
  };

  const reportReasons = {
    job: [
      { value: "Spam hoặc lừa đảo", label: "Spam hoặc lừa đảo" },
      { value: "Nội dung không phù hợp", label: "Nội dung không phù hợp" },
      { value: "Thông tin sai lệch", label: "Thông tin sai lệch" },
      { value: "Bài đăng trùng lặp", label: "Bài đăng trùng lặp" },
      { value: "Vấn đề về thanh toán", label: "Vấn đề về thanh toán" },
      { value: "Lý do khác", label: "Lý do khác" },
    ],
    freelancer: [
      { value: "fake", label: "Hồ sơ giả mạo" },
      { value: "inappropriate", label: "Hành vi không phù hợp" },
      { value: "misleading", label: "Thông tin sai lệch" },
      { value: "spam", label: "Spam hoặc quấy rối" },
      { value: "other", label: "Lý do khác" },
    ],
    client: [
      { value: "fake", label: "Hồ sơ giả mạo" },
      { value: "payment", label: "Không thanh toán" },
      { value: "inappropriate", label: "Hành vi không phù hợp" },
      { value: "misleading", label: "Thông tin sai lệch" },
      { value: "other", label: "Lý do khác" },
    ],
  };

  const reasons = reportReasons[itemType];
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[600px]">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-destructive" />
                Báo cáo
              </DialogTitle>
              <DialogDescription>
                Báo cáo "{itemTitle}" vì lý do vi phạm quy định cộng đồng
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-6 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Lý do báo cáo</h4>
                  <RadioGroup
                    value={formData.reason}
                    onValueChange={handleRadioChange}
                    className="space-y-2"
                  >
                    {reasons.map((reason) => (
                      <div
                        key={reason.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={reason.value}
                          id={reason.value}
                        />
                        <Label
                          htmlFor={reason.value}
                          className="cursor-pointer"
                        >
                          {reason.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.reason && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.reason}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="details" className="text-sm font-medium">
                    Chi tiết bổ sung (không bắt buộc)
                  </Label>
                  <Textarea
                    id="details"
                    name="details"
                    placeholder="Vui lòng cung cấp thêm thông tin chi tiết về vấn đề bạn gặp phải..."
                    className="mt-1"
                    rows={4}
                    value={formData.details}
                    onChange={handleInputChange}
                  />
                  {errors.details && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.details}
                    </p>
                  )}
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
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Tải ảnh lên
                      </Button>
                    </div>
                    {imagePreview && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border w-[100px]">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-300">
                    Chúng tôi chỉ xử lý các báo cáo có căn cứ. Việc báo cáo sai
                    mục đích có thể dẫn đến hạn chế tài khoản.
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Cảm ơn bạn đã báo cáo!
            </h2>
            <p className="text-muted-foreground mb-6">
              Chúng tôi đã nhận được báo cáo của bạn và sẽ xem xét trong thời
              gian sớm nhất.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
