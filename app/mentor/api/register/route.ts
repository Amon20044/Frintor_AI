
import { NextRequest, NextResponse } from 'next/server';
import { createMentor } from '@/models/mentorModel';
import { genHash } from '@/utils/generateHash';

export async function POST(req: NextRequest) {
  try {
    const { mentor_name, email, mobile_number, password } = await req.json();

    // Validate required fields
    if (!mentor_name || !email || !mobile_number || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await genHash(password);

    // Create mentor object
    const mentorData = {
      mentor_name,
      email,
      mobile_number,
      password: hashedPassword,
      metadata: {},
      preferences_settings: {},
    };

    // Register mentor
    const response = await createMentor(mentorData);

    return NextResponse.json(
      {
        message: 'Mentor registered successfully',
        response,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in mentor register:', error);

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
