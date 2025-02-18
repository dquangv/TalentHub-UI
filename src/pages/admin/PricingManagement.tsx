import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    DollarSign,
    Users,
    BarChart,
    Package,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";

const pricingStats = [
    {
        title: "Tổng số gói",
        value: "3",
        description: "Gói dịch vụ đang cung cấp",
        icon: <Package className="h-5 w-5 text-muted-foreground" />,
        trend: "none"
    },
    {
        title: "Người dùng Premium",
        value: "150",
        description: "25% so với tháng trước",
        icon: <Users className="h-5 w-5 text-muted-foreground" />,
        trend: "up"
    },
    {
        title: "Doanh thu từ gói",
        value: "12,500,000đ",
        description: "18% so với tháng trước",
        icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
        trend: "up"
    },
    {
        title: "Tỷ lệ chuyển đổi",
        value: "8.5%",
        description: "2% so với tháng trước",
        icon: <BarChart className="h-5 w-5 text-muted-foreground" />,
        trend: "up"
    }
];

const pricingPlans = [
    {
        id: 1,
        name: "Gói dùng thử",
        price: "Miễn phí",
        duration: "7 ngày",
        features: [
            "Đăng tin ưu tiên (2 tin)",
            "Hiển thị hồ sơ ưu tiên",
            "Tìm kiếm nâng cao",
        ],
        status: "active",
        subscribers: 45,
        revenue: "0đ"
    },
    {
        id: 2,
        name: "Gói tháng",
        price: "299,000đ",
        duration: "1 tháng",
        features: [
            "Đăng tin ưu tiên (10 tin/tháng)",
            "Hiển thị hồ sơ ưu tiên",
            "Tìm kiếm nâng cao không giới hạn",
        ],
        status: "active",
        subscribers: 85,
        revenue: "25,415,000đ"
    },
    {
        id: 3,
        name: "Gói 6 tháng",
        price: "249,000đ/tháng",
        duration: "6 tháng",
        features: [
            "Tất cả tính năng của gói tháng",
            "Đăng tin ưu tiên (15 tin/tháng)",
            "Ưu tiên hiển thị cao nhất",
        ],
        status: "active",
        subscribers: 20,
        revenue: "29,880,000đ"
    }
];

const recentActivities = [
    {
        id: 1,
        action: "Cập nhật giá",
        package: "Gói 6 tháng",
        user: "Admin",
        timestamp: "2 giờ trước",
        type: "update"
    },
    {
        id: 2,
        action: "Thêm tính năng mới",
        package: "Gói tháng",
        user: "Admin",
        timestamp: "5 giờ trước",
        type: "feature"
    },
    {
        id: 3,
        action: "Kích hoạt gói",
        package: "Gói dùng thử",
        user: "Hệ thống",
        timestamp: "1 ngày trước",
        type: "status"
    }
];

export default function PricingManagement() {
    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Quản lý Gói dịch vụ</h1>
                    <p className="text-muted-foreground mt-1">
                        Quản lý các gói dịch vụ và theo dõi hiệu quả
                    </p>
                </div>
                <Button className="gap-2 w-full sm:w-auto">
                    <Plus size={16} />
                    Thêm gói mới
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pricingStats.map((stat, index) => (
                    <Card key={index} className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                {stat.trend === "up" && "↗️"}
                                {stat.trend === "down" && "↘️"}
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pricing Plans Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách gói dịch vụ</CardTitle>
                    <CardDescription>
                        Quản lý thông tin và cấu hình các gói dịch vụ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-4 py-3 text-xs text-left">Tên gói</th>
                                            <th className="px-4 py-3 text-xs text-left">Giá</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-xs text-left">Thời hạn</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-xs text-left">Người dùng</th>
                                            <th className="hidden lg:table-cell px-4 py-3 text-xs text-left">Doanh thu</th>
                                            <th className="px-4 py-3 text-xs text-left">Trạng thái</th>
                                            <th className="px-4 py-3 text-xs text-left">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pricingPlans.map((plan) => (
                                            <tr key={plan.id}>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{plan.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {plan.features[0]}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">{plan.price}</td>
                                                <td className="hidden sm:table-cell px-4 py-3">{plan.duration}</td>
                                                <td className="hidden md:table-cell px-4 py-3">{plan.subscribers}</td>
                                                <td className="hidden lg:table-cell px-4 py-3">{plan.revenue}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200">
                                                        {plan.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Pencil size={14} />
                                                            <span className="hidden sm:inline">Sửa</span>
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Trash2 size={14} />
                                                            <span className="hidden sm:inline">Xóa</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Hoạt động gần đây</CardTitle>
                    <CardDescription>
                        Các thay đổi và cập nhật gói dịch vụ gần đây
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4">
                                <div
                                    className={cn(
                                        "w-2 h-2 rounded-full",
                                        activity.type === "update" && "bg-blue-500",
                                        activity.type === "feature" && "bg-green-500",
                                        activity.type === "status" && "bg-orange-500"
                                    )}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">
                                        {activity.action}: <span className="font-medium">{activity.package}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.user} • {activity.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}