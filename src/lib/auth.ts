import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function getUserIdFromToken(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, "your-secret-key") as { userId: number };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
