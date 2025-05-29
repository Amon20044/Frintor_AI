
import { Gender, Level } from './enums';

interface StudentMetadata {
  classOrLevel: string; // e.g., "10th", "BTech"
  marks: string; // e.g., "90%", "8.2 CGPA"
  field: string; // e.g., "CSE", "Mech"
}

interface PreferencesSettings {
  [key: string]: string | boolean | number; // Flexible key-value pairs
}

export interface Student {
  uuid?: string;
  first_name?: string;
  last_name?: string;
  age?: string;
  email?: string;
  mobile_number?: string;
  password?: string;
  dateofbirth?: string;
  timeofbirth?: string; 
  placeofbirth?: string; // city, State, Country
  gender?: Gender; 
  education?: string; // e.g. "Bachelor's", "Master's"
  category?: string;
  birth_date?: string; // DD/MM/YYYY
  interest?: string[];
  lvl?: Level;
  studentmetadata?: StudentMetadata[];
  preferences_settings?: PreferencesSettings;
  email_verified?: boolean;
  onboardingcompleted?: boolean;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  student?: Student;
  error?: string;
}
