
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
  Syringe,
  Edit,
  Trash2,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

// API URL from environment or default
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

interface Vaccine {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  doseCount: number;
  ageGroup: string;
  price: number;
  status: 'available' | 'out_of_stock' | 'discontinued';
  description?: string;
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
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVaccine, setNewVaccine] = useState<Partial<Vaccine>>({
    name: '',
    manufacturer: '',
    type: '',
    doseCount: 1,
    ageGroup: '',
    price: 0,
    status: 'available'
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vaccineToDelete, setVaccineToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      if (response.data) {
        console.log("Vaccines data:", response.data);
        setVaccines(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error("Invalid response format");
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
    setCurrentPage(1); // Reset to first page on new search
    fetchVaccines();
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(`${API_URL}/admin/vaccines/export`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vaccines-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Dữ liệu vắc-xin đã được xuất ra file Excel.",
      });
    } catch (error) {
      console.error("Error exporting vaccines:", error);
      toast({
        variant: "destructive",
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu. Vui lòng thử lại sau.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddVaccine = () => {
    setNewVaccine({
      name: '',
      manufacturer: '',
      type: '',
      doseCount: 1,
      ageGroup: '',
      price: 0,
      status: 'available'
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateVaccine = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine);
    setNewVaccine(vaccine);
    setIsDetailDialogOpen(true);
  };

  const handleShowDeleteConfirm = (vaccineId: string) => {
    setVaccineToDelete(vaccineId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteVaccine = async () => {
    if (!vaccineToDelete) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        `${API_URL}/admin/vaccines/${vaccineToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Remove the vaccine from the list
        setVaccines(vaccines.filter(v => v.id !== vaccineToDelete));
        
        toast({
          title: "Xóa thành công",
          description: "Vắc-xin đã được xóa khỏi hệ thống.",
        });
      } else {
        throw new Error("Failed to delete vaccine");
      }
    } catch (error) {
      console.error("Error deleting vaccine:", error);
      toast({
        variant: "destructive",
        title: "Lỗi xóa vắc-xin",
        description: "Không thể xóa vắc-xin. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setVaccineToDelete(null);
    }
  };

  const saveVaccine = async () => {
    setIsSubmitting(true);
    try {
      let response;
      
      if (selectedVaccine) {
        // Update existing vaccine
        response = await axios.put(
          `${API_URL}/admin/vaccines/${selectedVaccine.id}`,
          newVaccine,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          }
        );
        
        if (response.data) {
          // Update the vaccine in the list
          setVaccines(vaccines.map(v => 
            v.id === selectedVaccine.id ? response.data : v
          ));
          
          toast({
            title: "Cập nhật thành công",
            description: "Thông tin vắc-xin đã được cập nhật.",
          });
        }
      } else {
        // Add new vaccine
        response = await axios.post(
          `${API_URL}/admin/vaccines`,
          newVaccine,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          }
        );
        
        if (response.data) {
          // Add the new vaccine to the list
          setVaccines([...vaccines, response.data]);
          
          toast({
            title: "Thêm thành công",
            description: "Vắc-xin mới đã được thêm vào hệ thống.",
          });
        }
      }
      
      // Close the dialog
      setIsDetailDialogOpen(false);
      setIsAddDialogOpen(false);
      setSelectedVaccine(null);
    } catch (error) {
      console.error("Error saving vaccine:", error);
      toast({
        variant: "destructive",
        title: "Lỗi lưu dữ liệu",
        description: "Không thể lưu thông tin vắc-xin. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <Button variant="default" onClick={handleAddVaccine}>
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
                    {filteredVaccines.length > 0 ? (
                      filteredVaccines.map((vaccine) => (
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
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleUpdateVaccine(vaccine)}
                                title="Chỉnh sửa"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-700" 
                                onClick={() => handleShowDeleteConfirm(vaccine.id)}
                                title="Xóa"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                          {searchQuery || typeFilter !== "all" ? 
                            "Không có vắc-xin nào phù hợp với tìm kiếm" : 
                            "Chưa có vắc-xin nào trong hệ thống"}
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

          {/* Vaccine Add/Edit Dialog */}
          <Dialog 
            open={isDetailDialogOpen || isAddDialogOpen} 
            onOpenChange={(open) => {
              if (isDetailDialogOpen) setIsDetailDialogOpen(open);
              if (isAddDialogOpen) setIsAddDialogOpen(open);
            }}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {selectedVaccine ? "Cập nhật vắc-xin" : "Thêm vắc-xin mới"}
                </DialogTitle>
                <DialogDescription>
                  {selectedVaccine 
                    ? "Chỉnh sửa thông tin vắc-xin trong hệ thống" 
                    : "Thêm thông tin về loại vắc-xin mới vào hệ thống"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vaccine-name">Tên vắc-xin</Label>
                  <Input 
                    id="vaccine-name"
                    value={newVaccine.name}
                    onChange={(e) => setNewVaccine({...newVaccine, name: e.target.value})}
                    placeholder="Nhập tên vắc-xin"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vaccine-manufacturer">Nhà sản xuất</Label>
                  <Input 
                    id="vaccine-manufacturer"
                    value={newVaccine.manufacturer}
                    onChange={(e) => setNewVaccine({...newVaccine, manufacturer: e.target.value})}
                    placeholder="Nhập tên nhà sản xuất"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vaccine-type">Loại vắc-xin</Label>
                  <Select 
                    value={newVaccine.type} 
                    onValueChange={(value) => setNewVaccine({...newVaccine, type: value})}
                  >
                    <SelectTrigger id="vaccine-type">
                      <SelectValue placeholder="Chọn loại vắc-xin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COVID-19">COVID-19</SelectItem>
                      <SelectItem value="Influenza">Cúm</SelectItem>
                      <SelectItem value="Hepatitis B">Viêm gan B</SelectItem>
                      <SelectItem value="MMR">Sởi-Quai bị-Rubella</SelectItem>
                      <SelectItem value="Pneumococcal">Phế cầu khuẩn</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vaccine-dose">Số liều</Label>
                    <Input 
                      id="vaccine-dose"
                      type="number"
                      min="1"
                      value={newVaccine.doseCount}
                      onChange={(e) => setNewVaccine({...newVaccine, doseCount: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vaccine-price">Giá (VNĐ)</Label>
                    <Input 
                      id="vaccine-price"
                      type="number"
                      min="0"
                      step="1000"
                      value={newVaccine.price}
                      onChange={(e) => setNewVaccine({...newVaccine, price: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vaccine-age">Nhóm tuổi</Label>
                  <Input 
                    id="vaccine-age"
                    value={newVaccine.ageGroup}
                    onChange={(e) => setNewVaccine({...newVaccine, ageGroup: e.target.value})}
                    placeholder="Ví dụ: 2-6 tuổi, người lớn, ..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vaccine-status">Trạng thái</Label>
                  <Select 
                    value={newVaccine.status} 
                    onValueChange={(value: 'available' | 'out_of_stock' | 'discontinued') => 
                      setNewVaccine({...newVaccine, status: value})
                    }
                  >
                    <SelectTrigger id="vaccine-status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Có sẵn</SelectItem>
                      <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                      <SelectItem value="discontinued">Ngừng cung cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vaccine-description">Mô tả (tùy chọn)</Label>
                  <Input 
                    id="vaccine-description"
                    value={newVaccine.description || ''}
                    onChange={(e) => setNewVaccine({...newVaccine, description: e.target.value})}
                    placeholder="Nhập mô tả về vắc-xin"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    setIsAddDialogOpen(false);
                    setSelectedVaccine(null);
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  onClick={saveVaccine}
                  disabled={isSubmitting || !newVaccine.name || !newVaccine.manufacturer}
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {selectedVaccine ? "Cập nhật" : "Thêm mới"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa vắc-xin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Dữ liệu về vắc-xin này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteVaccine}
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Xóa vắc-xin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default VaccinesPage;
