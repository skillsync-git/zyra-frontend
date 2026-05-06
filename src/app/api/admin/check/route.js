import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    console.log('Admin check API called');
    
    const token = request.cookies.get('adminToken');
    
    console.log('Token exists:', !!token);
    console.log('Token value:', token?.value);

    if (!token || token.value !== 'admin_authenticated') {
      console.log('Not authenticated');
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('Authentication valid');
    return NextResponse.json(
      { success: true, message: 'Authenticated' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
