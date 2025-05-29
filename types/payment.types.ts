export type PaymentStatus = 'pending' | 'captured' | 'failed';

export interface Payment {
  id: string;
  student_id: string;
  amount: string;
  payment: Record<string, any>;
  payment_status: PaymentStatus;
  payment_verified: boolean;
  paid: boolean;
  created_at: string;
  updated_at: string;
}
