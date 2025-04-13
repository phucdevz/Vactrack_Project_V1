
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ChildSidebar from "@/components/children/ChildSidebar";
import ChildList from "@/components/children/ChildList";
import AddChildForm from "@/components/children/AddChildForm";

const Children = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/children" } } });
    }
  }, [isLoggedIn, navigate]);

  // Loading and error states
  if (!isLoggedIn) {
    return null; // Return nothing while redirecting
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-16 bg-gradient-to-r from-brand-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ trẻ em</h1>
            <p className="mt-2 text-lg text-gray-600">
              Quản lý thông tin cá nhân và lịch sử tiêm chủng của trẻ
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <ChildSidebar />
              
              <div className="md:w-3/4 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">Danh sách trẻ em</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2" 
                      onClick={() => {
                        // Refetch children data using react-query
                        queryClient.invalidateQueries({ queryKey: ['children'] });
                        toast({
                          title: "Đã làm mới",
                          description: "Danh sách trẻ em đã được cập nhật",
                        });
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <AddChildForm open={dialogOpen} onOpenChange={setDialogOpen} />
                </div>
                
                <ChildList />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Children;
