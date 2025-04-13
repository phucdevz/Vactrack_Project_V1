
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Edit, Trash2 } from "lucide-react";
import { ChildProfile } from "@/types/children";
import { childrenApi } from "@/services/childrenApi";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 1) {
    // Calculate months
    let months = (today.getMonth() + 12) - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    return `${months} tháng`;
  }
  
  return `${age} tuổi`;
};

const ChildList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  
  const { 
    data: children = [], 
    isLoading, 
    isError, 
    refetch
  } = useQuery({
    queryKey: ['children'],
    queryFn: childrenApi.getAll,
  });

  const deleteChildMutation = useMutation({
    mutationFn: childrenApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
      toast({
        title: "Xóa thành công",
        description: "Đã xóa hồ sơ trẻ",
      });
    },
    onError: (error) => {
      console.error("Error deleting child:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa hồ sơ trẻ. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  });

  const handleDelete = (id: string) => {
    setChildToDelete(id);
  };

  const confirmDelete = () => {
    if (childToDelete) {
      deleteChildMutation.mutate(childToDelete);
      setChildToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <p className="text-red-500 mb-4">
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </CardContent>
      </Card>
    );
  }

  if (children.length === 0) {
    return (
      <Card>
        <CardContent className="text-center p-6">
          <p className="text-gray-500 mb-4">
            Chưa có hồ sơ trẻ em nào được thêm vào.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {children.map((child) => (
          <Card key={child.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{child.name}</CardTitle>
                <span className="text-sm bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                  {child.gender === "male" ? "Nam" : "Nữ"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Ngày sinh:</span>
                  <div className="text-gray-900">
                    {new Date(child.dob).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Tuổi:</span>
                  <div className="text-gray-900">{calculateAge(child.dob)}</div>
                </div>
                {child.bloodType && (
                  <div>
                    <span className="text-gray-500">Nhóm máu:</span>
                    <div className="text-gray-900">{child.bloodType}</div>
                  </div>
                )}
                {child.allergies && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Dị ứng:</span>
                    <div className="text-gray-900">{child.allergies}</div>
                  </div>
                )}
                {child.notes && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Ghi chú:</span>
                    <div className="text-gray-900">{child.notes}</div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/vaccination-history?child=${child.id}`)}
                >
                  Lịch sử tiêm chủng
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/booking?child=${child.id}`)}
                >
                  Đặt lịch tiêm
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    // TODO: Implement edit functionality
                    toast({
                      title: "Chức năng đang phát triển",
                      description: "Tính năng chỉnh sửa hồ sơ sẽ sớm được cập nhật",
                    });
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(child.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xóa hồ sơ trẻ</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa hồ sơ của "{child.name}"? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ChildList;
