
import { NextRequest, NextResponse } from 'next/server';
import { getStudentCompleteProfile } from '@/models/optimizedQueries';

export async function GET(req: NextRequest) {
  try {
    const studentId = req.nextUrl.pathname.split('/').pop();
    
    if (!studentId) {
      return NextResponse.json(
        { message: 'Student ID is required' },
        { status: 400 }
      );
    }

    const student = await getStudentCompleteProfile(studentId);
    
    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if student has completed test and horoscope
    const hasCompletedTest = student.tests?.some(test => test.status === 'COMPLETED');
    const hasHoroscope = student.ai_horoscope && student.ai_horoscope.length > 0;

    if (!hasCompletedTest || !hasHoroscope) {
      return NextResponse.json(
        { 
          message: 'Student must complete psychometric test and horoscope generation first',
          hasCompletedTest,
          hasHoroscope
        },
        { status: 400 }
      );
    }

    // Generate career recommendations based on test results and horoscope
    const testResults = student.tests?.find(test => test.status === 'COMPLETED')?.test_results?.[0];
    const horoscope = student.ai_horoscope[0];

    const recommendations = {
      primary_careers: [],
      secondary_careers: [],
      suggested_colleges: [],
      skills_to_develop: [],
      recommended_courses: []
    };

    return NextResponse.json({
      student_id: studentId,
      recommendations,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating career recommendations:', error);
    return NextResponse.json(
      { message: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
