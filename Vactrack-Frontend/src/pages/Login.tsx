import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Facebook, LogIn, RefreshCw } from "lucide-react";
import { generateCaptcha, validateCaptcha, getCaptchaStyle } from "@/utils/captchaUtils";

const Login = () => {
  const { login, register, loginWithGoogle, loginWithFacebook, isLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsAdminLogin(params.get('role') === 'admin');
  }, [location]);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const captchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    console.log("Generated CAPTCHA:", newCaptcha);
    setCaptchaCode(newCaptcha);
    setUserCaptchaInput("");
    setCaptchaError(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại VacTrack!",
      });
      
      if (isAdmin && from === "/") {
        navigate("/admin-vactrack");
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: "Mật khẩu xác nhận không khớp. Vui lòng thử lại.",
      });
      return;
    }
    
    if (!validateCaptcha(userCaptchaInput, captchaCode)) {
      toast({
        variant: "destructive",
        title: "Mã xác thực không đúng",
        description: "Vui lòng nhập lại mã CAPTCHA.",
      });
      setCaptchaError(true);
      refreshCaptcha();
      return;
    }
    
    try {
      await register(registerName, registerEmail, registerPassword);
      toast({
        title: "Đăng ký thành công",
        description: "Chào mừng bạn đến với VacTrack!",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.",
      });
      refreshCaptcha();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đăng nhập Google thất bại",
        description: "Có lỗi xảy ra khi đăng nhập bằng Google.",
      });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đăng nhập Facebook thất bại",
        description: "Có lỗi xảy ra khi đăng nhập bằng Facebook.",
      });
    }
  };

  const renderUserLogin = () => (
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
            <h2 className="text-3xl font-bold text-gray-900">
              Chào mừng đến với VacTrack
            </h2>
            <p className="mt-2 text-gray-600">
              Đăng nhập hoặc đăng ký để quản lý tiêm chủng cho con bạn
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register" onClick={refreshCaptcha}>Đăng ký</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-500">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
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
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Hoặc đăng nhập với
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                    className="flex items-center justify-center"
                  >
                    <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                    Facebook
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="email@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Mật khẩu</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="captcha">Mã xác thực</Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      ref={captchaRef}
                      style={getCaptchaStyle(captchaError)}
                      className="flex-1 flex items-center justify-center h-12"
                    >
                      {captchaCode}
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-shrink-0 h-12 aspect-square p-0"
                      onClick={refreshCaptcha}
                      title="Làm mới mã xác thực"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    id="captcha"
                    type="text"
                    placeholder="Nhập mã xác thực"
                    value={userCaptchaInput}
                    onChange={(e) => {
                      setUserCaptchaInput(e.target.value);
                      setCaptchaError(false);
                    }}
                    className={captchaError ? 'border-red-500' : ''}
                    required
                    disabled={isLoading}
                    maxLength={4}
                  />
                  {captchaError && (
                    <p className="text-sm text-red-500 mt-1">
                      Mã xác thực không đúng. Vui lòng thử lại.
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-brand-500 hover:bg-brand-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng ký...
                    </>
                  ) : (
                    "Đăng ký"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );

  const renderAdminLogin = () => (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-900 to-indigo-800">
      <div className="w-full max-w-md m-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-700 w-16 h-16 rounded-full flex items-center justify-center">
                <LogIn className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Quản trị viên VacTrack
            </h2>
            <p className="mt-2 text-gray-600">
              Đăng nhập để quản lý hệ thống
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-gray-700 font-semibold">
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password" className="text-gray-700 font-semibold">
                  Mật khẩu
                </Label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="admin-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-gray-300"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-purple-700 hover:bg-purple-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập quản trị"
              )}
            </Button>
            
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Quay lại trang đăng nhập người dùng
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );

  return isAdminLogin ? renderAdminLogin() : renderUserLogin();
};

export default Login;
