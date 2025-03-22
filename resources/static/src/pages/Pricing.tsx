
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const { isLoggedIn } = useAuth();

  const packages = [
    {
      name: "Cơ bản",
      description: "Các mũi tiêm thiết yếu theo lịch tiêm chủng mở rộng của Bộ Y Tế",
      price: "1.500.000",
      features: [
        "Các vắc xin trong TCMR",
        "Hồ sơ tiêm chủng điện tử",
        "Nhắc lịch tiêm tự động",
        "Tư vấn qua điện thoại",
        "Khám sàng lọc trước tiêm",
      ],
      popular: false,
      color: "bg-blue-500",
    },
    {
      name: "Tiêu chuẩn",
      description: "Gói tiêm chủng đầy đủ cho trẻ từ 0-6 tuổi",
      price: "9.800.000",
      features: [
        "Tất cả vắc xin trong gói Cơ bản",
        "Vắc xin 5 trong 1",
        "Vắc xin Rota",
        "Vắc xin phòng viêm phổi",
        "Vắc xin phòng viêm não Nhật Bản",
        "Tư vấn 24/7",
        "Theo dõi sức khỏe sau tiêm",
      ],
      popular: true,
      color: "bg-brand-500",
    },
    {
      name: "Cao cấp",
      description: "Gói tiêm chủng toàn diện nhất với đầy đủ vắc xin hiện có",
      price: "15.500.000",
      features: [
        "Tất cả vắc xin trong gói Tiêu chuẩn",
        "Vắc xin phòng cúm mùa",
        "Vắc xin phòng viêm não mô cầu",
        "Vắc xin phòng thủy đậu",
        "Vắc xin phòng viêm gan siêu vi A",
        "Bác sĩ riêng theo dõi",
        "Ưu tiên đặt lịch",
        "Dịch vụ tiêm tại nhà",
      ],
      popular: false,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 bg-gradient-to-r from-brand-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4">
              Bảng giá
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Gói tiêm chủng phù hợp với nhu cầu của bạn
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp đa dạng các gói tiêm chủng với mức giá hợp lý, 
              đảm bảo mọi gia đình đều có thể tiếp cận dịch vụ tiêm chủng chất lượng.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-xl shadow-lg overflow-hidden ${
                  pkg.popular ? "border-2 border-brand-500 ring-2 ring-brand-200 ring-opacity-50" : "border border-gray-200"
                }`}
              >
                {pkg.popular && (
                  <div className="bg-brand-500 text-white text-center py-2 font-medium">
                    Phổ biến nhất
                  </div>
                )}
                <div className="p-6">
                  <h3 className={`text-xl font-bold ${pkg.popular ? "text-brand-600" : "text-gray-900"}`}>
                    {pkg.name}
                  </h3>
                  <p className="mt-2 text-gray-600 min-h-[50px]">{pkg.description}</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">{pkg.price}đ</span>
                    <span className="ml-1 text-gray-600">/gói</span>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full ${pkg.color} flex items-center justify-center mr-2`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      to={isLoggedIn ? "/booking" : "/login"}
                      state={isLoggedIn ? {} : { from: { pathname: "/booking" } }}
                    >
                      <Button
                        className={`w-full ${
                          pkg.popular
                            ? "bg-brand-500 hover:bg-brand-600"
                            : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        {isLoggedIn ? "Đặt lịch ngay" : "Đăng nhập để đặt lịch"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Cần tùy chỉnh gói tiêm chủng?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Chúng tôi hiểu mỗi trẻ có nhu cầu khác nhau. Hãy liên hệ với chúng tôi để 
              được tư vấn gói tiêm chủng phù hợp nhất với con bạn.
            </p>
            <Button variant="outline" size="lg">
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
