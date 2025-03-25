
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import {
  BarChart2,
  Calendar,
  Download,
  FileText,
  LineChart,
  PieChart,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

// API URL from context
const API_URL = "http://localhost:8080/api";

interface StatisticData {
  monthlyData: Array<{
    month: string;
    count: number;
  }>;
  distributionByService: Array<{
    service: string;
    percentage: number;
  }>;
  trendData: Array<{
    date: string;
    count: number;
  }>;
}

const ReportsPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [statistics, setStatistics] = useState<StatisticData | null>(null);

  // Check if user is logged in and has admin role
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/admin-vactrack/reports" } } });
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

    // Fetch reports data
    fetchReportData();
  }, [isLoggedIn, isAdmin, navigate, period]);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // API call to get report data
      const response = await axios.get(`${API_URL}/admin/statistics/vaccinations`, {
        params: {
          period: period
        }
      });
      
      if (response.data) {
        setStatistics(response.data);
      } else {
        // Fallback data
        setStatistics({
          monthlyData: [
            { month: "Tháng 1", count: 45 },
            { month: "Tháng 2", count: 52 },
            { month: "Tháng 3", count: 38 },
            { month: "Tháng 4", count: 62 },
            { month: "Tháng 5", count: 57 },
            { month: "Tháng 6", count: 78 }
          ],
          distributionByService: [
            { service: "Gói tiêm chủng cơ bản", percentage: 35 },
            { service: "Gói tiêm chủng cao cấp", percentage: 25 },
            { service: "Tiêm vắc-xin COVID-19", percentage: 20 },
            { service: "Tiêm vắc-xin cúm mùa", percentage: 15 },
            { service: "Khác", percentage: 5 }
          ],
          trendData: [
            { date: "01/01/2023", count: 15 },
            { date: "15/01/2023", count: 30 },
            { date: "01/02/2023", count: 22 },
            { date: "15/02/2023", count: 30 },
            { date: "01/03/2023", count: 18 },
            { date: "15/03/2023", count: 20 },
            { date: "01/04/2023", count: 28 },
            { date: "15/04/2023", count: 34 },
            { date: "01/05/2023", count: 27 },
            { date: "15/05/2023", count: 30 },
            { date: "01/06/2023", count: 38 },
            { date: "15/06/2023", count: 40 }
          ]
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.",
      });
      
      // Fallback data for error case
      setStatistics({
        monthlyData: [
          { month: "Tháng 1", count: 45 },
          { month: "Tháng 2", count: 52 },
          { month: "Tháng 3", count: 38 },
          { month: "Tháng 4", count: 62 },
          { month: "Tháng 5", count: 57 },
          { month: "Tháng 6", count: 78 }
        ],
        distributionByService: [
          { service: "Gói tiêm chủng cơ bản", percentage: 35 },
          { service: "Gói tiêm chủng cao cấp", percentage: 25 },
          { service: "Tiêm vắc-xin COVID-19", percentage: 20 },
          { service: "Tiêm vắc-xin cúm mùa", percentage: 15 },
          { service: "Khác", percentage: 5 }
        ],
        trendData: [
          { date: "01/01/2023", count: 15 },
          { date: "15/01/2023", count: 30 },
          { date: "01/02/2023", count: 22 },
          { date: "15/02/2023", count: 30 },
          { date: "01/03/2023", count: 18 },
          { date: "15/03/2023", count: 20 }
        ]
      });
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: "Xuất báo cáo",
      description: "Báo cáo đang được xuất ra file PDF.",
    });
    // In a real app, this would trigger a report export
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
              <p className="text-gray-600">Phân tích dữ liệu tiêm chủng</p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="w-full md:w-auto">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Theo tháng</SelectItem>
                    <SelectItem value="quarter">Theo quý</SelectItem>
                    <SelectItem value="year">Theo năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleExportData} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </Button>
            </div>
          </div>

          <Tabs defaultValue="vaccination" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="vaccination">Tiêm chủng</TabsTrigger>
              <TabsTrigger value="financial">Tài chính</TabsTrigger>
              <TabsTrigger value="inventory">Kho vắc-xin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vaccination" className="mt-0">
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
                      <BarChart2 className="h-16 w-16 text-gray-400" />
                      <div className="ml-4">
                        <p className="text-gray-500 mb-2">Biểu đồ sẽ hiển thị ở đây</p>
                        <p className="text-sm text-gray-400">
                          (Đây là nơi giữ chỗ cho biểu đồ thống kê theo tháng)
                        </p>
                      </div>
                    </div>
                  </CardContent>
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
                      <div className="ml-4">
                        <p className="text-gray-500 mb-2">Biểu đồ sẽ hiển thị ở đây</p>
                        <p className="text-sm text-gray-400">
                          (Đây là nơi giữ chỗ cho biểu đồ phân bố dịch vụ)
                        </p>
                      </div>
                    </div>
                  </CardContent>
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
                      <div className="ml-4">
                        <p className="text-gray-500 mb-2">Biểu đồ sẽ hiển thị ở đây</p>
                        <p className="text-sm text-gray-400">
                          (Đây là nơi giữ chỗ cho biểu đồ xu hướng tiêm chủng)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Doanh thu theo tháng</CardTitle>
                    <CardDescription>
                      Biểu đồ doanh thu theo tháng trong năm 2023
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <BarChart2 className="h-16 w-16 text-gray-400" />
                      <div className="ml-4">
                        <p className="text-gray-500 mb-2">Biểu đồ sẽ hiển thị ở đây</p>
                        <p className="text-sm text-gray-400">
                          (Đây là nơi giữ chỗ cho biểu đồ doanh thu theo tháng)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Phân bố doanh thu theo dịch vụ</CardTitle>
                    <CardDescription>
                      Biểu đồ tỷ lệ doanh thu từ các dịch vụ tiêm chủng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <PieChart className="h-16 w-16 text-gray-400" />
                      <div className="ml-4">
                        <p className="text-gray-500 mb-2">Biểu đồ sẽ hiển thị ở đây</p>
                        <p className="text-sm text-gray-400">
                          (Đây là nơi giữ chỗ cho biểu đồ phân bố doanh thu)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Tình trạng kho vắc-xin</CardTitle>
                  <CardDescription>
                    Thống kê số lượng vắc-xin tồn kho và tình trạng sử dụng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                    <div className="ml-4">
                      <p className="text-gray-500 mb-2">Báo cáo kho sẽ hiển thị ở đây</p>
                      <p className="text-sm text-gray-400">
                        (Đây là nơi giữ chỗ cho báo cáo kho vắc-xin)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
