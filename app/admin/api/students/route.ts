
import { NextRequest, NextResponse } from 'next/server';
import { getAllStudentsForAdmin } from '@/models/adminModel';

export async function GET(req: NextRequest) {
  try {
    const students = await getAllStudentsForAdmin();
    
    return NextResponse.json({
      message: 'Students fetched successfully',
      students
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { message: 'Failed to fetch students', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
