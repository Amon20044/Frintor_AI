
import { NextRequest, NextResponse } from 'next/server';
import { getMentorStudents } from '@/models/mentorModel';

export async function GET(req: NextRequest, { params }: { params: { mentorId: string } }) {
  try {
    const { mentorId } = params;
    
    if (!mentorId) {
      return NextResponse.json(
        { message: 'Mentor ID is required' },
        { status: 400 }
      );
    }

    const students = await getMentorStudents(mentorId);
    
    return NextResponse.json({
      message: 'Students fetched successfully',
      students
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching mentor students:', error);
    return NextResponse.json(
      { message: 'Failed to fetch students', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
