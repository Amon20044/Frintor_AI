
import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/database/db';
import { genHash } from '@/utils/generateHash';

export async function POST(req: NextRequest) {
  try {
    const { name, user_id, mobile_number, password } = await req.json();
    
    // Hash password
    const hashedPassword = await genHash(password);
    
    // Insert admin into database
    const { data, error } = await supabase
      .from('admins')
      .insert({
        name,
        user_id,
        mobile_number,
        password: hashedPassword
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ 
      message: 'Admin registered successfully', 
      data 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error registering admin:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(
      { message: 'Registration failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}
