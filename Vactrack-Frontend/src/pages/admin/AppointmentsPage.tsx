
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
  UserPlus,
  X,
  Check,
  AlertCircle
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

// API URL from environment or default
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

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
  const { isLoggedIn, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

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
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (response.data) {
        console.log("Appointments data:", response.data);
        setAppointments(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error("Invalid response format");
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
    setCurrentPage(1); // Reset to first page on new search
    fetchAppointments();
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(`${API_URL}/admin/appointments/export`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `appointments-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Dữ liệu lịch hẹn đã được xuất ra file Excel.",
      });
    } catch (error) {
      console.error("Error exporting appointments:", error);
      toast({
        variant: "destructive",
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu. Vui lòng thử lại sau.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'completed' | 'pending' | 'canceled') => {
    setIsStatusUpdating(true);
    try {
      const response = await axios.patch(
        `${API_URL}/admin/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Update appointment in the local state
        setAppointments(appointments.map(app => 
          app.id === appointmentId ? { ...app, status: newStatus } : app
        ));
        
        if (selectedAppointment && selectedAppointment.id === appointmentId) {
          setSelectedAppointment({ ...selectedAppointment, status: newStatus });
        }
        
        toast({
          title: "Cập nhật thành công",
          description: `Trạng thái lịch hẹn đã được cập nhật thành ${getStatusText(newStatus)}.`,
        });
      } else {
        throw new Error("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast({
        variant: "destructive",
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật trạng thái lịch hẹn. Vui lòng thử lại sau.",
      });
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleCreateAppointment = () => {
    // Navigate to appointment creation page
    navigate("/admin-vactrack/appointments/create");
  };

  const showAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailDialogOpen(true);
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
              <Button 
                onClick={handleExportData} 
                disabled={isExporting}
                variant="outline"
              >
                {isExporting ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Xuất Excel
              </Button>
              <Button variant="default" onClick={handleCreateAppointment}>
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
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => showAppointmentDetails(appointment)}
                            >
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                          {searchQuery || statusFilter !== "all" ? 
                            "Không có lịch hẹn nào phù hợp với tìm kiếm" : 
                            "Chưa có lịch hẹn nào trong hệ thống"}
                        </TableCell>
                      </TableRow>
                    )}
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

          {/* Appointment Details Dialog */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết và các thao tác cho lịch hẹn
                </DialogDescription>
              </DialogHeader>
              
              {selectedAppointment && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Mã lịch hẹn</p>
                      <p>{selectedAppointment.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusText(selectedAppointment.status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tên bệnh nhân</p>
                      <p>{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                      <p>{selectedAppointment.phone || "Không có"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày hẹn</p>
                      <p>{selectedAppointment.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Giờ hẹn</p>
                      <p>{selectedAppointment.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Dịch vụ</p>
                      <p>{selectedAppointment.service}</p>
                    </div>
                    {selectedAppointment.notes && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Ghi chú</p>
                        <p>{selectedAppointment.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Cập nhật trạng thái</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        disabled={selectedAppointment.status === "completed" || isStatusUpdating}
                        onClick={() => handleUpdateStatus(selectedAppointment.id, "completed")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Hoàn thành
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        disabled={selectedAppointment.status === "pending" || isStatusUpdating}
                        onClick={() => handleUpdateStatus(selectedAppointment.id, "pending")}
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Đang chờ
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        disabled={selectedAppointment.status === "canceled" || isStatusUpdating}
                        onClick={() => handleUpdateStatus(selectedAppointment.id, "canceled")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Hủy bỏ
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Đóng
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
