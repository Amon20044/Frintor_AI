
import supabase from "../database/db";
import { TestResult } from "../types/testResult.types";
import { Test } from "@/types/tests.types";

export async function setTestResult(testResult: Partial<TestResult>): Promise<Partial<TestResult> | null> {
  try {
    const { data, error } = await supabase
      .from("test_results")
      .insert([{ ...testResult }])
      .select()
      .single();

    if (error) {
      console.error("Error inserting test result:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error in setTestResult:", err);
    return null;
  }
}

export async function getTest(uuid: string): Promise<Partial<Test> | null> {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('student_id', uuid)
      .single();

    if (error) {
      console.error('Error fetching test:', error.message);
      return null;
    }

    return data as Partial<Test>;
  } catch (err) {
    console.error('Unexpected error in getTest:', err);
    return null;
  }
}

export async function createTest(studentId: string, testType: string = 'psychometric') {
  try {
    const { data, error } = await supabase
      .from('tests')
      .insert({
        student_id: studentId,
        test_type: testType,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating test:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in createTest:', err);
    return null;
  }
}

export async function getTestWithResults(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select(`
        *,
        test_results:test_results!test_id (
          uuid,
          marks,
          test_structure,
          evaluated_at
        )
      `)
      .eq('student_id', studentId)
      .order('assigned_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching test with results:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in getTestWithResults:', err);
    return null;
  }
}

export async function canStudentViewResults(studentId: string): Promise<boolean> {
  try {
    // Check if student has an active mentor who has allowed viewing results
    const { data: assignment, error } = await supabase
      .from('assigned_mentor')
      .select('uuid, meeting_status')
      .eq('student_id', studentId)
      .eq('status', 'ACTIVE')
      .single();

    if (error || !assignment) {
      return false;
    }

    // Student can view results if they have had at least one completed meeting
    return assignment.meeting_status === 'COMPLETED';
  } catch (err) {
    console.error('Error checking result visibility:', err);
    return false;
  }
}

export async function allowStudentToViewResults(studentId: string, mentorId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('assigned_mentor')
      .update({ meeting_status: 'COMPLETED' })
      .eq('student_id', studentId)
      .eq('mentor_id', mentorId)
      .eq('status', 'ACTIVE')
      .select()
      .single();

    if (error) {
      console.error('Error allowing result view:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error in allowStudentToViewResults:', err);
    return false;
  }
}

export async function getStudentTestStatus(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('uuid, status, completed_at, test_type')
      .eq('student_id', studentId)
      .order('assigned_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching test status:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error in getStudentTestStatus:', err);
    return null;
  }
}
