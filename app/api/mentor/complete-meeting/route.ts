
import { NextRequest, NextResponse } from 'next/server';
import { updateMeetingStatus } from '@/models/mentorModel';

export async function POST(req: NextRequest) {
  try {
    const { assignmentId } = await req.json();

    if (!assignmentId) {
      return NextResponse.json(
        { message: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    const result = await updateMeetingStatus(assignmentId, 'COMPLETED');
    
    return NextResponse.json({
      message: 'Meeting marked as completed',
      data: result
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating meeting status:', error);
    return NextResponse.json(
      { message: 'Failed to update meeting status', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
