<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { Link } from 'carbon-components-svelte';
	import { authStore } from '$lib/store/auth';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	export async function signOut() {
		try {
			await fetch(`/auth/sign-out.json`);
		} catch (error) {
			// Do nothing
		}
		authStore.set({ user: undefined });
		await tick();
		goto('/register');
	}
</script>

<div class="content">
	{#if $authStore.user}
		<h1>Really sign out?</h1>
		<ul>
			<li>
				<Link href="#" on:click={signOut}>Yes, sign out</Link>
			</li>
			<li>
				<Link href="/account/advisor">Stay signed in</Link>
			</li>
		</ul>
	{:else}
		<div class="center">
			<h1>You've successfully signed out</h1>
			<Link href="/auth/sign-in">Go to the Login Page</Link>
		</div>
	{/if}
</div>

<style lang="scss">
	li {
		margin-bottom: 10px;
	}
</style>
