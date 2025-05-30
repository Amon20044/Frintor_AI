import supabase from "@/database/db";
import { genHash } from "@/utils/generateHash";

// Types for the utility functions
export interface DevStudentData {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  password: string;
  age?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  lvl?:
    | "MID_SCHOOL"
    | "HIGH_SCHOOL"
    | "UNDERGRADUATE"
    | "POSTGRADUATE"
    | "WORKING_PROFESSIONAL";
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  category?: string;
  birth_date?: string;
  interest?: string[];
  education?: any;
  studentMetadata?: any;
  preferences?: any;
  onboardingCompleted?: boolean;
}

export interface DevMentorData {
  mentor_name: string;
  email: string;
  mobile_number: string;
  password: string;
  metadata?: any;
  preferences_settings?: any;
  sub_admin_id?: string;
}

export interface DevAdminData {
  user_id: string;
  name: string;
  mobile_number?: string;
  password: string;
}

export interface DevSubAdminData {
  name: string;
  email: string;
  mobile_number?: string;
  password: string;
}

// Student creation utility
export const createDevStudent = async (studentData: DevStudentData) => {
  try {
    // Hash the password
    const hashedPassword = await genHash(studentData.password);

    // Prepare student object with proper defaults
    const studentToInsert = {
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      email: studentData.email,
      mobile_number: studentData.mobile_number,
      password: hashedPassword,
      age: studentData.age || null,
      gender: studentData.gender || null,
      lvl: studentData.lvl || null,
      dateOfBirth: studentData.dateOfBirth || null,
      timeOfBirth: studentData.timeOfBirth || null,
      placeOfBirth: studentData.placeOfBirth || null,
      category: studentData.category || null,
      birth_date: studentData.birth_date || null,
      interest: studentData.interest || null,
      education: studentData.education || null,
      studentMetadata: studentData.studentMetadata || null,
      preferences: studentData.preferences || null,
      email_verified: false,
      onboardingCompleted: studentData.onboardingCompleted || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("students")
      .insert(studentToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating student:", error);
      throw new Error(`Failed to create student: ${error.message}`);
    }

    return {
      success: true,
      data,
      message: "Student created successfully",
    };
  } catch (error) {
    console.error("Error in createDevStudent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to create student",
    };
  }
};

// Mentor creation utility
export const createDevMentor = async (mentorData: DevMentorData) => {
  try {
    // Hash the password
    const hashedPassword = await genHash(mentorData.password);

    // Prepare mentor object
    const mentorToInsert = {
      mentor_name: mentorData.mentor_name,
      email: mentorData.email,
      mobile_number: mentorData.mobile_number,
      password: hashedPassword,
      metadata: mentorData.metadata || {},
      preferences_settings: mentorData.preferences_settings || {},
      sub_admin_id: mentorData.sub_admin_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("mentor")
      .insert(mentorToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating mentor:", error);
      throw new Error(`Failed to create mentor: ${error.message}`);
    }

    return {
      success: true,
      data,
      message: "Mentor created successfully",
    };
  } catch (error) {
    console.error("Error in createDevMentor:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to create mentor",
    };
  }
};

// Admin creation utility
export const createDevAdmin = async (adminData: DevAdminData) => {
  try {
    // Hash the password
    const hashedPassword = await genHash(adminData.password);

    // Prepare admin object
    const adminToInsert = {
      user_id: adminData.user_id,
      name: adminData.name,
      mobile_number: adminData.mobile_number || null,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("admin")
      .insert(adminToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating admin:", error);
      throw new Error(`Failed to create admin: ${error.message}`);
    }

    return {
      success: true,
      data,
      message: "Admin created successfully",
    };
  } catch (error) {
    console.error("Error in createDevAdmin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to create admin",
    };
  }
};

// Sub Admin creation utility
export const createDevSubAdmin = async (subAdminData: DevSubAdminData) => {
  try {
    // Hash the password
    const hashedPassword = await genHash(subAdminData.password);

    // Prepare sub admin object
    const subAdminToInsert = {
      name: subAdminData.name,
      email: subAdminData.email,
      mobile_number: subAdminData.mobile_number || null,
      password: hashedPassword,
      is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("sub_admin")
      .insert(subAdminToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating sub admin:", error);
      throw new Error(`Failed to create sub admin: ${error.message}`);
    }

    return {
      success: true,
      data,
      message: "Sub Admin created successfully",
    };
  } catch (error) {
    console.error("Error in createDevSubAdmin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to create sub admin",
    };
  }
};

// Utility to assign mentor to student
export const assignMentorToStudent = async (
  studentId: string,
  mentorId: string,
  meetingLink?: string,
) => {
  try {
    // Check if student already has an active mentor
    const { data: existingAssignment } = await supabase
      .from("assigned_mentor")
      .select("*")
      .eq("student_id", studentId)
      .eq("status", "ACTIVE")
      .single();

    if (existingAssignment) {
      return {
        success: false,
        message: "Student already has an active mentor assigned",
      };
    }

    const assignmentData = {
      student_id: studentId,
      mentor_id: mentorId,
      meeting_link: meetingLink || null,
      status: "ACTIVE" as const,
      meeting_status: "SCHEDULED" as const,
      assigned_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("assigned_mentor")
      .insert(assignmentData)
      .select()
      .single();

    if (error) {
      console.error("Error assigning mentor:", error);
      throw new Error(`Failed to assign mentor: ${error.message}`);
    }

    return {
      success: true,
      data,
      message: "Mentor assigned successfully",
    };
  } catch (error) {
    console.error("Error in assignMentorToStudent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to assign mentor",
    };
  }
};

// Utility to create a test for a student
export const createTestForStudent = async (
  studentId: string,
  testType: string,
  testStructure: any = {},
) => {
  try {
    const testData = {
      student_id: studentId,
      test_type: testType,
      test_structure: testStructure,
      status: "PENDING" as const,
      assigned_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("tests")
      .insert(testData)
      .select()
      .single();

    if (error) {
      console.error("Error creating test:", error);
      throw new Error(`Failed to create test: ${error.message}`);
    }

    return {
      success: true,
      data,
      message: "Test created successfully",
    };
  } catch (error) {
    console.error("Error in createTestForStudent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to create test",
    };
  }
};

// Utility to get all data for debugging
export const getAllDevData = async () => {
  try {
    const [studentsRes, mentorsRes, adminsRes, subAdminsRes] =
      await Promise.all([
        supabase
          .from("students")
          .select(
            "uuid, first_name, last_name, email, mobile_number, created_at",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("mentor")
          .select("uuid, mentor_name, email, mobile_number, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("admin")
          .select("uuid, user_id, name, mobile_number, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("sub_admin")
          .select("uuid, name, email, mobile_number, created_at")
          .eq("is_deleted", false)
          .order("created_at", { ascending: false }),
      ]);

    return {
      success: true,
      data: {
        students: studentsRes.data || [],
        mentors: mentorsRes.data || [],
        admins: adminsRes.data || [],
        subAdmins: subAdminsRes.data || [],
      },
    };
  } catch (error) {
    console.error("Error getting all dev data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Utility to clean up test data (use with caution!)
export const cleanupTestData = async (confirmationText: string) => {
  if (confirmationText !== "DELETE_ALL_TEST_DATA") {
    return {
      success: false,
      message: "Invalid confirmation text. Data not deleted.",
    };
  }

  try {
    // Delete in order to respect foreign key constraints
    await supabase
      .from("test_results")
      .delete()
      .neq("uuid", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("tests")
      .delete()
      .neq("uuid", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("assigned_mentor")
      .delete()
      .neq("uuid", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("ai_horoscope")
      .delete()
      .neq("uuid", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("students")
      .delete()
      .neq("uuid", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("mentor")
      .delete()
      .neq("uuid", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("admin")
      .delete()
      .neq("uuid", "00000000-0000-0000-0000-000000000000");
    await supabase
      .from("sub_admin")
      .delete()
      .neq("uuid", "00000000-0000-0000-0000-000000000000");

    return {
      success: true,
      message: "All test data cleaned up successfully",
    };
  } catch (error) {
    console.error("Error cleaning up test data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};