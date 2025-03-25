
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Book,
  ChevronRight,
  FileQuestion,
  HelpCircle,
  Info,
  LifeBuoy,
  Mail,
  Phone,
  Search,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

const HelpPage = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in and has admin role
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/admin-vactrack/help" } } });
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
  }, [isLoggedIn, isAdmin, navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Trợ giúp</h1>
            <p className="text-gray-600">Tìm kiếm trợ giúp và tài liệu hướng dẫn</p>
          </div>
          
          <div className="mb-8">
            <div className="relative w-full max-w-lg mx-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm câu hỏi hoặc hướng dẫn..."
                className="pl-8"
              />
            </div>
          </div>

          <Tabs defaultValue="faq" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="faq">
                <FileQuestion className="h-4 w-4 mr-2" />
                Câu hỏi thường gặp
              </TabsTrigger>
              <TabsTrigger value="guides">
                <Book className="h-4 w-4 mr-2" />
                Hướng dẫn sử dụng
              </TabsTrigger>
              <TabsTrigger value="contact">
                <LifeBuoy className="h-4 w-4 mr-2" />
                Liên hệ hỗ trợ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Câu hỏi thường gặp</CardTitle>
                  <CardDescription>
                    Danh sách các câu hỏi và giải đáp thường gặp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Làm thế nào để tạo một lịch hẹn mới?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 mb-2">
                          Để tạo một lịch hẹn mới, bạn có thể thực hiện theo các bước sau:
                        </p>
                        <ol className="text-gray-600 pl-5 space-y-2 list-decimal">
                          <li>Truy cập vào trang "Lịch hẹn" từ menu bên trái.</li>
                          <li>Nhấn vào nút "Tạo lịch hẹn" ở góc trên bên phải.</li>
                          <li>Điền đầy đủ thông tin vào form tạo lịch hẹn.</li>
                          <li>Nhấn "Lưu" để hoàn tất quá trình tạo lịch hẹn.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Làm thế nào để cập nhật thông tin vắc-xin?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 mb-2">
                          Để cập nhật thông tin vắc-xin, bạn có thể thực hiện theo các bước sau:
                        </p>
                        <ol className="text-gray-600 pl-5 space-y-2 list-decimal">
                          <li>Truy cập vào trang "Vắc-xin" từ menu bên trái.</li>
                          <li>Tìm kiếm vắc-xin cần cập nhật thông tin.</li>
                          <li>Nhấn vào nút "Chi tiết" trên dòng của vắc-xin đó.</li>
                          <li>Cập nhật thông tin trong form hiển thị.</li>
                          <li>Nhấn "Lưu thay đổi" để hoàn tất quá trình cập nhật.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Làm thế nào để xem báo cáo theo tháng?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 mb-2">
                          Để xem báo cáo theo tháng, bạn có thể thực hiện theo các bước sau:
                        </p>
                        <ol className="text-gray-600 pl-5 space-y-2 list-decimal">
                          <li>Truy cập vào trang "Báo cáo" từ menu bên trái.</li>
                          <li>Chọn tab "Tiêm chủng" hoặc tab báo cáo mong muốn.</li>
                          <li>Sử dụng bộ lọc thời gian để chọn "Theo tháng".</li>
                          <li>Nếu cần, bạn có thể xuất báo cáo ra file Excel bằng cách nhấn vào nút "Xuất báo cáo".</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        Làm thế nào để thay đổi thông tin phòng khám?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 mb-2">
                          Để thay đổi thông tin phòng khám, bạn có thể thực hiện theo các bước sau:
                        </p>
                        <ol className="text-gray-600 pl-5 space-y-2 list-decimal">
                          <li>Truy cập vào trang "Cài đặt" từ menu bên trái.</li>
                          <li>Chọn tab "Phòng khám".</li>
                          <li>Cập nhật thông tin trong form hiển thị.</li>
                          <li>Nhấn "Lưu thay đổi" để hoàn tất quá trình cập nhật.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger>
                        Làm thế nào để sao lưu dữ liệu hệ thống?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 mb-2">
                          Để sao lưu dữ liệu hệ thống, bạn có thể thực hiện theo các bước sau:
                        </p>
                        <ol className="text-gray-600 pl-5 space-y-2 list-decimal">
                          <li>Truy cập vào trang "Cài đặt" từ menu bên trái.</li>
                          <li>Chọn tab "Hệ thống".</li>
                          <li>Tìm mục "Sao lưu dữ liệu" và nhấn nút "Tạo bản sao lưu".</li>
                          <li>Hệ thống sẽ tạo một bản sao lưu và cho phép bạn tải xuống.</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guides" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Hướng dẫn quản lý lịch hẹn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Video className="h-4 w-4 mr-1" />
                      <span>Video hướng dẫn</span>
                      <span className="mx-2">•</span>
                      <span>10 phút</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Hướng dẫn chi tiết về cách quản lý lịch hẹn, tạo lịch hẹn mới, chỉnh sửa và xóa lịch hẹn trong hệ thống.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      Xem hướng dẫn
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Hướng dẫn quản lý vắc-xin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Book className="h-4 w-4 mr-1" />
                      <span>Tài liệu</span>
                      <span className="mx-2">•</span>
                      <span>15 trang</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Hướng dẫn chi tiết về cách quản lý vắc-xin, thêm vắc-xin mới, cập nhật thông tin và theo dõi tình trạng tồn kho.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      Xem hướng dẫn
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Hướng dẫn tạo báo cáo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Video className="h-4 w-4 mr-1" />
                      <span>Video hướng dẫn</span>
                      <span className="mx-2">•</span>
                      <span>8 phút</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Hướng dẫn chi tiết về cách tạo và xuất báo cáo theo nhiều tiêu chí khác nhau, phân tích dữ liệu từ hệ thống.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      Xem hướng dẫn
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Cấu hình thông báo tự động</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Book className="h-4 w-4 mr-1" />
                      <span>Tài liệu</span>
                      <span className="mx-2">•</span>
                      <span>12 trang</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Hướng dẫn chi tiết về cách cấu hình hệ thống gửi thông báo tự động cho khách hàng qua email và SMS.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      Xem hướng dẫn
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quản lý hồ sơ bệnh nhân</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Video className="h-4 w-4 mr-1" />
                      <span>Video hướng dẫn</span>
                      <span className="mx-2">•</span>
                      <span>12 phút</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Hướng dẫn chi tiết về cách quản lý hồ sơ bệnh nhân, thêm bệnh nhân mới, cập nhật thông tin và theo dõi lịch sử tiêm chủng.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      Xem hướng dẫn
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Sao lưu và phục hồi dữ liệu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Book className="h-4 w-4 mr-1" />
                      <span>Tài liệu</span>
                      <span className="mx-2">•</span>
                      <span>8 trang</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Hướng dẫn chi tiết về cách sao lưu dữ liệu hệ thống và phục hồi dữ liệu từ bản sao lưu khi cần.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-between">
                      Xem hướng dẫn
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Liên hệ hỗ trợ kỹ thuật</CardTitle>
                  <CardDescription>
                    Nếu bạn cần trợ giúp thêm, vui lòng liên hệ với đội ngũ hỗ trợ kỹ thuật của chúng tôi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-brand-500" />
                          Email hỗ trợ
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">
                          Gửi email cho đội ngũ hỗ trợ kỹ thuật của chúng tôi:
                        </p>
                        <a href="mailto:support@vactrack.vn" className="text-brand-600 font-medium hover:underline">
                          support@vactrack.vn
                        </a>
                        <p className="text-xs text-gray-500 mt-2">
                          Thời gian phản hồi: trong vòng 24 giờ làm việc
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Phone className="h-5 w-5 mr-2 text-brand-500" />
                          Hotline hỗ trợ
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">
                          Gọi đến hotline hỗ trợ kỹ thuật của chúng tôi:
                        </p>
                        <a href="tel:02812345678" className="text-brand-600 font-medium hover:underline">
                          028 1234 5678
                        </a>
                        <p className="text-xs text-gray-500 mt-2">
                          Thời gian hỗ trợ: 8:00 - 17:30, Thứ Hai - Thứ Sáu
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Info className="h-5 w-5 mr-2 text-brand-500" />
                          Form yêu cầu hỗ trợ
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="name" className="text-sm font-medium">
                                Họ và tên
                              </label>
                              <Input id="name" placeholder="Nhập họ và tên của bạn" />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium">
                                Email
                              </label>
                              <Input id="email" type="email" placeholder="email@example.com" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">
                              Tiêu đề
                            </label>
                            <Input id="subject" placeholder="Nhập tiêu đề yêu cầu hỗ trợ" />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                              Nội dung
                            </label>
                            <textarea
                              id="message"
                              className="w-full min-h-[120px] rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                              placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                            ></textarea>
                          </div>
                          <Button className="w-full">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Gửi yêu cầu hỗ trợ
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-500">
                    Đội ngũ hỗ trợ của chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
