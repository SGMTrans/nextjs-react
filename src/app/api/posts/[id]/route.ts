import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserIdFromToken } from "@/lib/auth";

const prisma = new PrismaClient();
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const postId = parseInt(params.id);

  // Mengambil post berdasarkan ID
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { user: true }, // jika perlu menginclude informasi user terkait
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, image } = await request.json();
  const post = await prisma.post.update({
    where: { id: parseInt(params.id) },
    data: { title, content, image },
  });
  return NextResponse.json({ post }, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.post.delete({ where: { id: parseInt(params.id) } });
  return NextResponse.json({ message: "Post deleted" }, { status: 200 });
}
