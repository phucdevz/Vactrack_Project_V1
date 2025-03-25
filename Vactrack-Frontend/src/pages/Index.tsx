
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import InfoSection from "@/components/InfoSection";
import TestimonialCard from "@/components/TestimonialCard";
import { 
  CalendarClock, 
  Users, 
  Package, 
  UserRound, 
  CalendarCheck, 
  ShieldCheck, 
  Bell, 
  Award 
} from "lucide-react";

const Index = () => {
  // Mock statistics data
  const statistics = [
    { label: "Trẻ em được tiêm chủng", value: "50,000+" },
    { label: "Loại vắc xin", value: "20+" },
    { label: "Cơ sở trên toàn quốc", value: "15+" },
    { label: "Năm kinh nghiệm", value: "10+" },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4"
            >
              Về chúng tôi
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Hệ thống tiêm chủng hàng đầu Việt Nam
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-3xl mx-auto"
            >
              VacTrack là hệ thống tiêm chủng hiện đại với đội ngũ y bác sĩ giàu kinh
              nghiệm. Chúng tôi cung cấp dịch vụ tiêm chủng toàn diện, an toàn và
              hiệu quả cho trẻ em trên toàn quốc.
            </motion.p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <p className="text-3xl md:text-4xl font-bold text-brand-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4"
            >
              Dịch vụ của chúng tôi
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Giải pháp tiêm chủng toàn diện
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-3xl mx-auto"
            >
              Chúng tôi cung cấp đa dạng các gói tiêm chủng đáp ứng nhu cầu của
              từng gia đình, kèm theo hệ thống quản lý hiện đại giúp theo dõi lịch
              tiêm chủng một cách dễ dàng.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              id="dat-lich-tiem-chung"
              title="Đặt lịch tiêm chủng"
              description="Dễ dàng đặt lịch tiêm chủng trực tuyến mọi lúc, mọi nơi, tiết kiệm thời gian và công sức."
              icon={<CalendarClock className="h-6 w-6 text-white" />}
              color="bg-blue-500"
              delay={0.1}
            />
            <ServiceCard
              id="goi-tiem-chung-tron-goi"
              title="Gói tiêm chủng trọn gói"
              description="Các gói tiêm chủng đầy đủ theo từng độ tuổi, được thiết kế theo chuẩn của Bộ Y tế và WHO."
              icon={<Package className="h-6 w-6 text-white" />}
              color="bg-green-500"
              delay={0.2}
            />
            <ServiceCard
              id="tiem-chung-ca-the-hoa"
              title="Tiêm chủng cá thể hóa"
              description="Các gói tiêm chủng được thiết kế riêng phù hợp với tình trạng sức khỏe và nhu cầu của từng bé."
              icon={<UserRound className="h-6 w-6 text-white" />}
              color="bg-purple-500"
              delay={0.3}
            />
            <ServiceCard
              id="ho-so-tiem-chung-dien-tu"
              title="Hồ sơ tiêm chủng điện tử"
              description="Lưu trữ đầy đủ thông tin về lịch sử tiêm chủng của trẻ, dễ dàng tra cứu mọi lúc, mọi nơi."
              icon={<Users className="h-6 w-6 text-white" />}
              color="bg-orange-500"
              delay={0.4}
            />
            <ServiceCard
              id="nhac-lich-tiem-tu-dong"
              title="Nhắc lịch tiêm tự động"
              description="Hệ thống thông báo tự động giúp phụ huynh không bỏ lỡ bất kỳ mũi tiêm nào cho con."
              icon={<Bell className="h-6 w-6 text-white" />}
              color="bg-red-500"
              delay={0.5}
            />
            <ServiceCard
              id="tu-van-tiem-chung"
              title="Tư vấn tiêm chủng"
              description="Đội ngũ y bác sĩ giàu kinh nghiệm tư vấn chi tiết về lịch tiêm, phản ứng sau tiêm và chăm sóc trẻ."
              icon={<ShieldCheck className="h-6 w-6 text-white" />}
              color="bg-teal-500"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Features Sections */}
      <InfoSection
        title="Quản lý tiêm chủng thông minh"
        subtitle="Tính năng nổi bật"
        description="Với VacTrack, việc quản lý thông tin tiêm chủng của trẻ trở nên vô cùng đơn giản. Hệ thống giúp phụ huynh theo dõi đầy đủ lịch sử tiêm chủng và nhận thông báo về các mũi tiêm sắp tới."
        imageSrc="https://images.unsplash.com/photo-1576671414121-aa2d80c2d091?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80"
        imageAlt="Quản lý tiêm chủng"
        features={[
          "Tra cứu lịch sử tiêm chủng mọi lúc, mọi nơi",
          "Nhận thông báo nhắc lịch qua SMS, email",
          "Xem khuyến nghị về các mũi tiêm theo độ tuổi",
          "Ghi nhận phản ứng sau tiêm cho từng mũi tiêm",
        ]}
        ctaText="Tìm hiểu thêm"
        imagePosition="right"
      />

      <InfoSection
        title="Đặt lịch tiêm chủng dễ dàng"
        subtitle="Tiện lợi & Nhanh chóng"
        description="Phụ huynh có thể đặt lịch tiêm chủng trực tuyến cho con chỉ trong vài phút. Chọn thời gian phù hợp, loại vắc xin và nhận xác nhận tức thì. Không cần xếp hàng chờ đợi, tiết kiệm thời gian tối đa."
        imageSrc="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
        imageAlt="Đặt lịch tiêm chủng"
        features={[
          "Đặt lịch trực tuyến 24/7",
          "Chọn dịch vụ và gói tiêm phù hợp",
          "Nhận xác nhận lịch tức thì",
          "Dễ dàng thay đổi hoặc hủy lịch",
        ]}
        ctaText="Đặt lịch ngay"
        imagePosition="left"
      />

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4"
            >
              Đánh giá từ khách hàng
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Phụ huynh nói gì về chúng tôi
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-3xl mx-auto"
            >
              Hàng ngàn phụ huynh đã tin tưởng chúng tôi để chăm sóc sức khỏe
              cho con em họ. Hãy xem họ nói gì về dịch vụ của chúng tôi.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Nguyễn Thị Mai"
              role="Mẹ bé Na"
              content="VacTrack giúp tôi dễ dàng theo dõi lịch tiêm chủng của con. Đặc biệt ấn tượng với tính năng nhắc lịch tự động và hồ sơ điện tử, giúp tôi không bỏ sót mũi tiêm nào cho bé."
              rating={5}
              delay={0.1}
            />
            <TestimonialCard
              name="Trần Văn Hoàng"
              role="Bố bé Minh"
              content="Đội ngũ y bác sĩ rất chuyên nghiệp và tận tâm. Tôi đánh giá cao việc hệ thống lưu trữ đầy đủ thông tin tiêm chủng và gửi nhắc nhở đều đặn. Giao diện ứng dụng cũng rất dễ sử dụng."
              rating={5}
              delay={0.2}
            />
            <TestimonialCard
              name="Lê Thị Hương"
              role="Mẹ hai bé"
              content="Với hai con nhỏ, việc theo dõi lịch tiêm chủng thực sự là thách thức lớn. VacTrack đã giúp tôi quản lý thông tin tiêm chủng của cả hai bé một cách hiệu quả và không bỏ sót mũi tiêm nào."
              rating={4}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background with overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559000357-f6b52ddfcfba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-700/90 to-brand-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
              Bắt đầu ngay hôm nay
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Bảo vệ sức khỏe cho con bạn với lịch tiêm chủng khoa học
            </h2>
            <p className="text-white/90 mb-8">
              Đăng ký tài khoản để bắt đầu quản lý tiêm chủng cho con bạn. Chỉ mất
              vài phút để thiết lập và sử dụng ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-white/90 px-6">
                Đăng ký miễn phí
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-6"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
