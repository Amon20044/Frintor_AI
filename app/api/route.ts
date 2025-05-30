import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    console.log('Received POST request with name:', name);

    return NextResponse.json({ name }, { status: 200 });
  } catch (error) {
    console.error('Error in route:', error);
    return NextResponse.json(
      {
        message: 'Invalid credentials',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 401 }
    );
  }
}
