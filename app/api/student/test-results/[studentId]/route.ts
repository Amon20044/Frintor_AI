
import { NextRequest, NextResponse } from 'next/server';
import { getTestWithResults, canStudentViewResults } from '@/models/testModel';

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.pathname.split('/').pop(); // Extract UUID from the URL
  
  try {
    if (!studentId) {
      return NextResponse.json(
        { message: 'Student ID is required' },
        { status: 400 }
      );
    }

    const testWithResults = await getTestWithResults(studentId);
    
    if (!testWithResults || !testWithResults.test_results || testWithResults.test_results.length === 0) {
      return NextResponse.json(
        { message: 'No results found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Test results fetched successfully',
      results: testWithResults.test_results[0]
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { message: 'Failed to fetch test results', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
