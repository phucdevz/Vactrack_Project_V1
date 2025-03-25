
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, FileCheck, Bell, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    if (isLoggedIn) {
      navigate("/booking");
    } else {
      navigate("/login", { state: { from: { pathname: "/booking" } } });
    }
  };

  const handleLearnMoreClick = () => {
    navigate("/services");
  };

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/90 to-brand-800/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col lg:flex-row items-center">
        {/* Left side content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Chăm sóc sức khỏe cho{" "}
              <span className="text-brand-100">tương lai</span> của bé
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="mt-4 text-lg text-white/90 max-w-xl mx-auto lg:mx-0">
              Hệ thống quản lý tiêm chủng toàn diện giúp theo dõi lịch tiêm, nhận
              thông báo và bảo vệ sức khỏe của bé một cách hiệu quả nhất.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button 
              size="lg" 
              className="bg-white text-brand-600 hover:bg-brand-50 px-6"
              onClick={handleBookNowClick}
            >
              Đặt lịch ngay
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-6"
              onClick={handleLearnMoreClick}
            >
              Tìm hiểu thêm
            </Button>
          </motion.div>
        </div>

        {/* Right side - Feature cards */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <CalendarCheck className="h-8 w-8 text-brand-500" />,
              title: "Đặt lịch trực tuyến",
              description: "Dễ dàng đặt lịch tiêm chủng mọi lúc, mọi nơi",
              delay: 0.3,
            },
            {
              icon: <FileCheck className="h-8 w-8 text-brand-500" />,
              title: "Hồ sơ tiêm chủng",
              description: "Theo dõi đầy đủ lịch sử tiêm chủng của bé",
              delay: 0.4,
            },
            {
              icon: <Bell className="h-8 w-8 text-brand-500" />,
              title: "Nhắc lịch thông minh",
              description: "Không bỏ lỡ mũi tiêm nào với hệ thống nhắc lịch",
              delay: 0.5,
            },
            {
              icon: <Shield className="h-8 w-8 text-brand-500" />,
              title: "An toàn tối đa",
              description: "Quy trình tiêm chủng chuẩn WHO, đội ngũ y bác sĩ chuyên môn cao",
              delay: 0.6,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              className="glass-panel rounded-xl p-6"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
