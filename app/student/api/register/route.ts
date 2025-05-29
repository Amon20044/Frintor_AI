import { NextRequest, NextResponse } from 'next/server';
import { regStudent } from '@/models/studentModel';
import { genHash } from '@/utils/generateHash';
import { Student } from '@/types/student.types';

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, mobile_number, email, password, final_pass } = await req.json();

    // Validate required fields
    if (!first_name || !last_name || !mobile_number || !email || !password || !final_pass) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== final_pass) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await genHash(password);

    // Create student object
    const student: Student = {
      first_name,
      last_name,
      mobile_number,
      email,
      password: hashedPassword,
    };

    // Register student
    const response = await regStudent(student);

    return NextResponse.json(
      {
        message: 'Student registered successfully',
        response,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in register POST:', error);

    // Handle Supabase duplicate email error
    if (
      error.code === '23505' ||
      (error.message && error.message.includes('duplicate key value violates unique constraint'))
    ) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Generic error for other cases
    return NextResponse.json(
      { message: 'Registration failed', error: error.message },
      { status: 500 }
    );
  }
}