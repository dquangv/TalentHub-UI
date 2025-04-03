import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseIcon, Mail, Video } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const role = userInfo?.role;

  const handleProtectedLink = (e, path) => {
    if (!userInfo) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <BriefcaseIcon className="h-6 w-6" />
              <span className="text-xl font-bold">TalentHub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Nền tảng kết nối freelancer và doanh nghiệp hàng đầu Việt Nam
            </p>
            <div className="space-y-2">
              <a 
                href="https://www.tiktok.com/@codefaster" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground hover:underline text-sm flex items-center space-x-2"
              >
                <Video className="h-4 w-4" />
                <span>TikTok: @codefaster</span>
              </a>
              <a 
                href="mailto:aimtothemoon07@gmail.com"
                className="text-foreground/60 hover:text-foreground hover:underline text-sm flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>aimtothemoon07@gmail.com</span>
              </a>
            </div>
          </div>

          {role !== "CLIENT" && (
            <div>
              <h3 className="font-semibold mb-4">Dành cho Freelancer</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/jobs" 
                    onClick={(e) => handleProtectedLink(e, '/jobs')}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Tìm việc làm
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/settingsfreelancer" 
                    onClick={(e) => handleProtectedLink(e, '/settingsfreelancer')}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Tạo hồ sơ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/client/post-job" 
                    onClick={(e) => handleProtectedLink(e, '/client/post-job')}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Báo giá dự án
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/wallet" 
                    onClick={(e) => handleProtectedLink(e, '/wallet')}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Quản lý thu nhập
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {role !== "FREELANCER" && (
            <div>
              <h3 className="font-semibold mb-4">Dành cho Doanh nghiệp</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/client/post-job" 
                    onClick={(e) => handleProtectedLink(e, '/client/post-job')}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Đăng việc
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/freelancers" 
                    onClick={(e) => handleProtectedLink(e, '/freelancers')}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Tìm Freelancer
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    onClick={(e) => handleProtectedLink(e, '/about')}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Giải pháp doanh nghiệp
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    onClick={(e) => handleProtectedLink(e, '/pricing')}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Bảng giá
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TalentHub. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;