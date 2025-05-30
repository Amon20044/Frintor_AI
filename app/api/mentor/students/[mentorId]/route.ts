
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/database/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  try {
    const { mentorId } = params;

    if (!mentorId) {
      return NextResponse.json(
        { success: false, message: "Mentor ID is required" },
        { status: 400 }
      );
    }

    // Fetch assigned students with their details
    const { data: assignments, error } = await supabase
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
          onboardingcompleted
        )
      `)
      .eq('mentor_id', mentorId)
      .eq('status', 'ACTIVE')
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching assigned students:', error.message);
      return NextResponse.json(
        { success: false, message: "Failed to fetch students" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, students: assignments || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in mentor students API:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
