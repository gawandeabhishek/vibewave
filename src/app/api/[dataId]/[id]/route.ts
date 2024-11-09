import { NextRequest, NextResponse } from 'next/server';

// GET handler for the route
export async function GET(request: NextRequest, { params }: { params: { dataId: string; id: string } }) {
  const { dataId, id } = params;

  try {
    // Fetch data from the external API
    const res = dataId === "playlist" ? await fetch(`${process.env.API_URL}/api/${dataId}s?id=${id}`) : await fetch(`${process.env.API_URL}/api/${dataId}s/${id}`);

    if (!res.ok) {
      // If the response status is not ok, return an error response
      return NextResponse.json({ status: res.status, message: 'Failed to fetch data' }, { status: res.status });
    }

    // Parse the JSON response
    const data = await res.json();

    // Return the data in the NextResponse
    return NextResponse.json({ status: 200, data });
  } catch (error) {
    // Handle any errors during the fetch
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error }, { status: 500 });
  }
}
