import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export type PlaylistProps = {
  playlistId: string;
  imageUrl: string;
  title: string;
  artist: string;
  type: string;
  language: string;
  link: string;
  description: string;
  year: number | null; // Make year nullable if it can be null
  users?: {
    connect: {
      id: string;
    }[];
  };
};

export async function POST(req: Request) {
  try {
    const { playlistId } = await req.json();

    if (!playlistId) {
      return new NextResponse("playlistId is required", { status: 400 });
    }

    const res = await fetch(
      `${process.env.BASE_URL}/api/playlist/${playlistId}`
    );
    const result = await res.json();
    const raw = result.data.data;
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return new NextResponse("User not authenticated", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser?.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!raw) {
      return new NextResponse("No data found", { status: 404 });
    }

    // Check if playlist exists in the database
    let playlist = await db.playlist.findUnique({
      where: { playlistId: raw.id },
    });

    // If playlist doesn't exist, create a new one
    if (!playlist) {
      const playlistData: PlaylistProps = {
        playlistId: raw.id,
        title: raw.name,
        year: raw.year ?? null,
        type: raw.type,
        link: `/${raw.type}/${raw.id}`,
        description: raw.description || undefined,
        imageUrl: raw.image[raw.image.length - 1]?.url,
        artist: "",
        language: raw.language,
        users: {
          connect: [{ id: user.id }], // Connect the user here during creation
        },
      };

      if (raw.artists) {
        playlistData.artist = raw.artists
          .map((singer: { name: string }) => singer.name)
          .join(", ");
      }

      // Create playlist with the connected user
      playlist = await db.playlist.create({
        data: playlistData,
      });
    }
    playlist = await db.playlist.update({
      where: { id: playlist.id },
      data: {
        users: {
          connect: { id: user.id }, // Connect the user here
        },
      },
    });

    return NextResponse.json(playlist);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create or fetch playlist", {
      status: 500,
    });
  }
}

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const playlistId = searchParams.get("playlistId");

//     if (!playlistId) {
//       return new NextResponse("Playlist ID is required", { status: 400 });
//     }

//     const res = await fetch(
//       `${process.env.BASE_URL}/api/playlist/${playlistId}`
//     );
//     const result = await res.json();
//     const raw = result.data.data;
//     const clerkUser = await currentUser(); // Assuming you're getting this from Clerk or another service

//     if (!clerkUser || !clerkUser.id) {
//       return new NextResponse("User not authenticated", { status: 401 });
//     }
    
//     const user = await db.user.findUnique({
//       where: {
//         clerkId: clerkUser?.id, // Assuming you're getting this from Clerk or another service
//       },
//     });

//     if (!user) {
//       return new NextResponse("User not authenticated", { status: 403 });
//     }

//     if (!raw) {
//       return new NextResponse("No data found", { status: 404 });
//     }

//     const playlistExists = await db.playlist.findFirst({
//       where: {
//         playlistId: playlistId, // The playlist ID from the URL query
//         users: {
//           some: { id: user.id }, // Check if this user is in the playlist
//         },
//       },
//     });

//     return NextResponse.json({ exist: !!playlistExists });
//   } catch (error) {
//     console.error(error);
//     return new NextResponse("Failed to create or fetch playlist", {
//       status: 500,
//     });
//   }
// }

export async function DELETE(req: Request) {
  try {
    const { playlistId } = await req.json();

    if (!playlistId) {
      return new NextResponse("playlistId is required", { status: 400 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new NextResponse("User not authenticated", { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if the playlist is saved by the authenticated user
    const playlist = await db.playlist.findFirst({
      where: {
        playlistId: playlistId,
        users: {
          some: { id: user.id }, // Ensure user is linked to this playlist
        },
      },
    });

    if (!playlist) {
      return new NextResponse("Playlist not found in your saved playlists", {
        status: 404,
      });
    }

    // Unlink the playlist from the user by disconnecting the user from the playlist
    await db.playlist.update({
      where: { id: playlist.id },
      data: {
        users: {
          disconnect: { id: user.id },
        },
      },
    });

    return new NextResponse("Playlist unsaved successfully", { status: 200 });
  } catch (error) {
    console.error("Error unsaving playlist:", error);
    return new NextResponse("Failed to unsave playlist", { status: 500 });
  }
}
