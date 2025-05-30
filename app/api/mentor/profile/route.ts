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

    const { data: mentor, error } = await supabase
      .from("mentor")
      .select("uuid, mentor_name, email")
      .eq("uuid", uuid)
      .single();

    if (error || !mentor) {
      return NextResponse.json(
        { success: false, message: "Mentor not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      mentor,
    });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
