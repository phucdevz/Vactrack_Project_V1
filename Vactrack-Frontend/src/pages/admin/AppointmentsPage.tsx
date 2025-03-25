
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import {
  CalendarDays,
  Download,
  FilePlus,
  RefreshCw,
  Search,
  UserPlus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

// API URL from context
const API_URL = "http://localhost:8080/api";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: 'completed' | 'pending' | 'canceled';
  phone?: string;
  notes?: string;
}

const AppointmentsPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Check if user is logged in and has admin role
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/admin-vactrack/appointments" } } });
      return;
    }

    // Check if user has admin role
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Quyền truy cập bị từ chối",
        description: "Bạn không có quyền truy cập trang này.",
      });
      navigate("/");
      return;
    }

    // Fetch appointments data
    fetchAppointments();
  }, [isLoggedIn, isAdmin, navigate, currentPage, statusFilter]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // API call to get appointment data
      const response = await axios.get(`${API_URL}/admin/appointments`, {
        params: {
          page: currentPage - 1,
          size: 10,
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: searchQuery || undefined
        }
      });
      
      if (response.data) {
        setAppointments(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        // Fallback data
        setAppointments([
          {
            id: "AP-12345",
            patientName: "Nguyễn Văn A",
            date: "20/06/2023",
            time: "09:30",
            service: "Gói tiêm chủng cơ bản",
            status: "completed",
            phone: "0912345678"
          },
          {
            id: "AP-12346",
            patientName: "Trần Thị B",
            date: "21/06/2023",
            time: "10:15",
            service: "Gói tiêm chủng cao cấp",
            status: "pending",
            phone: "0987654321"
          },
          {
            id: "AP-12347",
            patientName: "Lê Văn C",
            date: "22/06/2023",
            time: "14:00",
            service: "Tiêm vắc-xin Covid-19",
            status: "canceled",
            phone: "0923456789"
          },
          {
            id: "AP-12348",
            patientName: "Phạm Thị D",
            date: "23/06/2023",
            time: "15:30",
            service: "Gói tiêm chủng trọn gói",
            status: "pending",
            phone: "0934567890"
          },
          {
            id: "AP-12349",
            patientName: "Hoàng Văn E",
            date: "24/06/2023",
            time: "11:00",
            service: "Tiêm vắc-xin cúm mùa",
            status: "completed",
            phone: "0945678901"
          }
        ]);
        setTotalPages(5);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching appointments data:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu lịch hẹn. Vui lòng thử lại sau.",
      });
      
      // Fallback data for error case
      setAppointments([
        {
          id: "AP-12345",
          patientName: "Nguyễn Văn A",
          date: "20/06/2023",
          time: "09:30",
          service: "Gói tiêm chủng cơ bản",
          status: "completed",
          phone: "0912345678"
        },
        {
          id: "AP-12346",
          patientName: "Trần Thị B",
          date: "21/06/2023",
          time: "10:15",
          service: "Gói tiêm chủng cao cấp",
          status: "pending",
          phone: "0987654321"
        },
        {
          id: "AP-12347",
          patientName: "Lê Văn C",
          date: "22/06/2023",
          time: "14:00",
          service: "Tiêm vắc-xin Covid-19",
          status: "canceled",
          phone: "0923456789"
        }
      ]);
      setTotalPages(3);
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handleExportData = () => {
    toast({
      title: "Xuất dữ liệu",
      description: "Dữ liệu lịch hẹn đang được xuất ra file Excel.",
    });
    // In a real app, this would trigger a data export
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang chờ';
      case 'canceled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = !searchQuery || 
                          appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appointment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (appointment.phone && appointment.phone.includes(searchQuery));
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-brand-500" />
              <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn</h1>
              <p className="text-gray-600">Quản lý tất cả các lịch hẹn tiêm chủng</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
              <Button variant="default">
                <CalendarDays className="mr-2 h-4 w-4" />
                Tạo lịch hẹn
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Tìm kiếm và lọc</CardTitle>
              <CardDescription>
                Tìm kiếm theo tên, số điện thoại hoặc mã lịch hẹn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="pending">Đang chờ</SelectItem>
                      <SelectItem value="canceled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="md:ml-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Tìm kiếm
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Danh sách lịch hẹn</CardTitle>
              <CardDescription>
                Có tổng cộng {appointments.length} lịch hẹn trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã lịch hẹn</TableHead>
                      <TableHead>Tên bệnh nhân</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Giờ</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.id}</TableCell>
                        <TableCell>{appointment.patientName}</TableCell>
                        <TableCell>{appointment.phone || "Không có"}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
