
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/database/db";

export async function GET(req: NextRequest) {
  try {
    // Fetch all assignments with student and mentor details
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
        ),
        mentor:mentor_id (
          uuid,
          mentor_name,
          email,
          mobile_number
        )
      `)
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching assignments:', error.message);
      return NextResponse.json(
        { success: false, message: "Failed to fetch assignments" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, assignments: assignments || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in assignments API:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
