
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Flag, Shield, ThumbsUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Guide = () => {
  const faqs = [
    {
      question: "Khi nào trẻ nên bắt đầu tiêm chủng?",
      answer: "Trẻ nên bắt đầu tiêm chủng ngay từ khi mới sinh. Lịch tiêm chủng đầu tiên sẽ bắt đầu khi trẻ được sinh ra và tiếp tục theo các mốc thời gian được khuyến cáo bởi Bộ Y tế và Tổ chức Y tế Thế giới (WHO)."
    },
    {
      question: "Một số phản ứng phụ thông thường sau tiêm chủng?",
      answer: "Các phản ứng phụ thông thường sau tiêm chủng có thể bao gồm: sốt nhẹ, đau tại vị trí tiêm, mệt mỏi, biếng ăn. Những phản ứng này thường nhẹ và tự hết sau 1-2 ngày. Nếu trẻ có biểu hiện bất thường, phụ huynh nên liên hệ ngay với bác sĩ hoặc cơ sở y tế."
    },
    {
      question: "Tại sao cần tiêm nhắc lại một số loại vắc xin?",
      answer: "Một số vắc xin cần tiêm nhắc lại để duy trì hiệu quả bảo vệ lâu dài. Mỗi lần tiêm nhắc sẽ giúp hệ miễn dịch của trẻ ghi nhớ và tăng cường khả năng đối phó với bệnh. Việc tiêm nhắc đúng lịch rất quan trọng để đảm bảo sự bảo vệ liên tục cho trẻ."
    },
    {
      question: "Nếu trẻ bị ốm có nên hoãn tiêm chủng không?",
      answer: "Nếu trẻ bị ốm nhẹ như cảm, ho nhẹ, sổ mũi mà không sốt cao, vẫn có thể tiêm chủng bình thường. Tuy nhiên, nếu trẻ sốt cao trên 38.5°C hoặc có biểu hiện bệnh nặng, nên hoãn tiêm và tham khảo ý kiến bác sĩ. Quan trọng nhất là đánh giá tình trạng sức khỏe của trẻ trước khi tiêm."
    },
    {
      question: "Làm thế nào để chuẩn bị cho trẻ trước khi tiêm chủng?",
      answer: "Để chuẩn bị cho trẻ trước khi tiêm chủng, phụ huynh nên: cho trẻ ăn uống đầy đủ trước khi đi tiêm, mặc quần áo thoải mái dễ cởi, mang theo sổ tiêm chủng hoặc giấy tờ y tế của trẻ, và chuẩn bị tinh thần để trấn an trẻ trong quá trình tiêm."
    },
    {
      question: "Tôi có thể tiêm nhiều loại vắc xin cho trẻ trong cùng một lần không?",
      answer: "Có, nhiều loại vắc xin có thể được tiêm cùng một lúc và điều này hoàn toàn an toàn. Hệ thống miễn dịch của trẻ có khả năng đáp ứng với nhiều kháng nguyên cùng lúc. Việc tiêm nhiều vắc xin cùng lúc giúp giảm số lần đến cơ sở y tế, tiết kiệm thời gian và đảm bảo trẻ được bảo vệ sớm nhất có thể."
    },
  ];

  const posts = [
    {
      title: "10 điều cần biết về tiêm chủng cho trẻ sơ sinh",
      excerpt: "Hướng dẫn chi tiết cho cha mẹ về tiêm chủng trong những tháng đầu đời của bé, giúp bảo vệ trẻ khỏi các bệnh nguy hiểm.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-blue-100",
    },
    {
      title: "Phòng ngừa phản ứng sau tiêm chủng",
      excerpt: "Những biện pháp hiệu quả giúp giảm thiểu và xử lý các phản ứng thông thường sau khi tiêm vắc xin cho trẻ.",
      image: "https://images.unsplash.com/photo-1559000357-f6b52ddfcfba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-green-100",
    },
    {
      title: "Lịch tiêm chủng chuẩn theo độ tuổi",
      excerpt: "Hướng dẫn đầy đủ về các mũi tiêm cần thiết theo từng giai đoạn phát triển của trẻ từ sơ sinh đến 6 tuổi.",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 bg-gradient-to-r from-brand-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
              Cẩm nang
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Cẩm nang tiêm chủng
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tất cả những thông tin cần thiết để giúp phụ huynh hiểu rõ về tiêm chủng
              và bảo vệ sức khỏe của con một cách toàn diện.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Guide Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quy trình tiêm chủng tại VacTrack
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Quy trình tiêm chủng an toàn, hiệu quả với 5 bước đơn giản
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-brand-600" />,
                title: "Đăng ký",
                description: "Tạo tài khoản và cập nhật thông tin cá nhân của bạn và con bạn",
              },
              {
                icon: <Clock className="h-8 w-8 text-brand-600" />,
                title: "Đặt lịch",
                description: "Chọn ngày giờ và loại vắc xin phù hợp với nhu cầu của con bạn",
              },
              {
                icon: <Shield className="h-8 w-8 text-brand-600" />,
                title: "Khám sàng lọc",
                description: "Bác sĩ sẽ khám sàng lọc để đảm bảo trẻ đủ điều kiện tiêm chủng",
              },
              {
                icon: <Flag className="h-8 w-8 text-brand-600" />,
                title: "Tiêm chủng",
                description: "Quy trình tiêm chủng an toàn được thực hiện bởi đội ngũ y tế chuyên nghiệp",
              },
              {
                icon: <ThumbsUp className="h-8 w-8 text-brand-600" />,
                title: "Theo dõi",
                description: "Theo dõi và cập nhật thông tin sau tiêm chủng vào hồ sơ của trẻ",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bài viết hữu ích
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Những kiến thức cần thiết về tiêm chủng giúp phụ huynh chăm sóc con tốt hơn
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className={`h-48 overflow-hidden ${post.color}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link
                    to="/blog"
                    className="inline-flex items-center text-brand-600 font-medium hover:text-brand-500"
                  >
                    Đọc thêm <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Xem tất cả bài viết
            </Button>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600">
              Giải đáp những thắc mắc phổ biến của phụ huynh về tiêm chủng
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Không tìm thấy câu trả lời cho câu hỏi của bạn?</p>
            <Button>Liên hệ với chúng tôi</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Guide;
