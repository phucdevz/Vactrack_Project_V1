
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { QuickFeedbackForm } from "./QuickFeedbackForm";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleOpenFullFeedback = () => {
    setOpen(false);
    navigate("/feedback");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button 
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-brand-500 hover:bg-brand-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Feedback"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Đánh giá dịch vụ của chúng tôi</DrawerTitle>
          <DrawerDescription>
            Chia sẻ ý kiến của bạn để chúng tôi có thể cải thiện dịch vụ tốt hơn
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4">
          <QuickFeedbackForm onClose={() => setOpen(false)} />
        </div>
        
        <DrawerFooter>
          <Button variant="outline" onClick={handleOpenFullFeedback}>
            Gửi phản hồi chi tiết
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost">Đóng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
