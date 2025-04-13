
import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FeedbackForm } from "@/components/FeedbackForm";

const Feedback = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-brand-600 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Phản hồi của bạn
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/90 max-w-2xl mx-auto"
            >
              Chúng tôi luôn cố gắng cải thiện dịch vụ để phục vụ bạn tốt hơn.
              Hãy chia sẻ ý kiến của bạn với chúng tôi!
            </motion.p>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 md:p-8 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Gửi phản hồi của bạn
              </h2>
              <FeedbackForm />
            </motion.div>
          </div>
        </section>

        {/* Why Feedback Matters Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Tại sao phản hồi của bạn quan trọng
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Ý kiến của bạn giúp chúng tôi không ngừng nâng cao chất lượng dịch vụ tiêm chủng
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Cải thiện dịch vụ</h3>
                <p className="text-gray-600">
                  Chúng tôi sử dụng phản hồi để cải thiện quy trình tiêm chủng và nâng cao
                  trải nghiệm cho mọi khách hàng.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Lắng nghe người dùng</h3>
                <p className="text-gray-600">
                  Mỗi phản hồi đều được đội ngũ của chúng tôi xem xét cẩn thận để hiểu rõ
                  nhu cầu của khách hàng.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Phát triển sản phẩm</h3>
                <p className="text-gray-600">
                  Những đề xuất của bạn giúp chúng tôi phát triển thêm các tính năng và
                  dịch vụ mới mà bạn thực sự cần.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
