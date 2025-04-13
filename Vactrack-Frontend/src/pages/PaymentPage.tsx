
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Copy, Loader2, MapPin, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

interface PaymentInfo {
  amount: number;
  bookingId: string;
  serviceType: string;
  packageType: string;
  facilityName: string;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: string;
  notes?: string;
}

interface PaymentStatus {
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  message?: string;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  
  // Get payment info from location state
  const paymentInfo: PaymentInfo = location.state?.paymentInfo;
  
  useEffect(() => {
    if (!paymentInfo) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin thanh toán",
        variant: "destructive",
      });
      navigate("/booking");
      return;
    }

    // Generate QR code for exact payment amount
    if (paymentInfo.paymentMethod === "online") {
      generateQRCode();
    }
  }, [paymentInfo, navigate, toast]);

  const generateQRCode = async () => {
    try {
      // In a real application, you would call your backend API to generate the QR code
      // For now, we'll use a mock API with the actual amount
      const amountFormatted = paymentInfo.amount.toString();
      const bankInfo = `Techcombank|19036518968011|CÔNG TY TNHH VACTRACK VIỆT NAM|${amountFormatted}|VT${paymentInfo.bookingId}`;
      
      // Using QR Server API to generate the QR code with the payment info
      const encodedBankInfo = encodeURIComponent(bankInfo);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedBankInfo}`;
      setQrCodeUrl(qrUrl);

      // In a real application, you would also call your backend to record this payment attempt
      // await axios.post("/api/payments/create", { 
      //   bookingId: paymentInfo.bookingId, 
      //   amount: paymentInfo.amount,
      //   paymentMethod: paymentInfo.paymentMethod 
      // });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Lỗi tạo mã QR",
        description: "Không thể tạo mã QR. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const bankInfo = {
    bankName: "Ngân hàng Techcombank",
    accountNumber: "19036518968011",
    accountName: "CÔNG TY TNHH VACTRACK VIỆT NAM",
    content: `VT${paymentInfo?.bookingId}`
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: "Đã sao chép",
      description: `${type === 'account' ? 'Số tài khoản' : 'Nội dung chuyển khoản'} đã được sao chép vào clipboard`,
    });
    
    setTimeout(() => setCopied(null), 3000);
  };

  const handleCheckPayment = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to check payment status
      // Example API call:
      // const response = await axios.get(`/api/payments/check/${paymentInfo.bookingId}`);
      // setPaymentStatus(response.data);
      // if (response.data.status === "completed") {
      //   setIsPaid(true);
      // }
      
      // Simulate API call with a timeout
      setTimeout(() => {
        setIsLoading(false);
        setIsPaid(true);
        setPaymentStatus({
          status: "completed",
          transactionId: `TX${Math.floor(Math.random() * 1000000)}`,
          message: "Giao dịch thành công"
        });
        
        toast({
          title: "Thanh toán thành công",
          description: "Chúng tôi đã nhận được thanh toán của bạn",
        });
      }, 2000);
    } catch (error) {
      console.error("Error checking payment:", error);
      setIsLoading(false);
      toast({
        title: "Lỗi kiểm tra thanh toán",
        description: "Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshQR = () => {
    generateQRCode();
    toast({
      title: "Đã làm mới",
      description: "Mã QR đã được làm mới",
    });
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  if (!paymentInfo) {
    return null; // Prevent rendering with no data
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-50 to-purple-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
            <p className="mt-2 text-lg text-gray-600">
              {paymentInfo.paymentMethod === "banking" ? 
                "Vui lòng chuyển khoản theo thông tin bên dưới" : 
                "Quét mã QR để thanh toán"}
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đặt lịch</CardTitle>
              <CardDescription>Chi tiết dịch vụ và thời gian bạn đã đặt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Dịch vụ</p>
                  <p className="font-medium">{paymentInfo.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gói dịch vụ</p>
                  <p className="font-medium">{paymentInfo.packageType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày hẹn</p>
                  <p className="font-medium">{paymentInfo.appointmentDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Giờ hẹn</p>
                  <p className="font-medium">{paymentInfo.appointmentTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Cơ sở</p>
                  <p className="font-medium flex items-start">
                    <MapPin className="h-4 w-4 mr-1 mt-1 shrink-0" />
                    {paymentInfo.facilityName}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500">Hình thức thanh toán</p>
                <p className="font-medium">{
                  paymentInfo.paymentMethod === "direct" ? "Thanh toán trực tiếp" : 
                  paymentInfo.paymentMethod === "banking" ? "Chuyển khoản ngân hàng" : 
                  "Thanh toán online"
                }</p>
              </div>
              
              <div className="border-t border-b py-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Tổng thanh toán</p>
                  <p className="text-xl font-bold text-brand-600">{paymentInfo.amount.toLocaleString('vi-VN')} VND</p>
                </div>
              </div>
              
              {paymentInfo.paymentMethod === "banking" && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <h3 className="font-medium text-center">Thông tin chuyển khoản</h3>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ngân hàng</p>
                    <p className="font-medium">{bankInfo.bankName}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Số tài khoản</p>
                      <p className="font-medium">{bankInfo.accountNumber}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopy(bankInfo.accountNumber, 'account')}
                      className="flex items-center"
                    >
                      {copied === 'account' ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied === 'account' ? "Đã sao chép" : "Sao chép"}
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Chủ tài khoản</p>
                    <p className="font-medium">{bankInfo.accountName}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nội dung chuyển khoản</p>
                      <p className="font-medium">{bankInfo.content}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopy(bankInfo.content, 'content')}
                      className="flex items-center"
                    >
                      {copied === 'content' ? <CheckCircle className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied === 'content' ? "Đã sao chép" : "Sao chép"}
                    </Button>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md mt-4">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Lưu ý:</span> Vui lòng chuyển khoản chính xác số tiền {paymentInfo.amount.toLocaleString('vi-VN')} VND và nội dung chuyển khoản để chúng tôi có thể xác nhận giao dịch của bạn.
                    </p>
                  </div>
                </div>
              )}
              
              {paymentInfo.paymentMethod === "online" && (
                <div className="flex flex-col items-center space-y-4">
                  <p className="font-medium">Quét mã QR để thanh toán số tiền {paymentInfo.amount.toLocaleString('vi-VN')} VND</p>
                  <div className="relative">
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="border p-2 bg-white rounded"
                        width={200}
                        height={200}
                      />
                    ) : (
                      <div className="border p-2 bg-white rounded w-[200px] h-[200px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="absolute -top-2 -right-2 rounded-full p-1 h-8 w-8" 
                      onClick={handleRefreshQR}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Làm mới mã QR</span>
                    </Button>
                  </div>
                  <div className="w-full max-w-md space-y-2">
                    <p className="text-sm text-gray-500 text-center">Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã</p>
                    <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Mã QR đã được cấu hình với số tiền chính xác {paymentInfo.amount.toLocaleString('vi-VN')} VND. Không cần nhập thêm số tiền khi thanh toán.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {isPaid ? (
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="font-semibold text-green-700">Thanh toán thành công</p>
                  <p className="text-sm text-green-600">Cảm ơn bạn đã sử dụng dịch vụ của VacTrack</p>
                  {paymentStatus?.transactionId && (
                    <p className="text-sm text-green-600 mt-2">Mã giao dịch: {paymentStatus.transactionId}</p>
                  )}
                </div>
              ) : (paymentInfo.paymentMethod !== "direct" && (
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Sau khi hoàn tất thanh toán, vui lòng nhấn vào nút bên dưới để kiểm tra trạng thái
                  </p>
                  <Button 
                    onClick={handleCheckPayment} 
                    disabled={isLoading}
                    className="bg-brand-500 hover:bg-brand-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang kiểm tra...
                      </>
                    ) : (
                      "Tôi đã thanh toán"
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={handleReturnHome}
                className={cn("w-full", isPaid && "bg-brand-500 hover:bg-brand-600 text-white")}
              >
                {isPaid ? "Quay về trang chủ" : "Quay lại"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;
