import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BriefcaseIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import NotificationDropdown from './NotificationDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
        <DropdownMenuItem>Cài đặt</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BriefcaseIcon className="h-6 w-6" />
            <span className="text-xl font-bold">TalentHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/60 hover:text-foreground">
              Trang chủ
            </Link>
            <Link to="/freelancers" className="text-foreground/60 hover:text-foreground">
              Freelancers
            </Link>
            <Link to="/jobs" className="text-foreground/60 hover:text-foreground">
              Việc làm
            </Link>
            <Link to="/about" className="text-foreground/60 hover:text-foreground">
              Về chúng tôi
            </Link>
            <Link to="/contact" className="text-foreground/60 hover:text-foreground">
              Liên hệ
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            {isLoggedIn ? (
              <>
                <NotificationDropdown />
                <UserMenu />
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <ModeToggle />
            {isLoggedIn && <NotificationDropdown />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-foreground/60 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/freelancers"
                className="text-foreground/60 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Freelancers
              </Link>
              <Link
                to="/jobs"
                className="text-foreground/60 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Việc làm
              </Link>
              <Link
                to="/about"
                className="text-foreground/60 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="text-foreground/60 hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Liên hệ
              </Link>
              {isLoggedIn ? (
                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="pt-4 space-y-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                  <Button
                    className="w-full"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <Link to="/register">Đăng ký</Link>
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