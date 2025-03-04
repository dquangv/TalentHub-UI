import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  Briefcase,
  FileText,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";
import { Button } from "antd";
import { useAuth } from "@/contexts/AuthContext";

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
    icon: Briefcase,
    href: "/employers",
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
    icon: CreditCard,
    href: "/banners",
  },

];

export function Sidebar() {
  const location = useLocation();
  const {logout} = useAuth()
  const navigate = useNavigate()
  const handleLogout =  () => {
     logout()
     navigate("/login")
  }
  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
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