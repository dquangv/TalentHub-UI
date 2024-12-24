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
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full ring-2 ring-offset-2 ring-primary/20 hover:ring-primary/30 transition-all"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback className="bg-primary-100 text-primary-700">CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <Link to={`/settingsfreelancer`}>
          <DropdownMenuItem className="hover:bg-primary-50 focus:bg-primary-50">
            <span className="text-primary-700">Cài đặt</span>
          </DropdownMenuItem></Link>
        <DropdownMenuItem
          onClick={handleLogout}
          className="hover:bg-destructive-50 focus:bg-destructive-50"
        >
          <LogOut className="mr-2 h-4 w-4 text-destructive-500" />
          <span className="text-destructive-500">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary-100/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <img width={40} src="/favicon.png" alt="Favicon" className="favicon" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              TalentHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-primary-600/70 hover:text-primary-700 transition-colors">
              Trang chủ
            </Link>
            <Link to="/freelancers" className="text-primary-600/70 hover:text-primary-700 transition-colors">
              Freelancers
            </Link>
            <Link to="/jobs" className="text-primary-600/70 hover:text-primary-700 transition-colors">
              Việc làm
            </Link>
            <Link to="/about" className="text-primary-600/70 hover:text-primary-700 transition-colors">
              Về chúng tôi
            </Link>
            <Link to="/contact" className="text-primary-600/70 hover:text-primary-700 transition-colors">
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
                <Button
                  variant="outline"
                  asChild
                  className="border-primary-200 text-primary-700 hover:bg-primary-50"
                >
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
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
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 bg-gradient-to-b from-background via-primary-50/50 to-background">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-primary-600/70 hover:text-primary-700 transition-colors px-4 py-2 hover:bg-primary-100/50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/freelancers"
                className="text-primary-600/70 hover:text-primary-700 transition-colors px-4 py-2 hover:bg-primary-100/50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Freelancers
              </Link>
              <Link
                to="/jobs"
                className="text-primary-600/70 hover:text-primary-700 transition-colors px-4 py-2 hover:bg-primary-100/50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Việc làm
              </Link>
              <Link
                to="/about"
                className="text-primary-600/70 hover:text-primary-700 transition-colors px-4 py-2 hover:bg-primary-100/50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="text-primary-600/70 hover:text-primary-700 transition-colors px-4 py-2 hover:bg-primary-100/50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Liên hệ
              </Link>
              {isLoggedIn ? (
                <div className="pt-4 space-y-2 px-4">
                  <Button
                    variant="outline"
                    className="w-full border-destructive-200 text-destructive-600 hover:bg-destructive-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
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
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                  <Button
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
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