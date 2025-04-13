
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Star, Download, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// API URL from environment or default
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  createdAt: string;
  published?: boolean;
}

interface FeedbackListProps {
  onSelectFeedback?: (feedback: FeedbackItem[]) => void;
}

export function AdminFeedbackList({ onSelectFeedback }: FeedbackListProps) {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchFeedback = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/feedback`, {
        params: {
          page: 0,
          size: 50,
          sort: "createdAt,desc"
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.data) {
        console.log("Admin feedback data:", response.data);
        const feedbackData = response.data.content || [];
        setFeedbackItems(feedbackData);
        
        // Call callback if provided
        if (onSelectFeedback) {
          onSelectFeedback(feedbackData);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách phản hồi. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      // Use sample data when there's an error
      setFeedbackItems([
        {
          id: "FB-001",
          name: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          subject: "Đánh giá dịch vụ tiêm chủng",
          message: "Rất hài lòng với dịch vụ, nhân viên thân thiện và chuyên nghiệp.",
          rating: 5,
          createdAt: new Date().toISOString(),
          published: true
        },
        {
          id: "FB-002",
          name: "Trần Thị B",
          email: "tranthib@example.com",
          subject: "Góp ý về thời gian chờ đợi",
          message: "Thời gian chờ đợi hơi lâu, mong cải thiện trong lần tới.",
          rating: 3,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          published: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleExportFeedback = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get(`${API_URL}/admin/feedback/export`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `feedback-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: "Xuất dữ liệu thành công",
        description: "Dữ liệu phản hồi đã được xuất ra file Excel.",
      });
    } catch (error) {
      console.error("Error exporting feedback:", error);
      toast({
        variant: "destructive",
        title: "Lỗi xuất dữ liệu",
        description: "Không thể xuất dữ liệu. Vui lòng thử lại sau.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const showFeedbackDetails = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setIsDetailDialogOpen(true);
  };

  const handleShowDeleteConfirm = (feedbackId: string) => {
    setFeedbackToDelete(feedbackId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFeedback = async () => {
    if (!feedbackToDelete) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        `${API_URL}/admin/feedback/${feedbackToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      
      if (response.data && response.data.success) {
        // Remove the feedback from the list
        setFeedbackItems(feedbackItems.filter(item => item.id !== feedbackToDelete));
        
        toast({
          title: "Xóa thành công",
          description: "Phản hồi đã được xóa khỏi hệ thống.",
        });
      } else {
        throw new Error("Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast({
        variant: "destructive",
        title: "Lỗi xóa phản hồi",
        description: "Không thể xóa phản hồi. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    }
  };

  const toggleFeedbackPublished = async (feedbackId: string, shouldPublish: boolean) => {
    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${API_URL}/admin/feedback/${feedbackId}/publish`,
        { published: shouldPublish },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      
      if (response.data) {
        // Update the feedback in the list
        setFeedbackItems(feedbackItems.map(item => 
          item.id === feedbackId ? { ...item, published: shouldPublish } : item
        ));
        
        // Update selected feedback if it's the one being modified
        if (selectedFeedback && selectedFeedback.id === feedbackId) {
          setSelectedFeedback({ ...selectedFeedback, published: shouldPublish });
        }
        
        toast({
          title: shouldPublish ? "Đã xuất bản phản hồi" : "Đã ẩn phản hồi",
          description: shouldPublish 
            ? "Phản hồi này sẽ được hiển thị trên trang chủ." 
            : "Phản hồi này sẽ không được hiển thị trên trang chủ.",
        });
      } else {
        throw new Error("Failed to update feedback publish status");
      }
    } catch (error) {
      console.error("Error updating feedback publish status:", error);
      toast({
        variant: "destructive",
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật trạng thái xuất bản. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <CardTitle>Phản hồi khách hàng</CardTitle>
          <CardDescription>
            Danh sách phản hồi từ khách hàng
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportFeedback}
            disabled={isExporting}
          >
            {isExporting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Xuất Excel
          </Button>
          <Button 
            size="sm" 
            onClick={fetchFeedback} 
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
            <p className="ml-4 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableCaption>Danh sách các phản hồi từ khách hàng.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbackItems.length > 0 ? (
                  feedbackItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge variant="outline" className={getRatingColor(item.rating)}>
                            {item.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={item.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {item.published ? "Đã xuất bản" : "Chưa xuất bản"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => showFeedbackDetails(item)}
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Chưa có phản hồi nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Feedback Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chi tiết phản hồi</DialogTitle>
              <DialogDescription>
                Xem chi tiết phản hồi từ khách hàng
              </DialogDescription>
            </DialogHeader>
            
            {selectedFeedback && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Đánh giá</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < selectedFeedback.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} 
                        />
                      ))}
                      <span className="ml-2 font-medium">{selectedFeedback.rating}/5</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                    <p>{selectedFeedback.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{selectedFeedback.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Tiêu đề</p>
                    <p>{selectedFeedback.subject}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Nội dung</p>
                    <p className="whitespace-pre-wrap">{selectedFeedback.message}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Ngày gửi</p>
                    <p>{formatDate(selectedFeedback.createdAt)}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Thao tác</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeedback.published ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        disabled={isSubmitting}
                        onClick={() => toggleFeedbackPublished(selectedFeedback.id, false)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Ẩn phản hồi
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        disabled={isSubmitting}
                        onClick={() => toggleFeedbackPublished(selectedFeedback.id, true)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Xuất bản
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setIsDetailDialogOpen(false);
                        handleShowDeleteConfirm(selectedFeedback.id);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Xóa phản hồi
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa phản hồi?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Phản hồi này sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteFeedback}
                disabled={isSubmitting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Xóa phản hồi
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
