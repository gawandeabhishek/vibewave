import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const songId = searchParams.get("songId");

  if (!songId) {
    return NextResponse.json(
      { error: "Missing songId in query" },
      { status: 400 }
    );
  }

  try {
    const likeCount = await db.user.count({
      where: {
        likedSongs: {
          some: {
            songId,
          },
        },
      },
    });

    return NextResponse.json({ songId, likes: likeCount });
  } catch (error) {
    console.error("Error counting likes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
