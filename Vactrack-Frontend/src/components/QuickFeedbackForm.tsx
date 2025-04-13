
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "./StarRating";
import axios from "axios";

const quickFeedbackSchema = z.object({
  message: z.string().min(10, { message: "Nội dung phải có ít nhất 10 ký tự" }),
  rating: z.number().min(1, { message: "Vui lòng đánh giá dịch vụ của chúng tôi" }).max(5),
});

type QuickFeedbackValues = z.infer<typeof quickFeedbackSchema>;

interface QuickFeedbackFormProps {
  onClose: () => void;
}

export function QuickFeedbackForm({ onClose }: QuickFeedbackFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<QuickFeedbackValues>({
    resolver: zodResolver(quickFeedbackSchema),
    defaultValues: {
      message: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: QuickFeedbackValues) => {
    setIsSubmitting(true);
    
    try {
      // Create a full feedback object from the quick feedback data
      const feedbackData = {
        name: "Khách hàng",  // Anonymous user
        email: "anonymous@example.com", // Anonymous email
        subject: "Đánh giá nhanh",
        message: data.message,
        rating: data.rating,
        published: false  // Thêm trường published theo yêu cầu của backend
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
          title: "Cảm ơn bạn đã gửi đánh giá",
          description: "Phản hồi của bạn rất quan trọng đối với chúng tôi.",
        });
        
        form.reset();
        onClose();
      } else {
        throw new Error("Server did not return success status");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Đã xảy ra lỗi",
        description: "Không thể gửi đánh giá của bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Đánh giá dịch vụ</FormLabel>
              <FormControl>
                <StarRating 
                  value={field.value} 
                  onChange={field.onChange}
                  size="lg"
                  className="justify-center py-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ý kiến của bạn</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập ý kiến của bạn về dịch vụ của chúng tôi" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-brand-500 hover:bg-brand-600" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </form>
    </Form>
  );
}
