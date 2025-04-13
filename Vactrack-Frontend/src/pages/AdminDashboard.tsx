
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Calendar, 
  Users, 
  Activity, 
  FileText, 
  Download,
  Search,
  RefreshCw,
  MessageCircle,
  PhoneCall,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { AdminFeedbackList } from "@/components/AdminFeedbackList";
import { AdminContactList } from "@/components/AdminContactList";

// API URL from environment or default
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

interface VaccinationStats {
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  pendingAppointments: number;
}

interface RecentAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: 'completed' | 'pending' | 'canceled';
}

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  createdAt: string;
}

const AdminDashboard = () => {
  const { isLoggedIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<VaccinationStats>({
    totalAppointments: 0,
    completedAppointments: 0,
    canceledAppointments: 0,
    pendingAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [highlightFeedback, setHighlightFeedback] = useState<FeedbackItem[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/admin-vactrack" } } });
      return;
    }

    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Quyền truy cập bị từ chối",
        description: "Bạn không có quyền truy cập trang này.",
      });
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [isLoggedIn, isAdmin, navigate, timeFilter]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        params: {
          timeRange: timeFilter
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (response.data) {
        console.log("Dashboard data:", response.data);
        setStats(response.data.stats || {
          totalAppointments: 124,
          completedAppointments: 85,
          canceledAppointments: 12,
          pendingAppointments: 27
        });
        
        setRecentAppointments(response.data.recentAppointments || []);
      } else {
        throw new Error("Invalid response format");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại sau.",
      });
      
      // Fallback data
      setStats({
        totalAppointments: 124,
        completedAppointments: 85,
        canceledAppointments: 12,
        pendingAppointments: 27
      });

      setRecentAppointments([
        {
          id: "AP-12345",
          patientName: "Nguyễn Văn A",
          date: "20/06/2023",
          time: "09:30",
          service: "Gói tiêm chủng cơ bản",
          status: "completed"
        },
        {
          id: "AP-12346",
          patientName: "Trần Thị B",
          date: "21/06/2023",
          time: "10:15",
          service: "Gói tiêm chủng cao cấp",
          status: "pending"
        },
        {
          id: "AP-12347",
          patientName: "Lê Văn C",
          date: "22/06/2023",
          time: "14:00",
          service: "Tiêm vắc-xin Covid-19",
          status: "canceled"
        },
        {
          id: "AP-12348",
          patientName: "Phạm Thị D",
          date: "23/06/2023",
          time: "15:30",
          service: "Gói tiêm chủng trọn gói",
          status: "pending"
        },
        {
          id: "AP-12349",
          patientName: "Hoàng Văn E",
          date: "24/06/2023",
          time: "11:00",
          service: "Tiêm vắc-xin cúm mùa",
          status: "completed"
        }
      ]);
      
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const endpoint = activeTab === "appointments" 
        ? `${API_URL}/admin/appointments/export` 
        : `${API_URL}/admin/statistics/export`;
      
      const response = await axios.get(endpoint, {
        params: {
          timeRange: timeFilter
        },
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeTab}-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Dữ liệu đã được xuất ra file Excel.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        variant: "destructive",
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu. Vui lòng thử lại sau.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleHighlightFeedback = (feedbackItems: FeedbackItem[]) => {
    const bestFeedback = feedbackItems
      .filter(item => item.rating >= 4)
      .sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    setHighlightFeedback(bestFeedback);
  };

  const filteredAppointments = recentAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appointment.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

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

  const navigateToAppointmentDetails = (appointmentId: string) => {
    navigate(`/admin-vactrack/appointments?id=${appointmentId}`);
  };

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
            <p className="text-gray-600">Xem tổng quan về hoạt động tiêm chủng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Tổng lịch hẹn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-brand-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">{stats.totalAppointments}</div>
                    <p className="text-xs text-gray-500">Lịch hẹn trong hệ thống</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Hoàn thành
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">{stats.completedAppointments}</div>
                    <p className="text-xs text-gray-500">Lịch đã hoàn thành</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Chờ xử lý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">{stats.pendingAppointments}</div>
                    <p className="text-xs text-gray-500">Lịch đang chờ xử lý</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Đã hủy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">{stats.canceledAppointments}</div>
                    <p className="text-xs text-gray-500">Lịch đã hủy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="appointments" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
              <TabsTrigger value="feedback">Phản hồi</TabsTrigger>
              <TabsTrigger value="contacts">Liên hệ</TabsTrigger>
              <TabsTrigger value="reports">Báo cáo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="mt-6">
              <Card>
                <CardHeader className="flex justify-between items-center flex-col sm:flex-row gap-4">
                  <div>
                    <CardTitle>Lịch hẹn gần đây</CardTitle>
                    <CardDescription>
                      Danh sách các lịch hẹn tiêm chủng gần đây trong hệ thống
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportData}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      Xuất Excel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={fetchDashboardData}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      Làm mới
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-4 justify-between">
                    <div className="relative w-full md:w-1/2">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Tìm kiếm theo tên hoặc mã lịch hẹn..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="w-full md:w-1/4">
                      <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          <SelectItem value="today">Hôm nay</SelectItem>
                          <SelectItem value="week">Tuần này</SelectItem>
                          <SelectItem value="month">Tháng này</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã lịch hẹn</TableHead>
                          <TableHead>Tên bệnh nhân</TableHead>
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
                                  onClick={() => navigateToAppointmentDetails(appointment.id)}
                                >
                                  Chi tiết
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                              {searchQuery ? 
                                "Không có lịch hẹn nào phù hợp với tìm kiếm" : 
                                "Chưa có lịch hẹn nào trong hệ thống"}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    Hiển thị {filteredAppointments.length} lịch hẹn gần đây
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/admin-vactrack/appointments")}
                  >
                    Xem tất cả
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-6">
              <AdminFeedbackList onSelectFeedback={handleHighlightFeedback} />
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-6">
              <AdminContactList />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thống kê tiêm chủng theo tháng</CardTitle>
                    <CardDescription>
                      Biểu đồ số lượng tiêm chủng theo tháng trong năm 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <BarChart className="h-16 w-16 text-gray-400" />
                      <p className="ml-4 text-gray-500">Biểu đồ đang được tải...</p>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate("/admin-vactrack/reports")}
                    >
                      Xem chi tiết
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Phân bố dịch vụ</CardTitle>
                    <CardDescription>
                      Biểu đồ tỷ lệ các dịch vụ tiêm chủng được sử dụng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-gray-400" />
                      <p className="ml-4 text-gray-500">Biểu đồ đang được tải...</p>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate("/admin-vactrack/reports")}
                    >
                      Xem chi tiết
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Xu hướng tiêm chủng</CardTitle>
                    <CardDescription>
                      Biểu đồ xu hướng tiêm chủng theo thời gian
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-gray-400" />
                      <p className="ml-4 text-gray-500">Biểu đồ đang được tải...</p>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate("/admin-vactrack/reports")}
                    >
                      Xem chi tiết báo cáo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
