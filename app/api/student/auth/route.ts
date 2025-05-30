"use server";

import { NextRequest, NextResponse } from 'next/server';
import { signUp, regStudent } from '@/models/studentModel';
import { Student } from '@/types/student.types';
import { genHash } from '@/utils/generateHash';

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, mobile_number, email, password, final_pass } = await req.json();
    console.log('Received data:', {
      first_name,
      last_name,
      mobile_number,
      email,
      password,
      final_pass,
    });
    // 1. Validate required fields
    if (!first_name || !last_name || !mobile_number || !email || !password || !final_pass) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // 2. Check password match
    if (password !== final_pass) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // 3. Hash password
    const hashedPassword = await genHash(password);

    // 4. Create student object
    const student: Student = {
      first_name,
      last_name,
      mobile_number,
      email,
      password: hashedPassword,
    };

    // 5. Sign up (e.g., with Supabase auth) and save in DB
    const result = await signUp(email, password);

    console.log('Sign up result:', result);

    const response = await regStudent(student);

    return NextResponse.json(
      {
        message: 'Student registered successfully',
        result,
        response,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in register POST:', error);
    
    // 6. Handle duplicate email error (e.g., from Supabase/Postgres)
    if (
        error instanceof Error && error.message.includes('duplicate key value violates unique constraint')) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // 7. Default error response
    return NextResponse.json(
      { message: 'Registration failed', error },
      { status: 500 }
    );
  }
}
