
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { getStudentTestStatus } from '@/models/testModel';

export async function GET(req: NextRequest ) {
  const studentId = req.nextUrl.pathname.split('/').pop(); // Extract UUID from the URL
  console.log('Fetching test status for studentId:', studentId);
  try {
    if (!studentId) {
      return NextResponse.json(
        { message: 'Student ID is required' },
        { status: 400 }
      );
    }

    const test = await getStudentTestStatus(studentId);
    
    return NextResponse.json({
      message: 'Test status fetched successfully',
      test
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching test status:', error);
    return NextResponse.json(
      { message: 'Failed to fetch test status', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
