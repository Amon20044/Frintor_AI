"use server"

import * as jose from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET!);
const alg = 'HS256';

// Object type: safer to use Record<string, any>
export const jwt = async (payload: jose.JWTPayload) => {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg, payload })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
};
