
import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUserId } from '@/models/adminModel';
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

    const admin = await getAdminByUserId(email);
    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await jwt({ uuid: admin.uuid, email: admin.user_id });

    return NextResponse.json({
      message: 'Admin logged in successfully',
      token,
      response: admin,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
