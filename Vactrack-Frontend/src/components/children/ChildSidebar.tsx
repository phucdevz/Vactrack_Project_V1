
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Calendar } from "lucide-react";

const ChildSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="md:w-1/4 bg-brand-50 p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          Thông tin cá nhân
        </Button>
      </div>
      
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="w-full justify-start bg-brand-100"
          onClick={() => navigate("/children")}
        >
          <span className="mr-2">👶</span>
          Hồ sơ trẻ em
        </Button>
      </div>
      
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate("/vaccination-history")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Lịch sử tiêm chủng
        </Button>
      </div>
      
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => navigate("/booking")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Đặt lịch tiêm chủng
        </Button>
      </div>
    </div>
  );
};

export default ChildSidebar;
