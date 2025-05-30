
import { NextRequest, NextResponse } from "next/server";
import { getAllMentors } from "@/models/mentorModel";

export async function GET(req: NextRequest) {
  try {
    // Add authentication check here if needed
    const mentors = await getAllMentors();
    
    return NextResponse.json(
      { success: true, mentors },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch mentors" },
      { status: 500 }
    );
  }
}
