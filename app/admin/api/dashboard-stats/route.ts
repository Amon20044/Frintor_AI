
import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/models/adminModel';

export async function GET(req: NextRequest) {
  try {
    const stats = await getDashboardStats();
    
    return NextResponse.json({
      message: 'Dashboard stats fetched successfully',
      stats
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard stats', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
