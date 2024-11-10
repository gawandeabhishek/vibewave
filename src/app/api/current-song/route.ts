import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body to get currentSongId
    const { currentSongId } = await req.json();

    // Validate that currentSongId is provided
    if (!currentSongId) {
      return new NextResponse("currentSongId is required", { status: 400 });
    }

    // Fetch the currently logged-in user from Clerk
    const clerkUser = await currentUser();

    // Check if the Clerk user exists
    if (!clerkUser || !clerkUser.id) {
      return new NextResponse("User not authenticated", { status: 401 });
    }

    // Update the user in the database with the currentSongId
    const user = await db.user.update({
      where: {
        clerkId: clerkUser.id,
      },
      data: {
        currentSongId: currentSongId,
      },
    });

    // If user is not found, return a 404 error
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Respond with a success message or the updated user data
    return NextResponse.json({
      message: "Current song updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating current song:", error);

    // Return a generic error response for any unhandled errors
    return new NextResponse("Failed to update current song", { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch the currently logged-in user from Clerk
    const clerkUser = await currentUser();

    // Check if the Clerk user exists
    if (!clerkUser || !clerkUser.id) {
      return new NextResponse("User not authenticated", { status: 401 });
    }

    // Fetch the user from the database and get their currentSongId
    const user = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
      select: {
        currentSongId: true,
      },
    });

    // If user is not found, return a 404 error
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Fetch the song data based on the currentSongId
    const res = await fetch(`${process.env.API_URL}/api/songs/${user.currentSongId}`);

    if (!res.ok) {
      // If the response status is not ok, return an error response
      return NextResponse.json({
        status: res.status,
        message: "Failed to fetch song data",
      });
    }

    // Parse and return the song data
    const data = await res.json();

    // Respond with the current song data
    return NextResponse.json({
      message: "Current song data retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching current song:", error);

    // Return a generic error response for any unhandled errors
    return new NextResponse("Failed to fetch current song", { status: 500 });
  }
}
