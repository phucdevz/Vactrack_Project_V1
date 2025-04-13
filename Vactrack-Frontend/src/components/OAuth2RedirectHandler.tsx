
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsLoggedIn, setIsAdmin, retrieveTokenFromUrl } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const processAuthentication = async () => {
      try {
        console.log("Processing OAuth authentication with URL:", location.pathname + location.search);
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');
        const code = params.get('code');
        
        // Handle direct token from URL
        if (token) {
          console.log("Token found in URL, processing...");
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          // Set default authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          try {
            // Try to fetch user data if not provided in state
            const response = await axios.get('http://localhost:8080/api/auth/user');
            const userData = response.data;
            
            // Save user data
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Update auth context
            setUser(userData);
            setIsLoggedIn(true);
            setIsAdmin(userData.role === "ADMIN");
            
            // Show success toast
            toast({
              title: "Đăng nhập thành công",
              description: `Chào mừng ${userData.name || 'bạn'} đến với VacTrack!`,
            });
            
            // Redirect based on user role
            if (userData.role === "ADMIN") {
              navigate('/admin-vactrack');
            } else {
              navigate('/');
            }
          } catch (err) {
            console.error('Error completing OAuth authentication:', err);
            handleAuthError("Không thể lấy dữ liệu người dùng. Vui lòng thử lại.");
          }
        } 
        // Handle direct Google/Facebook auth callback with code parameter
        else if (code) {
          console.log("Authorization code found in URL, processing...");
          setErrorMessage("Đang xử lý xác thực. Vui lòng đợi trong giây lát...");
          
          try {
            // Check which OAuth provider callback this is
            let endpoint = 'google';
            if (location.pathname.includes('/facebook/callback')) {
              endpoint = 'facebook';
            }
            
            // This is a direct callback - we need to exchange the code for a token
            const response = await axios.post(`http://localhost:8080/api/auth/${endpoint}/token`, { 
              code,
              redirectUri: window.location.origin + '/oauth2/redirect'
            });
            
            if (response.data && response.data.token) {
              console.log("Token exchange successful");
              // Store token in localStorage
              localStorage.setItem('token', response.data.token);
              
              // Set default authorization header for future requests
              axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
              
              // Fetch user data
              const userResponse = await axios.get('http://localhost:8080/api/auth/user');
              const userData = userResponse.data;
              
              // Save user data
              localStorage.setItem('user', JSON.stringify(userData));
              
              // Update auth context
              setUser(userData);
              setIsLoggedIn(true);
              setIsAdmin(userData.role === "ADMIN");
              
              // Show success toast
              toast({
                title: "Đăng nhập thành công",
                description: `Chào mừng ${userData.name || 'bạn'} đến với VacTrack!`,
              });
              
              // Redirect based on user role
              if (userData.role === "ADMIN") {
                navigate('/admin-vactrack');
              } else {
                navigate('/');
              }
            } else {
              handleAuthError("Không thể hoàn thành xác thực với dịch vụ OAuth.");
            }
          } catch (error) {
            console.error('Error processing OAuth auth callback:', error);
            handleAuthError("Lỗi xử lý xác thực OAuth. Vui lòng thử lại sau.");
          }
        }
        // Handle error
        else if (error) {
          handleAuthError(error || "Đã xảy ra lỗi trong quá trình xác thực.");
        } else {
          handleAuthError("Không có thông tin xác thực.");
        }
      } catch (error) {
        console.error('Error in OAuth redirect handler:', error);
        handleAuthError("Đã xảy ra lỗi khi xử lý đăng nhập. Vui lòng thử lại sau.");
      } finally {
        setIsProcessing(false);
      }
    };

    const handleAuthError = (message: string) => {
      setErrorMessage(message);
      
      toast({
        variant: "destructive",
        title: "Lỗi xác thực",
        description: message,
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    };

    processAuthentication();
  }, [navigate, location, setUser, setIsLoggedIn, setIsAdmin, toast]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white p-4">
      <div className="text-center max-w-md w-full bg-white rounded-xl shadow-md p-8">
        {isProcessing ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-brand-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đang xử lý đăng nhập</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
          </>
        ) : errorMessage ? (
          <>
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đăng nhập thất bại</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">Đang chuyển hướng đến trang đăng nhập...</p>
          </>
        ) : (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đăng nhập thành công</h2>
            <p className="text-gray-600 mb-4">Đang chuyển hướng...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
