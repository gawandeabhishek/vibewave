import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust based on your Prisma setup
import { currentUser  } from "@clerk/nextjs/server"; // Ensure you have this installed

export async function GET() {
  const clerkUser  = await currentUser ();

  // Check if the user is authenticated
  if (!clerkUser ?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the user in the database using clerkId
  const user = await db.user.findUnique({
    where: { clerkId: clerkUser .id },
    select: {
      currentSongId: true,
      likedSongs: {
        select: { id: true, songId: true }, // Assuming likedSongs has songId
      },
    },
  });

  // Check if user exists
  if (!user) {
    return NextResponse.json({ error: "User  not found" }, { status: 404 });
  }

  // Check if currentSongId is in likedSongs
  const isPlayingLikedSongs = user.likedSongs.some(song => song.songId === user.currentSongId);

  return NextResponse.json({ isPlayingLikedSongs });
}