
import { NextRequest, NextResponse } from 'next/server';
import { allowStudentToViewResults } from '@/models/testModel';
import { getStudentMentor } from '@/models/mentorModel';

export async function POST(req: NextRequest) {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { message: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Get the student's mentor
    const mentorAssignment = await getStudentMentor(studentId);
    
    if (!mentorAssignment) {
      return NextResponse.json(
        { message: 'Student does not have an assigned mentor' },
        { status: 404 }
      );
    }

    const success = await allowStudentToViewResults(studentId, mentorAssignment.mentor_id);
    
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
