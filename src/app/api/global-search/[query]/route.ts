import { NextRequest, NextResponse } from "next/server";

// GET handler for the route
export async function GET(
  request: NextRequest,
  { params }: { params: { query: string } }
) {
  const { query } = params;

  try {
    // Fetch data from the external API
    const songsRes = await fetch(
      `${process.env.API_URL}/api/search/songs?query=${query}`,
      { method: "GET" }
    );

    const playlistsRes = await fetch(
      `${process.env.API_URL}/api/search/playlists?query=${query}`,
      { method: "GET" }
    );

    const albumsRes = await fetch(
      `${process.env.API_URL}/api/search/artists?query=${query}`,
      { method: "GET" }
    );

    if (!songsRes.ok) {
      // If the response status is not ok, return an error response
      return NextResponse.json(
        { status: songsRes.status, message: "Failed to fetch data" },
        { status: songsRes.status }
      );
    }

    if (!playlistsRes.ok) {
      // If the response status is not ok, return an error response
      return NextResponse.json(
        { status: playlistsRes.status, message: "Failed to fetch data" },
        { status: playlistsRes.status }
      );
    }

    if (!albumsRes.ok) {
      // If the response status is not ok, return an error response
      return NextResponse.json(
        { status: albumsRes.status, message: "Failed to fetch data" },
        { status: albumsRes.status }
      );
    }

    // Parse the JSON response
    const songs = await songsRes.json();
    const playlists = await playlistsRes.json();
    const artists = await albumsRes.json();

    // Return the data in the NextResponse
    return NextResponse.json({
      status: 200,
      data: { songs, playlists, artists },
    });
  } catch (error) {
    // Handle any errors during the fetch
    return NextResponse.json(
      { status: 500, message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
