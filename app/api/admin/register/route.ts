
import { NextRequest, NextResponse } from 'next/server';
import { createAdmin } from '@/models/adminModel';
import { genHash } from '@/utils/generateHash';

export async function POST(req: NextRequest) {
  try {
    const { name, user_id, mobile_number, password } = await req.json();

    // Validate required fields
    if (!name || !user_id || !password) {
      return NextResponse.json(
        { message: 'Name, user ID, and password are required' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await genHash(password);

    // Create admin object
    const adminData = {
      name,
      user_id,
      mobile_number,
      password: hashedPassword,
    };

    // Register admin
    const response = await createAdmin(adminData);

    return NextResponse.json(
      {
        message: 'Admin registered successfully',
        response,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in admin register:', error);

    // Handle Supabase duplicate user_id error
    if (
      error.code === '23505' ||
      (error.message && error.message.includes('duplicate key value violates unique constraint'))
    ) {
      return NextResponse.json(
        { message: 'User ID already registered' },
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
