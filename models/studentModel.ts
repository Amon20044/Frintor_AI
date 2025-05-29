
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

export const registerStudent = async (student: Student) => {
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

    return data;
}

export const regStudent = async (student: Student) => {
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

export const onboardStudent = async (student: Student) => {
    const { data, error } = await supabase
        .from("students")
        .update({
            age: student.age,
            dateOfBirth: student.dateofbirth,
            timeOfBirth: student.timeofbirth,
            placeOfBirth: student.placeofbirth,
            gender: student.gender,
            education: student.education,
            category: student.category,
            birth_date: student.birth_date,
            interest: student.interest,
            lvl: student.lvl,
            studentMetadata: student.studentmetadata,
            preferences: student.preferences_settings,
            onboardingCompleted: true,
            updated_at: new Date().toISOString()
        })
        .eq('uuid', student.uuid)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

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
