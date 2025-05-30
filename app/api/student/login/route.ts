import { NextRequest, NextResponse } from "next/server";
import { logStudent } from "@/models/studentModel";
import { jwt } from "@/utils/signJwt";

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request for student login");
    const { email, password } = await req.json();
    console.log("Received login request:", { email, password });
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }

    const student = await logStudent(email, password);
    console.log("student adat:", student);
    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    const token = await jwt({ uuid: student.uuid, email: student.email });

    // Ensure we return the complete student data
    return NextResponse.json(
      {
        success: true,
        message: "Student logged in successfully",
        token,
        student,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error in student login:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
