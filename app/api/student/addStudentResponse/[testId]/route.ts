import { NextRequest, NextResponse } from "next/server";
import { setTestResult } from "@/models/testModel"; 
import { TestResult } from "@/types/testResult.types";
import { verifyToken } from "@/middleware/authMiddleware";

export async function POST(req: NextRequest) {
    
  const testId = req.nextUrl.pathname.split('/').pop(); // Extract testID from the URL
  const body = await req.json();
    const auth = await verifyToken(req);
      if (!auth.valid || !auth.payload) {
        return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
      }
    
      const studentIdFromToken = auth.payload.uuid;
  if (!testId) {
    return NextResponse.json({ error: "Missing testId in query params" }, { status: 400 });
  }

  if (!body || !body.test_id) {
    return NextResponse.json({ error: "Missing required test result data" }, { status: 400 });
  }

  try {
    const testResult: Partial<TestResult> = {
        test_id: testId,
      ...body,
    };

    const inserted = await setTestResult(testResult);

    if (!inserted) {
      return NextResponse.json({ error: "Failed to insert test result" }, { status: 500 });
    }
    const endpoint = `https://frintor-ai-487976053532.asia-south1.run.app/horoscope/${studentIdFromToken}`;
    fetch(endpoint, {
      method: "POST",
    }).then(() => {
      console.log(`✅ Background task started for ${studentIdFromToken}`);
    }).catch((err) => {
      console.error(`❌ Failed to trigger background task:`, err);
    });
    return NextResponse.json({ success: true, data: inserted });
  } catch (error) {
    console.error("POST /api/test/submit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
