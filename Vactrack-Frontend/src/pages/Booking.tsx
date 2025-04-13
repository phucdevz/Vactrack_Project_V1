
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
import { facilities } from "@/models/facility";
import { FacilityPicker } from "@/components/FacilityPicker";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
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
import { PaymentConfirmation } from "@/components/PaymentConfirmation";

const API_URL = "http://localhost:8080/api";

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
  facilityId: z.string({
    required_error: "Vui lòng chọn cơ sở tiêm chủng",
  }),
  appointmentDate: z.string({
    required_error: "Vui lòng chọn ngày hẹn",
  }),
  appointmentTime: z.string({
    required_error: "Vui lòng chọn giờ hẹn",
  }),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
});

const packagePrices = {
  "co-ban": 1500000,
  "tieu-chuan": 2500000,
  "cao-cap": 3500000,
  "ca-the-hoa-12": 2000000,
  "ca-the-hoa-35": 2200000,
  "ca-the-hoa-6": 2400000,
  "sang-loc-co-ban": 500000,
  "sang-loc-nang-cao": 800000,
};

const Booking = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<BookingSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [facilityName, setFacilityName] = useState("");
  const [bookingAmount, setBookingAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("direct");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/booking" } } });
    }
  }, [isLoggedIn, navigate]);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientName: user?.name || "",
      patientDob: "",
      serviceType: "",
      packageType: "",
      facilityId: "",
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (date && form.watch("facilityId")) {
      const formattedDate = format(date, "yyyy-MM-dd");
      form.setValue("appointmentDate", formattedDate);
      
      // Mock time slots
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
    } else {
      setTimeSlots([]);
    }
  }, [date, form]);

  useEffect(() => {
    const selectedPackage = form.watch("packageType");
    if (selectedPackage) {
      setBookingAmount(packagePrices[selectedPackage] || 0);
    } else {
      setBookingAmount(0);
    }
  }, [form.watch("packageType")]);

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

    setShowConfirmation(true);
  };

  const handleConfirmBooking = () => {
    // This will be handled by the PaymentConfirmation component now
  };

  // Services and packages data
  const services = [
    { id: "goi-tiem-chung-tron-goi", name: "Gói tiêm chủng trọn gói" },
    { id: "tiem-chung-ca-the-hoa", name: "Tiêm chủng cá thể hóa" },
    { id: "kham-sang-loc-truoc-tiem", name: "Khám sàng lọc trước tiêm" },
  ];

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

  const filteredPackages = packages.filter(
    pkg => form.watch("serviceType") === pkg.serviceId
  );

  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < today || date.getDay() === 0;
  };

  const handleFacilityChange = (facilityId: string, name: string) => {
    form.setValue("facilityId", facilityId);
    setFacilityName(name);
  };

  // For the payment confirmation dialog
  const selectedService = services.find(s => s.id === form.watch("serviceType"));
  const selectedPackage = packages.find(p => p.id === form.watch("packageType"));

  const confirmationData = {
    bookingId: "BK" + Math.floor(Math.random() * 10000),
    amount: bookingAmount,
    serviceType: selectedService?.name,
    packageType: selectedPackage?.name,
    facilityName: facilityName,
    appointmentDate: form.watch("appointmentDate"),
    appointmentTime: form.watch("appointmentTime"),
    paymentMethod: paymentMethod
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
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("packageType", ""); // Reset packageType when service changes
                          }} 
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
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="facilityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cơ sở tiêm chủng</FormLabel>
                          <FormControl>
                            <FacilityPicker
                              value={field.value}
                              onChange={handleFacilityChange}
                              facilities={facilities}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                            disabled={!date || !form.watch("facilityId")}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          {!date 
                            ? "Vui lòng chọn ngày trước để xem các khung giờ trống"
                            : !form.watch("facilityId") 
                              ? "Vui lòng chọn cơ sở tiêm chủng trước"
                              : "Chọn khung giờ phù hợp"
                          }
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
                  
                  <div className="col-span-2 mt-4">
                    <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
                    <PaymentMethodSelector
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-500 hover:bg-brand-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Tiếp tục đặt lịch"}
                  </Button>
                </div>
              </form>
            </Form>

            <PaymentConfirmation 
              open={showConfirmation} 
              onOpenChange={setShowConfirmation} 
              bookingData={confirmationData}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Booking;
