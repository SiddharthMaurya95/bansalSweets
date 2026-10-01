/**
 * Google OAuth 2.0 Third-Party Authentication Service
 * Implements official Google OAuth 2.0 Web Client redirect flow.
 */

export interface GoogleAuthState {
  redirect?: string;
  nonce?: string;
  timestamp?: number;
}

/**
 * Returns the configured Google OAuth 2.0 Client ID
 */
export function getGoogleClientId(): string {
  if (typeof window !== 'undefined') {
    const localId = localStorage.getItem('bf_google_client_id');
    if (localId && localId.trim()) return localId.trim();
  }
  return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() || '';
}

/**
 * Saves a Google Client ID in local storage for local testing
 */
export function setLocalGoogleClientId(clientId: string): void {
  if (typeof window !== 'undefined') {
    if (clientId.trim()) {
      localStorage.setItem('bf_google_client_id', clientId.trim());
    } else {
      localStorage.removeItem('bf_google_client_id');
    }
  }
}

/**
 * Builds the official Google OAuth 2.0 authorization redirect URL.
 * Redirects the user's browser to https://accounts.google.com/o/oauth2/v2/auth
 */
export function getGoogleOAuthUrl(redirectPath = '/shop', customClientId?: string): string {
  const clientId = customClientId || getGoogleClientId();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const redirectUri = `${origin}/auth/callback/google`;

  const statePayload: GoogleAuthState = {
    redirect: redirectPath || '/shop',
    nonce: Math.random().toString(36).substring(2, 15),
    timestamp: Date.now(),
  };

  const state = encodeURIComponent(JSON.stringify(statePayload));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Initiates the official third-party redirect to Google.
 */
export function redirectToGoogle(redirectPath = '/shop', customClientId?: string): void {
  if (typeof window === 'undefined') return;
  const url = getGoogleOAuthUrl(redirectPath, customClientId);
  window.location.href = url;
}
