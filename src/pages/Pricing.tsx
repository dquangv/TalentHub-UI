import { Check, Star, Rocket, Sparkles, Zap, History, Package, Loader2, Info, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import api from "@/api/axiosConfig";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

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
  myPackage?: boolean;
}

interface PackageHistory {
  id: number;
  startDate: string;
  endDate: string;
  price: number;
  numberPost: number;
  numberPosted: number;
  postsUsed: number;
  packageType: string;
  packageTypeName: string;
  usagePeriod: string;
  status: string;
  active: boolean;
}

interface CurrentPackage {
  id: number;
  startDate: string;
  endDate: string;
  price: number;
  numberPost: number;
  numberPosted: number;
  postsRemaining: number;
  packageType: string;
  packageTypeName: string;
  remainingTimeInHours: number;
  remainingTimeFormatted: string;
  active: boolean;
}

const Pricing = () => {
  const [plans, setPlans] = useState<VoucherPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<VoucherPackage | null>(null);
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [packageHistory, setPackageHistory] = useState<PackageHistory[]>([]);
  const [currentPackage, setCurrentPackage] = useState<CurrentPackage | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    if (!userInfoStr) {
      fetchVoucherPackageList();
      return;
    }

    const userInfo = JSON.parse(userInfoStr);
    const clientId = userInfo?.clientId;
    fetchVoucherPackageListByClientId(clientId);
  }, []);

  const fetchPackageHistory = async () => {
    setIsLoadingDetails(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) return;

      const userInfo = JSON.parse(userInfoStr);
      const clientId = userInfo?.clientId;

      const response = await api.get(`/v1/clients/soldpackages/history/${clientId}`);
      if (response.status === 200) {
        setPackageHistory(response.data);
      }
    } catch (err) {
      console.error("Error fetching package history:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const fetchCurrentPackage = async () => {
    setIsLoadingDetails(true);
    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) return;

      const userInfo = JSON.parse(userInfoStr);
      const clientId = userInfo?.clientId;

      const response = await api.get(`/v1/clients/soldpackages/current/${clientId}`);
      if (response.status === 200) {
        setCurrentPackage(response.data);
      }
    } catch (err) {
      console.error("Error fetching current package:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleShowPackageDetails = async () => {
    setShowPackageDetails(true);
    await Promise.all([fetchCurrentPackage(), fetchPackageHistory()]);
  };

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

  const fetchVoucherPackageListByClientId = async (clientId: boolean) => {
    try {
      const response = await api.get(
        "/v1/voucher-packages/all-voucher/client",
        { params: { clientId } }
      );
      setPlans(response.data);
    } catch (err) {
      console.error("Error fetching voucher package list:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (plan: VoucherPackage) => {
    setSelectedPlan(plan);
    setShowConfirmDialog(true);
  };

  const confirmSubscribe = async () => {
    if (!selectedPlan) return;

    try {
      const userInfoStr = localStorage.getItem("userInfo");
      if (!userInfoStr) {
        return;
      }
      const userInfo = JSON.parse(userInfoStr);

      const subscribeData = {
        price: selectedPlan.price,
        status: true,
        typePackage: selectedPlan.typePackage,
        clientId: userInfo.clientId,
      };

      const response = await api.post(
        "/v1/clients/soldpackages",
        subscribeData
      );

      if (response.status === 201) {
        fetchVoucherPackageListByClientId(userInfo.clientId);
      }
    } catch (err) {
      console.error("Error subscribing to package:", err);
    } finally {
      setShowConfirmDialog(false);
      setSelectedPlan(null);
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

  // Function to get the appropriate icon for each package type
  const getPackageIcon = (typePackage) => {
    switch (typePackage) {
      case "Dùng thử":
        return <Sparkles className="w-8 h-8 text-primary" />;
      case "NORMAL":
        return <Check className="w-8 h-8 text-primary" />;
      case "SILVER":
        return <Star className="w-8 h-8 text-primary" />;
      case "GOLD":
        return <Rocket className="w-8 h-8 text-primary" />;
      case "DIAMOND":
        return <Zap className="w-8 h-8 text-primary" />;
      default:
        return <Package className="w-8 h-8 text-primary" />;
    }
  };

  // Function to determine if a plan should show the "popular" badge
  const isPopularPlan = (plan) => {
    return plan.status && plan.typePackage !== "NORMAL" && !plan.myPackage;
  };

  return (
    <>
      <div className="py-20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <FadeInWhenVisible>
              <h1 className="text-4xl font-bold mb-6">Gói Ưu Tiên</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Tăng khả năng tiếp cận và nổi bật hơn với gói ưu tiên
              </p>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleShowPackageDetails}
                >
                  <Package className="w-4 h-4" />
                  <span>Xem thông tin gói đang sử dụng</span>
                </Button>
              </div>
            </FadeInWhenVisible>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <FadeInWhenVisible key={index} delay={0.2 + index * 0.1}>
                <div className="relative h-full pt-5">
                  {isPopularPlan(plan) && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white z-10 shadow-sm">
                      Phổ biến
                    </Badge>
                  )}
                  <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow flex flex-col h-full relative overflow-hidden">
                    <div className="flex flex-col flex-grow">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          {getPackageIcon(plan.typePackage)}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-2xl md:text-3xl font-bold mb-2">
                          {plan.typePackage === "NORMAL" ? (
                            <span className="text-base font-normal text-muted-foreground">
                              Miễn phí
                            </span>
                          ) : (
                            <>
                              {plan.price.toLocaleString()}đ
                              <span className="text-base font-normal text-muted-foreground ml-1">
                                / 30 ngày
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4 mb-8 flex-grow">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Có thể đăng <span className="font-medium">{plan.numberPost}</span> bài/tháng</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>
                            Thời hạn tồn tại của mỗi bài: <span className="font-medium">{plan.duration}</span> ngày
                          </span>
                        </div>
                        {(plan.typePackage === "GOLD" ||
                          plan.typePackage === "DIAMOND") && (
                            <div className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>
                                Có thể sử dụng chat và video call với ứng viên
                              </span>
                            </div>
                          )}
                        {plan.typePackage === "DIAMOND" && (
                          <div className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>
                              Nhận thông báo gợi ý những ứng viên phù hợp
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto">
                      {(plan.typePackage !== "NORMAL" || plan.myPackage) && (
                        <Button
                          className="w-full"
                          variant={plan.status && !plan.myPackage ? "default" : "outline"}
                          disabled={plan.myPackage}
                          onClick={() => handleSubscribe(plan)}
                        >
                          {plan.myPackage ? "Đang sử dụng" : "Đăng ký ngay"}
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {priorityBenefits.map((benefit, index) => (
                <FadeInWhenVisible key={index} delay={index * 0.1}>
                  <Card className="p-6 hover:shadow-md transition-all h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      {benefit.icon}
                      <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    </div>
                    <p className="text-muted-foreground flex-grow">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <FadeInWhenVisible key={index} delay={index * 0.1}>
                  <Card className="p-6 hover:shadow-md transition-all h-full flex flex-col">
                    <h3 className="font-semibold mb-3 text-lg">{faq.question}</h3>
                    <p className="text-muted-foreground flex-grow">{faq.answer}</p>
                  </Card>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng ký gói mới</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPlan?.name} bạn đang dùng vẫn còn hạn sử dụng. Nếu bạn
              đăng ký gói khác, gói cũ sẽ mất. Bạn đã chắc chắn chưa?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Trở lại</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubscribe}>
              Chắc chắn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showPackageDetails} onOpenChange={setShowPackageDetails}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Thông tin gói dịch vụ
            </DialogTitle>
            <DialogDescription>
              Xem chi tiết gói dịch vụ đang sử dụng và lịch sử gói đã mua
            </DialogDescription>
          </DialogHeader>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="current">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Gói hiện tại
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Lịch sử sử dụng
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="mt-4">
                {currentPackage ? (
                  <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">{currentPackage.packageTypeName}</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Thời gian sử dụng:</span>
                            <span className="font-medium">
                              {new Date(currentPackage.startDate).toLocaleDateString('vi-VN')} - {new Date(currentPackage.endDate).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Thời gian còn lại:</span>
                            <span className="font-medium">{currentPackage.remainingTimeFormatted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Giá gói:</span>
                            <span className="font-medium">{currentPackage.price.toLocaleString()}đ</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Tình trạng sử dụng</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-muted-foreground">Bài đăng đã sử dụng:</span>
                              <span className="font-medium">{currentPackage.numberPosted}/{currentPackage.numberPost}</span>
                            </div>
                            <Progress value={(currentPackage.numberPosted / currentPackage.numberPost) * 100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-muted-foreground">Thời gian còn lại:</span>
                              <span className="font-medium">{Math.round(currentPackage.remainingTimeInHours)} giờ</span>
                            </div>
                            <Progress
                              value={(currentPackage.remainingTimeInHours / ((new Date(currentPackage.endDate).getTime() - new Date(currentPackage.startDate).getTime()) / 3600000)) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Bạn chưa sử dụng gói nào</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {packageHistory && packageHistory.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Gói</TableHead>
                          <TableHead>Thời gian sử dụng</TableHead>
                          <TableHead>Giá</TableHead>
                          <TableHead>Bài đăng</TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {packageHistory.map((pkg) => (
                          <TableRow key={pkg.id}>
                            <TableCell className="font-medium">{pkg.packageTypeName}</TableCell>
                            <TableCell>{pkg.usagePeriod}</TableCell>
                            <TableCell>{pkg.price.toLocaleString()}đ</TableCell>
                            <TableCell>{pkg.postsUsed}/{pkg.numberPost}</TableCell>
                            <TableCell>
                              <Badge variant={pkg.active ? "default" : "secondary"}>
                                {pkg.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Không có lịch sử gói</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Pricing;