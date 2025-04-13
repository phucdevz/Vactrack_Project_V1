
import * as React from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface PaymentConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingData: {
    bookingId: string;
    amount: number;
    serviceType?: string;
    packageType?: string;
    facilityName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    paymentMethod: string;
  };
}

export function PaymentConfirmation({ open, onOpenChange, bookingData }: PaymentConfirmationProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = React.useState("");

  const handleConfirm = () => {
    if (bookingData.paymentMethod === "direct") {
      toast({
        title: "Đặt lịch thành công",
        description: "Bạn sẽ thanh toán tại cơ sở khi đến tiêm",
      });
      onOpenChange(false);
    } else {
      navigate("/payment", {
        state: {
          paymentInfo: {
            ...bookingData,
            notes
          }
        }
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận đặt lịch</AlertDialogTitle>
          <AlertDialogDescription>
            Vui lòng xác nhận thông tin đặt lịch và phương thức thanh toán
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-4">
          <div className="border-t border-b py-3 space-y-3">
            {bookingData.facilityName && (
              <div>
                <p className="text-sm text-muted-foreground">Cơ sở:</p>
                <p className="font-medium">{bookingData.facilityName}</p>
              </div>
            )}
            
            {bookingData.appointmentDate && bookingData.appointmentTime && (
              <div>
                <p className="text-sm text-muted-foreground">Thời gian:</p>
                <p className="font-medium">
                  {bookingData.appointmentDate} - {bookingData.appointmentTime}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-muted-foreground">Phương thức thanh toán:</p>
              <p className="font-medium">
                {bookingData.paymentMethod === "direct"
                  ? "Thanh toán trực tiếp tại cơ sở"
                  : bookingData.paymentMethod === "banking"
                  ? "Chuyển khoản ngân hàng"
                  : "Thanh toán online"}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Ghi chú bổ sung (không bắt buộc):</p>
            <Textarea 
              placeholder="Thêm ghi chú của bạn về lịch tiêm chủng này" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <p className="font-medium">Tổng tiền:</p>
            <p className="text-xl font-bold text-brand-600">
              {bookingData.amount.toLocaleString('vi-VN')} VND
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Quay lại</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {bookingData.paymentMethod === "direct" ? "Xác nhận đặt lịch" : "Tiếp tục thanh toán"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
