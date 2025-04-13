
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would connect to your backend to handle password reset
      // For now, we'll simulate a successful request with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast({
        title: "Yêu cầu đã được gửi",
        description: "Mật khẩu mới đã được gửi đến email của bạn.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            {!isSubmitted ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-500 mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Quên mật khẩu
                </h2>
                <p className="mt-2 text-gray-600">
                  Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Kiểm tra email của bạn
                </h2>
                <p className="mt-2 text-gray-600">
                  Chúng tôi đã gửi mật khẩu mới đến email {email}. Vui lòng kiểm tra hộp thư đến của bạn.
                </p>
              </>
            )}
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-500 hover:bg-brand-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Khôi phục mật khẩu"
                )}
              </Button>
              
              <div className="text-center mt-4">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-brand-600 hover:text-brand-500"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Quay lại trang đăng nhập
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <Button 
                className="w-full bg-brand-500 hover:bg-brand-600"
                onClick={() => window.location.href = "/login"}
              >
                Quay lại trang đăng nhập
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
