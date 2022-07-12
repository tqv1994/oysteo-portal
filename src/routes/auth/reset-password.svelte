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
	import { checkPasswordRule, isPasswordComplex } from '$lib/helpers/utils';
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
	import { redirect } from '$lib/helpers/redirect.svelte';
	export let resetPasswordToken: string;

	type FormError = {
		password?: string;
		confirm?: string;
	};

	let formErrors: FormError;
	let formData = {
		password: '',
		confirm: ''
	};

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	async function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		const errors: FormError = {};

		if (!formData.password) {
			errors.password = 'A password is required';
		} else if (!isPasswordComplex(formData.password)) {
			errors.password =
				'Password must be at least 8 characters (including 1 uppercase letter, 1 number and 1 lowercase letter)';
		}

		if (!formData.confirm) {
			errors.confirm = 'Please confirm your password';
		} else if (!errors.password && formData.password !== formData.confirm) {
			errors.password = 'Passwords do not match';
			errors.confirm = 'Passwords do not match';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });

		try {
			const auth = getAuth();
			await auth.setPersistence(browserSessionPersistence); // To save user after logging into the browser session
			await confirmPasswordReset(auth, resetPasswordToken, formData.password);
			notify({
				kind: 'success',
				title: 'Password updated',
				subtitle: 'Your password has been updated successfully. Please sign-in again.'
			});
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
<Form on:submit={onSubmit}>
	<ODeviceDetector showInDesktop={true}>
		<FormGroup>
			<h1>Reset Password</h1>
		</FormGroup>
	</ODeviceDetector>
	<FormGroup>
		<PasswordInput
			labelText=""
			placeholder="NEW PASSWORD *"
			bind:value={formData.password}
			invalid={!!formErrors?.password}
			invalidText={formErrors?.password}
		/>
	</FormGroup>
	<FormGroup>
		<PasswordInput
			labelText=""
			placeholder="CONFIRM PASSWORD *"
			bind:value={formData.confirm}
			invalid={!!formErrors?.confirm}
			invalidText={formErrors?.confirm}
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
