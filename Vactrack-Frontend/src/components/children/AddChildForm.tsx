
import React, { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/DatePicker";
import { Plus } from "lucide-react";
import { childrenApi } from "@/services/childrenApi";

interface AddChildFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddChildForm = ({ open, onOpenChange }: AddChildFormProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    bloodType: "",
    allergies: "",
    notes: "",
  });
  const queryClient = useQueryClient();

  const addChildMutation = useMutation({
    mutationFn: childrenApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      
      setFormData({
        name: "",
        gender: "",
        bloodType: "",
        allergies: "",
        notes: "",
      });
      setDate(undefined);
      onOpenChange(false);
      
      toast({
        title: "Thành công",
        description: "Đã thêm hồ sơ trẻ mới",
      });
    },
    onError: (error) => {
      console.error("Error adding child:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm hồ sơ trẻ. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng nhập tên của trẻ",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Thông tin không đầy đủ",
        description: "Vui lòng chọn ngày sinh của trẻ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const newChild = {
      name: formData.name,
      dob: format(date, "yyyy-MM-dd"),
      gender: formData.gender as "male" | "female" || "male",
      bloodType: formData.bloodType || undefined,
      allergies: formData.allergies || undefined,
      notes: formData.notes || undefined,
    };
    
    addChildMutation.mutate(newChild);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm hồ sơ trẻ
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm hồ sơ trẻ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin cá nhân của trẻ. Bạn có thể cập nhật thông tin này sau.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Họ và tên trẻ</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dob">Ngày sinh</Label>
              <DatePicker
                date={date}
                setDate={setDate}
                label="Chọn ngày sinh"
                disabledDates={(date) => {
                  const today = new Date();
                  return date > today;
                }}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="gender">Giới tính</Label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-500"
                  />
                  <label htmlFor="male" className="ml-2 text-sm">Nam</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-brand-500"
                  />
                  <label htmlFor="female" className="ml-2 text-sm">Nữ</label>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bloodType">Nhóm máu (nếu biết)</Label>
              <Input
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="allergies">Dị ứng (nếu có)</Label>
              <Input
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="Liệt kê các dị ứng, phân cách bằng dấu phẩy"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Ghi chú thêm</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Tiền sử bệnh, thông tin khác cần lưu ý"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || addChildMutation.isPending}
            >
              {addChildMutation.isPending ? "Đang xử lý..." : "Lưu thông tin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChildForm;
