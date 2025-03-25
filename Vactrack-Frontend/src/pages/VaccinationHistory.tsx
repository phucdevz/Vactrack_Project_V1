
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, ChevronDown, Filter, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface VaccinationRecord {
  id: string;
  childName: string;
  childDob: string;
  vaccineName: string;
  date: string;
  location: string;
  batchNumber?: string;
  nextDoseDate?: string;
  status: "completed" | "scheduled" | "missed";
}

const VaccinationHistory = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/vaccination-history" } } });
      return;
    }

    // Fetch vaccination records - using mock data for now
    const mockRecords: VaccinationRecord[] = [
      {
        id: "1",
        childName: "Nguyễn Minh Anh",
        childDob: "2020-03-15",
        vaccineName: "Vắc-xin 6 trong 1 (Hexaxim)",
        date: "2023-04-10",
        location: "Trung tâm Y tế VacTrack",
        batchNumber: "HEX20230410",
        nextDoseDate: "2023-07-10",
        status: "completed",
      },
      {
        id: "2",
        childName: "Nguyễn Minh Anh",
        childDob: "2020-03-15",
        vaccineName: "Vắc-xin Rotavirus",
        date: "2023-04-10",
        location: "Trung tâm Y tế VacTrack",
        batchNumber: "ROT20230410",
        status: "completed",
      },
      {
        id: "3",
        childName: "Nguyễn Minh Anh",
        childDob: "2020-03-15",
        vaccineName: "Vắc-xin 6 trong 1 (Hexaxim) - Liều 2",
        date: "2023-07-10",
        location: "Trung tâm Y tế VacTrack",
        status: "scheduled",
      },
      {
        id: "4",
        childName: "Nguyễn Minh Vũ",
        childDob: "2018-08-20",
        vaccineName: "Vắc-xin phòng sởi",
        date: "2022-09-05",
        location: "Trung tâm Y tế VacTrack",
        batchNumber: "MES20220905",
        status: "completed",
      },
    ];

    setRecords(mockRecords);
    setIsLoading(false);
  }, [isLoggedIn, navigate, user]);

  // Filter records based on search term
  const filteredRecords = records.filter(
    (record) =>
      record.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vaccineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group records by child
  const recordsByChild = filteredRecords.reduce((acc, record) => {
    if (!acc[record.childName]) {
      acc[record.childName] = [];
    }
    acc[record.childName].push(record);
    return acc;
  }, {} as Record<string, VaccinationRecord[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>Đang tải thông tin...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-16 bg-gradient-to-r from-brand-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Lịch sử tiêm chủng</h1>
            <p className="mt-2 text-lg text-gray-600">
              Theo dõi lịch sử tiêm chủng của trẻ em
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
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
                    className="w-full justify-start"
                    onClick={() => navigate("/children")}
                  >
                    <span className="mr-2">👶</span>
                    Hồ sơ trẻ em
                  </Button>
                </div>
                
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-brand-100"
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
              
              <div className="md:w-3/4 p-6">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm theo tên trẻ hoặc loại vắc-xin"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {Object.keys(recordsByChild).length > 0 ? (
                    Object.entries(recordsByChild).map(([childName, childRecords]) => (
                      <Collapsible key={childName} className="border rounded-lg overflow-hidden">
                        <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 text-left">
                          <div>
                            <h3 className="font-medium text-gray-900">{childName}</h3>
                            <p className="text-sm text-gray-600">
                              {childRecords.length} mũi tiêm
                            </p>
                          </div>
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 divide-y">
                            {childRecords
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((record) => (
                                <div key={record.id} className="py-4 first:pt-0 last:pb-0">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium text-gray-900">{record.vaccineName}</h4>
                                      <p className="text-sm text-gray-600">
                                        Ngày tiêm: {new Date(record.date).toLocaleDateString("vi-VN")}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Địa điểm: {record.location}
                                      </p>
                                      {record.batchNumber && (
                                        <p className="text-sm text-gray-600">
                                          Số lô: {record.batchNumber}
                                        </p>
                                      )}
                                      {record.nextDoseDate && (
                                        <p className="text-sm text-gray-600">
                                          Mũi tiếp theo: {new Date(record.nextDoseDate).toLocaleDateString("vi-VN")}
                                        </p>
                                      )}
                                    </div>
                                    <div>
                                      {record.status === "completed" && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          <Check className="w-3 h-3 mr-1" /> Đã tiêm
                                        </span>
                                      )}
                                      {record.status === "scheduled" && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          Đã lên lịch
                                        </span>
                                      )}
                                      {record.status === "missed" && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          Đã bỏ lỡ
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-gray-500">Không tìm thấy kết quả phù hợp.</p>
                        {searchTerm && (
                          <Button 
                            variant="link" 
                            onClick={() => setSearchTerm("")}
                            className="mt-2"
                          >
                            Xóa tìm kiếm
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  {records.length === 0 && (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-gray-500">Chưa có lịch sử tiêm chủng nào được ghi nhận.</p>
                        <Button 
                          onClick={() => navigate("/booking")}
                          className="mt-4"
                        >
                          Đặt lịch tiêm chủng
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VaccinationHistory;
