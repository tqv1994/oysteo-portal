<script lang="ts" context="module">
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { get } from 'svelte/store';
	import { authStore } from '$lib/store/auth';
	import { goto } from '$app/navigation';

	export const load: Load = async ({ url }) => {
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

		const email = url.searchParams.get('email');

		return {
			props: {
				email
			}
		};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { Button, Link } from 'carbon-components-svelte';
	import { TIME_RESEND_EMAIL_FORGOT_PW } from '$lib/utils/constants';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';
	import { sendLoginEmail, sendEmailVerificationLink } from '$lib/services/user.service';
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

	const reSendAccountVerifyLink = async () => {
		try {
			await sendEmailVerificationLink(email);
			countDownStart = true;
			countDown();
		} catch (error) {
			console.error(error);
		}
	};
	const reSendAccountLoginLink = async () => {
		try {
			await sendLoginEmail(email);
			countDownStart = true;
			countDown();
		} catch (error) {
			console.error(error);
		}
	};
</script>

<ODeviceDetector showInMobile={true}>
	<h1>Sign Up Success</h1>
</ODeviceDetector>
<div class="section-login--messenge">
	<ODeviceDetector showInDesktop={true}>
		<h1>Sign Up Success</h1>
	</ODeviceDetector>
	<div class="section-login--messenge-content">
		<p>
			We have sent an email to {#if email}<b>{email}</b>{:else}you{/if} with a link to verify your account.
		</p>
		<p>Please check your email and click the link provided.</p>
		<p>If you haven’t received our email, please click <b>RESEND</b>.</p>
	</div>
	<div>
		{#if !countDownStart}
			<Button kind="secondary" type="button" on:click={reSendAccountVerifyLink} class="btn-submit"
				>RESEND</Button
			>
		{:else}
			<Button kind="secondary" type="button" disabled class="btn-submit btn-count-down"
				>{count}</Button
			>
		{/if}
	</div>
	<div class="section-resetpw">
		<p>Got the email?</p>
		<Link href="/auth/sign-in">Sign in</Link>
	</div>
</div>

<style lang="scss">
	b {
		font-weight: 700;
	}
	.section-forgot {
		--cds-disabled-03: #fff;
	}
	p {
		margin-bottom: 1em;
	}
</style>
