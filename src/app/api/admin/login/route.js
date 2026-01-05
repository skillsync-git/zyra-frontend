import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Admin login API called');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { username, password } = body;

    // Admin credentials from environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('Checking credentials:', { username, ADMIN_USERNAME });

    // Validation
    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('Credentials matched - creating response');
      
      const response = NextResponse.json(
        {
          success: true,
          message: 'Admin login successful',
          data: {
            username: ADMIN_USERNAME,
          },
        },
        { status: 200 }
      );

      // Set secure cookie
      response.cookies.set('adminToken', 'admin_authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      console.log('Cookie set, response sent');
      return response;
    }

    console.log('Invalid credentials');
    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}