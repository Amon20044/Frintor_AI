
import { NextRequest, NextResponse } from 'next/server';
import { canStudentViewResults } from '@/models/testModel';

export async function GET(req: NextRequest) {
  try {
    const studentId = req.nextUrl.pathname.split('/').pop(); // Extract UUID from the URL
  
    if (!studentId) {
      return NextResponse.json(
        { message: 'Student ID is required' },
        { status: 400 }
      );
    }

    const canView = await canStudentViewResults(studentId);
    
    return NextResponse.json({
      message: 'Access check completed',
      canView
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking result access:', error);
    return NextResponse.json(
      { message: 'Failed to check result access', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
