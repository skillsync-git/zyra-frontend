import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ results: [] });
    }

    // Call your Express backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://zyra-website.onrender.com';
    const response = await fetch(
      `${backendUrl}/api/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Backend search request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', results: [] },
      { status: 500 }
    );
  }
}
