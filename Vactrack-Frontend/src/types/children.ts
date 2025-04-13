
export interface ChildProfile {
  id: string;
  name: string;
  dob: string;
  gender: "male" | "female";
  bloodType?: string;
  allergies?: string;
  notes?: string;
}
