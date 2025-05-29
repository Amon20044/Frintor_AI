import { AssignedStatus, SessionStatus } from './enums';

export interface AssignedMentor {
  uuid: string;
  student_id: string;
  mentor_id: string;
  assigned_at: string;
  status: AssignedStatus;
  meeting_status: SessionStatus;
  meeting_link: string;
}
