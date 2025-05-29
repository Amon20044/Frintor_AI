import { NextRequest, NextResponse } from 'next/server';
import { logStudent } from '@/models/studentModel';
import { jwt } from '@/utils/signJwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    const student = await logStudent(email, password);
    if (!student) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid credentials' 
        },
        { status: 401 }
      );
    }

    const token = await jwt({ uuid: student.uuid, email: student.email });

    // Ensure we return the complete student data
    return NextResponse.json({
      success: true,
      message: 'Student logged in successfully',
      token,
      student: {
        uuid: student.uuid,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        mobile_number: student.mobile_number,
        age: student.age,
        dateofbirth: student.dateofbirth,
        timeofbirth: student.timeofbirth,
        placeofbirth: student.placeofbirth,
        gender: student.gender,
        education: student.education,
        category: student.category,
        interest: student.interest,
        lvl: student.lvl,
        studentmetadata: student.studentmetadata,
        email_verified: student.email_verified,
        onboardingcompleted: student.onboardingcompleted,
        created_at: student.created_at,
        updated_at: student.updated_at
      }
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in student login:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Invalid credentials', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}