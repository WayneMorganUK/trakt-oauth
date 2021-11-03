const TRAKT_CLIENT_ID = import.meta.env.VITE_TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = import.meta.env.VITE_TRAKT_CLIENT_SECRET;
const TRAKT_REDIRECT_URI = import.meta.env.VITE_TRAKT_REDIRECT_URI;

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */

export async function get({query}:{query:URLSearchParams}) :Promise<{ headers: { 'set-cookie'?: string[]; Location: string; }; status: number; }> {
  // fetch returnCode set in the URL parameters.
  const returnCode = query.get('code');
  const request = await fetch('https://api.trakt.tv/oauth/token', {
    method: 'POST',
    body: JSON.stringify({
      code: returnCode,
      client_id: TRAKT_CLIENT_ID,
      client_secret: TRAKT_CLIENT_SECRET,
      redirect_uri: TRAKT_REDIRECT_URI,
      grant_type: 'authorization_code'
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const response = await request.json();

  // redirect to front page in case of error
  if (response.error) {
    return {
      headers: { Location: '/' },
      status: 302
    }
  }

  // redirect user to front page with cookies set
  const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
  const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  return {
    headers: {
      'set-cookie': [
        `trakt_access_token=${response.access_token}; Path=/; SameSite=Strict; Expires=${access_token_expires_in}`,
        `trakt_refresh_token=${response.refresh_token}; Path=/; SameSite=Strict; Expires=${refresh_token_expires_in}`,
      ],
      Location: '/'
    },
    status: 302
  }
}