const TRAKT_CLIENT_ID: string = import.meta.env.VITE_TRAKT_CLIENT_ID;
const TRAKT_REDIRECT_URI = import.meta.env.VITE_TRAKT_REDIRECT_URI;
const TRAKT_ENDPOINT =
  `https://trakt.tv/oauth/authorize?client_id=${TRAKT_CLIENT_ID}&redirect_uri=${TRAKT_REDIRECT_URI}&response_type=code`

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(): Promise<{ headers: { Location: string; }; status: number; }> {

  return {
    headers: { Location: TRAKT_ENDPOINT },
    status: 302
  }
}
