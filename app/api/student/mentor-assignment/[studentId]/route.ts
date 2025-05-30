
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/database/db";

export async function GET(
  req: NextRequest
) {
  try {
    const studentId = req.nextUrl.pathname.split('/').pop(); // Extract UUID from the URL
  
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    // Fetch mentor assignment with mentor details
    const { data: assignment, error } = await supabase
      .from('assigned_mentor')
      .select(`
        *,
        mentor:mentor_id (
          uuid,
          mentor_name,
          email,
          mobile_number
        )
      `)
      .eq('student_id', studentId)
      .eq('status', 'ACTIVE')
      .single();

    if (error) {
      console.log('No mentor assigned:', error.message);
      return NextResponse.json(
        { success: true, mentor: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, mentor: assignment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching mentor assignment:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
