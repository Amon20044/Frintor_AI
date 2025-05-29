// lib/middleware/verifyToken.ts
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export async function verifyToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let token: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return { valid: false, error: "Token missing" };
    }

    const secret = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    console.log("Token payload:", payload); // Log the payload for debugging
    console.log("body:", req.body); // Log the request body for debugging
    return { valid: true, payload };
  } catch (error) {
  if (error instanceof Error) {
    return { valid: false, error: error.message };
  } else {
    return { valid: false, error: "Unknown error occurred" };
  }
}

}
