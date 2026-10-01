import { NextRequest, NextResponse } from 'next/server';

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, redirectUri } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const clientId =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Google OAuth credentials not configured' },
        { status: 500 }
      );
    }

    const origin = request.nextUrl.origin;
    const effectiveRedirectUri = redirectUri || `${origin}/auth/callback/google`;

    // Handle simulation or local demo codes
    if (code.startsWith('google_auth_demo_code_')) {
      return NextResponse.json({
        success: true,
        user: {
          id: `google_${Date.now()}`,
          name: 'Siddharth Maurya',
          email: 'siddharth@example.com',
          avatar: `https://ui-avatars.com/api/?name=Siddharth+Maurya&background=52101b&color=ffffff&size=128&bold=true&rounded=true`,
          googleId: '109876543210987654321',
        },
      });
    }

    // 1. Exchange authorization code for tokens with Google OAuth 2.0
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: effectiveRedirectUri,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
      cache: 'no-store',
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      const errMsg =
        tokenData.error_description ||
        tokenData.error ||
        'Failed to exchange authorization code with Google';
      return NextResponse.json(
        {
          error: errMsg,
          details: tokenData,
        },
        { status: tokenRes.status || 400 }
      );
    }

    // 2. Fetch authenticated user's profile from Google's UserInfo API
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: 'no-store',
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile from Google' },
        { status: userRes.status || 400 }
      );
    }

    const googleUser: GoogleUserInfo = await userRes.json();

    // 3. Return verified user profile
    return NextResponse.json({
      success: true,
      user: {
        id: googleUser.sub,
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        googleId: googleUser.sub,
      },
      tokens: {
        accessToken: tokenData.access_token,
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type,
        idToken: tokenData.id_token,
      },
    });
  } catch (error) {
    console.error('Google OAuth exchange error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error during Google OAuth exchange',
      },
      { status: 500 }
    );
  }
}
