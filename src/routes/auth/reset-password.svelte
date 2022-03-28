<script lang="ts" context="module">
	import {
		Form,
		FormGroup,
		Button,
		Link,
		PasswordInput,
		InlineLoading
	} from 'carbon-components-svelte';
	import { getAuth, confirmPasswordReset, browserSessionPersistence } from 'firebase/auth';
	import { checkPasswordRule } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import type { Load } from '@sveltejs/kit';
	import '$lib/utils/firebase';
	export const load: Load = async ({ url }) => {
		const resetPasswordToken = url.searchParams.get('token');
		if (!resetPasswordToken) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {
			props: {
				resetPasswordToken
			}
		};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { goto } from '$app/navigation';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import ODeviceDetector from '$lib/components/ODeviceDetector.svelte';
	export let resetPasswordToken: string;
	let resetPasswordData = {
		newPassword: '',
		confirmPassword: ''
	};

	let invalidNewPassword = {
		status: false,
		message: ''
	};

	let invalidConfirmPassword = {
		status: false,
		message: ''
	};

	async function handleSubmit() {
		invalidNewPassword = checkPasswordRule(resetPasswordData.newPassword);
		if (invalidNewPassword.status) {
			setTimeout(() => {
				invalidNewPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
			invalidConfirmPassword = {
				status: true,
				message: 'Confirmation password is incorrect'
			};
			setTimeout(() => {
				invalidConfirmPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		isFormSavingStore.set({ saving: true });
		const auth = getAuth();

		try {
			await auth.setPersistence(browserSessionPersistence); // To save user after logging into the browser session
			await confirmPasswordReset(auth, resetPasswordToken, resetPasswordData.newPassword);
			goto('/auth/sign-in');
		} catch (error) {
			if (
				(error.code === 400 && error.message === 'EXPIRED_OOB_CODE') ||
				error.code === 'auth/expired-action-code'
			) {
				notify({
					title: 'Link is invalid or has expired',
					subtitle: 'Please request a new one'
				});
				goto('/auth/forgot-password');
			}
		}
		isFormSavingStore.set({ saving: false });
	}
</script>

<ODeviceDetector showInMobile={true}>
	<h1>Reset Password</h1>
</ODeviceDetector>
<Form on:submit={handleSubmit}>
	<ODeviceDetector showInDesktop={true}>
		<FormGroup>
			<h1>Reset Password</h1>
		</FormGroup>
	</ODeviceDetector>
	<FormGroup>
		<PasswordInput
			labelText=""
			placeholder="NEW PASSWORD *"
			bind:value={resetPasswordData.newPassword}
			required
			invalid={invalidNewPassword.status}
			invalidText={invalidNewPassword.message}
		/>
	</FormGroup>
	<FormGroup>
		<PasswordInput
			labelText=""
			placeholder="CONFIRM PASSWORD *"
			bind:value={resetPasswordData.confirmPassword}
			required
			invalid={invalidConfirmPassword.status}
			invalidText={invalidConfirmPassword.message}
		/>
	</FormGroup>
	<FormGroup>
		{#if $isFormSavingStore.saving}
			<div class="saving-modal" />
			<InlineLoading status="active" description="Processing..." />
		{:else}
			<Button kind="secondary" type="submit" class="btn-submit">SUBMIT</Button>
		{/if}
	</FormGroup>
	<div class="section-resetpw">
		<p>Is this a mistake?</p>
		<Link href="/auth/sign-in">Sign in now</Link>
	</div>
</Form>

<style lang="scss">
</style>
