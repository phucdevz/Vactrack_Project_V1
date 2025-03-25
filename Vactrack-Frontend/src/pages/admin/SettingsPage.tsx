
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import {
  Bell,
  Building,
  CalendarDays,
  Clock,
  Database,
  Globe,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// API URL from context
const API_URL = "http://localhost:8080/api";

const clinicFormSchema = z.object({
  clinicName: z.string().min(2, { message: "Tên phòng khám phải có ít nhất 2 ký tự" }),
  address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  website: z.string().optional(),
  description: z.string().optional(),
});

type ClinicFormValues = z.infer<typeof clinicFormSchema>;

const workingHoursSchema = z.object({
  mondayToFriday: z.string(),
  saturday: z.string(),
  sunday: z.string(),
  holidayMode: z.boolean().default(false),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  remindersBefore: z.string(),
  appointmentConfirmation: z.boolean().default(true),
});

const SettingsPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Clinic Information Form
  const clinicForm = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      clinicName: "Phòng khám VacTrack",
      address: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
      phone: "0287654321",
      email: "contact@vactrack.vn",
      website: "https://vactrack.vn",
      description: "Phòng khám chuyên về tiêm chủng và chăm sóc sức khỏe trẻ em."
    },
  });

  // Working Hours Form
  const workingHoursForm = useForm({
    resolver: zodResolver(workingHoursSchema),
    defaultValues: {
      mondayToFriday: "08:00 - 17:00",
      saturday: "08:00 - 12:00",
      sunday: "Đóng cửa",
      holidayMode: false,
    },
  });

  // Notification Settings Form
  const notificationSettingsForm = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      remindersBefore: "1",
      appointmentConfirmation: true,
    },
  });

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
    fetchSettingsData();
  }, [isLoggedIn, isAdmin, navigate]);

  const fetchSettingsData = async () => {
    setIsLoading(true);
    try {
      // API call to get settings data
      const response = await axios.get(`${API_URL}/admin/settings`);
      
      if (response.data) {
        // Update forms with data from API
        const { clinicInfo, workingHours, notificationSettings } = response.data;
        
        if (clinicInfo) {
          clinicForm.reset(clinicInfo);
        }
        
        if (workingHours) {
          workingHoursForm.reset(workingHours);
        }
        
        if (notificationSettings) {
          notificationSettingsForm.reset(notificationSettings);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching settings data:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu cài đặt. Dùng dữ liệu mặc định thay thế.",
      });
      
      // No need to set fallback data, as we already have default values
      setIsLoading(false);
    }
  };

  const onClinicSubmit = async (data: ClinicFormValues) => {
    try {
      // In a real app, this would send the data to the API
      // await axios.put(`${API_URL}/admin/settings/clinic`, data);
      
      console.log("Clinic info submitted:", data);
      
      toast({
        title: "Đã lưu thành công",
        description: "Thông tin phòng khám đã được cập nhật.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật thông tin phòng khám. Vui lòng thử lại sau.",
      });
    }
  };

  const onWorkingHoursSubmit = async (data: any) => {
    try {
      // In a real app, this would send the data to the API
      // await axios.put(`${API_URL}/admin/settings/working-hours`, data);
      
      console.log("Working hours submitted:", data);
      
      toast({
        title: "Đã lưu thành công",
        description: "Giờ làm việc đã được cập nhật.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật giờ làm việc. Vui lòng thử lại sau.",
      });
    }
  };

  const onNotificationSettingsSubmit = async (data: any) => {
    try {
      // In a real app, this would send the data to the API
      // await axios.put(`${API_URL}/admin/settings/notifications`, data);
      
      console.log("Notification settings submitted:", data);
      
      toast({
        title: "Đã lưu thành công",
        description: "Cài đặt thông báo đã được cập nhật.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật cài đặt thông báo. Vui lòng thử lại sau.",
      });
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-600">Quản lý cài đặt hệ thống tiêm chủng</p>
          </div>

          <Tabs defaultValue="clinic" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="clinic">
                <Building className="h-4 w-4 mr-2" />
                Phòng khám
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <Clock className="h-4 w-4 mr-2" />
                Lịch làm việc
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Thông báo
              </TabsTrigger>
              <TabsTrigger value="system">
                <Database className="h-4 w-4 mr-2" />
                Hệ thống
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="clinic" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin phòng khám</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin của phòng khám tiêm chủng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...clinicForm}>
                    <form onSubmit={clinicForm.handleSubmit(onClinicSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={clinicForm.control}
                          name="clinicName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên phòng khám</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập tên phòng khám" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clinicForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="contact@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clinicForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số điện thoại</FormLabel>
                              <FormControl>
                                <Input placeholder="028 1234 5678" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clinicForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clinicForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                              <FormLabel>Địa chỉ</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập địa chỉ phòng khám" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={clinicForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                              <FormLabel>Mô tả</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Mô tả về phòng khám" 
                                  className="resize-none h-32" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Lưu thay đổi
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Giờ làm việc</CardTitle>
                  <CardDescription>
                    Cài đặt giờ làm việc của phòng khám
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...workingHoursForm}>
                    <form onSubmit={workingHoursForm.handleSubmit(onWorkingHoursSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={workingHoursForm.control}
                          name="mondayToFriday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thứ Hai - Thứ Sáu</FormLabel>
                              <FormControl>
                                <Input placeholder="08:00 - 17:00" {...field} />
                              </FormControl>
                              <FormDescription>
                                Ví dụ: 08:00 - 17:00
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={workingHoursForm.control}
                          name="saturday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thứ Bảy</FormLabel>
                              <FormControl>
                                <Input placeholder="08:00 - 12:00" {...field} />
                              </FormControl>
                              <FormDescription>
                                Ví dụ: 08:00 - 12:00 hoặc "Đóng cửa"
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={workingHoursForm.control}
                          name="sunday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chủ Nhật</FormLabel>
                              <FormControl>
                                <Input placeholder="Đóng cửa" {...field} />
                              </FormControl>
                              <FormDescription>
                                Ví dụ: 08:00 - 12:00 hoặc "Đóng cửa"
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={workingHoursForm.control}
                          name="holidayMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Chế độ nghỉ lễ</FormLabel>
                                <FormDescription>
                                  Kích hoạt khi phòng khám đóng cửa vào dịp lễ
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Lưu thay đổi
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt thông báo</CardTitle>
                  <CardDescription>
                    Quản lý cài đặt thông báo cho hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...notificationSettingsForm}>
                    <form onSubmit={notificationSettingsForm.handleSubmit(onNotificationSettingsSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <FormField
                          control={notificationSettingsForm.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Thông báo Email</FormLabel>
                                <FormDescription>
                                  Gửi thông báo qua email cho khách hàng
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationSettingsForm.control}
                          name="smsNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Thông báo SMS</FormLabel>
                                <FormDescription>
                                  Gửi thông báo qua SMS cho khách hàng
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationSettingsForm.control}
                          name="remindersBefore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gửi nhắc lịch hẹn trước</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn thời gian nhắc" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 ngày</SelectItem>
                                  <SelectItem value="2">2 ngày</SelectItem>
                                  <SelectItem value="3">3 ngày</SelectItem>
                                  <SelectItem value="7">1 tuần</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Thời gian gửi thông báo nhắc trước khi đến lịch hẹn
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationSettingsForm.control}
                          name="appointmentConfirmation"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Xác nhận lịch hẹn</FormLabel>
                                <FormDescription>
                                  Yêu cầu khách hàng xác nhận lịch hẹn sau khi đặt
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Lưu thay đổi
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt hệ thống</CardTitle>
                  <CardDescription>
                    Quản lý cài đặt chung của hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="darkMode">Phiên bản ứng dụng</Label>
                        <p className="text-sm text-muted-foreground">
                          VacTrack Admin v1.0.0
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Kiểm tra cập nhật
                      </Button>
                    </div>
                    
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="language">Ngôn ngữ</Label>
                        <p className="text-sm text-muted-foreground">
                          Thiết lập ngôn ngữ hiển thị của hệ thống
                        </p>
                      </div>
                      <Select defaultValue="vi">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn ngôn ngữ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vi">Tiếng Việt</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="backupData">Sao lưu dữ liệu</Label>
                        <p className="text-sm text-muted-foreground">
                          Tạo bản sao lưu dữ liệu hệ thống
                        </p>
                      </div>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Tạo bản sao lưu
                      </Button>
                    </div>
                    
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="clearCache">Xóa bộ nhớ cache</Label>
                        <p className="text-sm text-muted-foreground">
                          Xóa bộ nhớ đệm của hệ thống
                        </p>
                      </div>
                      <Button variant="outline">
                        Xóa cache
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Bạn có thể liên hệ đội hỗ trợ kỹ thuật nếu cần trợ giúp
                  </p>
                  <Button variant="outline">
                    Liên hệ hỗ trợ
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
