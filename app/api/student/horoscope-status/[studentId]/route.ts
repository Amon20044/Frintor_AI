
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/database/db";

export async function GET(
  req: NextRequest,
) {
  try {
    const studentId = req.nextUrl.pathname.split('/').pop(); // Extract UUID from the URL
    
    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID is required" },
        { status: 400 }
      );
    }

    // Check if horoscope exists and verification status
    const { data: horoscope, error } = await supabase
      .from('ai_horoscope')
      .select('uuid, verfied')
      .eq('student_id', studentId)
      .single();

    if (error) {
      console.log('No horoscope found:', error.message);
      return NextResponse.json(
        { 
          success: true, 
          status: { exists: false, verified: false } 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        status: { 
          exists: true, 
          verified: horoscope.verfied || false 
        } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching horoscope status:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
