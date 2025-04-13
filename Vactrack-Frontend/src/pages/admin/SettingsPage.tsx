import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import {
  Check,
  Download,
  Save,
  Settings,
  Upload,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

// API URL from context
const API_URL = "http://localhost:8080/api";

interface WorkingHours {
  start: string;
  end: string;
  closed: boolean;
}

interface WorkingDays {
  monday: WorkingHours;
  tuesday: WorkingHours;
  wednesday: WorkingHours;
  thursday: WorkingHours;
  friday: WorkingHours;
  saturday: WorkingHours;
  sunday: WorkingHours;
}

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  reminderHours: number;
}

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

interface SystemSettings {
  workingHours: WorkingDays;
  notifications: NotificationSettings;
  servicePackages: ServicePackage[];
}

const SettingsPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  // Check if user is logged in and has admin role
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/admin-vactrack/settings" } } });
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

    // Fetch settings data
    fetchSettings();
  }, [isLoggedIn, isAdmin, navigate]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // API call to get settings data
      const response = await axios.get(`${API_URL}/admin/settings`);
      
      if (response.data) {
        setSettings(response.data);
      } else {
        // Fallback data
        setSettings({
          workingHours: {
            monday: { start: "08:00", end: "17:00", closed: false },
            tuesday: { start: "08:00", end: "17:00", closed: false },
            wednesday: { start: "08:00", end: "17:00", closed: false },
            thursday: { start: "08:00", end: "17:00", closed: false },
            friday: { start: "08:00", end: "17:00", closed: false },
            saturday: { start: "08:00", end: "12:00", closed: false },
            sunday: { start: "08:00", end: "12:00", closed: true },
          },
          notifications: {
            emailEnabled: true,
            smsEnabled: true,
            reminderHours: 24
          },
          servicePackages: [
            {
              id: "pkg-1",
              name: "Gói tiêm chủng cơ bản",
              description: "Gói tiêm chủng cơ bản cho trẻ dưới 1 tuổi",
              price: 2500000,
              active: true
            },
            {
              id: "pkg-2",
              name: "Gói tiêm chủng nâng cao",
              description: "Gói tiêm chủng nâng cao cho trẻ dưới 1 tuổi",
              price: 5000000,
              active: true
            },
            {
              id: "pkg-3",
              name: "Gói tiêm chủng cao cấp",
              description: "Gói tiêm chủng cao cấp cho trẻ dưới 1 tuổi",
              price: 10000000,
              active: true
            }
          ]
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching settings data:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu cài đặt. Vui lòng thử lại sau.",
      });
      
      // Fallback data for error case
      setSettings({
        workingHours: {
          monday: { start: "08:00", end: "17:00", closed: false },
          tuesday: { start: "08:00", end: "17:00", closed: false },
          wednesday: { start: "08:00", end: "17:00", closed: false },
          thursday: { start: "08:00", end: "17:00", closed: false },
          friday: { start: "08:00", end: "17:00", closed: false },
          saturday: { start: "08:00", end: "12:00", closed: false },
          sunday: { start: "08:00", end: "12:00", closed: true },
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: true,
          reminderHours: 24
        },
        servicePackages: [
          {
            id: "pkg-1",
            name: "Gói tiêm chủng cơ bản",
            description: "Gói tiêm chủng cơ bản cho trẻ dưới 1 tuổi",
            price: 2500000,
            active: true
          },
          {
            id: "pkg-2",
            name: "Gói tiêm chủng nâng cao",
            description: "Gói tiêm chủng nâng cao cho trẻ dưới 1 tuổi",
            price: 5000000,
            active: true
          }
        ]
      });
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    try {
      // API call to update settings
      await axios.put(`${API_URL}/admin/settings`, settings);
      
      toast({
        title: "Cài đặt đã được lưu",
        description: "Các thay đổi của bạn đã được lưu thành công.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu cài đặt. Vui lòng thử lại sau.",
      });
    }
  };

  const updateWorkingHours = (day: keyof WorkingDays, field: keyof WorkingHours, value: string | boolean) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      workingHours: {
        ...settings.workingHours,
        [day]: {
          ...settings.workingHours[day],
          [field]: value
        }
      }
    });
  };

  const updateNotification = (field: keyof NotificationSettings, value: boolean | number) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value
      }
    });
  };

  const updateServicePackage = (id: string, field: keyof ServicePackage, value: string | number | boolean) => {
    if (!settings) return;
    
    const updatedPackages = settings.servicePackages.map(pkg => 
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    );
    
    setSettings({
      ...settings,
      servicePackages: updatedPackages
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 p-8">
            <div className="text-center py-12">
              <Settings className="h-8 w-8 animate-spin mx-auto text-brand-500" />
              <p className="mt-4 text-gray-600">Đang tải cài đặt...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
              <p className="text-gray-600">Quản lý cài đặt và tùy chỉnh hệ thống</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Lưu cài đặt
              </Button>
            </div>
          </div>

          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
              <TabsTrigger value="working-hours">Giờ làm việc</TabsTrigger>
              <TabsTrigger value="packages">Gói dịch vụ</TabsTrigger>
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt chung</CardTitle>
                  <CardDescription>
                    Quản lý các cài đặt chung của hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="clinic-name">Tên phòng khám</Label>
                        <Input id="clinic-name" defaultValue="VacTrack - Trung tâm tiêm chủng" />
                      </div>
                      
                      <div>
                        <Label htmlFor="clinic-address">Địa chỉ</Label>
                        <Input id="clinic-address" defaultValue="123 Nguyễn Văn Linh, Quận 7, TP.HCM" />
                      </div>
                      
                      <div>
                        <Label htmlFor="clinic-phone">Số điện thoại</Label>
                        <Input id="clinic-phone" defaultValue="028 1234 5678" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="clinic-email">Email liên hệ</Label>
                        <Input id="clinic-email" defaultValue="contact@vactrack.vn" />
                      </div>
                      
                      <div>
                        <Label htmlFor="appointment-duration">Thời lượng mỗi lịch hẹn (phút)</Label>
                        <Input id="appointment-duration" type="number" defaultValue="30" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maintenance-mode">Chế độ bảo trì</Label>
                        <Switch id="maintenance-mode" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="working-hours">
              <Card>
                <CardHeader>
                  <CardTitle>Giờ làm việc</CardTitle>
                  <CardDescription>
                    Cài đặt giờ làm việc của phòng khám
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(settings.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-4">
                        <div className="w-32">
                          <Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={!hours.closed} 
                            onCheckedChange={(checked) => updateWorkingHours(day as keyof WorkingDays, 'closed', !checked)} 
                          />
                          <span className="text-sm text-gray-500">
                            {hours.closed ? 'Đóng cửa' : 'Mở cửa'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="time" 
                            value={hours.start} 
                            onChange={(e) => updateWorkingHours(day as keyof WorkingDays, 'start', e.target.value)}
                            disabled={hours.closed}
                            className="w-32"
                          />
                          <span>đến</span>
                          <Input 
                            type="time" 
                            value={hours.end} 
                            onChange={(e) => updateWorkingHours(day as keyof WorkingDays, 'end', e.target.value)}
                            disabled={hours.closed}
                            className="w-32"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="packages">
              <Card>
                <CardHeader>
                  <CardTitle>Gói dịch vụ</CardTitle>
                  <CardDescription>
                    Quản lý các gói dịch vụ tiêm chủng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {settings.servicePackages.map((pkg) => (
                      <div key={pkg.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Input 
                              value={pkg.name} 
                              onChange={(e) => updateServicePackage(pkg.id, 'name', e.target.value)}
                              className="font-medium text-lg w-64"
                            />
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={pkg.active} 
                                onCheckedChange={(checked) => updateServicePackage(pkg.id, 'active', checked)} 
                              />
                              <span className="text-sm text-gray-500">
                                {pkg.active ? 'Đang hoạt động' : 'Đã tắt'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input 
                              type="number" 
                              value={pkg.price} 
                              onChange={(e) => updateServicePackage(pkg.id, 'price', parseInt(e.target.value))}
                              className="w-32"
                            />
                            <span className="text-sm text-gray-500">VNĐ</span>
                          </div>
                        </div>
                        
                        <div>
                          <Input 
                            value={pkg.description} 
                            onChange={(e) => updateServicePackage(pkg.id, 'description', e.target.value)}
                            className="text-sm text-gray-600"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Thêm gói dịch vụ mới
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt thông báo</CardTitle>
                  <CardDescription>
                    Quản lý cài đặt thông báo cho khách hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Thông báo qua Email</h3>
                        <p className="text-sm text-gray-500">Gửi thông báo qua email cho khách hàng</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.emailEnabled} 
                        onCheckedChange={(checked) => updateNotification('emailEnabled', checked)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Thông báo qua SMS</h3>
                        <p className="text-sm text-gray-500">Gửi thông báo qua tin nhắn SMS cho khách hàng</p>
                      </div>
                      <Switch 
                        checked={settings.notifications.smsEnabled} 
                        onCheckedChange={(checked) => updateNotification('smsEnabled', checked)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Thời gian nhắc lịch hẹn</h3>
                      <p className="text-sm text-gray-500 mb-4">Gửi thông báo nhắc lịch hẹn trước bao nhiêu giờ</p>
                      
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="number" 
                          value={settings.notifications.reminderHours} 
                          onChange={(e) => updateNotification('reminderHours', parseInt(e.target.value))}
                          className="w-24"
                        />
                        <span>giờ trước lịch hẹn</span>
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
  );
};

export default SettingsPage;
