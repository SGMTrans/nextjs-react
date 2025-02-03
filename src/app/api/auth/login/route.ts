import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { error } from "console";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }

  const token = jwt.sign({ userId: user.id }, "your-secret-key", {
    expiresIn: "1h",
  });
  return NextResponse.json({ token }, { status: 200 });
}
