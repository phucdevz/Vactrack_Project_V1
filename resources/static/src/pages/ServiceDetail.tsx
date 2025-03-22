
import React from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ServiceDetailProps {}

const ServiceDetail = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  // Mapping from service IDs to their full details
  const servicesDetails = [
    {
      id: "dat-lich-tiem-chung",
      title: "Đặt lịch tiêm chủng",
      description: "Dễ dàng đặt lịch tiêm chủng trực tuyến mọi lúc, mọi nơi, tiết kiệm thời gian và công sức.",
      fullDescription: "Dịch vụ đặt lịch tiêm chủng trực tuyến của VacTrack giúp phụ huynh tiết kiệm thời gian và công sức. Không cần xếp hàng chờ đợi, bạn có thể đặt lịch tiêm chủng cho con mình bất cứ lúc nào, bất cứ nơi đâu chỉ với vài thao tác đơn giản trên điện thoại hoặc máy tính. Hệ thống sẽ gửi thông báo nhắc nhở trước ngày tiêm, giúp bạn không bỏ lỡ lịch hẹn quan trọng.",
      imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2940&auto=format&fit=crop",
      benefits: [
        "Đặt lịch 24/7 mọi lúc, mọi nơi",
        "Không cần xếp hàng chờ đợi tại cơ sở",
        "Nhận thông báo nhắc nhở trước ngày tiêm",
        "Dễ dàng theo dõi và quản lý lịch tiêm chủng",
        "Tiết kiệm thời gian cho gia đình"
      ],
      color: "bg-blue-500",
    },
    {
      id: "goi-tiem-chung-tron-goi",
      title: "Gói tiêm chủng trọn gói",
      description: "Các gói tiêm chủng đầy đủ theo từng độ tuổi, được thiết kế theo chuẩn của Bộ Y tế và WHO.",
      fullDescription: "Gói tiêm chủng trọn gói của VacTrack được thiết kế đầy đủ theo từng độ tuổi, tuân thủ nghiêm ngặt các tiêu chuẩn của Bộ Y tế và Tổ chức Y tế Thế giới (WHO). Gói trọn gói bao gồm tất cả các loại vắc-xin cần thiết cho trẻ trong các giai đoạn phát triển khác nhau, từ sơ sinh đến 6 tuổi, đảm bảo trẻ được bảo vệ toàn diện trước các bệnh truyền nhiễm nguy hiểm.",
      imageUrl: "https://images.unsplash.com/photo-1587854680352-936b22b91030?q=80&w=2938&auto=format&fit=crop",
      benefits: [
        "Đầy đủ các loại vắc-xin theo từng độ tuổi",
        "Tuân thủ tiêu chuẩn của Bộ Y tế và WHO",
        "Tiết kiệm chi phí so với tiêm lẻ",
        "Lịch tiêm được sắp xếp khoa học",
        "Hỗ trợ tư vấn trước và sau tiêm"
      ],
      color: "bg-green-500",
    },
    {
      id: "tiem-chung-ca-the-hoa",
      title: "Tiêm chủng cá thể hóa",
      description: "Các gói tiêm chủng được thiết kế riêng phù hợp với tình trạng sức khỏe và nhu cầu của từng bé.",
      fullDescription: "Dịch vụ tiêm chủng cá thể hóa của VacTrack cung cấp các gói tiêm chủng được thiết kế riêng, tùy chỉnh theo tình trạng sức khỏe và nhu cầu cụ thể của từng bé. Bác sĩ chuyên khoa sẽ đánh giá toàn diện tình trạng sức khỏe, tiền sử bệnh, dị ứng và các yếu tố khác của trẻ để xây dựng lịch tiêm chủng phù hợp nhất, đảm bảo hiệu quả và an toàn tối đa.",
      imageUrl: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?q=80&w=2940&auto=format&fit=crop",
      benefits: [
        "Đánh giá toàn diện tình trạng sức khỏe của trẻ",
        "Tùy chỉnh lịch tiêm phù hợp với từng bé",
        "Tư vấn chi tiết về lợi ích và nguy cơ",
        "Theo dõi phản ứng sau tiêm sát sao",
        "Điều chỉnh linh hoạt theo phản ứng của trẻ"
      ],
      color: "bg-purple-500",
    },
    {
      id: "ho-so-tiem-chung-dien-tu",
      title: "Hồ sơ tiêm chủng điện tử",
      description: "Lưu trữ đầy đủ thông tin về lịch sử tiêm chủng của trẻ, dễ dàng tra cứu mọi lúc, mọi nơi.",
      fullDescription: "Hồ sơ tiêm chủng điện tử của VacTrack giúp lưu trữ đầy đủ và chi tiết toàn bộ thông tin về lịch sử tiêm chủng của trẻ. Phụ huynh có thể dễ dàng tra cứu thông tin về các mũi tiêm đã thực hiện, thời gian tiêm, loại vắc-xin, lô sản xuất, và phản ứng sau tiêm (nếu có) mọi lúc, mọi nơi thông qua ứng dụng hoặc website. Hồ sơ điện tử này cũng có thể chia sẻ với bác sĩ hoặc cơ sở y tế khác khi cần thiết.",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2940&auto=format&fit=crop",
      benefits: [
        "Lưu trữ đầy đủ thông tin tiêm chủng",
        "Truy cập dễ dàng mọi lúc, mọi nơi",
        "Chia sẻ thông tin với cơ sở y tế khi cần",
        "Xuất báo cáo tiêm chủng theo yêu cầu",
        "Bảo mật thông tin cá nhân tuyệt đối"
      ],
      color: "bg-orange-500",
    },
    {
      id: "nhac-lich-tiem-tu-dong",
      title: "Nhắc lịch tiêm tự động",
      description: "Hệ thống thông báo tự động giúp phụ huynh không bỏ lỡ bất kỳ mũi tiêm nào cho con.",
      fullDescription: "Dịch vụ nhắc lịch tiêm tự động của VacTrack là một trợ thủ đắc lực giúp phụ huynh không bỏ lỡ bất kỳ mũi tiêm quan trọng nào cho con. Hệ thống sẽ gửi thông báo nhắc nhở trước ngày tiêm qua SMS, email hoặc thông báo trên ứng dụng theo tùy chọn của bạn. Ngoài ra, hệ thống còn cung cấp thông tin hữu ích về loại vắc-xin sắp tiêm, cách chuẩn bị cho trẻ trước khi tiêm, và những lưu ý quan trọng sau tiêm.",
      imageUrl: "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?q=80&w=2940&auto=format&fit=crop",
      benefits: [
        "Nhắc nhở tự động trước ngày tiêm",
        "Nhiều hình thức nhắc nhở: SMS, email, thông báo",
        "Cung cấp thông tin về vắc-xin sắp tiêm",
        "Hướng dẫn chuẩn bị trước khi tiêm",
        "Tần suất nhắc tùy chỉnh theo nhu cầu"
      ],
      color: "bg-red-500",
    },
    {
      id: "tu-van-tiem-chung",
      title: "Tư vấn tiêm chủng",
      description: "Đội ngũ y bác sĩ giàu kinh nghiệm tư vấn chi tiết về lịch tiêm, phản ứng sau tiêm và chăm sóc trẻ.",
      fullDescription: "Dịch vụ tư vấn tiêm chủng của VacTrack cung cấp cho phụ huynh sự hỗ trợ toàn diện từ đội ngũ y bác sĩ giàu kinh nghiệm. Chúng tôi tư vấn chi tiết về lịch tiêm chủng phù hợp, giải đáp mọi thắc mắc về các loại vắc-xin, phản ứng có thể xảy ra sau tiêm và cách xử lý, cũng như hướng dẫn chăm sóc trẻ đúng cách trước và sau khi tiêm chủng. Dịch vụ tư vấn có thể thực hiện trực tiếp tại cơ sở hoặc online theo nhu cầu của phụ huynh.",
      imageUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=2938&auto=format&fit=crop",
      benefits: [
        "Tư vấn bởi đội ngũ y bác sĩ chuyên khoa",
        "Giải đáp chi tiết mọi thắc mắc về vắc-xin",
        "Hướng dẫn xử lý phản ứng sau tiêm",
        "Tư vấn trực tiếp hoặc online linh hoạt",
        "Hỗ trợ 24/7 cho các trường hợp khẩn cấp"
      ],
      color: "bg-teal-500",
    },
    {
      id: "kham-sang-loc-truoc-tiem",
      title: "Khám sàng lọc trước tiêm",
      description: "Đánh giá tình trạng sức khỏe của trẻ trước khi tiêm chủng để đảm bảo an toàn tối đa.",
      fullDescription: "Dịch vụ khám sàng lọc trước tiêm của VacTrack là bước quan trọng không thể thiếu để đảm bảo an toàn tối đa cho trẻ khi tiêm chủng. Bác sĩ chuyên khoa sẽ đánh giá toàn diện tình trạng sức khỏe của trẻ, kiểm tra các chỉ số sinh tồn, phát hiện các yếu tố nguy cơ và chống chỉ định trước khi quyết định tiêm chủng. Nếu trẻ không đủ điều kiện tiêm, bác sĩ sẽ tư vấn hoãn tiêm và có kế hoạch chăm sóc phù hợp.",
      imageUrl: "https://images.unsplash.com/photo-1631815588090-d4bfb9a27854?q=80&w=2832&auto=format&fit=crop",
      benefits: [
        "Đánh giá toàn diện sức khỏe trước tiêm",
        "Phát hiện sớm các yếu tố nguy cơ",
        "Tư vấn hoãn tiêm khi cần thiết",
        "Giảm thiểu tối đa phản ứng phụ",
        "Đảm bảo hiệu quả tối ưu của vắc-xin"
      ],
      color: "bg-indigo-500",
    },
    {
      id: "theo-doi-sau-tiem",
      title: "Theo dõi sau tiêm",
      description: "Ghi nhận thông tin phản ứng sau tiêm và hướng dẫn xử lý các tình huống bất thường.",
      fullDescription: "Dịch vụ theo dõi sau tiêm của VacTrack giúp phụ huynh an tâm hơn khi cho trẻ tiêm chủng. Sau khi tiêm, trẻ sẽ được theo dõi tại cơ sở ít nhất 30 phút để kịp thời phát hiện và xử lý các phản ứng bất thường. Sau đó, hệ thống sẽ gửi tin nhắn hoặc gọi điện định kỳ để kiểm tra tình trạng của trẻ trong 24-48 giờ đầu tiên. Phụ huynh có thể ghi nhận các phản ứng sau tiêm (nếu có) vào hồ sơ điện tử, và nhận được hướng dẫn cụ thể cách xử lý từ đội ngũ y bác sĩ.",
      imageUrl: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2940&auto=format&fit=crop",
      benefits: [
        "Theo dõi tại cơ sở ít nhất 30 phút sau tiêm",
        "Kiểm tra định kỳ trong 24-48 giờ đầu",
        "Ghi nhận chi tiết các phản ứng sau tiêm",
        "Hướng dẫn cụ thể cách xử lý phản ứng",
        "Hỗ trợ y tế khẩn cấp khi cần thiết"
      ],
      color: "bg-amber-500",
    },
  ];

  // Find the service with the matching ID
  const service = servicesDetails.find(s => s.id === id);

  if (!service) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <h1 className="text-3xl font-bold text-center">Dịch vụ không tồn tại</h1>
          <div className="text-center mt-6">
            <Link to="/services" className="text-brand-500 hover:text-brand-600">
              Quay lại trang dịch vụ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBooking = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/booking" } } });
    } else {
      navigate("/booking");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/services" className="inline-flex items-center text-gray-600 hover:text-brand-500 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tất cả dịch vụ
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className={`${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6`}>
                  <div className="text-white text-2xl font-bold">{service.title.charAt(0)}</div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {service.title}
                </h1>
                <div className="prose prose-lg max-w-none text-gray-600 mb-8">
                  <p>{service.fullDescription}</p>
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Lợi ích dịch vụ:</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <Button 
                    size="lg" 
                    className="bg-brand-500 hover:bg-brand-600"
                    onClick={handleBooking}
                  >
                    Đặt lịch ngay
                  </Button>
                </div>
              </div>
              
              <div className="relative rounded-xl overflow-hidden h-[400px] lg:h-[500px]">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;
