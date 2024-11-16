// src/app/api/get-liked-songs/route.ts

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (): Promise<Response> => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Retrieve user from the database using the Clerk user ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: {
        likedSongs: {
          select: {
            id: true,   // ID of the liked song
            songId: true, // Song ID (or any other relevant fields like title)
            // Add other song fields like title, artist if needed
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return liked songs, or empty array if no liked songs
    return NextResponse.json(user.likedSongs || []);
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
