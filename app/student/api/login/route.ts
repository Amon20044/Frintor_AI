import { NextRequest, NextResponse } from 'next/server';
import { logStudent } from '@/models/studentModel';
import { jwt } from '@/utils/signJwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const student = await logStudent(email, password);
    if (!student) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await jwt({ uuid: student.uuid, email: student.email });

    return NextResponse.json({
      message: 'Student logged in successfully',
      token,
      response: student,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in student login:', error);
    return NextResponse.json(
      { message: 'Invalid credentials', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 401 }
    );
  }
}