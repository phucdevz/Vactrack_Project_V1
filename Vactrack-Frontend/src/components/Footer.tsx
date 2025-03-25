
import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 text-2xl font-bold text-brand-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                <span className="text-white font-semibold">VT</span>
              </div>
              <span>VacTrack</span>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Hệ thống quản lý tiêm chủng hàng đầu Việt Nam, tự hào mang đến dịch vụ chăm sóc sức khỏe chất lượng cao cho trẻ em trên toàn quốc.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-500 mr-2 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  22 Đường Nguyễn Văn Cừ, Phường Cầu Kho, Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center">
                <PhoneCall className="h-5 w-5 text-brand-500 mr-2" />
                <span className="text-gray-600 text-sm">1900 6788</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-brand-500 mr-2" />
                <span className="text-gray-600 text-sm">info@vactrack.vn</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 text-brand-500 mr-2" />
                <span className="text-gray-600 text-sm">8:00 - 17:30, Thứ 2 - Chủ nhật</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Truy cập nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-500 transition-colors text-sm">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-brand-500 transition-colors text-sm">
                  Dịch vụ tiêm chủng
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-brand-500 transition-colors text-sm">
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link to="/guide" className="text-gray-600 hover:text-brand-500 transition-colors text-sm">
                  Cẩm nang tiêm chủng
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-brand-500 transition-colors text-sm">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-500 transition-colors text-sm">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Đăng ký nhận tin</h3>
            <p className="text-gray-600 mb-3 text-sm">
              Nhận thông tin mới nhất về lịch tiêm chủng và các chương trình khuyến mãi
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              />
              <button className="bg-brand-500 hover:bg-brand-600 text-white py-2 rounded-md text-sm font-medium transition-colors">
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} VacTrack. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
