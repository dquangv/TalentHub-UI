import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertTriangle, Flag, CheckCircle2 } from 'lucide-react';

// Define the form schema with Zod
const reportSchema = z.object({
  reason: z.string({
    required_error: "Vui lòng chọn lý do báo cáo",
  }),
  details: z.string().min(10, {
    message: "Vui lòng nhập ít nhất 10 ký tự",
  }).optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportDialogProps {
  itemId: string;
  itemType: 'job' | 'freelancer' | 'client';
  itemTitle: string;
  children: React.ReactNode;
}

const ReportDialog = ({ itemId, itemType, itemTitle, children }: ReportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reason: '',
      details: '',
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Report submitted:', {
        itemId,
        itemType,
        ...data,
      });
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
        setOpen(false);
        
        toast.success('Báo cáo đã được gửi thành công', {
          description: 'Chúng tôi sẽ xem xét báo cáo của bạn trong thời gian sớm nhất.',
        });
      }, 2000);
    }, 1500);
  };

  const reportReasons = {
    job: [
      { value: 'spam', label: 'Spam hoặc lừa đảo' },
      { value: 'inappropriate', label: 'Nội dung không phù hợp' },
      { value: 'misleading', label: 'Thông tin sai lệch' },
      { value: 'duplicate', label: 'Bài đăng trùng lặp' },
      { value: 'payment', label: 'Vấn đề về thanh toán' },
      { value: 'other', label: 'Lý do khác' },
    ],
    freelancer: [
      { value: 'fake', label: 'Hồ sơ giả mạo' },
      { value: 'inappropriate', label: 'Hành vi không phù hợp' },
      { value: 'misleading', label: 'Thông tin sai lệch' },
      { value: 'spam', label: 'Spam hoặc quấy rối' },
      { value: 'other', label: 'Lý do khác' },
    ],
    client: [
      { value: 'fake', label: 'Hồ sơ giả mạo' },
      { value: 'payment', label: 'Không thanh toán' },
      { value: 'inappropriate', label: 'Hành vi không phù hợp' },
      { value: 'misleading', label: 'Thông tin sai lệch' },
      { value: 'other', label: 'Lý do khác' },
    ],
  };

  const reasons = reportReasons[itemType];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Lý do báo cáo</h4>
                  <RadioGroup 
                    onValueChange={(value) => form.setValue('reason', value)}
                    className="space-y-2"
                  >
                    {reasons.map((reason) => (
                      <div key={reason.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={reason.value} id={reason.value} />
                        <Label htmlFor={reason.value} className="cursor-pointer">
                          {reason.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {form.formState.errors.reason && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.reason.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="details" className="text-sm font-medium">
                    Chi tiết bổ sung (không bắt buộc)
                  </Label>
                  <Textarea
                    id="details"
                    placeholder="Vui lòng cung cấp thêm thông tin chi tiết về vấn đề bạn gặp phải..."
                    className="mt-1"
                    rows={4}
                    {...form.register('details')}
                  />
                  {form.formState.errors.details && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.details.message}
                    </p>
                  )}
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800 dark:text-amber-300">
                    Chúng tôi chỉ xử lý các báo cáo có căn cứ. Việc báo cáo sai mục đích có thể dẫn đến hạn chế tài khoản.
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
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Cảm ơn bạn đã báo cáo!</h2>
            <p className="text-muted-foreground mb-6">
              Chúng tôi đã nhận được báo cáo của bạn và sẽ xem xét trong thời gian sớm nhất.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;