// src/app/api/saved-playlists/[id]/route.ts
import { db } from "@/lib/prisma";
import { currentUser  } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const clerkUser  = await currentUser ();

  if (!clerkUser ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const user = await db.user.findUnique({
      where: { clerkId: clerkUser .id },
      include: { myPlaylists: true }, // Assuming you have a relation for saved playlists
    });

    if (!user) {
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    const isSaved = user.myPlaylists.some((playlist) => playlist.playlistId === id);

    return NextResponse.json({ isSaved }, { status: 200 });
  } catch (error) {
    console.error("Error checking saved status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};