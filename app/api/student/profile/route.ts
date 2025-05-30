import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/authMiddleware";
import supabase from "@/database/db";

export async function GET(req: NextRequest) {
  try {
    const tokenVerification = await verifyToken(req);
    if (!tokenVerification.valid) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const { uuid } = tokenVerification.payload as { uuid: string };

    const { data: student, error } = await supabase
      .from("students")
      .select("uuid, first_name, last_name, email, lvl, onboardingcompleted")
      .eq("uuid", uuid)
      .single();

    if (error || !student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
