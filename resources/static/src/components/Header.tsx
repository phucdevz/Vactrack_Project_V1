
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Dịch vụ", path: "/services" },
    { name: "Bảng giá", path: "/pricing" },
    { name: "Cẩm nang", path: "/guide" },
    { name: "Liên hệ", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/booking" } } });
    } else {
      navigate("/booking");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-6",
        isScrolled
          ? "bg-white/90 backdrop-blur-md py-2 shadow-md"
          : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-bold text-brand-600 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
            <span className="text-white font-semibold">VT</span>
          </div>
          <span className={isScrolled ? "text-brand-700" : "text-brand-500"}>
            VacTrack
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-500",
                isScrolled ? "text-gray-800" : "text-gray-700"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-4 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {user?.name?.split(' ')[0] || 'Tài khoản'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/children")}>
                  Hồ sơ trẻ em
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/vaccination-history")}>
                  Lịch sử tiêm chủng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="px-4"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
          )}
          <Button 
            size="sm" 
            className="px-4 bg-brand-500 hover:bg-brand-600"
            onClick={handleBookingClick}
          >
            Đặt lịch
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-in-right">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block py-2 text-base font-medium text-gray-700 hover:text-brand-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 pb-3 flex flex-col space-y-2">
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/profile" 
                    className="block py-2 text-base font-medium text-gray-700 hover:text-brand-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link 
                    to="/children" 
                    className="block py-2 text-base font-medium text-gray-700 hover:text-brand-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Hồ sơ trẻ em
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-red-500" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Đăng nhập
                </Button>
              )}
              <Button 
                size="sm" 
                className="w-full bg-brand-500 hover:bg-brand-600"
                onClick={() => {
                  handleBookingClick();
                  setMobileMenuOpen(false);
                }}
              >
                Đặt lịch
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
