import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // Adjust based on your Prisma setup
import { currentUser } from "@clerk/nextjs/server"; // Ensure you have this installed

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  // Check if the user is authenticated
  if (!clerkUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the user in the database using clerkId
  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      likedSongs: true, // Include liked songs
      myPlaylists: true, // Include user's playlists
    },
  });

  // Check if user exists
  if (!user) {
    return NextResponse.json({ error: "User  not found" }, { status: 404 });
  }

  // Parse the request body
  const { type, playlistId } = await req.json();

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }

  try {
    if (type === "songs") {
      // Check if there are liked songs
      const likedSongs = user.likedSongs;
    
      if (!likedSongs || likedSongs.length === 0) {
        return NextResponse.json({ error: "No liked songs found" }, { status: 404 });
      }
    
      // Use the first liked song's ID as currentSongId
      const currentSongId = likedSongs[0].songId; // Assuming likedSongs is an array of objects with songId
    
      // Step 3: Check if currentSongId is already in use
      const existingUser  = await db.user.findUnique({
        where: { currentSongId },
      });
    
      if (existingUser  && existingUser .clerkId !== clerkUser .id) {
        // Clear the existing user's currentSongId
        await db.user.update({
          where: { id: existingUser .id },
          data: { currentSongId: null }, // Or set to another value if needed
        });
      }
    
      // Update the user's queuedSongs and currentSongId
      await db.user.update({
        where: { clerkId: clerkUser .id },
        data: {
          queuedSongs: {
            set: likedSongs.map((song) => ({ id: song.id })), // Replace queued songs with liked songs
          },
          currentSongId: currentSongId,
        },
      });
    
      return NextResponse.json({
        message: "Queued songs updated successfully",
      });
    } else if (type === "playlists") {
      if (!playlistId) {
        return NextResponse.json(
          { error: "Playlist ID is required for updating playlists" },
          { status: 400 }
        );
      }

      // Find the playlist by ID
      const res = await fetch(
        `${process.env.BASE_URL}/api/playlist/${playlistId}`
      );
      const playlist = await res.json();

      // Check if the playlist exists
      if (!playlist) {
        return NextResponse.json(
          { error: "Playlist not found" },
          { status: 404 }
        );
      }

      const songs = playlist.data.data.songs; // Array of songs from the playlist

      // Step 1: Upsert all songs into the database
      for (const song of songs) {
        await db.song.upsert({
          where: { songId: song.id },
          update: {}, // Add logic to update song properties if needed
          create: {
            songId: song.id, // External song ID
          },
        });
      }

      // Step 2: Retrieve the UUIDs of the songs from the database
      const songUUIDs = await db.song.findMany({
        where: {
          songId: { in: songs.map((song: Song) => song.id) },
        },
        select: { id: true },
      });

      const currentSongId = songs[0].id; // Use the first song in the playlist as currentSongId

      // Step 3: Check if currentSongId is already in use
      const existingUser = await db.user.findUnique({
        where: { currentSongId },
      });

      if (existingUser && existingUser.clerkId !== clerkUser.id) {
        // Clear the existing user's currentSongId
        await db.user.update({
          where: { id: existingUser.id },
          data: { currentSongId: null }, // Or set to another value if needed
        });
      }

      // Step 4: Update user's queuedSongs and currentSongId
      if (songUUIDs.length > 0) {
        await db.user.update({
          where: { clerkId: clerkUser.id },
          data: {
            queuedSongs: {
              set: songUUIDs.map((song) => ({ id: song.id })), // Set all queued songs
            },
            currentSongId: currentSongId,
          },
        });
      } else {
        throw Error(
          "No songs found in the database for the provided playlist."
        );
      }

      return NextResponse.json({
        message: "Queued songs updated with playlist successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid type specified" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while updating queued items" },
      { status: 500 }
    );
  }
}
