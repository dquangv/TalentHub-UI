import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
import { toast } from 'sonner';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  QrCode,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Search,
  Calendar,
  DollarSign,
  Copy,
  RefreshCw,
  Plus,
  Landmark,
  Banknote,
} from 'lucide-react';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = () => {
    if (!depositAmount || !depositMethod) {
      toast.error('Vui lòng nhập số tiền và chọn phương thức thanh toán');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Yêu cầu nạp tiền đã được gửi', {
        description: 'Chúng tôi sẽ xử lý giao dịch của bạn trong thời gian sớm nhất.',
      });
      setDepositAmount('');
      setDepositMethod('');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép vào clipboard');
  };

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
                    <p className="text-sm opacity-80">Số dư khả dụng</p>
                    <h2 className="text-3xl font-bold">2.500.000đ</h2>
                  </div>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => setActiveTab('deposit')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nạp tiền
                </Button>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <ArrowUpRight className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng nạp</p>
                    <h2 className="text-2xl font-bold">5.000.000đ</h2>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Cập nhật: Hôm nay, 10:30</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <ArrowDownLeft className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                    <h2 className="text-2xl font-bold">2.500.000đ</h2>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Cập nhật: Hôm nay, 10:30</p>
              </Card>
            </div>
          </FadeInWhenVisible>

          {/* Main Content */}
          <FadeInWhenVisible delay={0.2}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
                <TabsTrigger value="deposit">Nạp tiền</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Tổng quan ví</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <h3 className="font-medium text-muted-foreground">Thông tin ví</h3>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">ID Ví</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">W123456789</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => copyToClipboard('W123456789')}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Trạng thái</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Đang hoạt động
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Ngày tạo</span>
                        <span className="font-medium">15/03/2024</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Cập nhật lần cuối</span>
                        <span className="font-medium">Hôm nay, 10:30</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-muted-foreground">Giao dịch gần đây</h3>
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.type === 'deposit' 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {transaction.type === 'deposit' ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownLeft className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                          <span className={`font-medium ${
                            transaction.type === 'deposit' ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount}
                          </span>
                        </div>
                      ))}
                      <Button 
                        variant="ghost" 
                        className="w-full text-primary"
                        onClick={() => setActiveTab('transactions')}
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
                        <span>Số dư trong ví được sử dụng để thanh toán cho các dịch vụ trên nền tảng.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Giao dịch nạp tiền thường được xử lý trong vòng 24 giờ làm việc.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Liên hệ với chúng tôi nếu bạn cần hỗ trợ về các vấn đề liên quan đến ví.</span>
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
                        placeholder="Tìm kiếm giao dịch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                          <TableHead>Mã giao dịch</TableHead>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Mô tả</TableHead>
                          <TableHead>Loại</TableHead>
                          <TableHead>Số tiền</TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.id}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                transaction.type === 'deposit' 
                                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : transaction.type === 'refund'
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              }>
                                {transaction.type === 'deposit' 
                                  ? 'Nạp tiền' 
                                  : transaction.type === 'refund'
                                  ? 'Hoàn tiền'
                                  : 'Thanh toán'}
                              </Badge>
                            </TableCell>
                            <TableCell className={`font-medium ${
                              transaction.type === 'deposit' || transaction.type === 'refund'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}>
                              {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}{transaction.amount}
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                transaction.status === 'completed' 
                                  ? 'default' 
                                  : transaction.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }>
                                {transaction.status === 'completed' 
                                  ? 'Hoàn thành' 
                                  : transaction.status === 'pending'
                                  ? 'Đang xử lý'
                                  : 'Thất bại'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
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
                      <h2 className="text-xl font-semibold mb-6">Nạp tiền vào ví</h2>
                      
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
                                depositMethod === 'bank' ? 'border-primary bg-primary/5' : ''
                              }`}
                              onClick={() => setDepositMethod('bank')}
                            >
                              <div className="flex flex-col items-center gap-2 text-center">
                                <Landmark className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="font-medium">Chuyển khoản</p>
                                  <p className="text-xs text-muted-foreground">Ngân hàng</p>
                                </div>
                              </div>
                            </Card>
                            
                            <Card 
                              className={`p-4 cursor-pointer border transition-all ${
                                depositMethod === 'card' ? 'border-primary bg-primary/5' : ''
                              }`}
                              onClick={() => setDepositMethod('card')}
                            >
                              <div className="flex flex-col items-center gap-2 text-center">
                                <CreditCard className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="font-medium">Thẻ tín dụng</p>
                                  <p className="text-xs text-muted-foreground">Visa/Mastercard</p>
                                </div>
                              </div>
                            </Card>
                            
                            <Card 
                              className={`p-4 cursor-pointer border transition-all ${
                                depositMethod === 'ewallet' ? 'border-primary bg-primary/5' : ''
                              }`}
                              onClick={() => setDepositMethod('ewallet')}
                            >
                              <div className="flex flex-col items-center gap-2 text-center">
                                <Banknote className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="font-medium">Ví điện tử</p>
                                  <p className="text-xs text-muted-foreground">MoMo/ZaloPay</p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>

                        {depositMethod === 'bank' && (
                          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                            <h3 className="font-medium">Thông tin chuyển khoản</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Ngân hàng</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Vietcombank</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard('Vietcombank')}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Số tài khoản</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">1234567890</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard('1234567890')}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Chủ tài khoản</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">CONG TY VIET FREELANCER</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard('CONG TY VIET FREELANCER')}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Nội dung</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">NAP W123456789</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard('NAP W123456789')}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Sau khi chuyển khoản, vui lòng nhấn "Xác nhận đã chuyển khoản" để chúng tôi kiểm tra và cập nhật số dư cho bạn.
                            </p>
                          </div>
                        )}

                        {depositMethod === 'ewallet' && (
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
                          disabled={!depositAmount || !depositMethod || isProcessing}
                          onClick={handleDeposit}
                        >
                          {isProcessing ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
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
                            <span>Giao dịch nạp tiền thường được xử lý trong vòng 24 giờ làm việc.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Số tiền tối thiểu cho mỗi lần nạp là 100.000đ.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Vui lòng kiểm tra kỹ thông tin trước khi thực hiện giao dịch.</span>
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

// Sample data
const recentTransactions = [
  {
    id: 'TX123456',
    date: '15/03/2024, 10:30',
    description: 'Nạp tiền qua ngân hàng',
    type: 'deposit',
    amount: '1.000.000đ',
    status: 'completed',
  },
  {
    id: 'TX123455',
    date: '14/03/2024, 15:45',
    description: 'Thanh toán dịch vụ Premium',
    type: 'payment',
    amount: '500.000đ',
    status: 'completed',
  },
  {
    id: 'TX123454',
    date: '12/03/2024, 09:15',
    description: 'Nạp tiền qua MoMo',
    type: 'deposit',
    amount: '500.000đ',
    status: 'completed',
  },
];

const transactions = [
  {
    id: 'TX123456',
    date: '15/03/2024, 10:30',
    description: 'Nạp tiền qua ngân hàng',
    type: 'deposit',
    amount: '1.000.000đ',
    status: 'completed',
  },
  {
    id: 'TX123455',
    date: '14/03/2024, 15:45',
    description: 'Thanh toán dịch vụ Premium',
    type: 'payment',
    amount: '500.000đ',
    status: 'completed',
  },
  {
    id: 'TX123454',
    date: '12/03/2024, 09:15',
    description: 'Nạp tiền qua MoMo',
    type: 'deposit',
    amount: '500.000đ',
    status: 'completed',
  },
  {
    id: 'TX123453',
    date: '10/03/2024, 14:20',
    description: 'Thanh toán dịch vụ đăng tin',
    type: 'payment',
    amount: '200.000đ',
    status: 'completed',
  },
  {
    id: 'TX123452',
    date: '08/03/2024, 11:05',
    description: 'Hoàn tiền dịch vụ',
    type: 'refund',
    amount: '100.000đ',
    status: 'completed',
  },
  {
    id: 'TX123451',
    date: '05/03/2024, 16:30',
    description: 'Nạp tiền qua thẻ tín dụng',
    type: 'deposit',
    amount: '2.000.000đ',
    status: 'completed',
  },
  {
    id: 'TX123450',
    date: '01/03/2024, 09:45',
    description: 'Thanh toán dịch vụ đăng tin',
    type: 'payment',
    amount: '300.000đ',
    status: 'completed',
  },
  {
    id: 'TX123449',
    date: '28/02/2024, 13:15',
    description: 'Nạp tiền qua ZaloPay',
    type: 'deposit',
    amount: '500.000đ',
    status: 'pending',
  },
  {
    id: 'TX123448',
    date: '25/02/2024, 10:10',
    description: 'Thanh toán dịch vụ đăng tin',
    type: 'payment',
    amount: '200.000đ',
    status: 'failed',
  },
  {
    id: 'TX123447',
    date: '20/02/2024, 14:50',
    description: 'Nạp tiền qua ngân hàng',
    type: 'deposit',
    amount: '1.000.000đ',
    status: 'completed',
  },
];

// Add Label component if not already defined
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);

export default Wallet;