
import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUserId } from '@/models/adminModel';
import { jwt } from '@/utils/signJwt';
import * as argon2 from 'argon2';

export async function POST(req: NextRequest) {
  try {
    const { user_id, password } = await req.json();

    if (!user_id || !password) {
      return NextResponse.json(
        { message: 'User ID and password are required' },
        { status: 400 }
      );
    }

    const admin = await getAdminByUserId(user_id);
    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await argon2.verify(admin.password, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await jwt({ uuid: admin.uuid, user_id: admin.user_id });

    return NextResponse.json({
      message: 'Admin logged in successfully',
      token,
      response: admin,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      { message: 'Invalid credentials', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 401 }
    );
  }
}
