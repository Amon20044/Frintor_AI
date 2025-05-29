export interface Mentor {
  uuid: string;
  mentor_name: string;
  mobile_number: string;
  email: string;
  password: string;
  metadata: Record<string, any>;
  preferences_settings: Record<string, any>;
  sub_admin_id: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}
