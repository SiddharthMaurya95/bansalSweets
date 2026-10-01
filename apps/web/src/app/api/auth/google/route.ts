import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTarget = searchParams.get('redirect') || '/shop';

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/auth/callback/google`;

  const state = encodeURIComponent(
    JSON.stringify({
      redirect: redirectTarget,
      timestamp: Date.now(),
    })
  );

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(googleAuthUrl.toString(), 302);
}
