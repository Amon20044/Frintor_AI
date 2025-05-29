import { TestStatus } from './enums';

export interface Test {
  uuid: string;
  student_id: string;
  test_type: string;
  assigned_at: string;
  completed_at: string | null;
  status: TestStatus;
  test_structure: Record<string, any>;
}
