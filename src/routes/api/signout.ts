const TRAKT_CLIENT_ID = import.meta.env.VITE_TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = import.meta.env.VITE_TRAKT_CLIENT_SECRET;
import cookie from 'cookie';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(req:{ headers: { cookies: {name: string, val: string; }}; }): Promise<{ headers: { 'set-cookie'?: string[]; Location: string; }; status: number; }> {
    const cookies = cookie.parse(req.headers.cookies || '');
    const request = await fetch('https://trakt.tv/oauth/revoke', {
        method: 'POST',
        body: JSON.stringify({
            token: cookies.trakt_access_token,
            client_id: TRAKT_CLIENT_ID,
            client_secret: TRAKT_CLIENT_SECRET,
        }),
        headers: { 'Content-Type': 'application/json' }
    });
    const response = await request.json();
   
    if (response.error) {
        return {
          headers: { Location: '/' },
          status: 302
        }
      }
    return {
        headers: {
            'set-cookie': [
                `trakt_access_token=deleted; Path=/; Max-Age=-1`,
                `trakt_refresh_token=deleted; Path=/; Max-Age=-1`,
            ],
            Location: '/'
        },
        status: 302
    }
}
