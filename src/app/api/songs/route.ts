import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const API_URL = process.env.API_URL; // Ensure this is set in your `.env` file

// GET: Fetch the index of the current song in queuedSongs
export async function GET() {
  const clerkUser = await currentUser();

  if (!clerkUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { queuedSongs: true },
  });


  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const currentIndex = user.queuedSongs.findIndex(
    (song) => song.songId === user.currentSongId
  );

  return NextResponse.json({ currentIndex, id: user.currentSongId, songs: user.queuedSongs });
}

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing song ID in request body" },
        { status: 400 }
      );
    }


    const raw = await fetch(`${API_URL}/api/songs/${id}/suggestions`);
    const temp = await raw.json();
    const data = temp.data[Math.floor(Math.random() * (temp.data.length))];
    id = data.id;

    // Check if the song already exists in the database
    let song = await db.song.findUnique({
      where: { songId: id },
    });

    if (!song) {
      // If the song doesn't exist, fetch details from the external API
      const url = `${API_URL}/api/songs/${id}`;
      const externalResponse = await fetch(url, { method: "GET" });

      if (!externalResponse.ok) {
        return NextResponse.json(
          {
            error: "External API error",
            details: await externalResponse.text(),
          },
          { status: externalResponse.status }
        );
      }

      let songData = await externalResponse.json();
      songData = songData.data[0]

      if (!songData || !songData.id) {
        return NextResponse.json(
          { error: "Song data invalid or not found" },
          { status: 404 }
        );
      }

      // Create the song in the database
      song = await db.song.create({
        data: {
          songId: songData.id,
        },
      });
    }


    // Add the song to the user's queuedSongs
    await db.user.update({
      where: { id: user.id },
      data: {
        queuedSongs: {
          connect: { id: song.id },
        },
      },
    });

    return NextResponse.json({
      message: "Song added to queue successfully",
      data,
    });
  } catch (error) {
    console.error("Error processing song addition:", error);
    return NextResponse.json(
      { error: "Failed to process song addition", details: error },
      { status: 500 }
    );
  }
}
