import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetching data from the external API
    const res = await fetch(`${process.env.API_URL}/api/search/songs?query=top+songs`);
    
    // Check if the response is OK (status code 200-299)
    if (!res.ok) {
      return NextResponse.json({ error: "Error in Fetching Top Songs" }, { status: res.status });
    }

    // Convert the response to JSON
    const data = await res.json();

    // Return the data in the response
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    // Handle any errors that occurred during fetch
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
