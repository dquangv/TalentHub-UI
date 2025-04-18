import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FadeInWhenVisible from "@/components/animations/FadeInWhenVisible";
import { toast } from "sonner";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  QrCode,
  CheckCircle,
  Download,
  DollarSign,
  Copy,
  RefreshCw,
  Plus,
  Landmark,
  Banknote,
} from "lucide-react";
import api from "@/api/axiosConfig";

interface Payments {
  balance: number;
  latestDeposit: number;
  latestDepositDate: string;
  todaySpending: number;
  latestSpendingDate: string;
  oldestTransactionDate: string;
}

interface Transaction {
  id: number;
  money: number;
  activity: string;
  createdAt: string;
  description: string;
  status: string;
}

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [payments, setPayments] = useState<Payments>({
    balance: 0,
    latestDeposit: 0,
    latestDepositDate: "",
    todaySpending: 0,
    latestSpendingDate: "",
    oldestTransactionDate: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 0,
      money: 0,
      activity: "",
      createdAt: "",
      description: "",
      status: "",
    },
  ]);
  const userId = JSON.parse(localStorage.getItem("userInfo") || "{}").userId;

  const handleDeposit = () => {
    if (!depositAmount || !depositMethod) {
      toast.error("Vui lòng nhập số tiền và chọn phương thức thanh toán");
      return;
    }

    if (Number(depositAmount) < 10000) {
      toast.error("Số tiền nạp tối thiểu là 10,000 VND");
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // toast.success("Yêu cầu nạp tiền đã được gửi", {
      //   description:
      //     "Chúng tôi sẽ xử lý giao dịch của bạn trong thời gian sớm nhất.",
      // });
      // setDepositAmount(0);
      // setDepositMethod("");
      getVnpay(Number(depositAmount));
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép vào clipboard");
  };

  // const handleGetVnpay = () => {
  //   if (!depositAmount) {
  //     toast.error("Vui lòng nhập số tiền");
  //     return;
  //   }
  //   getVnpay(depositAmount);
  // };
  const getVnpay = async (amount: number) => {
    try {
      const response = await api.get("/v1/payments/vnpay", {
        params: { amount: Math.round(amount) }, // ✅ Chuyển thành số nguyên
      });
      console.log(response);
      window.location.href = response.data.url;
      setDepositAmount("");
      setDepositMethod("");
    } catch (error) {
      console.log(error);
    }
  };

  const getBalancerClient = async () => {
    try {
      const response = await api.get("/v1/payments/balance", {
        params: { userId: userId },
      });
      console.log(response);
      setPayments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterTransactionsByDate = (transactions: Transaction[]) => {
    const now = new Date();

    switch (dateFilter) {
      case "today":
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return (
            transactionDate.getDate() === now.getDate() &&
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        });

      case "week": {
        const startOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 1)
        ); // Start of the week (Monday)
        const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6)); // End of the week (Sunday)
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        });
      }

      case "month":
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
        });

      case "year":
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return transactionDate.getFullYear() === now.getFullYear();
        });

      default:
        return transactions; // "all" or any other value
    }
  };
  const getTransactionsClient = async () => {
    try {
      const response = await api.get("/v1/transactions", {
        params: { userId: userId },
      });
      console.log(response);
      setTransactions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalancerClient();
    getTransactionsClient();
  }, [userId]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeInWhenVisible>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Ví của tôi</h1>
              <p className="text-muted-foreground">
                Quản lý số dư và giao dịch của bạn
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Balance Cards */}
          <FadeInWhenVisible delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-primary text-primary-foreground">
                <div className="flex items-center gap-4 mb-4">
                  <WalletIcon className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-muted-foreground text-white">
                      Số dư
                    </p>
                    <h2 className="text-3xl font-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(payments.balance)}
                    </h2>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setActiveTab("deposit")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nạp tiền
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <ArrowUpRight className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng nạp</p>
                    <h2 className="text-3xl font-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(payments.latestDeposit)}
                    </h2>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cập nhật:{" "}
                  {payments.latestDepositDate
                    ? new Intl.DateTimeFormat("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date(payments.latestDepositDate))
                    : "Không có dữ liệu"}
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <ArrowDownLeft className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng chi tiêu
                    </p>
                    <h2 className="text-3xl font-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(payments.todaySpending)}
                    </h2>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cập nhật:{" "}
                  {payments.latestSpendingDate
                    ? new Intl.DateTimeFormat("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date(payments.latestSpendingDate))
                    : "Không có dữ liệu"}
                </p>
              </Card>
            </div>
          </FadeInWhenVisible>

          {/* Main Content */}
          <FadeInWhenVisible delay={0.2}>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="transactions">
                  Lịch sử giao dịch
                </TabsTrigger>
                <TabsTrigger value="deposit">Nạp tiền</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Tổng quan ví</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <h3 className="font-medium text-muted-foreground">
                        Thông tin ví
                      </h3>
                      <div className="flex justify-between py-2 border-b">
                        {/* <span className="text-muted-foreground">ID Ví</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{userId || "Không xác định"}</span>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(userId)}
                        >
                        <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div> */}
                      </div>
                      {/* <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">
                        Trạng thái
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      >
                        Đang hoạt động
                      </Badge>
                      </div> */}
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Ngày tạo</span>
                        <span className="font-medium">
                          {payments.latestDepositDate
                            ? new Intl.DateTimeFormat("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }).format(
                                new Date(payments.oldestTransactionDate)
                              )
                            : "Không có dữ liệu"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">
                          Cập nhật lần cuối
                        </span>
                        <span className="font-medium">
                          {payments.latestDepositDate
                            ? new Intl.DateTimeFormat("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(payments.latestDepositDate))
                            : "Không có dữ liệu"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-muted-foreground">
                        Giao dịch gần đây
                      </h3>
                      {transactions.slice(0, 3).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between py-2 border-b"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                transaction.activity === "Nạp tiền"
                                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}
                            >
                              {transaction.activity === "Nạp tiền" ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownLeft className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.createdAt
                                  ? new Intl.DateTimeFormat("vi-VN", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(new Date(transaction.createdAt))
                                  : "Không rõ thời gian"}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`font-medium ${
                              transaction.activity === "Nạp tiền"
                                ? "text-green-600"
                                : "text-amber-600"
                            }`}
                          >
                            {transaction.activity === "Nạp tiền" ? "+" : "-"}
                            {transaction.money}
                          </span>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        className="w-full text-primary"
                        onClick={() => setActiveTab("transactions")}
                      >
                        Xem tất cả giao dịch
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Lưu ý</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>
                          Số dư trong ví được sử dụng để thanh toán cho các dịch
                          vụ trên nền tảng.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>
                          Tiền đã nạp vào ví thành công sẽ không thể rút lại.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>
                          Liên hệ với chúng tôi nếu bạn cần hỗ trợ về các vấn đề
                          liên quan đến ví.
                        </span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Lịch sử giao dịch</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Làm mới
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất Excel
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Tìm kiếm mô tả..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="mb-4"
                      />
                    </div>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Thời gian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="today">Hôm nay</SelectItem>
                        <SelectItem value="week">Tuần này</SelectItem>
                        <SelectItem value="month">Tháng này</SelectItem>
                        <SelectItem value="year">Năm nay</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Loại giao dịch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="deposit">Nạp tiền</SelectItem>
                        <SelectItem value="payment">Thanh toán</SelectItem>
                        <SelectItem value="refund">Hoàn tiền</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="pending">Đang xử lý</SelectItem>
                        <SelectItem value="failed">Thất bại</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Transactions Table */}
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {/* <TableHead>Mã giao dịch</TableHead> */}
                          <TableHead>Ngày</TableHead>
                          <TableHead>Mô tả</TableHead>
                          <TableHead>Loại</TableHead>
                          <TableHead>Số tiền</TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterTransactionsByDate(transactions).map(
                          (transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                {transaction.createdAt
                                  ? new Intl.DateTimeFormat("vi-VN", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(new Date(transaction.createdAt))
                                  : "Không rõ thời gian"}
                              </TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    transaction.activity === "Nạp tiền"
                                      ? "bg-green-100 text-green-700"
                                      : transaction.activity === "Rút tiền"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {transaction.activity}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(transaction.money)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    transaction.status === "SUCCESS"
                                      ? "bg-green-200 text-green-800"
                                      : transaction.status === "PENDING"
                                      ? "bg-yellow-200 text-yellow-800"
                                      : "bg-red-200 text-red-800"
                                  }`}
                                >
                                  {transaction.status === "SUCCESS"
                                    ? "Thành công"
                                    : transaction.status === "PENDING"
                                    ? "Đang xử lý"
                                    : "Thất bại"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      Hiển thị 1-10 của 24 giao dịch
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Trước
                      </Button>
                      <Button variant="outline" size="sm">
                        Tiếp
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Deposit Tab */}
              <TabsContent value="deposit">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-6">
                        Nạp tiền vào ví
                      </h2>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Số tiền</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              type="number"
                              placeholder="Nhập số tiền"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Phương thức thanh toán</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card
                              className={`p-4 cursor-pointer border transition-all ${
                                depositMethod === "bank"
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                              onClick={() => setDepositMethod("bank")}
                            >
                              <div className="flex flex-col items-center gap-2 text-center">
                                <Landmark className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="font-medium">Chuyển khoản</p>
                                  <p className="text-xs text-muted-foreground">
                                    Ngân hàng
                                  </p>
                                </div>
                              </div>
                            </Card>

                            <Card
                              className={`p-4 cursor-pointer border transition-all ${
                                depositMethod === "card"
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                              onClick={() => setDepositMethod("card")}
                            >
                              <div className="flex flex-col items-center gap-2 text-center">
                                <CreditCard className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="font-medium">Vnpay</p>
                                  <p className="text-xs text-muted-foreground">
                                    Thanh toán Vnppay
                                  </p>
                                </div>
                              </div>
                            </Card>

                            <Card
                              className={`p-4 cursor-pointer border transition-all ${
                                depositMethod === "ewallet"
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                              onClick={() => setDepositMethod("ewallet")}
                            >
                              <div className="flex flex-col items-center gap-2 text-center">
                                <Banknote className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="font-medium">Ví điện tử</p>
                                  <p className="text-xs text-muted-foreground">
                                    MoMo/ZaloPay
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>

                        {depositMethod === "bank" && (
                          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                            <h3 className="font-medium">
                              Thông tin chuyển khoản
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Ngân hàng
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    Vietcombank
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard("Vietcombank")
                                    }
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Số tài khoản
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    1234567890
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard("1234567890")
                                    }
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Chủ tài khoản
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    CONG TY VIET FREELANCER
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard("CONG TY VIET FREELANCER")
                                    }
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Nội dung
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    NAP W123456789
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard("NAP W123456789")
                                    }
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Sau khi chuyển khoản, vui lòng nhấn "Xác nhận đã
                              chuyển khoản" để chúng tôi kiểm tra và cập nhật số
                              dư cho bạn.
                            </p>
                          </div>
                        )}

                        {depositMethod === "ewallet" && (
                          <div className="flex flex-col items-center p-6 border rounded-lg">
                            <QrCode className="w-32 h-32 text-primary mb-4" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Quét mã QR để thanh toán
                            </p>
                            <Badge>Mã nạp tiền: NAP123456</Badge>
                          </div>
                        )}

                        <Button
                          className="w-full"
                          disabled={
                            !depositAmount ||
                            !depositMethod ||
                            isProcessing ||
                            depositMethod !== "card"
                          }
                          onClick={handleDeposit}
                        >
                          {isProcessing ? "Đang xử lý..." : "Xác nhận nạp tiền"}
                        </Button>
                      </div>
                    </Card>
                  </div>

                  <div>
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Hướng dẫn nạp tiền</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            1
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Nhập số tiền bạn muốn nạp vào ví
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            2
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Chọn phương thức thanh toán phù hợp
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            3
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Hoàn tất thanh toán theo hướng dẫn
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            4
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Số dư sẽ được cập nhật sau khi xác nhận thanh toán
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-semibold mb-4">Lưu ý</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>
                              Tiền đã nạp vào ví thành công sẽ không thể rút
                              lại.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>
                              Số tiền tối thiểu cho mỗi lần nạp là 50.000đ.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>
                              Vui lòng kiểm tra kỹ thông tin trước khi thực hiện
                              giao dịch.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  );
};

// Add Label component if not already defined
const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);

export default Wallet;
