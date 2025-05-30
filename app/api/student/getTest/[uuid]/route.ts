// app/api/test/[uuid]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTest } from '@/models/testModel'; // adjust if your function is in another path
import { verifyToken } from "@/middleware/authMiddleware";
export async function GET(req: NextRequest) {
  
  console.log("Received GET request for test data", req);
  const auth = await verifyToken(req);
  if (!auth.valid || !auth.payload) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
  }

  try {
    const uuid = req.nextUrl.pathname.split('/').pop(); // Extract UUID from the URL
    console.log('Received UUID:', uuid); // Log the UUID for debugging
    if (!uuid) {
      return NextResponse.json({ message: 'UUID is required' }, { status: 400 });
    }

    const testData = await getTest(uuid);

    if (!testData) {
      return NextResponse.json({ message: 'Test not found or failed to fetch' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Test fetched successfully', data: testData }, { status: 200 });
  } catch (error) {
    console.error('Error in getTest route:', error);
    return NextResponse.json(
      { message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
