import * as cookie from 'cookie';
const TRAKT_API_URL = import.meta.env.VITE_TRAKT_API_URL;
const TRAKT_CLIENT_ID = import.meta.env.VITE_TRAKT_CLIENT_ID;
const HOST = import.meta.env.VITE_HOST;

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession(req: { headers: { cookie: {name: string, val: string; }}; }): Promise<{user:unknown|boolean}>{

  const cookies = await cookie.parse(req.headers.cookie || '');
  
  // if only refresh token is found, then access token has expired. perform a refresh on it.

  if (cookies.trakt_refresh_token && !cookies.trakt_access_token) {
    const trakt_request = await fetch(`${HOST}/api/refresh?code=${cookies.trakt_refresh_token}`);
    const trakt_response = await trakt_request.json();

    if (trakt_response.trakt_access_token) {
      const request = await fetch(`${TRAKT_API_URL}/users/settings`, {
        headers: { 
          'Authorization': `Bearer ${trakt_response.trakt_access_token}`,
          'Content-Type': 'application/json',
          'trakt-api-version': '2',
          'trakt-api-key': TRAKT_CLIENT_ID
           }
      });
  
      // returns a trakt user if JWT was valid
      const response = await request.json();
  
      if (response.id) {
        return {
          user: {
            // only include properties needed client-side —
            // exclude anything else attached to the user
            // like access tokens etc
            ...response
          }
        }
      }
    }
  }

  if (cookies.trakt_access_token) {
    const request = await fetch(`${TRAKT_API_URL}/users/settings`, {
      headers: { 
        'Authorization': `Bearer ${cookies.trakt_access_token}`,
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': TRAKT_CLIENT_ID
         }
    });

    // returns a trakt user if JWT was valid
    const response = await request.json();
    

    if (response.user) {
      
      return {
        user: {
          // only include properties needed client-side —
          // exclude anything else attached to the user
          // like access tokens etc
          ...response
        }
      }
    }
  }

  // not authenticated, return empty user object
  return {
    user: false
  }
}