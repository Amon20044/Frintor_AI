
import { NextRequest, NextResponse } from 'next/server';
import { getMentorByEmail } from '@/models/mentorModel';
import { verifyPassword } from '@/utils/generateHash';
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

    const mentor = await getMentorByEmail(email);
    if (!mentor) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, mentor.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await jwt({ uuid: mentor.uuid, email: mentor.email });

    return NextResponse.json({
      message: 'Mentor logged in successfully',
      token,
      response: mentor,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in mentor login:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
