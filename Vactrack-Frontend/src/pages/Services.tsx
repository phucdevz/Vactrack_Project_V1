
import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { 
  CalendarClock, 
  Package, 
  UserRound, 
  Users, 
  Bell, 
  ShieldCheck,
  Stethoscope,
  Clipboard
} from "lucide-react";

const Services = () => {
  const services = [
    {
      id: "dat-lich-tiem-chung",
      title: "Đặt lịch tiêm chủng",
      description: "Dễ dàng đặt lịch tiêm chủng trực tuyến mọi lúc, mọi nơi, tiết kiệm thời gian và công sức.",
      icon: <CalendarClock className="h-6 w-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      id: "goi-tiem-chung-tron-goi",
      title: "Gói tiêm chủng trọn gói",
      description: "Các gói tiêm chủng đầy đủ theo từng độ tuổi, được thiết kế theo chuẩn của Bộ Y tế và WHO.",
      icon: <Package className="h-6 w-6 text-white" />,
      color: "bg-green-500",
    },
    {
      id: "tiem-chung-ca-the-hoa",
      title: "Tiêm chủng cá thể hóa",
      description: "Các gói tiêm chủng được thiết kế riêng phù hợp với tình trạng sức khỏe và nhu cầu của từng bé.",
      icon: <UserRound className="h-6 w-6 text-white" />,
      color: "bg-purple-500",
    },
    {
      id: "ho-so-tiem-chung-dien-tu",
      title: "Hồ sơ tiêm chủng điện tử",
      description: "Lưu trữ đầy đủ thông tin về lịch sử tiêm chủng của trẻ, dễ dàng tra cứu mọi lúc, mọi nơi.",
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-orange-500",
    },
    {
      id: "nhac-lich-tiem-tu-dong",
      title: "Nhắc lịch tiêm tự động",
      description: "Hệ thống thông báo tự động giúp phụ huynh không bỏ lỡ bất kỳ mũi tiêm nào cho con.",
      icon: <Bell className="h-6 w-6 text-white" />,
      color: "bg-red-500",
    },
    {
      id: "tu-van-tiem-chung",
      title: "Tư vấn tiêm chủng",
      description: "Đội ngũ y bác sĩ giàu kinh nghiệm tư vấn chi tiết về lịch tiêm, phản ứng sau tiêm và chăm sóc trẻ.",
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      color: "bg-teal-500",
    },
    {
      id: "kham-sang-loc-truoc-tiem",
      title: "Khám sàng lọc trước tiêm",
      description: "Đánh giá tình trạng sức khỏe của trẻ trước khi tiêm chủng để đảm bảo an toàn tối đa.",
      icon: <Stethoscope className="h-6 w-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      id: "theo-doi-sau-tiem",
      title: "Theo dõi sau tiêm",
      description: "Ghi nhận thông tin phản ứng sau tiêm và hướng dẫn xử lý các tình huống bất thường.",
      icon: <Clipboard className="h-6 w-6 text-white" />,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 bg-gradient-to-r from-brand-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
              Dịch vụ
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Dịch vụ tiêm chủng toàn diện
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp đa dạng các dịch vụ tiêm chủng với đội ngũ y bác sĩ chuyên môn cao, 
              cơ sở vật chất hiện đại đáp ứng đầy đủ nhu cầu cho trẻ em mọi lứa tuổi.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                id={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                color={service.color}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
