
import { NextRequest, NextResponse } from 'next/server';
import { allowStudentToViewResults } from '@/models/testModel';

export async function POST(req: NextRequest) {
  try {
    const { studentId, mentorId } = await req.json();

    if (!studentId || !mentorId) {
      return NextResponse.json(
        { message: 'Student ID and Mentor ID are required' },
        { status: 400 }
      );
    }

    const success = await allowStudentToViewResults(studentId, mentorId);
    
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to update permissions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Student can now view test results'
    }, { status: 200 });
  } catch (error) {
    console.error('Error allowing result view:', error);
    return NextResponse.json(
      { message: 'Failed to update permissions', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
