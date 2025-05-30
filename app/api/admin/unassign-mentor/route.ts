
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/database/db";

export async function POST(req: NextRequest) {
  try {
    const { assignmentId } = await req.json();

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, message: "Assignment ID is required" },
        { status: 400 }
      );
    }

    // Update assignment status to INACTIVE
    const { data, error } = await supabase
      .from('assigned_mentor')
      .update({ 
        status: 'INACTIVE',
        updated_at: new Date().toISOString()
      })
      .eq('uuid', assignmentId)
      .select()
      .single();

    if (error) {
      console.error('Error unassigning mentor:', error.message);
      return NextResponse.json(
        { success: false, message: "Failed to unassign mentor" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        assignment: data,
        message: "Mentor unassigned successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in unassign mentor API:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
