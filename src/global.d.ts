/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_TRAKT_API_URL: string,
    readonly VITE_TRAKT_CLIENT_ID: string,
    readonly VITE_TRAKT_CLIENT_SECRET: string,
    readonly VITE_TRAKT_REDIRECT_URI: string,
    readonly VITE_HOST: string,
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
