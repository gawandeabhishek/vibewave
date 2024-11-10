import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";


export type PlaylistProps = {
  playlistId: string;
  userId: string;
  imageUrl: string;
  title: string;
  artist: string;
  type: string;
  language: string;
  link: string;
  description: string;
  year: number;
};


export async function POST(req: Request) {
  try {
    const { playlistId } = await req.json();

    // Validate that playlistId is provided
    if (!playlistId) {
      return new NextResponse("playlistId is required", { status: 400 });
    }

    const res = await fetch(
      `${process.env.BASE_URL}/api/playlist/${playlistId}`
    );
    const result = await res.json();
    const raw = result.data.data;
    const clerkUser = await currentUser(); // Assuming you're getting this from Clerk or another service
    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUser?.id, // Assuming you're getting this from Clerk or another service
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!raw) {
      return new NextResponse("No data found", { status: 404 });
    }

    // Check if the playlist already exists in the database using the playlistId
    let playlist = await db.playlist.findUnique({
      where: { playlistId: raw.id }, // Assuming 'id' is the unique identifier
    });

    // If playlist doesn't exist, create a new one
    if (!playlist) {
      const playlistData: PlaylistProps = {
        playlistId: raw.id, // Playlist ID
        title: raw.name, // Playlist name
        year: raw.year ?? null, // Year of the playlist (set to null if missing)
        type: raw.type, // Type of playlist
        link: `/${raw.type}/${raw.id}`, // Playlist link
        userId: user.id, // Link to the authenticated user
        description: raw.description || undefined, // Playlist description (empty string if missing)
        imageUrl: raw.image[raw.image.length - 1]?.url, // Image URL (empty string if missing)
        artist: "", // Default artist field (empty string)
        language: raw.language,
      };

      // Add artist if it exists, otherwise keep it as an empty string
      if (raw.artists) {
        playlistData.artist = raw.artists
          .map((singer: { name: string }) => singer.name)
          .join(", ");
      }

      // Create the playlist with the dynamically constructed data
      playlist = await db.playlist.create({
        data: playlistData,
      });
    }

    // Return the playlist (either created or found)
    return NextResponse.json(playlist);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create or fetch playlist", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const playlistId = searchParams.get("playlistId");

    if (!playlistId) {
      return new NextResponse("Playlist ID is required", { status: 400 });
    }

    const res = await fetch(
      `${process.env.BASE_URL}/api/playlist/${playlistId}`
    );
    const result = await res.json();
    const raw = result.data.data;
    const clerkUser = await currentUser(); // Assuming you're getting this from Clerk or another service
    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUser?.id, // Assuming you're getting this from Clerk or another service
      },
    });

    if (!user) {
      return new NextResponse("User  not authenticated", { status: 403 });
    }

    if (!raw) {
      return new NextResponse("No data found", { status: 404 });
    }

    const playlistExists = await db.playlist.findFirst({
      where: {
        playlistId: playlistId, // The playlist ID from the URL query
        userId: user.id, // The user ID from the authenticated user
      },
    });

    return NextResponse.json({ exist: !!playlistExists });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create or fetch playlist", {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { playlistId } = await req.json();

    // Validate that playlistId is provided
    if (!playlistId) {
      return new NextResponse("playlistId is required", { status: 400 });
    }

    const clerkUser = await currentUser(); // Get the authenticated user from Clerk
    if (!clerkUser) {
      return new NextResponse("User not authenticated", { status: 403 });
    }

    // Find the user associated with the authenticated Clerk user
    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id, // Match the Clerk ID to the user in the database
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if the playlist is saved by the authenticated user
    const playlist = await db.playlist.findFirst({
      where: {
        playlistId: playlistId, // The playlist ID from the request
        userId: user.id, // Ensure this is the playlist saved by the current user
      },
    });

    if (!playlist) {
      return new NextResponse("Playlist not found in your saved playlists", { status: 404 });
    }

    // Unlink the playlist from the user by setting userId to null (only for this user)
    await db.playlist.update({
      where: { id: playlist.id }, // Find the playlist to unlink
      data: {
        userId: null, // Unlink this playlist from the user
      },
    });

    return new NextResponse("Playlist unsaved successfully", { status: 200 });
  } catch (error) {
    console.error("Error unsaving playlist:", error);
    return new NextResponse("Failed to unsave playlist", { status: 500 });
  }
}
