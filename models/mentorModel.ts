
import supabase from '@/database/db';

export interface Mentor {
  uuid: string;
  mentor_name: string;
  mobile_number: string;
  email: string;
  password: string;
  metadata?: any;
  preferences_settings?: any;
  sub_admin_id?: string;
  created_at: string;
  updated_at: string;
}

export const getMentorByEmail = async (email: string): Promise<Mentor | null> => {
  const { data, error } = await supabase
    .from('mentor')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching mentor by email:', error.message);
    return null;
  }

  return data;
};

export const createMentor = async (mentorData: Omit<Mentor, 'uuid' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('mentor')
    .insert(mentorData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateMentor = async (uuid: string, updates: Partial<Mentor>) => {
  const { data, error } = await supabase
    .from('mentor')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('uuid', uuid)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteMentor = async (uuid: string) => {
  const { error } = await supabase
    .from('mentor')
    .delete()
    .eq('uuid', uuid);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export const getAllMentors = async (): Promise<Mentor[]> => {
  const { data, error } = await supabase
    .from('mentor')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const assignMentorToStudent = async (studentId: string, mentorId: string, meetingLink?: string) => {
  // First, check if student already has an active mentor
  const { data: existingAssignment } = await supabase
    .from('assigned_mentor')
    .select('*')
    .eq('student_id', studentId)
    .eq('status', 'ACTIVE')
    .single();

  if (existingAssignment) {
    throw new Error('Student already has an active mentor assigned');
  }

  const { data, error } = await supabase
    .from('assigned_mentor')
    .insert({
      student_id: studentId,
      mentor_id: mentorId,
      meeting_link: meetingLink,
      status: 'ACTIVE',
      meeting_status: 'SCHEDULED'
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getStudentMentor = async (studentId: string) => {
  const { data, error } = await supabase
    .from('assigned_mentor')
    .select(`
      *,
      mentor:mentor_id (
        uuid,
        mentor_name,
        email,
        mobile_number
      )
    `)
    .eq('student_id', studentId)
    .eq('status', 'ACTIVE')
    .single();

  if (error) {
    console.error('Error fetching student mentor:', error.message);
    return null;
  }

  return data;
};

export const getMentorStudents = async (mentorId: string) => {
  const { data, error } = await supabase
    .from('assigned_mentor')
    .select(`
      *,
      student:student_id (
        uuid,
        first_name,
        last_name,
        email,
        mobile_number,
        lvl,
        onboardingCompleted
      )
    `)
    .eq('mentor_id', mentorId)
    .eq('status', 'ACTIVE');

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
