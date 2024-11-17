import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface LikeSongRequest {
  songId: string;
}

export const POST = async (req: Request): Promise<Response> => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: LikeSongRequest = await req.json();
    const { songId } = body;

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
        });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let song = await db.song.findUnique({
      where: { songId },
    });

    if (!song) {
      song = await db.song.create({
        data: {
          songId,
        },
      });
    }

    await db.user.update({
      where: { clerkId: clerkUser.id },
      data: {
        likedSongs: {
          connect: { id: song.id },
        },
      },
    });

    return NextResponse.json(
      { message: "Song liked successfully" },
      { status: 200 }
    );
      } catch (error) {
    console.error("Error liking song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request): Promise<Response> => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: LikeSongRequest = await req.json();
    const { songId } = body;

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
      });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const song = await db.song.findUnique({
      where: { songId },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    await db.user.update({
      where: { clerkId: clerkUser.id },
      data: {
        likedSongs: {
          disconnect: { id: song.id },
        },
      },
    });

    return NextResponse.json(
      { message: "Song unliked successfully" },
      { status: 200 }
    );
    } catch (error) {
    console.error("Error unliking song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
  );
  }
};
