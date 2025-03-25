
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

const Profile = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/profile" } } });
    } else {
      // In a real app, fetch profile data from backend
      // For now, use mock data based on logged in user
      setProfile({
        id: user?.id || "1",
        name: user?.name || "Nguyễn Văn A",
        email: user?.email || "example@gmail.com",
        phone: "0912345678",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        avatar: user?.avatar,
      });
      setIsLoading(false);
    }
  }, [isLoggedIn, navigate, user]);

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
            <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
            <p className="mt-2 text-lg text-gray-600">
              Quản lý thông tin cá nhân và xem lịch sử đặt lịch
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-brand-50 p-6 md:p-8">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-brand-100 rounded-full flex items-center justify-center">
                    {profile?.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.name} 
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-brand-500" />
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">{profile?.name}</h2>
                  <p className="text-gray-600">{profile?.email}</p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/children")}
                  >
                    <span className="mr-2">👶</span>
                    Hồ sơ trẻ em
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/vaccination-history")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Lịch sử tiêm chủng
                  </Button>
                  
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
              
              <div className="md:w-2/3 p-6 md:p-8">
                <Tabs defaultValue="info">
                  <TabsList className="mb-6">
                    <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
                    <TabsTrigger value="appointments">Lịch hẹn sắp tới</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info">
                    <Card>
                      <CardHeader>
                        <CardTitle>Thông tin liên hệ</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                            <p className="text-gray-900">{profile?.name}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-900">{profile?.email}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                            <p className="text-gray-900">{profile?.phone || "Chưa cập nhật"}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                            <p className="text-gray-900">{profile?.address || "Chưa cập nhật"}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button>Cập nhật thông tin</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="appointments">
                    <Card>
                      <CardHeader>
                        <CardTitle>Lịch hẹn sắp tới</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900">Tiêm chủng định kỳ</h3>
                                <p className="text-sm text-gray-600">Bệnh nhân: Nguyễn Văn A</p>
                                <p className="text-sm text-gray-600">Dịch vụ: Gói tiêm chủng trọn gói - Tiêu chuẩn</p>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Đã xác nhận
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                              <span>Thứ 2, 20/07/2023 - 09:30</span>
                            </div>
                            <div className="mt-3 flex space-x-2">
                              <Button variant="outline" size="sm">Đổi lịch hẹn</Button>
                              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Hủy</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
