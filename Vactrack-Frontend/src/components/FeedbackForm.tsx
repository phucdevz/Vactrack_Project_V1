
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/StarRating";

const feedbackFormSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  subject: z.string().min(5, { message: "Tiêu đề phải có ít nhất 5 ký tự" }),
  message: z.string().min(10, { message: "Nội dung phải có ít nhất 10 ký tự" }),
  rating: z.number().min(1, { message: "Vui lòng đánh giá dịch vụ của chúng tôi" }).max(5),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export function FeedbackForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Thêm trường published vào dữ liệu gửi đi
      const feedbackData = {
        ...data,
        published: false
      };
      
      console.log("Sending feedback to API:", feedbackData);
      
      // Set the API URL explicitly with the full URL
      const apiUrl = 'http://localhost:8080/api/feedback';
      
      // Make the actual API call with specific headers
      const response = await axios.post(apiUrl, feedbackData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log("API response:", response);
      
      // Xử lý tất cả các mã trạng thái thành công (2xx)
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Cảm ơn bạn đã gửi phản hồi",
          description: "Chúng tôi đã nhận được phản hồi của bạn và sẽ xem xét sớm nhất có thể.",
        });
        
        form.reset();
      } else {
        throw new Error("Server did not return success status");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Đã xảy ra lỗi",
        description: "Không thể gửi phản hồi của bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ email của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Tiêu đề phản hồi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đánh giá</FormLabel>
              <FormControl>
                <StarRating 
                  value={field.value} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Hãy đánh giá trải nghiệm của bạn với dịch vụ của chúng tôi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung phản hồi</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập nội dung phản hồi của bạn" 
                  className="min-h-[150px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
        </Button>
      </form>
    </Form>
  );
}
