import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, BookMarked, FileCheck2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationDropdown from "./NotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import userService from "@/api/userService";
import MessageDropdown from "./MessageDropdown";

const NavLink = ({ to, children, onClick }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} onClick={onClick} className="relative group">
      <span
        className={`text-primary-600/70 hover:text-primary-700 transition-colors ${isActive ? "text-primary-700" : ""
          }`}
      >
        {children}
      </span>
      <span
        className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full
          ${isActive ? "w-full" : "w-0"}`}
      />
    </Link>
  );
};

const NavLinkDropdown = ({ children, menuItems }: any) => {
  const location = useLocation();

  const isAnyActive = menuItems.some((item: any) =>
    location.pathname === item.to
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative group cursor-pointer">
          <span
            className={`text-primary-600/70 hover:text-primary-700 transition-colors ${isAnyActive ? "text-primary-700" : ""}`}
          >
            {children}
          </span>
          <span
            className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full
              ${isAnyActive ? "w-full" : "w-0"}`}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {menuItems.map((item: any, index: number) => (
          <DropdownMenuItem key={index} asChild>
            <Link to={item.to} className="flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const { t } = useLanguage();
  const { isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const userInfoString = localStorage.getItem("userInfo");
          if (!userInfoString) return;

          const userInfo = JSON.parse(userInfoString);
          if (!userInfo.userId) return;

          const response = await userService.getUserById(userInfo.userId);
          if (response.data) {
            localStorage.setItem(
              "userData",
              JSON.stringify({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                image: response.data.image,
              })
            );
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      const userInfo = localStorage.getItem("userInfo");

      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setRole(parsedUserInfo?.role || "");
      }
    } else {
      setRole("");
    }
  }, [isLoggedIn]);


  const handleLogout = () => {
    window.location.href = '/login';
    logout();
  };

  const clientMenuItems = [
    { to: "/client/post-job", label: "Đăng việc làm", icon: Plus },
    { to: "/client/posted-jobs", label: "Đã đăng", icon: FileCheck2 },
    { to: "/client/appointment", label: "Lịch hẹn", icon: BookMarked }
  ];

  const freelancerMenuItems = [
    { to: "/jobs", label: t("jobs"), icon: FileCheck2 },
    { to: "/saved-jobs", label: "Đã lưu", icon: BookMarked },
    { to: "/freelancer/applied-jobs", label: "Đã ứng tuyển", icon: FileCheck2 },
    { to: "/freelancer/appointment", label: "Lịch hẹn", icon: BookMarked }
  ];

  const UserMenu = () => {
    const { t } = useLanguage();
    const userInfoString = localStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : {};

    const [userData, setUserData] = useState({
      firstName: "",
      lastName: "",
      image: "",
    });

    useEffect(() => {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } catch (error) {
          console.error("Lỗi khi parse userData:", error);
        }
      }
    }, []);

    const fullName =
      userData.firstName && userData.lastName
        ? ` ${userData.lastName} ${userData.firstName}`
        : "User";

    const avatarImage = userData.image || "https://github.com/shadcn.png";

    const roleDisplay = () => {
      switch (userInfo.role) {
        case "CLIENT":
          return "Nhà tuyển dụng";
        case "FREELANCER":
          return "Freelancer";
        case "ADMIN":
          return "Quản trị viên";
        default:
          return "";
      }
    };

    const settingsPath =
      userInfo.role === "FREELANCER"
        ? "/settingsfreelancer"
        : userInfo.role === "CLIENT"
          ? "/client/profile"
          : userInfo.role === "ADMIN"
            ? "/admin/dashboard"
            : "/";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full ring-2 ring-offset-2 ring-primary/20 hover:ring-primary/30 transition-all"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarImage} alt={fullName} />
              <AvatarFallback>
                {fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2 border-b border-primary-100">
            <div className="font-medium">{fullName}</div>
            {roleDisplay() && (
              <div className="text-sm text-muted-foreground">
                {roleDisplay()}
              </div>
            )}
          </div>
          <Link to={settingsPath}>
            <DropdownMenuItem className="hover:bg-primary-50 focus:bg-primary-50" style={{cursor: 'pointer'}}>
              <span className="text-primary-700">{t("settings")}</span>
            </DropdownMenuItem>
          </Link>
          <Link to={'wallet'} replace={true} >
            <DropdownMenuItem className="hover:bg-primary-50 focus:bg-primary-50" style={{cursor: 'pointer'}}>
              <span className="text-primary-700">Ví của tôi</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={handleLogout}
            className="hover:bg-destructive-50 focus:bg-destructive-50"
          >
            <LogOut className="mr-2 h-4 w-4 text-destructive-500" />
            <span className="text-destructive-500">{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MobileNavLink = ({ to, children }: any) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`relative px-4 py-2 transition-colors duration-200
          ${isActive
            ? "text-primary-700 bg-primary-100/50"
            : "text-primary-600/70 hover:text-primary-700 hover:bg-primary-100/50"
          } rounded-md`}
        onClick={() => setIsOpen(false)}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary-100/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              width={40}
              src="/favicon.png"
              alt="Favicon"
              className="favicon"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              TalentHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">{t("home")}</NavLink>
            {role === "CLIENT" ? (
              <>
                <NavLink to="/freelancers">{t("freelancers")}</NavLink>
                <NavLinkDropdown menuItems={clientMenuItems}>
                  Quản lý công việc
                </NavLinkDropdown>
              </>
            ) : role === "FREELANCER" ? (
              <>
                <NavLinkDropdown menuItems={freelancerMenuItems}>
                  Quản lý công việc
                </NavLinkDropdown>
                <NavLink to="/reports-freelancer">Báo cáo</NavLink>
              </>
            ) : null}
            <NavLink to="/about">{t("about")}</NavLink>
            <NavLink to="/contact">{t("contact")}</NavLink>
            <NavLink to="/pricing">{t("pricing")}</NavLink>
            
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            <LanguageToggle />
            {isLoggedIn ? (
              <>
                <MessageDropdown />
                <NotificationDropdown />
                <UserMenu />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="border-primary-200 text-primary-700 hover:bg-primary-50 hover:text-black"
                >
                  <Link to="/login">{t("login")}</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <Link to="/register">{t("register")}</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <ModeToggle />
            {isLoggedIn && (
              <>
                <MessageDropdown />
                <NotificationDropdown />
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 bg-gradient-to-b from-background via-primary-50/50 to-background">
            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/">{t("home")}</MobileNavLink>
              <MobileNavLink to="/freelancers">
                {t("freelancers")}
              </MobileNavLink>
              <MobileNavLink to="/jobs">{t("jobs")}</MobileNavLink>
              <MobileNavLink to="/about">{t("about")}</MobileNavLink>
              <MobileNavLink to="/contact">{t("contact")}</MobileNavLink>

              {isLoggedIn ? (
                <div className="pt-4 space-y-2 px-4">
                  <Button
                    variant="outline"
                    className="w-full border-destructive-200 text-destructive-600 hover:bg-destructive-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </Button>
                </div>
              ) : (
                <div className="pt-4 space-y-2 px-4">
                  <Button
                    className="w-full border-primary-200 text-primary-700 hover:bg-primary-50"
                    variant="outline"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/login">{t("login")}</Link>
                  </Button>
                  <Button
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/register">{t("register")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;