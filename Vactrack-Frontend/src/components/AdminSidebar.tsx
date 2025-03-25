
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart2, 
  Calendar, 
  ChevronRight, 
  FileText, 
  Home, 
  LayoutDashboard, 
  Settings, 
  Syringe, 
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const mainNavItems: NavItem[] = [
  {
    label: "Bảng điều khiển",
    icon: LayoutDashboard,
    href: "/admin-vactrack",
  },
  {
    label: "Lịch hẹn",
    icon: Calendar,
    href: "/admin-vactrack/appointments",
  },
  {
    label: "Bệnh nhân",
    icon: Users,
    href: "/admin-vactrack/patients",
  },
  {
    label: "Vắc-xin",
    icon: Syringe,
    href: "/admin-vactrack/vaccines",
  },
  {
    label: "Báo cáo",
    icon: BarChart2,
    href: "/admin-vactrack/reports",
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: "Cài đặt",
    icon: Settings,
    href: "/admin-vactrack/settings",
  },
  {
    label: "Trợ giúp",
    icon: FileText,
    href: "/admin-vactrack/help",
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
          isActive
            ? "bg-gray-100 text-gray-900 font-medium"
            : "hover:bg-gray-50"
        )}
      >
        <item.icon className="h-5 w-5" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        "h-[calc(100vh-4rem)] border-r bg-white",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between py-2">
            {!collapsed && <h2 className="text-lg font-semibold">Quản trị</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-8 w-8"
            >
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "rotate-180" : ""
              )} />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-2 px-3">
          <nav className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          <nav className="mt-8 flex flex-col gap-1">
            {!collapsed && 
              <div className="mb-2 px-3 text-xs font-semibold text-gray-500">
                Hệ thống
              </div>
            }
            {secondaryNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t p-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-50"
            >
              <Home className="h-5 w-5" />
              {!collapsed && <span>Về trang chủ</span>}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
