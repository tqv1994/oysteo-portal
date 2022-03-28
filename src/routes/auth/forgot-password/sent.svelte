<script lang="ts" context="module">
	import '$lib/utils/firebase';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import { authStore } from '$lib/store/auth';

	import type { Load } from '@sveltejs/kit';

	let email: string;

	export const load: Load = async ({ url, params }) => {
		const { user } = get(authStore);
		if (user) {
			const redirect = '/';
			if (browser) {
				goto(redirect);
			} else {
				return {
					status: 302,
					redirect
				};
			}
		}

		email = url.searchParams.get('email');

		return {
			props: {
				email
			}
		};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../../theme/oysteo.scss';
	import { Button, Link } from 'carbon-components-svelte';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';
	import { TIME_RESEND_EMAIL_FORGOT_PW } from '$lib/utils/constants';
	import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
	import { notify } from '$lib/components/Toast.svelte';
	import ODeviceDetector from '$lib/components/ODeviceDetector.svelte';
	export let email: string;
	let count = TIME_RESEND_EMAIL_FORGOT_PW;
	let countDownStart = true;
	const countDown = () => {
		if (count > 0 && countDownStart) {
			count--;
			setTimeout(countDown, 1000);
		} else {
			countDownStart = false;
			count = TIME_RESEND_EMAIL_FORGOT_PW;
		}
	};
	countDown();

	const reSendPasswordResetEmail = async () => {
		try {
			const res = await fetch('/auth/forgot-password.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email.trim().replace(' ', '+') })
			});
			if (res.ok) {
				countDownStart = true;
				countDown();
			} else {
				const error = await res.json();
				console.error(error);
				notify({
					kind: 'error',
					title: 'Something went wrong',
					subtitle: 'Please try again later'
				});
			}
		} catch (error) {
			console.error(error);
		}
	};
</script>

<ODeviceDetector showInMobile={true}>
	<h1>Forgot Password</h1>
</ODeviceDetector>
<div class="section-login--messenge">
	<ODeviceDetector showInDesktop={true}>
		<h1>Forgot Password</h1>
	</ODeviceDetector>
	<div class="section-login--messenge-content">
		<p>
			We have sent an email to {#if email}<b>{email}</b>{:else}you{/if} to reset your password.
		</p>
		<p>Please check your email and click the link provided.</p>
		<p>If you haven’t received our email click <b>RESEND</b>.</p>
	</div>
	{#if !countDownStart}
		<Button kind="secondary" type="button" on:click={reSendPasswordResetEmail} class="btn-submit"
			>RESEND</Button
		>
	{:else}
		<Button kind="secondary" type="button" disabled class="btn-submit btn-count-down"
			>{count}</Button
		>
	{/if}
	<div class="section-resetpw">
		<p>Got the email?</p>
		<Link href="/auth/sign-in">Go to sign in</Link>
	</div>
</div>

<style lang="scss">
	b {
		font-weight: 700;
	}
	.section-forgot {
		h1 {
			margin-bottom: 20px;
		}
		padding-top: 20px;
		--cds-disabled-03: #fff;
	}
	p {
		margin-bottom: 1em;
	}
</style>
