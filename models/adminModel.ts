
import supabase from "../database/db";
import { Admin } from "../types/admin.types";
import argon2 from "argon2";

export const createAdmin = async (admin: Omit<Admin, 'uuid' | 'created_at' | 'updated_at'>) => {
    const hashedPassword = await argon2.hash(admin.password);
    
    const { data, error } = await supabase
        .from("admin")
        .insert({
            user_id: admin.user_id,
            name: admin.name,
            mobile_number: admin.mobile_number,
            password: hashedPassword
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const loginAdmin = async (userId: string, password: string): Promise<Admin> => {
    const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("user_id", userId)
        .eq("is_deleted", false)
        .single();

    if (error) {
        throw new Error("Invalid credentials");
    }

    const isValid = await argon2.verify(data.password, password);
    if (!isValid) {
        throw new Error("Invalid credentials");
    }

    return data;
}

export const getAdminById = async (uuid: string): Promise<Admin | null> => {
    const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("uuid", uuid)
        .eq("is_deleted", false)
        .single();

    if (error) {
        console.error('Error fetching admin:', error.message);
        return null;
    }

    return data;
}

export const getAllStudentsForAdmin = async () => {
    const { data, error } = await supabase
        .from("students")
        .select(`
            *,
            assigned_mentor:assigned_mentor!student_id (
                uuid,
                status,
                meeting_status,
                mentor:mentor_id (
                    uuid,
                    mentor_name
                )
            ),
            tests:tests!student_id (
                uuid,
                status,
                test_type,
                completed_at
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export const getDashboardStats = async () => {
    // Get total students
    const { count: totalStudents, error: studentsError } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

    // Get total mentors
    const { count: totalMentors, error: mentorsError } = await supabase
        .from("mentor")
        .select("*", { count: "exact", head: true });

    // Get completed tests
    const { count: completedTests, error: testsError } = await supabase
        .from("tests")
        .select("*", { count: "exact", head: true })
        .eq("status", "COMPLETED");

    // Get active mentor assignments
    const { count: activeMentorships, error: mentorshipsError } = await supabase
        .from("assigned_mentor")
        .select("*", { count: "exact", head: true })
        .eq("status", "ACTIVE");

    if (studentsError || mentorsError || testsError || mentorshipsError) {
        throw new Error("Error fetching dashboard stats");
    }

    return {
        totalStudents: totalStudents || 0,
        totalMentors: totalMentors || 0,
        completedTests: completedTests || 0,
        activeMentorships: activeMentorships || 0
    };
}
