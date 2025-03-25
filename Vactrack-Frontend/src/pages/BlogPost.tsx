
import React from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BlogPostProps {}

const BlogPost = () => {
  const { id } = useParams();

  // Blog post data
  const posts = [
    {
      id: "10-dieu-can-biet-ve-tiem-chung-cho-tre-so-sinh",
      title: "10 điều cần biết về tiêm chủng cho trẻ sơ sinh",
      excerpt: "Hướng dẫn chi tiết cho cha mẹ về tiêm chủng trong những tháng đầu đời của bé, giúp bảo vệ trẻ khỏi các bệnh nguy hiểm.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      color: "bg-blue-100",
      author: "TS. Nguyễn Văn An",
      date: "15/06/2023",
      content: `
        <p>Tiêm chủng cho trẻ sơ sinh là một trong những biện pháp phòng bệnh hiệu quả nhất, giúp bảo vệ trẻ khỏi nhiều bệnh truyền nhiễm nguy hiểm. Dưới đây là 10 điều cha mẹ cần biết về tiêm chủng cho trẻ sơ sinh.</p>
        
        <h2>1. Tầm quan trọng của tiêm chủng sớm</h2>
        <p>Tiêm chủng sớm cho trẻ sơ sinh giúp xây dựng hệ miễn dịch vững mạnh trước khi trẻ tiếp xúc với các mầm bệnh nguy hiểm. Nhiều bệnh truyền nhiễm có thể gây biến chứng nghiêm trọng, thậm chí tử vong ở trẻ nhỏ, nhưng có thể phòng ngừa bằng vắc-xin.</p>
        
        <h2>2. Lịch tiêm chủng cơ bản cho trẻ sơ sinh</h2>
        <p>Lịch tiêm chủng cho trẻ sơ sinh bắt đầu ngay từ khi trẻ mới sinh. Mũi tiêm đầu tiên thường là vắc-xin viêm gan B, được tiêm trong vòng 24 giờ đầu sau sinh. Tiếp theo là các mũi tiêm vào tháng thứ 2, 3, 4 và 5 tùy theo từng loại vắc-xin.</p>
        
        <h2>3. Các loại vắc-xin cần thiết trong năm đầu đời</h2>
        <p>Trong năm đầu đời, trẻ cần được tiêm đầy đủ các vắc-xin phòng các bệnh: Lao (BCG), Viêm gan B, Bại liệt, Bạch hầu - Ho gà - Uốn ván (DPT), Hib (phòng viêm màng não, viêm phổi), Sởi, Rubella, Quai bị và các vắc-xin khác theo khuyến cáo của Bộ Y tế.</p>
        
        <h2>4. Phản ứng sau tiêm chủng ở trẻ sơ sinh</h2>
        <p>Sau tiêm chủng, trẻ có thể gặp một số phản ứng nhẹ như: sốt nhẹ, quấy khóc, đau tại chỗ tiêm, giảm ăn... Đây là những phản ứng bình thường và thường tự hết sau 1-2 ngày. Cha mẹ có thể giúp trẻ bằng cách cho uống nhiều nước, mặc quần áo thoáng mát và có thể dùng thuốc hạ sốt theo hướng dẫn của bác sĩ nếu cần.</p>
        
        <h2>5. Dấu hiệu bất thường cần đưa trẻ đến bác sĩ</h2>
        <p>Mặc dù hiếm gặp, nhưng một số trẻ có thể có phản ứng nặng sau tiêm như: sốt cao trên 39°C, co giật, khó thở, phát ban toàn thân, li bì... Khi gặp các dấu hiệu này, cha mẹ cần đưa trẻ đến cơ sở y tế ngay lập tức.</p>
        
        <h2>6. Cách chuẩn bị cho trẻ trước khi tiêm chủng</h2>
        <p>Trước khi đưa trẻ đi tiêm chủng, cha mẹ nên cho trẻ ăn đủ chất, ngủ đủ giấc, mặc quần áo thoáng mát dễ cởi. Nên mang theo sổ tiêm chủng, khăn lau và nước uống. Không nên cho trẻ ăn quá no hoặc quá đói trước khi tiêm.</p>
        
        <h2>7. Chăm sóc trẻ sau tiêm chủng</h2>
        <p>Sau tiêm, cha mẹ nên theo dõi sát trẻ trong 24-48 giờ đầu. Giữ vùng tiêm sạch sẽ, không day hoặc xoa mạnh. Cho trẻ bú mẹ nhiều hơn, uống nhiều nước và nghỉ ngơi đầy đủ. Tránh tắm ngay sau tiêm và có thể thoa kem dưỡng ẩm nếu da trẻ khô.</p>
        
        <h2>8. Tiêm chủng cho trẻ sinh non hoặc nhẹ cân</h2>
        <p>Trẻ sinh non hoặc nhẹ cân vẫn cần được tiêm chủng đúng lịch theo tuổi thực tế (không tính tuổi hiệu chỉnh), trừ một số trường hợp đặc biệt theo chỉ định của bác sĩ. Các vắc-xin an toàn và hiệu quả cho cả trẻ sinh non, và thậm chí còn quan trọng hơn vì những trẻ này có nguy cơ cao mắc bệnh truyền nhiễm.</p>
        
        <h2>9. Những trường hợp cần hoãn tiêm chủng</h2>
        <p>Một số trường hợp cần hoãn tiêm chủng cho trẻ bao gồm: trẻ đang sốt cao trên 38.5°C, đang mắc bệnh cấp tính, có tiền sử phản ứng nặng với vắc-xin trước đó, hoặc đang dùng một số loại thuốc ức chế miễn dịch. Cha mẹ nên thông báo đầy đủ tình trạng sức khỏe của trẻ cho bác sĩ trước khi tiêm.</p>
        
        <h2>10. Theo dõi và lưu giữ hồ sơ tiêm chủng</h2>
        <p>Việc lưu giữ đầy đủ hồ sơ tiêm chủng rất quan trọng để đảm bảo trẻ được tiêm đủ mũi, đúng lịch. Cha mẹ nên giữ cẩn thận sổ tiêm chủng, hoặc có thể sử dụng các ứng dụng điện tử để theo dõi lịch tiêm của con.</p>
        
        <p>Tiêm chủng đầy đủ và đúng lịch là cách tốt nhất để bảo vệ sức khỏe của trẻ trong những năm đầu đời. Cha mẹ hãy tham khảo ý kiến bác sĩ nhi khoa để được tư vấn chi tiết về lịch tiêm chủng phù hợp với con mình.</p>
      `,
    },
    {
      id: "phong-ngua-phan-ung-sau-tiem-chung",
      title: "Phòng ngừa phản ứng sau tiêm chủng",
      excerpt: "Những biện pháp hiệu quả giúp giảm thiểu và xử lý các phản ứng thông thường sau khi tiêm vắc xin cho trẻ.",
      image: "https://images.unsplash.com/photo-1559000357-f6b52ddfcfba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      color: "bg-green-100",
      author: "ThS. BS. Lê Thị Bình",
      date: "20/07/2023",
      content: `
        <p>Tiêm chủng là biện pháp hiệu quả giúp phòng ngừa nhiều bệnh truyền nhiễm nguy hiểm. Tuy nhiên, sau tiêm chủng, trẻ có thể gặp một số phản ứng phụ. Bài viết này sẽ giúp phụ huynh hiểu rõ và có biện pháp phòng ngừa, xử lý hiệu quả các phản ứng sau tiêm chủng.</p>
        
        <h2>Các phản ứng thường gặp sau tiêm chủng</h2>
        <p>Sau tiêm chủng, trẻ có thể gặp một số phản ứng như:</p>
        <ul>
          <li>Sốt nhẹ (37.5-38.5°C)</li>
          <li>Đau, sưng, đỏ tại chỗ tiêm</li>
          <li>Quấy khóc, bỏ bú</li>
          <li>Buồn nôn, nôn</li>
          <li>Mệt mỏi, ngủ nhiều</li>
        </ul>
        <p>Đây là những phản ứng bình thường, thường xuất hiện trong vòng 24-48 giờ sau tiêm và tự hết sau 2-3 ngày.</p>
        
        <h2>Biện pháp phòng ngừa phản ứng sau tiêm chủng</h2>
        
        <h3>1. Chuẩn bị trước khi tiêm</h3>
        <p>Để giảm thiểu phản ứng sau tiêm, phụ huynh nên:</p>
        <ul>
          <li>Cho trẻ ăn uống đầy đủ trước khi tiêm (không để trẻ đói hoặc quá no)</li>
          <li>Đảm bảo trẻ khỏe mạnh, không có biểu hiện ốm, sốt</li>
          <li>Thông báo cho bác sĩ về tiền sử dị ứng, phản ứng với các mũi tiêm trước (nếu có)</li>
          <li>Mang theo thuốc hạ sốt theo hướng dẫn của bác sĩ</li>
        </ul>
        
        <h3>2. Theo dõi sau tiêm</h3>
        <p>Sau khi tiêm, phụ huynh nên:</p>
        <ul>
          <li>Ở lại cơ sở tiêm chủng ít nhất 30 phút để được theo dõi</li>
          <li>Theo dõi nhiệt độ của trẻ thường xuyên trong 48 giờ đầu</li>
          <li>Để ý các dấu hiệu bất thường như: phát ban, khó thở, li bì...</li>
        </ul>
        
        <h2>Xử lý các phản ứng thường gặp sau tiêm chủng</h2>
        
        <h3>1. Sốt</h3>
        <p>Khi trẻ sốt sau tiêm:</p>
        <ul>
          <li>Cho trẻ mặc quần áo thoáng mát</li>
          <li>Cho trẻ uống nhiều nước</li>
          <li>Có thể dùng thuốc hạ sốt paracetamol theo liều lượng phù hợp với cân nặng và tuổi của trẻ (theo hướng dẫn của bác sĩ)</li>
          <li>Không nên dùng aspirin cho trẻ dưới 16 tuổi</li>
        </ul>
        
        <h3>2. Đau, sưng tại chỗ tiêm</h3>
        <p>Để giảm đau, sưng tại chỗ tiêm:</p>
        <ul>
          <li>Chườm lạnh vùng tiêm (bọc đá trong khăn sạch) mỗi lần 10-15 phút</li>
          <li>Không day, xoa mạnh vùng tiêm</li>
          <li>Giữ vùng tiêm sạch sẽ</li>
          <li>Có thể dùng thuốc giảm đau theo chỉ định của bác sĩ nếu trẻ quá khó chịu</li>
        </ul>
        
        <h3>3. Trẻ quấy khóc, bỏ bú</h3>
        <p>Khi trẻ quấy khóc, bỏ bú:</p>
        <ul>
          <li>Ôm, vỗ về trẻ nhiều hơn</li>
          <li>Cho trẻ bú nhiều lần hơn nhưng mỗi lần ít hơn</li>
          <li>Tạo không gian yên tĩnh, thoải mái cho trẻ nghỉ ngơi</li>
        </ul>
        
        <h2>Khi nào cần đưa trẻ đến bác sĩ?</h2>
        <p>Phụ huynh cần đưa trẻ đến cơ sở y tế ngay khi trẻ có các dấu hiệu:</p>
        <ul>
          <li>Sốt cao trên 39°C và kéo dài dù đã dùng thuốc hạ sốt</li>
          <li>Co giật</li>
          <li>Khó thở, thở nhanh, thở rít</li>
          <li>Phát ban toàn thân</li>
          <li>Li bì, khó đánh thức</li>
          <li>Quấy khóc kéo dài trên 3 giờ</li>
          <li>Nôn trớ nhiều lần</li>
          <li>Sưng đỏ lan rộng quanh vị trí tiêm (trên 5cm)</li>
        </ul>
        
        <h2>Lưu ý đặc biệt</h2>
        <ul>
          <li>Không tự ý dùng thuốc kháng sinh cho trẻ sau tiêm chủng</li>
          <li>Không tắm ngay cho trẻ sau tiêm (nên đợi ít nhất 6 giờ)</li>
          <li>Không xoa dầu nóng hoặc rượu vào vị trí tiêm</li>
          <li>Ghi nhận lại các phản ứng sau tiêm và thông báo cho bác sĩ trong lần tiêm tiếp theo</li>
        </ul>
        
        <p>Hầu hết các phản ứng sau tiêm chủng đều nhẹ và tự khỏi sau vài ngày. Với sự chuẩn bị tốt và xử lý đúng cách, phụ huynh có thể giúp trẻ vượt qua giai đoạn khó chịu này một cách thoải mái và an toàn. Tiêm chủng đầy đủ và đúng lịch vẫn là biện pháp tốt nhất để bảo vệ trẻ khỏi các bệnh truyền nhiễm nguy hiểm.</p>
      `,
    },
    {
      id: "lich-tiem-chung-chuan-theo-do-tuoi",
      title: "Lịch tiêm chủng chuẩn theo độ tuổi",
      excerpt: "Hướng dẫn đầy đủ về các mũi tiêm cần thiết theo từng giai đoạn phát triển của trẻ từ sơ sinh đến 6 tuổi.",
      image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      color: "bg-purple-100",
      author: "PGS. TS. Nguyễn Thành Công",
      date: "05/08/2023",
      content: `
        <p>Tiêm chủng đúng lịch là yếu tố quan trọng để đảm bảo trẻ được bảo vệ tối ưu trước các bệnh truyền nhiễm nguy hiểm. Bài viết này cung cấp hướng dẫn chi tiết về lịch tiêm chủng chuẩn theo từng độ tuổi của trẻ, từ sơ sinh đến 6 tuổi.</p>
        
        <h2>Tầm quan trọng của tiêm chủng đúng lịch</h2>
        <p>Tiêm chủng đúng lịch giúp:</p>
        <ul>
          <li>Đảm bảo trẻ được bảo vệ sớm nhất có thể trước các bệnh truyền nhiễm</li>
          <li>Tạo hiệu quả bảo vệ tối ưu theo từng giai đoạn phát triển của trẻ</li>
          <li>Giảm thiểu nguy cơ mắc bệnh trong giai đoạn trẻ dễ bị tổn thương nhất</li>
          <li>Tạo miễn dịch cộng đồng, bảo vệ cả những người không thể tiêm chủng</li>
        </ul>
        
        <h2>Lịch tiêm chủng cơ bản theo độ tuổi</h2>
        
        <h3>Sơ sinh (0-1 tháng tuổi)</h3>
        <ul>
          <li><strong>Trong 24 giờ đầu sau sinh:</strong> Viêm gan B (liều 1)</li>
          <li><strong>Trong tháng đầu:</strong> BCG (phòng bệnh Lao)</li>
        </ul>
        
        <h3>2 tháng tuổi</h3>
        <ul>
          <li>Bạch hầu - Ho gà - Uốn ván (DPT) - liều 1</li>
          <li>Bại liệt (IPV/OPV) - liều 1</li>
          <li>Hib (phòng viêm màng não, viêm phổi) - liều 1</li>
          <li>Viêm gan B - liều 2</li>
          <li>Rotavirus (phòng tiêu chảy) - liều 1</li>
          <li>Phế cầu khuẩn (PCV) - liều 1</li>
        </ul>
        
        <h3>3 tháng tuổi</h3>
        <ul>
          <li>Bạch hầu - Ho gà - Uốn ván (DPT) - liều 2</li>
          <li>Bại liệt (IPV/OPV) - liều 2</li>
          <li>Hib - liều 2</li>
          <li>Rotavirus - liều 2</li>
        </ul>
        
        <h3>4 tháng tuổi</h3>
        <ul>
          <li>Bạch hầu - Ho gà - Uốn ván (DPT) - liều 3</li>
          <li>Bại liệt (IPV/OPV) - liều 3</li>
          <li>Hib - liều 3</li>
          <li>Phế cầu khuẩn (PCV) - liều 2</li>
          <li>Rotavirus - liều 3 (tùy loại vắc-xin)</li>
        </ul>
        
        <h3>5 tháng tuổi</h3>
        <ul>
          <li>Viêm gan B - liều 3</li>
        </ul>
        
        <h3>9 tháng tuổi</h3>
        <ul>
          <li>Sởi - liều 1</li>
          <li>Phế cầu khuẩn (PCV) - liều 3</li>
        </ul>
        
        <h3>12 tháng tuổi</h3>
        <ul>
          <li>Thủy đậu - liều 1</li>
          <li>Viêm não Nhật Bản - liều 1</li>
          <li>Sởi - Quai bị - Rubella (MMR) - liều 1</li>
        </ul>
        
        <h3>18 tháng tuổi</h3>
        <ul>
          <li>Bạch hầu - Ho gà - Uốn ván (DPT) - liều nhắc 1</li>
          <li>Bại liệt (IPV/OPV) - liều nhắc</li>
          <li>Hib - liều nhắc</li>
          <li>Viêm não Nhật Bản - liều 2</li>
          <li>Sởi - Quai bị - Rubella (MMR) - liều 2</li>
        </ul>
        
        <h3>24 tháng tuổi</h3>
        <ul>
          <li>Viêm não Nhật Bản - liều 3</li>
          <li>Thủy đậu - liều 2 (tùy phác đồ)</li>
          <li>Viêm gan A - liều 1</li>
        </ul>
        
        <h3>30 tháng tuổi</h3>
        <ul>
          <li>Viêm gan A - liều 2</li>
        </ul>
        
        <h3>4 tuổi</h3>
        <ul>
          <li>Bạch hầu - Ho gà - Uốn ván (DPT) - liều nhắc 2</li>
          <li>Bại liệt (IPV/OPV) - liều nhắc 2</li>
        </ul>
        
        <h3>6 tuổi</h3>
        <ul>
          <li>Viêm não Nhật Bản - liều nhắc</li>
        </ul>
        
        <h2>Vắc-xin bổ sung (không bắt buộc)</h2>
        <p>Ngoài các vắc-xin trong chương trình tiêm chủng mở rộng, phụ huynh có thể cân nhắc các vắc-xin bổ sung sau:</p>
        <ul>
          <li><strong>Cúm:</strong> Tiêm hàng năm từ 6 tháng tuổi</li>
          <li><strong>Não mô cầu:</strong> Từ 9 tháng - 2 tuổi tùy loại vắc-xin</li>
          <li><strong>HPV:</strong> Cho trẻ gái từ 9-14 tuổi (2 liều) hoặc từ 15 tuổi trở lên (3 liều)</li>
          <li><strong>Thương hàn:</strong> Từ 2 tuổi trở lên</li>
          <li><strong>Tả:</strong> Từ 2 tuổi trở lên</li>
        </ul>
        
        <h2>Lưu ý quan trọng về lịch tiêm chủng</h2>
        <ul>
          <li>Lịch tiêm có thể thay đổi tùy theo tình hình dịch tễ và khuyến cáo của Bộ Y tế</li>
          <li>Nếu trẻ bỏ lỡ mũi tiêm, cần đưa trẻ đi tiêm bù càng sớm càng tốt</li>
          <li>Không cần bắt đầu lại từ đầu nếu bỏ lỡ mũi tiêm trong một đợt</li>
          <li>Tham khảo ý kiến bác sĩ về lịch tiêm phù hợp nếu trẻ có bệnh nền hoặc tình trạng đặc biệt</li>
          <li>Trẻ sinh non vẫn tiêm theo lịch dựa trên tuổi thực không tính tuổi hiệu chỉnh (trừ một số trường hợp đặc biệt)</li>
        </ul>
        
        <h2>Cách theo dõi lịch tiêm chủng</h2>
        <p>Để đảm bảo trẻ được tiêm chủng đầy đủ và đúng lịch, phụ huynh nên:</p>
        <ul>
          <li>Giữ sổ tiêm chủng cẩn thận và mang theo mỗi khi đi tiêm</li>
          <li>Sử dụng các ứng dụng theo dõi tiêm chủng trên điện thoại</li>
          <li>Đặt lịch nhắc nhở trước ngày tiêm 1-2 ngày</li>
          <li>Chọn một cơ sở tiêm chủng uy tín và thực hiện tiêm chủng nhất quán tại đó</li>
        </ul>
        
        <p>Tiêm chủng đầy đủ và đúng lịch là cách tốt nhất để bảo vệ trẻ khỏi các bệnh truyền nhiễm nguy hiểm. Phụ huynh hãy tham khảo ý kiến bác sĩ nhi khoa để được tư vấn chi tiết về lịch tiêm chủng phù hợp với tình trạng sức khỏe cụ thể của con mình.</p>
      `,
    },
  ];

  // Find the post with the matching ID
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <h1 className="text-3xl font-bold text-center">Bài viết không tồn tại</h1>
          <div className="text-center mt-6">
            <Link to="/guide" className="text-brand-500 hover:text-brand-600">
              Quay lại cẩm nang tiêm chủng
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/guide" className="inline-flex items-center text-gray-600 hover:text-brand-500 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tất cả bài viết
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`h-[300px] md:h-[400px] rounded-xl overflow-hidden ${post.color} mb-8`}>
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{post.date}</span>
              </div>
            </div>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
