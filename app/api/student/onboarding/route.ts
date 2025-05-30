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

    // Organize data into proper database structure
    const {
      // Personal fields that go directly to student table
      first_name,
      last_name,
      age,
      gender,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      email,
      mobile_number,
      category,
      lvl,
      interest,
      
      // Academic details for education jsonb
      tenth_percentage,
      twelfth_percentage,
      academic_background,
      subject,
      tenth_marksheet,
      twelfth_marksheet,
      other_certificate,
      neet_marksheet,
      
      // Metadata for studentMetadata jsonb
      permanent_address,
      current_address,
      father_name,
      mother_name,
      father_birth_date,
      mother_birth_date,
      father_contact,
      mother_contact,
      
      // Preferences for preferences jsonb
      preferences,
      career_goals,
      
      ...rest
    } = body;

    // Process interests into array
    const interestArray = interest ? interest.split(',').map((i: string) => i.trim()) : [];

    // Split interests into array
    const interestArray = interest ? interest.split(',').map(i => i.trim()) : [];

    // Organize data according to JSON structure
    const studentData = {
      uuid: studentIdFromToken,
      first_name,
      last_name,
      age,
      gender,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      email,
      mobile_number,
      category,
      lvl,
      interest: interestArray,
      education: {
        tenth_percentage,
        twelfth_percentage,
        academic_background,
        subject,
        tenth_marksheet,
        twelfth_marksheet,
        other_certificate,
        neet_marksheet,
        institute,
        branch,
        cgpa_cpi,
        graduation_year
      },
      studentMetadata: {
        permanent_address,
        current_address,
        full_parents_details: {
          father_name,
          mother_name,
          father_birth_date,
          mother_birth_date,
          father_contact,
          mother_contact
        },
        professional_experience: {
          company_name,
          job_title,
          experience_years,
          current_salary
        }
      },
      preferences: {
        preferences,
        career_goals
      }
    };

    const result = await onboardStudent(studentData);

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
