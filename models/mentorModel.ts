
import supabase from "../database/db";
import { Mentor } from "../types/mentor.types";
import argon2 from "argon2";

export const createMentor = async (mentor: Omit<Mentor, 'uuid' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
        .from("mentor")
        .insert({
            mentor_name: mentor.mentor_name,
            mobile_number: mentor.mobile_number,
            email: mentor.email,
            password: mentor.password,
            metadata: mentor.metadata,
            preferences_settings: mentor.preferences_settings,
            sub_admin_id: mentor.sub_admin_id
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const getMentorById = async (uuid: string): Promise<Mentor | null> => {
    const { data, error } = await supabase
        .from("mentor")
        .select("*")
        .eq("uuid", uuid)
        .single();

    if (error) {
        console.error('Error fetching mentor:', error.message);
        return null;
    }

    return data;
}

export const getAllMentors = async (): Promise<Mentor[]> => {
    const { data, error } = await supabase
        .from("mentor")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export const assignMentorToStudent = async (studentId: string, mentorId: string, meetingLink?: string) => {
    // First, check if student already has an active mentor
    const { data: existingAssignment } = await supabase
        .from("assigned_mentor")
        .select("*")
        .eq("student_id", studentId)
        .eq("status", "ACTIVE")
        .single();

    if (existingAssignment) {
        throw new Error("Student already has an active mentor assigned");
    }

    const { data, error } = await supabase
        .from("assigned_mentor")
        .insert({
            student_id: studentId,
            mentor_id: mentorId,
            meeting_link: meetingLink,
            status: "ACTIVE",
            meeting_status: "SCHEDULED"
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const getStudentMentor = async (studentId: string) => {
    const { data, error } = await supabase
        .from("assigned_mentor")
        .select(`
            *,
            mentor:mentor_id (
                uuid,
                mentor_name,
                email,
                mobile_number
            )
        `)
        .eq("student_id", studentId)
        .eq("status", "ACTIVE")
        .single();

    if (error) {
        console.error('Error fetching student mentor:', error.message);
        return null;
    }

    return data;
}

export const getMentorStudents = async (mentorId: string) => {
    const { data, error } = await supabase
        .from("assigned_mentor")
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
        .eq("mentor_id", mentorId)
        .eq("status", "ACTIVE");

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export const updateMeetingStatus = async (assignmentId: string, status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') => {
    const { data, error } = await supabase
        .from("assigned_mentor")
        .update({ meeting_status: status })
        .eq("uuid", assignmentId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
