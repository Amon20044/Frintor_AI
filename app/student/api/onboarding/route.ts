// app/api/student/onboarding/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/authMiddleware";
import { onboardStudent } from "@/models/studentModel";
import { Student } from "@/types/student.types";

export async function POST(req: NextRequest) {
  console.log("Onboarding request received");

  const auth = await verifyToken(req);
  if (!auth.valid || !auth.payload) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  }

  const studentIdFromToken = auth.payload.uuid;

  try {
    const body = await req.json();

    if (body.uuid && body.uuid !== studentIdFromToken) {
      return NextResponse.json({ error: "UUID in body does not match token" }, { status: 403 });
    }

    const student: Student = {
      ...body,
      uuid: studentIdFromToken,
    };

    const result = await onboardStudent(student);

    // 🔥 Non-blocking background task
    const endpoint = `https://frintor-ai-487976053532.asia-south1.run.app/test/${studentIdFromToken}`;
    fetch(endpoint, {
      method: "POST",
    }).then(() => {
      console.log(`✅ Background task started for ${studentIdFromToken}`);
    }).catch((err) => {
      console.error(`❌ Failed to trigger background task:`, err);
    });

    // ✅ Immediate response to client
    return NextResponse.json({
      message: "Student onboarded successfully",
      data: result,
    }, { status: 200 });


  } catch (err: any) { // eslint-disable-line
    console.error("Onboarding Error:", err);
    return NextResponse.json({ error: "Server Error", details: err.message }, { status: 500 });
  }
}
