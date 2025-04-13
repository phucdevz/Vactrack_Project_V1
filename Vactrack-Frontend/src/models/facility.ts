
export interface Facility {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  openingHours: string;
  imageUrl?: string;
}

// Mock facilities data representing real facilities
export const facilities: Facility[] = [
  {
    id: "f1",
    name: "VacTrack Trung tâm y tế Hà Nội",
    address: "123 Trần Duy Hưng",
    district: "Cầu Giấy",
    city: "Hà Nội",
    phone: "024.1234.5678",
    openingHours: "08:00 - 17:00"
  },
  {
    id: "f2",
    name: "VacTrack Phòng khám đa khoa Quận 1",
    address: "456 Nguyễn Huệ",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    phone: "028.1234.5678",
    openingHours: "08:00 - 17:00"
  },
  {
    id: "f3",
    name: "VacTrack Trung tâm tiêm chủng Đà Nẵng",
    address: "789 Nguyễn Văn Linh",
    district: "Hải Châu",
    city: "Đà Nẵng",
    phone: "0236.1234.5678",
    openingHours: "08:00 - 17:00"
  },
  {
    id: "f4",
    name: "VacTrack Bệnh viện Nhi Trung ương",
    address: "18 Nguyễn Du",
    district: "Hai Bà Trưng",
    city: "Hà Nội",
    phone: "024.9876.5432",
    openingHours: "07:30 - 17:30"
  }
];
