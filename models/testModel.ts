import supabase from "../database/db";
import { TestResult } from "../types/testResult.types";
import { Test } from "@/types/tests.types";

// ✅ Inserts the TestResult into the `test_results` table
export async function setTestResult(testResult: Partial<TestResult>): Promise<Partial<TestResult> | null> {
  try {
    const { data, error } = await supabase
      .from("test_results")
      .insert([{ ...testResult }])
      .select()
      .single(); // Expect only one inserted row

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

// ✅ Fetches test data for a specific student from `tests` table
export async function getTest(uuid: string): Promise<Partial<Test> | null> {
  try {
    const { data , error } = await supabase
      .from('tests')
      .select('*')
      .eq('student_id', uuid)
      .single(); // Ensures you get exactly one row

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
