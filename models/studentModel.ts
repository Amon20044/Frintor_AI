import supabase from "../database/db";
import { Student } from "../types/student.types";
import argon2 from "argon2";

export const signUp = async (email: string, password: string) => supabase.auth.signUp({
    email,
    password
})

export const signIn = async (email: string, password: string) => supabase.auth.signInWithPassword({
    email,
    password
})

export const registerStudent = async (student: Partial<Student>) => {
    const { data, error } = await supabase
        .from("students")
        .insert({
            uuid: student.uuid,
            email: student.email,
            password: student.password
        })
        .select()
        .single();

    if (error instanceof Error) {
        throw new Error(error.message);
    }

    return data as Partial<Student>;
}

export const regStudent = async (student: Partial<Student>) => {

    
    const { data, error } = await supabase
        .from("students")
        .insert({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            password: student.password,
            mobile_number: student.mobile_number
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const logStudent = async (email: string, password: string): Promise<Student> => {
    const { data: dataStudent, error: errorLogin } = await supabase
        .from("students")
        .select("*")
        .eq("email", email)
        .single();

    if (errorLogin) {
        throw new Error(errorLogin.message);
    }

    // Verify password
    const isValid = await argon2.verify(dataStudent.password, password);
    if (!isValid) {
        throw new Error("Invalid credentials");
    }

    return dataStudent;
}

export const onboardStudent = async (student: any): Promise<Partial<Student> | null> => {
  try {
    console.log("Onboarding student:", student);
    const { data, error } = await supabase
      .from("students")
      .update({
        first_name: student.first_name,
        last_name: student.last_name,
        age: student.age,
        gender: student.gender,
        dateofbirth: student.dateofbirth,
        timeofbirth: student.timeofbirth,
        placeofbirth: student.placeofbirth,
        email: student.email,
        mobile_number: student.mobile_number,
        category: student.category,
        lvl: student.lvl,
        interest: student.interest,
        education: student.education,
        studentmetadata: student.studentmetadata,
        preferences: student.preferences,
        onboardingcompleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("uuid", student.student_id)
      .select()
      .single();

    if (error) {
      console.error("Error onboarding student:", error);
      return null;
    }

    console.log("Student onboarded successfully:", data);
    return data as Partial<Student>;
  } catch (error) {
    console.error("Error in onboardStudent:", error);
    return null;
  }
};

export const getStudentById = async (uuid: string): Promise<Student | null> => {
    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("uuid", uuid)
        .single();

    if (error) {
        console.error('Error fetching student:', error.message);
        return null;
    }

    return data;
}

export const getAllStudents = async (): Promise<Student[]> => {
    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export const updateStudent = async (uuid: string, updates: Partial<Student>) => {
    const { data, error } = await supabase
        .from("students")
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('uuid', uuid)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}