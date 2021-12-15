<script lang="ts">
	import { authStore } from '$lib/store/auth';
	import { redirect } from '$lib/utils/router';
	import { Link } from 'carbon-components-svelte';
	async function signOut() {
		try {
			const res = await fetch(`/auth/sign-out.json?_z=${Date.now()}`);
			authStore.set({ user: undefined });
			if (res.ok) {
				authStore.set({ user: undefined });
				redirect('/');
				return;
			}
			console.error('Error authenticating', res);
		} catch (error) {
			console.error('Logout failure', error);
		}
	}
</script>

<div class="content">
	{#if $authStore.user}
		<h1>Really sign out?</h1>
		<ul>
			<li>
				<Link href="javascript:void(0);" on:click={signOut}>Yes, sign out</Link>
			</li>
			<li>
				<Link href="/account">Stay signed in</Link>
			</li>
		</ul>
	{:else}
		<h1>You've successfully signed out</h1>
		<Link
			href="javascript:void(0);"
			on:click={() => {
				redirect('/login');
			}}>Go to the Login Page</Link
		>
	{/if}
</div>

<style lang="scss">
	li {
		margin-bottom: 10px;
	}
</style>
