
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/database/db";

export async function POST(req: NextRequest) {
  try {
    const { studentId, mentorId } = await req.json();

    if (!studentId || !mentorId) {
      return NextResponse.json(
        { success: false, message: "Student ID and Mentor ID are required" },
        { status: 400 }
      );
    }

    // First verify that this mentor is assigned to this student
    const { data: assignment, error: assignmentError } = await supabase
      .from('assigned_mentor')
      .select('uuid')
      .eq('student_id', studentId)
      .eq('mentor_id', mentorId)
      .eq('status', 'ACTIVE')
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { success: false, message: "Mentor is not assigned to this student" },
        { status: 403 }
      );
    }

    // Update horoscope verification status
    const { data, error } = await supabase
      .from('ai_horoscope')
      .update({ verified: true })
      .eq('student_id', studentId)
      .order('generated_at', { ascending: false }) // or use 'id' if no timestamp
      .limit(1)
      .maybeSingle(); // avoids error if no row

    if (error) {
      console.error('Error verifying horoscope:', error.message);
      return NextResponse.json(
        { success: false, message: "Failed to verify horoscope" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Horoscope verified successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in verify horoscope API:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
