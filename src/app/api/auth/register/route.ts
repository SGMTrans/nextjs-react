import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user ke database
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      { message: "User created", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
