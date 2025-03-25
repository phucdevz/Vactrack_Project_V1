
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import {
  Download,
  FilePlus,
  Plus,
  RefreshCw,
  Search,
  Syringe
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

interface Vaccine {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  doseCount: number;
  ageGroup: string;
  price: number;
  status: 'available' | 'out_of_stock' | 'discontinued';
}

const VaccinesPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");

  // Check if user is logged in and has admin role
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/admin-vactrack/vaccines" } } });
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

    // Fetch vaccines data
    fetchVaccines();
  }, [isLoggedIn, isAdmin, navigate, currentPage, typeFilter]);

  const fetchVaccines = async () => {
    setIsLoading(true);
    try {
      // API call to get vaccine data
      const response = await axios.get(`${API_URL}/admin/vaccines`, {
        params: {
          page: currentPage - 1,
          size: 10,
          type: typeFilter !== "all" ? typeFilter : undefined,
          search: searchQuery || undefined
        }
      });
      
      if (response.data) {
        setVaccines(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        // Fallback data
        setVaccines([
          {
            id: "VAX-001",
            name: "ComirnatyⓇ",
            manufacturer: "Pfizer-BioNTech",
            type: "COVID-19",
            doseCount: 2,
            ageGroup: "12 tuổi trở lên",
            price: 1200000,
            status: "available"
          },
          {
            id: "VAX-002",
            name: "Vắc-xin Cúm mùa",
            manufacturer: "Sanofi Pasteur",
            type: "Influenza",
            doseCount: 1,
            ageGroup: "Mọi lứa tuổi",
            price: 500000,
            status: "available"
          },
          {
            id: "VAX-003",
            name: "Vắc-xin Viêm gan B",
            manufacturer: "GSK",
            type: "Hepatitis B",
            doseCount: 3,
            ageGroup: "Trẻ sơ sinh - người lớn",
            price: 350000,
            status: "available"
          },
          {
            id: "VAX-004",
            name: "Vắc-xin Sởi-Quai bị-Rubella",
            manufacturer: "Merck",
            type: "MMR",
            doseCount: 2,
            ageGroup: "1-12 tuổi",
            price: 450000,
            status: "out_of_stock"
          },
          {
            id: "VAX-005",
            name: "Vắc-xin Phế cầu khuẩn",
            manufacturer: "Pfizer",
            type: "Pneumococcal",
            doseCount: 4,
            ageGroup: "Trẻ em < 2 tuổi",
            price: 850000,
            status: "available"
          }
        ]);
        setTotalPages(5);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching vaccines data:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu vắc-xin. Vui lòng thử lại sau.",
      });
      
      // Fallback data for error case
      setVaccines([
        {
          id: "VAX-001",
          name: "ComirnatyⓇ",
          manufacturer: "Pfizer-BioNTech",
          type: "COVID-19",
          doseCount: 2,
          ageGroup: "12 tuổi trở lên",
          price: 1200000,
          status: "available"
        },
        {
          id: "VAX-002",
          name: "Vắc-xin Cúm mùa",
          manufacturer: "Sanofi Pasteur",
          type: "Influenza",
          doseCount: 1,
          ageGroup: "Mọi lứa tuổi",
          price: 500000,
          status: "available"
        },
        {
          id: "VAX-003",
          name: "Vắc-xin Viêm gan B",
          manufacturer: "GSK",
          type: "Hepatitis B",
          doseCount: 3,
          ageGroup: "Trẻ sơ sinh - người lớn",
          price: 350000,
          status: "available"
        }
      ]);
      setTotalPages(3);
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVaccines();
  };

  const handleExportData = () => {
    toast({
      title: "Xuất dữ liệu",
      description: "Dữ liệu vắc-xin đang được xuất ra file Excel.",
    });
    // In a real app, this would trigger a data export
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'out_of_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Có sẵn';
      case 'out_of_stock':
        return 'Hết hàng';
      case 'discontinued':
        return 'Ngừng cung cấp';
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredVaccines = vaccines.filter(vaccine => {
    const matchesSearch = !searchQuery || 
                         vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         vaccine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vaccine.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || vaccine.type === typeFilter;
    
    return matchesSearch && matchesType;
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
              <h1 className="text-2xl font-bold text-gray-900">Vắc-xin</h1>
              <p className="text-gray-600">Quản lý danh mục vắc-xin và tình trạng tồn kho</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Thêm vắc-xin mới
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Tìm kiếm và lọc</CardTitle>
              <CardDescription>
                Tìm kiếm theo tên, nhà sản xuất hoặc mã vắc-xin
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
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Loại vắc-xin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="COVID-19">COVID-19</SelectItem>
                      <SelectItem value="Influenza">Cúm</SelectItem>
                      <SelectItem value="Hepatitis B">Viêm gan B</SelectItem>
                      <SelectItem value="MMR">Sởi-Quai bị-Rubella</SelectItem>
                      <SelectItem value="Pneumococcal">Phế cầu khuẩn</SelectItem>
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
              <CardTitle>Danh sách vắc-xin</CardTitle>
              <CardDescription>
                Có tổng cộng {vaccines.length} loại vắc-xin trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã vắc-xin</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Nhà sản xuất</TableHead>
                      <TableHead>Liều lượng</TableHead>
                      <TableHead>Nhóm tuổi</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVaccines.map((vaccine) => (
                      <TableRow key={vaccine.id}>
                        <TableCell className="font-medium">{vaccine.id}</TableCell>
                        <TableCell>{vaccine.name}</TableCell>
                        <TableCell>{vaccine.manufacturer}</TableCell>
                        <TableCell>{vaccine.doseCount} liều</TableCell>
                        <TableCell>{vaccine.ageGroup}</TableCell>
                        <TableCell>{formatPrice(vaccine.price)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vaccine.status)}`}>
                            {getStatusText(vaccine.status)}
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

export default VaccinesPage;
