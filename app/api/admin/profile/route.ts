
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/authMiddleware";
import { supabase } from "@/database/db";

export async function GET(req: NextRequest) {
  try {
    const tokenVerification = await verifyToken(req);
    if (!tokenVerification.valid) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { uuid } = tokenVerification.payload as { uuid: string };

    const { data: admin, error } = await supabase
      .from("admin")
      .select("uuid, name, user_id")
      .eq("uuid", uuid)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
