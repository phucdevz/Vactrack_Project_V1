
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormData, BookingSlot } from "@/models/booking";
import { addDays, format } from "date-fns";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// API URL từ Auth Context
const API_URL = "http://localhost:8080/api";

// Schema validation cho form booking
const bookingFormSchema = z.object({
  patientName: z.string().min(2, {
    message: "Tên bệnh nhân phải có ít nhất 2 ký tự",
  }),
  patientDob: z.string({
    required_error: "Vui lòng chọn ngày sinh",
  }),
  serviceType: z.string({
    required_error: "Vui lòng chọn loại dịch vụ",
  }),
  packageType: z.string({
    required_error: "Vui lòng chọn gói tiêm chủng",
  }),
  appointmentDate: z.string({
    required_error: "Vui lòng chọn ngày hẹn",
  }),
  appointmentTime: z.string({
    required_error: "Vui lòng chọn giờ hẹn",
  }),
  notes: z.string().optional(),
});

const Booking = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<BookingSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Điều hướng sang trang login nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/booking" } } });
    }
  }, [isLoggedIn, navigate]);

  // Initialize form with React Hook Form
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientName: "",
      patientDob: "",
      serviceType: "",
      packageType: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    },
  });

  // Giả lập danh sách các khung giờ trống
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      form.setValue("appointmentDate", formattedDate);
      
      // Trong thực tế, bạn sẽ gọi API để lấy các khung giờ trống
      // Ví dụ: axios.get(`${API_URL}/bookings/available-slots?date=${formattedDate}`)
      
      // Hiện tại giả lập dữ liệu
      const mockTimeSlots: BookingSlot[] = [
        { id: "1", time: "08:00", available: true },
        { id: "2", time: "08:30", available: false },
        { id: "3", time: "09:00", available: true },
        { id: "4", time: "09:30", available: true },
        { id: "5", time: "10:00", available: false },
        { id: "6", time: "10:30", available: true },
        { id: "7", time: "14:00", available: true },
        { id: "8", time: "14:30", available: true },
        { id: "9", time: "15:00", available: false },
        { id: "10", time: "15:30", available: true },
        { id: "11", time: "16:00", available: true },
        { id: "12", time: "16:30", available: true },
      ];
      
      setTimeSlots(mockTimeSlots);
    }
  }, [date, form]);

  // Xử lý gửi form
  const onSubmit = async (values: z.infer<typeof bookingFormSchema>) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để đặt lịch",
        variant: "destructive",
      });
      navigate("/login", { state: { from: { pathname: "/booking" } } });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Kết nối với Spring Boot API
      // Trong thực tế, chúng ta sẽ gửi dữ liệu đến backend ở đây
      // const response = await axios.post(`${API_URL}/bookings`, {
      //   userId: user.id,
      //   ...values,
      //   status: "pending"
      // });
      
      // Giả lập việc gửi dữ liệu
      console.log("Booking data:", {
        userId: user.id,
        ...values,
        status: "pending"
      });
      
      // Hiển thị thông báo thành công
      toast({
        title: "Đặt lịch thành công",
        description: "Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn",
      });
      
      // Reset form
      form.reset();
      setDate(undefined);
      
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Lỗi đặt lịch",
        description: "Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Danh sách dịch vụ
  const services = [
    { id: "dat-lich-tiem-chung", name: "Đặt lịch tiêm chủng" },
    { id: "goi-tiem-chung-tron-goi", name: "Gói tiêm chủng trọn gói" },
    { id: "tiem-chung-ca-the-hoa", name: "Tiêm chủng cá thể hóa" },
    { id: "kham-sang-loc-truoc-tiem", name: "Khám sàng lọc trước tiêm" },
  ];

  // Danh sách các gói
  const packages = [
    { id: "co-ban", name: "Cơ bản", serviceId: "goi-tiem-chung-tron-goi" },
    { id: "tieu-chuan", name: "Tiêu chuẩn", serviceId: "goi-tiem-chung-tron-goi" },
    { id: "cao-cap", name: "Cao cấp", serviceId: "goi-tiem-chung-tron-goi" },
    { id: "ca-the-hoa-12", name: "Lịch 1-2 tuổi", serviceId: "tiem-chung-ca-the-hoa" },
    { id: "ca-the-hoa-35", name: "Lịch 3-5 tuổi", serviceId: "tiem-chung-ca-the-hoa" },
    { id: "ca-the-hoa-6", name: "Lịch trên 6 tuổi", serviceId: "tiem-chung-ca-the-hoa" },
    { id: "sang-loc-co-ban", name: "Khám sàng lọc cơ bản", serviceId: "kham-sang-loc-truoc-tiem" },
    { id: "sang-loc-nang-cao", name: "Khám sàng lọc nâng cao", serviceId: "kham-sang-loc-truoc-tiem" },
  ];

  // Lọc gói dựa trên dịch vụ đã chọn
  const filteredPackages = packages.filter(
    pkg => form.watch("serviceType") === pkg.serviceId
  );

  // Hàm vô hiệu hóa các ngày trong quá khứ hoặc ngày nghỉ
  const disabledDates = (date: Date) => {
    // Không cho phép chọn ngày trong quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Không cho phép chọn ngày chủ nhật
    return date < today || date.getDay() === 0;
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-16 bg-gradient-to-r from-brand-50 to-purple-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Đặt lịch tiêm chủng</h1>
            <p className="mt-2 text-lg text-gray-600">
              Vui lòng điền đầy đủ thông tin để đặt lịch tiêm chủng
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Thông tin bệnh nhân */}
                  <div className="col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Thông tin bệnh nhân</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ tên bệnh nhân</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập họ tên bệnh nhân" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="patientDob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <div>
                            <DatePicker
                              date={field.value ? new Date(field.value) : undefined}
                              setDate={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                              label="Ngày sinh"
                              disabledDates={(date) => {
                                const today = new Date();
                                return date > today;
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Thông tin dịch vụ */}
                  <div className="col-span-2 mt-4">
                    <h2 className="text-xl font-semibold mb-4">Thông tin dịch vụ</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại dịch vụ</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại dịch vụ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gói dịch vụ</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!form.watch("serviceType")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn gói dịch vụ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredPackages.map((pkg) => (
                              <SelectItem key={pkg.id} value={pkg.id}>
                                {pkg.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <FormDescription>
                          Chọn loại dịch vụ trước để xem các gói phù hợp
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  {/* Thông tin lịch hẹn */}
                  <div className="col-span-2 mt-4">
                    <h2 className="text-xl font-semibold mb-4">Thông tin lịch hẹn</h2>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày hẹn</FormLabel>
                        <FormControl>
                          <div>
                            <DatePicker
                              date={date}
                              setDate={setDate}
                              label="Chọn ngày hẹn"
                              disabledDates={disabledDates}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Chúng tôi làm việc từ thứ 2 đến thứ 7
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giờ hẹn</FormLabel>
                        <FormControl>
                          <TimePicker 
                            value={field.value} 
                            onChange={field.onChange}
                            timeSlots={timeSlots}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Vui lòng chọn ngày trước để xem các khung giờ trống
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập thông tin bổ sung hoặc yêu cầu đặc biệt (nếu có)"
                              className="h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-500 hover:bg-brand-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Booking;
