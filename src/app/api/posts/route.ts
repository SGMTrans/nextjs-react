import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserIdFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    include: { user: true },
  });
  return NextResponse.json({ posts }, { status: 200 });
}

export async function POST(request: Request) {
  const userId = getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, image } = await request.json();
  const post = await prisma.post.create({
    data: {
      title,
      content,
      image,
      userId,
    },
  });
  return NextResponse.json({ post }, { status: 201 });
}
