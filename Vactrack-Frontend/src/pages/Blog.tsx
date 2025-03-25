
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  const posts = [
    {
      id: "10-dieu-can-biet-ve-tiem-chung-cho-tre-so-sinh",
      title: "10 điều cần biết về tiêm chủng cho trẻ sơ sinh",
      excerpt: "Hướng dẫn chi tiết cho cha mẹ về tiêm chủng trong những tháng đầu đời của bé, giúp bảo vệ trẻ khỏi các bệnh nguy hiểm.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-blue-100",
      author: "TS. Nguyễn Văn An",
      date: "15/06/2023",
      category: "Sơ sinh",
    },
    {
      id: "phong-ngua-phan-ung-sau-tiem-chung",
      title: "Phòng ngừa phản ứng sau tiêm chủng",
      excerpt: "Những biện pháp hiệu quả giúp giảm thiểu và xử lý các phản ứng thông thường sau khi tiêm vắc xin cho trẻ.",
      image: "https://images.unsplash.com/photo-1559000357-f6b52ddfcfba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-green-100",
      author: "ThS. BS. Lê Thị Bình",
      date: "20/07/2023",
      category: "Chăm sóc",
    },
    {
      id: "lich-tiem-chung-chuan-theo-do-tuoi",
      title: "Lịch tiêm chủng chuẩn theo độ tuổi",
      excerpt: "Hướng dẫn đầy đủ về các mũi tiêm cần thiết theo từng giai đoạn phát triển của trẻ từ sơ sinh đến 6 tuổi.",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-purple-100",
      author: "PGS. TS. Nguyễn Thành Công",
      date: "05/08/2023",
      category: "Hướng dẫn",
    },
    {
      id: "nhung-lua-chon-vac-xin-cho-tre-tu-1-den-2-tuoi",
      title: "Những lựa chọn vắc xin cho trẻ từ 1 đến 2 tuổi",
      excerpt: "Khám phá các loại vắc xin quan trọng và lợi ích của việc tiêm chủng cho trẻ trong giai đoạn 1-2 tuổi.",
      image: "https://images.unsplash.com/photo-1632053001332-2963a1af1a4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-orange-100",
      author: "BS. Trần Minh Hiếu",
      date: "12/09/2023",
      category: "Hướng dẫn",
    },
    {
      id: "cham-soc-tre-bi-sot-sau-tiem-chung",
      title: "Chăm sóc trẻ bị sốt sau tiêm chủng",
      excerpt: "Hướng dẫn chi tiết giúp phụ huynh xử lý hiệu quả tình trạng sốt ở trẻ sau khi tiêm vắc xin.",
      image: "https://images.unsplash.com/photo-1612531654953-d52a9fe5e896?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-red-100",
      author: "BS. CKI. Lê Văn Minh",
      date: "18/10/2023",
      category: "Chăm sóc",
    },
    {
      id: "vac-xin-phong-cum-co-nen-tiem-cho-tre-hang-nam",
      title: "Vắc xin phòng cúm: Có nên tiêm cho trẻ hàng năm?",
      excerpt: "Phân tích lợi ích và những điều cần cân nhắc khi tiêm vắc xin cúm hàng năm cho trẻ em.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      color: "bg-yellow-100",
      author: "TS. BS. Ngô Thị Hương",
      date: "05/11/2023",
      category: "Hướng dẫn",
    },
  ];

  const categories = [
    "Tất cả", "Sơ sinh", "Hướng dẫn", "Chăm sóc", "Dinh dưỡng", "Phát triển"
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
              Blog
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tất cả bài viết
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kiến thức hữu ích về tiêm chủng và chăm sóc sức khỏe cho trẻ em từ các chuyên gia y tế
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Tìm kiếm bài viết..." 
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button 
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className={index === 0 ? "bg-brand-500 hover:bg-brand-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full flex flex-col"
              >
                <div className={`h-48 overflow-hidden ${post.color}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-brand-500 bg-brand-50 py-1 px-2 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center text-brand-600 font-medium text-sm hover:text-brand-500"
                    >
                      Đọc thêm <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg">
              Xem thêm bài viết
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
