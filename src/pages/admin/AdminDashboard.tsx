import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    LayoutDashboard,
    Briefcase,
    ChartBar,
    Settings,
    Menu,
    X,
    Sun,
    Moon,
    AlertTriangle
} from "lucide-react";

// Types
interface StatItem {
    title: string;
    value: string;
    description: string;
}

interface MenuItem {
    id: string;
    label: string;
    icon: JSX.Element;
}

// Sample data
const stats: StatItem[] = [
    {
        title: "Tổng số khách hàng",
        value: "2,350",
        description: "↗️ 12% so với tháng trước"
    },
    {
        title: "Tổng số freelancer",
        value: "1,200",
        description: "↗️ 8% so với tháng trước"
    },
    {
        title: "Dự án đang thực hiện",
        value: "45",
        description: "↘️ 5% so với tháng trước"
    },
    {
        title: "Doanh thu tháng",
        value: "$35,000",
        description: "↗️ 15% so với tháng trước"
    }
];

// Menu items
const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'customers', label: 'Khách hàng', icon: <Users size={20} /> },
    { id: 'freelancers', label: 'Freelancer', icon: <Users size={20} /> },
    { id: 'projects', label: 'Dự án', icon: <Briefcase size={20} /> },
    { id: 'statistics', label: 'Thống kê', icon: <ChartBar size={20} /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings size={20} /> },
    { id: 'reports', label: 'Quản lý báo cáo', icon: <AlertTriangle size={20} /> },
];

// Layout component
const AdminLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [activeMenu, setActiveMenu] = useState<string>('dashboard');
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-card border-r border-border transition-all duration-300 relative`}
            >
                <div className="p-4 flex justify-between items-center border-b border-border">
                    <h1 className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>
                        Admin
                    </h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </div>

                <nav className="mt-4">
                    {menuItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeMenu === item.id ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-2 mb-1 ${!isSidebarOpen ? 'justify-center' : ''
                                }`}
                            onClick={() => setActiveMenu(item.id)}
                        >
                            {item.icon}
                            <span className={!isSidebarOpen ? 'hidden' : ''}>
                                {item.label}
                            </span>
                        </Button>
                    ))}
                </nav>

                {/* Theme Toggle */}
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`w-full ${!isSidebarOpen ? 'justify-center' : 'justify-start gap-2'}`}
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span className={!isSidebarOpen ? 'hidden' : ''}>
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
};

// Dashboard Content Component
const DashboardContent = (): JSX.Element => {
    return (
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Dự án gần đây</CardTitle>
                    <CardDescription>
                        Danh sách các dự án đang thực hiện và mới cập nhật
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground">
                        Dữ liệu dự án sẽ được hiển thị ở đây
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê freelancer</CardTitle>
                        <CardDescription>
                            Phân bố freelancer theo lĩnh vực
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground">
                            Biểu đồ thống kê sẽ được hiển thị ở đây
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê khách hàng</CardTitle>
                        <CardDescription>
                            Phân bố khách hàng theo ngành nghề
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-muted-foreground">
                            Biểu đồ thống kê sẽ được hiển thị ở đây
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const AdminDashboard = (): JSX.Element => {
    return (
        <AdminLayout>
            <DashboardContent />
        </AdminLayout>
    );
};

export default AdminDashboard;