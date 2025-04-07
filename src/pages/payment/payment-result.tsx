import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Home, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/api/axiosConfig";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    status: "loading",
    userId: "",
    amount: 0,
    errorCode: "",
  });
  const userId =
    JSON.parse(localStorage.getItem("userInfo") || "{}").userId || "";
  const [searchParams] = useSearchParams();

  const getPaymentStatus = (vnp_ResponseCode: string) => {
    if (vnp_ResponseCode === "00") return "success";
    else if (vnp_ResponseCode === "07") return "pending";
    else if (vnp_ResponseCode === "24") return "cancelled";
    else return "failed";
  };

  useEffect(() => {
    const fetchPaymentResult = async () => {
      try {
        // Get all VNPay parameters from URL
        const params = Object.fromEntries(searchParams.entries());
        const vnp_ResponseCode = params.vnp_ResponseCode || "";
        const vnp_Amount = Number.parseFloat(params.vnp_Amount || "0") / 100;

        console.log("vnp_ResponseCode:", vnp_ResponseCode);
        console.log("vnp_ResponseCode:", typeof vnp_ResponseCode);
        console.log("vnp_Amount:", vnp_Amount);
        console.log("userId:", userId);

        const initialStatus = getPaymentStatus(vnp_ResponseCode);
        setPaymentData({
          status: initialStatus,
          userId: userId,
          amount: vnp_Amount,
          errorCode: vnp_ResponseCode,
        });

        // Send all VNPay parameters to the server
        const response = await api.post("/v1/payments/vnpay-callback", {
          vnp_ResponseCode,
          vnp_Amount,
          userId,
        });

        if (response.data && response.data.status) {
          setPaymentData((prev) => ({
            ...prev,
            status: response.data.status,
            userId: response.data.userId || prev.userId,
            amount: response.data.amount || prev.amount,
            errorCode: vnp_ResponseCode,
          }));
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        setPaymentData((prev) => ({
          ...prev,
          status: "failed",
          errorCode: searchParams.get("vnp_ResponseCode") || "Unknown",
        }));
      }
    };

    if (searchParams.has("vnp_ResponseCode")) {
      fetchPaymentResult();
    }
  }, [searchParams, userId]);

  const handleRetry = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/wallet");
    }, 1000);
  };

  const handleHome = () => {
    navigate("/");
  };

  const getStatusContent = () => {
    switch (paymentData.status) {
      case "loading":
        return {
          icon: <Clock className="h-16 w-16 mb-4 animate-pulse" />,
          title: "Đang xử lý...",
          message:
            "Vui lòng đợi trong khi chúng tôi xác nhận thanh toán của bạn.",
          headerClass: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          content: (
            <div className="flex justify-center items-center p-6">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ),
        };
      case "success":
        return {
          icon: <CheckCircle className="h-16 w-16 mb-4" />,
          title: "Thanh toán thành công!",
          message: "Giao dịch của bạn đã được thực hiện thành công.",
          headerClass:
            "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
          content: (
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span>Mã lỗi:</span>
                <span className="font-medium">{paymentData.errorCode}</span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span>Số tiền đã thanh toán:</span>
                <span className="font-bold">
                  {paymentData.amount.toLocaleString()} VNĐ
                </span>
              </div>
              <div className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span>Ngày thanh toán:</span>
                <span>{new Date().toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          ),
        };
      case "pending":
        return {
          icon: <Clock className="h-16 w-16 mb-4" />,
          title: "Thanh toán đang xử lý",
          message:
            "Giao dịch của bạn đang được xử lý. Chúng tôi sẽ thông báo khi hoàn tất.",
          headerClass:
            "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
          content: (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-amber-800 dark:text-amber-300">
                Mã lỗi: {paymentData.errorCode}
              </p>
              <p className="text-amber-800 dark:text-amber-300">
                Số tiền: {paymentData.amount.toLocaleString()} VNĐ
              </p>
            </div>
          ),
        };
      case "cancelled":
        return {
          icon: <XCircle className="h-16 w-16 mb-4" />,
          title: "Thanh toán đã hủy",
          message: "Bạn đã hủy giao dịch này.",
          headerClass: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
          content: (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
              <p className="text-gray-800 dark:text-gray-300">
                Mã lỗi: {paymentData.errorCode}
              </p>
              <p className="text-gray-800 dark:text-gray-300">
                Số tiền: {paymentData.amount.toLocaleString()} VNĐ
              </p>
            </div>
          ),
        };
      case "failed":
      default:
        return {
          icon: <XCircle className="h-16 w-16 mb-4" />,
          title: "Thanh toán thất bại",
          message:
            "Chúng tôi không thể xử lý thanh toán của bạn. Vui lòng thử lại.",
          headerClass: "bg-gradient-to-r from-rose-500 to-red-600 text-white",
          content: (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">
                Chi tiết lỗi:
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Mã lỗi: {paymentData.errorCode}</li>
                <li>Số tiền: {paymentData.amount.toLocaleString()} VNĐ</li>
                <li>
                  Có thể do: Số dư không đủ, thông tin thẻ không hợp lệ, hoặc
                  lỗi mạng
                </li>
              </ul>
            </div>
          ),
        };
    }
  };

  const { icon, title, message, headerClass, content } = getStatusContent();
  const showRetryButton = ["failed", "cancelled"].includes(paymentData.status);

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardHeader className={`text-center ${headerClass}`}>
          <div className="flex flex-col items-center">
            {icon}
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="mt-2 text-white/90">{message}</p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">{content}</CardContent>

        <CardFooter className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-4">
          {paymentData.status === "success" ? (
            <Button
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
              onClick={handleHome}
            >
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          ) : (
            <>
              <Button variant="outline" className="w-1/2" onClick={handleHome}>
                <Home className="mr-2 h-4 w-4" />
                Trang chủ
              </Button>
              {showRetryButton && (
                <Button
                  className="w-1/2 bg-gradient-to-r from-rose-500 to-red-600 text-white"
                  onClick={handleRetry}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Thử lại
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
