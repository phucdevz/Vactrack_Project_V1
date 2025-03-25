
export interface Booking {
  id?: string;
  userId: string;
  patientName: string;
  patientDob: string;
  serviceType: string;
  packageType?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: BookingStatus;
  notes?: string;
  createdAt?: string;
}

export type BookingStatus = 
  | "pending" 
  | "confirmed" 
  | "completed" 
  | "cancelled";

export interface BookingSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingFormData {
  patientName: string;
  patientDob: string;
  serviceType: string;
  packageType: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}
