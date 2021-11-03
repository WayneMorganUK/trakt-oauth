<script context="module">

	/** * @type {import('@sveltejs/kit').Load} */
	export async function load({ session }) {
		return {
			props: { user: session.user || false }
		};
	}
</script>

<script>
	export let user;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#key user}
	{#if !user}
		<a rel="external" title="Trakt Auth" href="/api/auth">Authenticate via Trakt</a>
	{:else}
		<h1>{user.user.username}</h1>
		<img height="200px" width="200px" src={user.user.images.avatar.full} alt="avatar" />
		<!-- <img src="https://walter.trakt.tv/images/users/001/195/888/avatars/large/509ef7b515.jpg" alt="https://walter.trakt.tv" class="shrinkToFit" width="452" height="452"> -->
		<a rel="external" title="Sign out" href="/api/signout">Sign Out</a>
	{/if}
{/key}
