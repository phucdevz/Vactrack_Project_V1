
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/DatePicker";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ChildProfile {
  id: string;
  name: string;
  dob: string;
  gender: "male" | "female";
  bloodType?: string;
  allergies?: string;
  notes?: string;
}

const Children = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    bloodType: "",
    allergies: "",
    notes: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/children" } } });
      return;
    }

    // Fetch children profiles - using mock data for now
    const mockChildren: ChildProfile[] = [
      {
        id: "1",
        name: "Nguyễn Minh Anh",
        dob: "2020-03-15",
        gender: "female",
        bloodType: "A+",
        allergies: "Không có",
        notes: "Tiền sử hen suyễn nhẹ",
      },
      {
        id: "2",
        name: "Nguyễn Minh Vũ",
        dob: "2018-08-20",
        gender: "male",
        bloodType: "O+",
        allergies: "Dị ứng với hải sản",
      },
    ];

    setChildren(mockChildren);
    setIsLoading(false);
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng nhập tên của trẻ",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng chọn ngày sinh của trẻ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    // For now, we'll simulate adding to local state
    setTimeout(() => {
      const newChild: ChildProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        dob: format(date, "yyyy-MM-dd"),
        gender: formData.gender as "male" | "female" || "male",
        bloodType: formData.bloodType || undefined,
        allergies: formData.allergies || undefined,
        notes: formData.notes || undefined,
      };
      
      setChildren((prev) => [...prev, newChild]);
      setFormData({
        name: "",
        gender: "",
        bloodType: "",
        allergies: "",
        notes: "",
      });
      setDate(undefined);
      setDialogOpen(false);
      setIsSubmitting(false);
      
      toast({
        title: "Thành công",
        description: "Đã thêm hồ sơ trẻ mới",
      });
    }, 1000);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 1) {
      // Calculate months
      let months = (today.getMonth() + 12) - birthDate.getMonth();
      if (today.getDate() < birthDate.getDate()) {
        months--;
      }
      return `${months} tháng`;
    }
    
    return `${age} tuổi`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>Đang tải thông tin...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-16 bg-gradient-to-r from-brand-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ trẻ em</h1>
            <p className="mt-2 text-lg text-gray-600">
              Quản lý thông tin cá nhân và lịch sử tiêm chủng của trẻ
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/4 bg-brand-50 p-6">
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </Button>
                </div>
                
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-brand-100"
                    onClick={() => navigate("/children")}
                  >
                    <span className="mr-2">👶</span>
                    Hồ sơ trẻ em
                  </Button>
                </div>
                
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/vaccination-history")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Lịch sử tiêm chủng
                  </Button>
                </div>
                
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/booking")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Đặt lịch tiêm chủng
                  </Button>
                </div>
              </div>
              
              <div className="md:w-3/4 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Danh sách trẻ em</h2>
                  
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm hồ sơ trẻ
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm hồ sơ trẻ mới</DialogTitle>
                        <DialogDescription>
                          Nhập thông tin cá nhân của trẻ. Bạn có thể cập nhật thông tin này sau.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Họ và tên trẻ</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="dob">Ngày sinh</Label>
                            <DatePicker
                              date={date}
                              setDate={setDate}
                              label="Chọn ngày sinh"
                              disabledDates={(date) => {
                                const today = new Date();
                                return date > today;
                              }}
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="gender">Giới tính</Label>
                            <div className="flex space-x-4">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="male"
                                  name="gender"
                                  value="male"
                                  checked={formData.gender === "male"}
                                  onChange={handleInputChange}
                                  className="h-4 w-4 text-brand-500"
                                />
                                <label htmlFor="male" className="ml-2 text-sm">Nam</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="female"
                                  name="gender"
                                  value="female"
                                  checked={formData.gender === "female"}
                                  onChange={handleInputChange}
                                  className="h-4 w-4 text-brand-500"
                                />
                                <label htmlFor="female" className="ml-2 text-sm">Nữ</label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="bloodType">Nhóm máu (nếu biết)</Label>
                            <Input
                              id="bloodType"
                              name="bloodType"
                              value={formData.bloodType}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="allergies">Dị ứng (nếu có)</Label>
                            <Input
                              id="allergies"
                              name="allergies"
                              value={formData.allergies}
                              onChange={handleInputChange}
                              placeholder="Liệt kê các dị ứng, phân cách bằng dấu phẩy"
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="notes">Ghi chú thêm</Label>
                            <Input
                              id="notes"
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              placeholder="Tiền sử bệnh, thông tin khác cần lưu ý"
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang xử lý..." : "Lưu thông tin"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {children.length > 0 ? (
                    children.map((child) => (
                      <Card key={child.id} className="transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{child.name}</CardTitle>
                            <span className="text-sm bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                              {child.gender === "male" ? "Nam" : "Nữ"}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">Ngày sinh:</span>
                              <div className="text-gray-900">
                                {new Date(child.dob).toLocaleDateString("vi-VN")}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Tuổi:</span>
                              <div className="text-gray-900">{calculateAge(child.dob)}</div>
                            </div>
                            {child.bloodType && (
                              <div>
                                <span className="text-gray-500">Nhóm máu:</span>
                                <div className="text-gray-900">{child.bloodType}</div>
                              </div>
                            )}
                            {child.allergies && (
                              <div className="col-span-2">
                                <span className="text-gray-500">Dị ứng:</span>
                                <div className="text-gray-900">{child.allergies}</div>
                              </div>
                            )}
                            {child.notes && (
                              <div className="col-span-2">
                                <span className="text-gray-500">Ghi chú:</span>
                                <div className="text-gray-900">{child.notes}</div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/vaccination-history?child=${child.id}`)}
                          >
                            Lịch sử tiêm chủng
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/booking?child=${child.id}`)}
                          >
                            Đặt lịch tiêm
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="text-center p-6">
                        <p className="text-gray-500 mb-4">
                          Chưa có hồ sơ trẻ em nào được thêm vào.
                        </p>
                        <Button onClick={() => setDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Thêm hồ sơ trẻ
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Children;
