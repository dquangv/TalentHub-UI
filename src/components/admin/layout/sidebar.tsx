import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  Building2,
  FileText,
  LayoutDashboard,
  CreditCard,
  AlertTriangle,
  Settings,
  GraduationCap,
  Building,
  Wrench,
  ChevronDown,
  MessageSquare
} from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";
import { Button } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Quản lý Account",
    icon: Users,
    href: "/accounts",
  },
  {
    title: "Quản lý Freelancer",
    icon: Users,
    href: "/freelancers",
  },
  {
    title: "Quản lý Nhà tuyển dụng",
    icon: Building2,
    href: "/employers",
  },
  {
    title: "Quản lý ChatBot",
    icon: MessageSquare,
    href: "/chatbot",
  },
  {
    title: "Quản lý Bài viết",
    icon: FileText,
    href: "/posts",
  },
  {
    title: "Quản lý Gói dịch vụ",
    icon: CreditCard,
    href: "/pricing",
  },
  {
    title: "Quản lý Banners",
    icon: Building,
    href: "/banners",
  },
  {
    title: "Quản lý Báo Cáo",
    icon: AlertTriangle,
    href: "/reports",
  },
  {
    title: "Cấu hình chung",
    icon: Settings,
    subItems: [
      {
        title: "Quản lý Trường",
        href: "/schools",
        icon: GraduationCap,
      },
      {
        title: "Quản lý bằng cấp",
        href: "/degrees",
        icon: GraduationCap,
      },
      {
        title: "Quản lý loại",
        href: "/categories",
        icon: GraduationCap,
      },
      {
        title: "Quản lý kỹ năng",
        icon: Wrench,
        href: "/skills",
      },
    ]
  },
];

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.subItems ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        openSubmenu === item.title ? "bg-accent text-accent-foreground" : "transparent"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openSubmenu === item.title ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    {openSubmenu === item.title && (
                      <div className="pl-6 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className={cn(
                              "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              location.pathname === subItem.href
                                ? "bg-accent text-accent-foreground"
                                : "transparent"
                            )}
                          >
                            <subItem.icon className="mr-2 h-4 w-4" />
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      location.pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "transparent"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
            <Button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                "transparent"
              )}
            >
              <ExitIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar