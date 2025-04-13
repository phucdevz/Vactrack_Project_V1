import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const contactData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || `Yêu cầu liên hệ từ ${formData.name}`,
        message: `Điện thoại: ${formData.phone}\n\n${formData.message}`,
        type: "contact",
      };

      const response = await axios.post('/api/contact', contactData);
      
      if (response.data.success) {
        toast({
          title: "Gửi thành công!",
          description: "Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Lỗi khi gửi form liên hệ");
      }
    } catch (error) {
      console.error("Lỗi khi gửi form liên hệ:", error);
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể gửi yêu cầu liên hệ. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-brand-500" />,
      title: "Điện thoại",
      details: ["(+84) 28 1234 5678", "(+84) 28 8765 4321"],
    },
    {
      icon: <Mail className="h-5 w-5 text-brand-500" />,
      title: "Email",
      details: ["info@vactrack.vn", "support@vactrack.vn"],
    },
    {
      icon: <MapPin className="h-5 w-5 text-brand-500" />,
      title: "Địa chỉ",
      details: ["123 Đường Nguyễn Văn Linh", "Quận 7, TP. Hồ Chí Minh"],
    },
    {
      icon: <Clock className="h-5 w-5 text-brand-500" />,
      title: "Giờ làm việc",
      details: ["Thứ 2 - Thứ 7: 8:00 - 20:00", "Chủ nhật: 8:00 - 12:00"],
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
              Liên hệ
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Đội ngũ tư vấn của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn
              trong việc chăm sóc sức khỏe cho con.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0912 345 678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Tiêu đề</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Tư vấn tiêm chủng"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Tin nhắn</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung tin nhắn của bạn tại đây..."
                    rows={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        {item.details.map((detail, i) => (
                          <p key={i} className="text-gray-600">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0098087391408!2d106.70433271471924!3d10.72871096293617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f900d6a38a7%3A0x4768a7de1a671051!2zMTIzIMSQLiBOZ3V54buFbiBWxINuIExpbmgsIFTDom4gUGjDuiwgUXXhuq1uIDcsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1631234567890!5m2!1svi!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="VacTrack Location"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
