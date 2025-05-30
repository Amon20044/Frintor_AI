
// Optimized database queries for the career counselling platform

import supabase from '../database/db';

// Get complete student profile with all related data
export const getStudentCompleteProfile = async (studentId: string) => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      assigned_mentor:assigned_mentor!student_id (
        uuid,
        status,
        meeting_status,
        meeting_link,
        mentor:mentor_id (
          uuid,
          mentor_name,
          email,
          mobile_number
        )
      ),
      tests:tests!student_id (
        uuid,
        test_type,
        status,
        assigned_at,
        completed_at,
        test_results:test_results!test_id (
          uuid,
          marks,
          test_structure,
          evaluated_at
        )
      ),
      ai_horoscope:ai_horoscope!student_id (
        uuid,
        horoscope,
        verfied,
        generated_at
      ),
      payments:payments!student_id (
        id,
        amount,
        payment_status,
        payment_verified,
        paid,
        created_at
      )
    `)
    .eq('uuid', studentId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Get dashboard analytics for admin
export const getDashboardAnalytics = async () => {
  // Students by education level
  const { data: studentsByLevel } = await supabase
    .from('students')
    .select('lvl')
    .not('lvl', 'is', null);

  // Test completion rates
  const { data: testStats } = await supabase
    .from('tests')
    .select('status, test_type');

  // Mentor assignment rates
  const { data: mentorStats } = await supabase
    .from('assigned_mentor')
    .select('status, meeting_status');

  // Recent student registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: recentStudents } = await supabase
    .from('students')
    .select('created_at')
    .gte('created_at', thirtyDaysAgo.toISOString());

  return {
    studentsByLevel: studentsByLevel || [],
    testStats: testStats || [],
    mentorStats: mentorStats || [],
    recentStudents: recentStudents || []
  };
};

// Get students ready for mentor assignment
export const getStudentsReadyForMentor = async () => {
  const { data, error } = await supabase
    .from('students')
    .select(`
      uuid,
      first_name,
      last_name,
      email,
      lvl,
      interest,
      onboardingCompleted,
      created_at,
      tests:tests!student_id (
        status,
        test_type,
        completed_at
      )
    `)
    .eq('onboardingCompleted', true)
    .not('uuid', 'in', 
      supabase
        .from('assigned_mentor')
        .select('student_id')
        .eq('status', 'ACTIVE')
    );

  if (error) {
    throw new Error(error.message);
  }

  return data?.filter(student => 
    student.tests?.some(test => test.status === 'COMPLETED')
  ) || [];
};

// Get mentor workload
export const getMentorWorkload = async () => {
  const { data, error } = await supabase
    .from('mentor')
    .select(`
      uuid,
      mentor_name,
      email,
      assigned_mentor:assigned_mentor!mentor_id (
        uuid,
        status,
        meeting_status,
        student:student_id (
          first_name,
          last_name,
          lvl
        )
      )
    `);

  if (error) {
    throw new Error(error.message);
  }

  return data?.map(mentor => ({
    ...mentor,
    activeStudents: mentor.assigned_mentor?.filter(am => am.status === 'ACTIVE').length || 0,
    completedSessions: mentor.assigned_mentor?.filter(am => am.meeting_status === 'COMPLETED').length || 0
  })) || [];
};
