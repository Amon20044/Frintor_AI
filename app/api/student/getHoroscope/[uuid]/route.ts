// app/api/test/[uuid]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getHoroscope } from '@/models/horoscopeModel'; // adjust if your function is in another path
import { verifyToken } from "@/middleware/authMiddleware";
export async function GET(req: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    console.log("Received request for horoscope with UUID:", params.uuid);

    const { data: horoscope, error } = await supabase
      .from("ai_horoscope")
      .select("*")
      .eq("student_id", params.uuid)
      .single();

    if (error) {
      console.error("Error fetching horoscope:", error.message);
      return NextResponse.json(
        { success: false, message: "Horoscope not found" },
        { status: 404 }
      );
    }

    // Check if horoscope is verified by mentor
    if (!horoscope.verfied) {
      return NextResponse.json(
        { success: false, message: "Horoscope pending mentor verification" },
        { status: 403 }
      );
    }

    console.log("Verified horoscope data fetched:", horoscope);

    return NextResponse.json(
      { success: true, data: { horoscope: [horoscope] } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}