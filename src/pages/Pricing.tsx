import { Check, Star, Rocket, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { Loader2 } from "lucide-react";
import api from "@/api/axiosConfig";

export const trialFeatures = [
  "Đăng tin ưu tiên (2 tin)",
  "Hiển thị hồ sơ ưu tiên",
  "Tìm kiếm nâng cao",
  "Lọc ứng viên theo kỹ năng",
  "Hỗ trợ cơ bản",
];

export const monthlyFeatures = [
  "Đăng tin ưu tiên (10 tin/tháng)",
  "Hiển thị hồ sơ ưu tiên",
  "Tìm kiếm nâng cao không giới hạn",
  "Lọc ứng viên theo nhiều tiêu chí",
  "Xem thông tin liên hệ ứng viên",
  "Hỗ trợ ưu tiên",
  "Báo cáo hiệu quả tuyển dụng",
];

export const annualFeatures = [
  "Tất cả tính năng của gói 1 tháng",
  "Đăng tin ưu tiên (15 tin/tháng)",
  "Ưu tiên hiển thị cao nhất",
  "Công cụ quản lý tuyển dụng",
  "Phân tích dữ liệu ứng viên",
  "Hỗ trợ 24/7",
  "Tư vấn chiến lược tuyển dụng",
];

export const priorityBenefits = [
  {
    icon: <Star className="w-8 h-8 text-primary" />,
    title: "Đăng tin ưu tiên",
    description:
      "Tin tuyển dụng của bạn sẽ được hiển thị ở vị trí nổi bật, tiếp cận nhiều ứng viên hơn.",
  },
  {
    icon: <Rocket className="w-8 h-8 text-primary" />,
    title: "Tìm kiếm nâng cao",
    description:
      "Sử dụng bộ lọc nâng cao để tìm kiếm ứng viên phù hợp theo nhiều tiêu chí.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: "Tiếp cận nhân tài",
    description:
      "Xem thông tin chi tiết và liên hệ trực tiếp với các ứng viên tiềm năng.",
  },
];

export const faqs = [
  {
    question: "Làm thế nào để nâng cấp lên gói ưu tiên?",
    answer:
      "Bạn có thể dễ dàng nâng cấp tài khoản trong phần cài đặt. Việc nâng cấp sẽ có hiệu lực ngay lập tức.",
  },
  {
    question: "Tôi có thể hủy gói ưu tiên không?",
    answer:
      "Có, bạn có thể hủy bất cứ lúc nào. Phần còn lại sẽ được hoàn tiền theo tỷ lệ thời gian chưa sử dụng.",
  },
  {
    question: "Có giới hạn số lượng tin đăng không?",
    answer:
      "Mỗi gói có số lượng tin đăng ưu tiên khác nhau. Bạn có thể xem chi tiết trong phần mô tả của từng gói.",
  },
  {
    question: "Làm sao để tận dụng tốt nhất gói ưu tiên?",
    answer:
      "Chúng tôi cung cấp hướng dẫn chi tiết và tư vấn để giúp bạn tối ưu hiệu quả tuyển dụng với gói ưu tiên.",
  },
];

interface VoucherPackage {
  id: number;
  name: string;
  price: number;
  duration: number;
  typePackage: string;
  numberPost?: number;
  status: boolean;
}

const Pricing = () => {
  const [plans, setPlans] = useState<VoucherPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVoucherPackageList();
  }, []);

  const fetchVoucherPackageList = async () => {
    try {
      const response = await api.get("/v1/voucher-packages/all-voucher");
      setPlans(response.data);
    } catch (err) {
      console.error("Error fetching voucher package list:", err);
    } finally {
      setIsLoading(false);
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
      <div className="py-20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeInWhenVisible>
              <h1 className="text-4xl font-bold mb-6">Gói Ưu Tiên</h1>
              <p className="text-xl text-muted-foreground">
                Tăng khả năng tiếp cận và nổi bật hơn với gói ưu tiên
              </p>
            </FadeInWhenVisible>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <FadeInWhenVisible key={index} delay={0.2 + index * 0.1}>
                <Card className="p-8 hover:shadow-lg transition-shadow flex flex-col justify-between h-full relative">
                  {plan.status && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white">
                      Phổ biến
                    </Badge>
                  )}
                  <div>
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {plan.typePackage === "Dùng thử" ? (
                          <Sparkles className="w-6 h-6 text-primary" />
                        ) : plan.duration <= 30 ? (
                          <Rocket className="w-6 h-6 text-primary" />
                        ) : (
                          <Zap className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {plan.name}
                      </h3>
                      <div className="text-3xl font-bold mb-2">
                        {plan.price.toLocaleString()}đ
                        <span className="text-base font-normal text-muted-foreground">
                          {plan.typePackage === "Dùng thử" ? " / 7 ngày" : " / tháng"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary" />
                        <span>Có thể đăng {plan.numberPost} bài/tháng</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary" />
                        <span>Thời hạn tồn tại của mỗi bài: {plan.duration} ngày</span>
                      </div>
                      {(plan.typePackage === "GOLD" || plan.typePackage === "DIAMOND") && (
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary" />
                          <span>Có thể sử dụng chat và video call với ứng viên</span>
                        </div>
                      )}
                      {(plan.typePackage === "DIAMOND") && (
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary" />
                          <span>Nhận thông báo gợi ý những ứng viên phù hợp</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    variant={plan.status ? "default" : "outline"}
                  >
                    Đăng ký ngay
                  </Button>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Priority Features */}
          <div className="mt-20">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold text-center mb-12">
                Đặc quyền của gói Ưu tiên
              </h2>
            </FadeInWhenVisible>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {priorityBenefits.map((benefit, index) => (
                <FadeInWhenVisible key={index} delay={index * 0.1}>
                  <Card className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {benefit.icon}
                      <h3 className="font-semibold">{benefit.title}</h3>
                    </div>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold text-center mb-12">
                Câu hỏi thường gặp
              </h2>
            </FadeInWhenVisible>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <FadeInWhenVisible key={index} delay={index * 0.1}>
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
