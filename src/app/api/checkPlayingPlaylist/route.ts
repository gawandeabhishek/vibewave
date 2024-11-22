import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust based on your Prisma setup
import { currentUser  } from "@clerk/nextjs/server"; // Ensure you have this installed

export async function GET(req: Request) {
  const clerkUser  = await currentUser ();

  // Check if the user is authenticated
  if (!clerkUser ?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract the playlistId from the query parameters
  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get("playlistId"); // Correctly get playlistId from query parameters

  // Check if playlistId is provided
  if (!playlistId) {
    return NextResponse.json({ error: "playlistId is required" }, { status: 400 });
  }

  // Find the user in the database using clerkId
  const user = await db.user.findUnique({
    where: { clerkId: clerkUser .id },
    select: {
      queuedSongs: {
        select: { songId: true }, // Get queued song IDs
      },
    },
  });

  // Check if user exists
  if (!user) {
    return NextResponse.json({ error: "User  not found" }, { status: 404 });
  }

  // Fetch the playlist by ID
  const res = await fetch(`${process.env.BASE_URL}/api/playlist/${playlistId}`);
  const playlist = await res.json();

  // Check if the playlist exists
  if (!playlist || !playlist.data || !playlist.data.data) {
    return NextResponse.json(
      { error: "Playlist not found" },
      { status: 404 }
    );
  }

  const songs = playlist.data.data.songs; // Array of songs from the playlist

  // Get the song IDs from the user's queued songs and the specified playlist
  const queuedSongIds = user.queuedSongs.map(song => song.songId);
  const playlistSongIds = songs.map((song: Song) => song.id); // Assuming each song has an 'id' field

  // Debugging logs
  console.log("Queued Song IDs:", queuedSongIds);
  console.log("Playlist Song IDs:", playlistSongIds);

  // Check if the playlist's songs are in the user's queued songs
  const isPlayingPlaylist = playlistSongIds.every((songId: string) => queuedSongIds.includes(songId));

  return NextResponse.json({ isPlayingPlaylist });
}