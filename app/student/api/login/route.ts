"use server"

import { NextRequest, NextResponse } from 'next/server';
import { logStudent } from '@/models/studentModel';
import { jwt } from '@/utils/signJwt';

async function loginStudent(email: string, password: string) {
  try {
    const response = await logStudent(email, password);
    if (!response) {
      throw new Error('Invalid credentials');
    }
    const token = await jwt({ uuid: response.uuid, email: response.email });
   console.log({...response})
    return {
      message: 'Student logged in successfully',
      token,
      response,
    };
  } catch (error) {
    throw error; // Let the caller handle the error
  }
}

export async function POST(req: NextRequest) {
  try {

    console.log('Logging in--------- student with email:', req);
    const { email, password } = await req.json();
    const result = await loginStudent(email, password);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in route:', error);
    return NextResponse.json(
      { message: 'Invalid credentials', error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 401 }
    );
  }
}