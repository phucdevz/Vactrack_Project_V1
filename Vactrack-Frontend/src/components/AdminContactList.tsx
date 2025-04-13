
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Download, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ContactItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status?: "new" | "in-progress" | "completed";
  type?: string;
}

export function AdminContactList() {
  const [contactItems, setContactItems] = useState<ContactItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/contact", {
        params: {
          page: 1,
          limit: 50,
          sortBy: "createdAt",
          order: "desc"
        }
      });

      if (response.data.success) {
        setContactItems(response.data.data);
      } else {
        throw new Error("Không thể tải danh sách liên hệ");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách liên hệ. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      // Dữ liệu mẫu cho trường hợp API lỗi
      setContactItems([
        {
          id: "CT-001",
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          subject: "Tư vấn lịch tiêm cho trẻ 2 tuổi",
          message: "Tôi muốn tư vấn lịch tiêm chủng cho con tôi 2 tuổi. Vui lòng liên hệ lại với tôi.",
          createdAt: new Date().toISOString(),
          status: "new"
        },
        {
          id: "CT-002",
          name: "Trần Thị B",
          email: "tranthib@example.com",
          subject: "Hỏi về giá gói tiêm chủng",
          message: "Tôi muốn biết thêm chi tiết về giá của các gói tiêm chủng. Xin cảm ơn!",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: "in-progress"
        },
        {
          id: "CT-003",
          name: "Lê Văn C",
          email: "levanc@example.com",
          subject: "Đăng ký tư vấn tại nhà",
          message: "Tôi muốn đăng ký dịch vụ tư vấn tiêm chủng tại nhà. Vui lòng gọi cho tôi để biết thêm chi tiết.",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "completed"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "new":
        return "Mới";
      case "in-progress":
        return "Đang xử lý";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Mới";
    }
  };

  const handleExportContacts = () => {
    toast({
      title: "Xuất dữ liệu",
      description: "Dữ liệu đang được xuất ra file Excel.",
    });
    // Đây là nơi sẽ thực hiện xuất dữ liệu trong ứng dụng thật
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <CardTitle>Yêu cầu liên hệ</CardTitle>
          <CardDescription>
            Danh sách yêu cầu liên hệ từ khách hàng
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportContacts}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button size="sm" onClick={fetchContacts} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
            <p className="ml-4 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableCaption>Danh sách các yêu cầu liên hệ từ khách hàng.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Thông tin liên hệ</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactItems.length > 0 ? (
                  contactItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" /> {item.email}
                          </span>
                          {item.message.includes("Điện thoại:") && (
                            <span className="flex items-center text-sm mt-1">
                              <Phone className="h-3 w-3 mr-1" /> 
                              {item.message.split("\n\n")[0].replace("Điện thoại:", "").trim()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.message.includes("\n\n") 
                          ? item.message.split("\n\n")[1]
                          : item.message
                        }
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Chưa có yêu cầu liên hệ nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
