
import { NextRequest, NextResponse } from "next/server";
import { assignMentorToStudent } from "@/models/mentorModel";

export async function POST(req: NextRequest) {
  try {
    const { studentId, mentorId, meetingLink } = await req.json();

    if (!studentId || !mentorId) {
      return NextResponse.json(
        { success: false, message: "Student ID and Mentor ID are required" },
        { status: 400 }
      );
    }

    const result = await assignMentorToStudent(studentId, mentorId, meetingLink);
    
    return NextResponse.json(
      { 
        success: true, 
        assignment: result,
        message: "Mentor assigned successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error assigning mentor:', error);
    const message = error instanceof Error ? error.message : "Failed to assign mentor";
    
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
