<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../../theme/oysteo.scss';
	import '$lib/utils/firebase';
	import {
		Form,
		FormGroup,
		Button,
		Link,
		TextInput,
		InlineLoading
	} from 'carbon-components-svelte';
	import { getAuth, inMemoryPersistence, sendPasswordResetEmail } from 'firebase/auth';
	import { isValidEmail } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME, TIME_RESEND_EMAIL_FORGOT_PW } from '$lib/utils/constants';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import ODeviceDetector from '$lib/components/ODeviceDetector.svelte';

	type FormError = {
		email?: string;
	};

	let formErrors: FormError;
	let formData = {
		email: ''
	};

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	async function onSubmit() {
		const errors: FormError = {};
		if (!formData.email) {
			errors.email = 'Email address is required';
		} else if (!isValidEmail(formData.email)) {
			errors.email = 'Email address is invalid';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });
		const res = await fetch('/auth/forgot-password.json', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: formData.email })
		});
		if (res.ok) {
			redirect(`/auth/forgot-password/sent`, { email: formData.email });
		} else {
			const error = await res.json();
			console.log(error);
			notify({
				title: 'Something went wrong',
				subtitle: 'Please try again later'
			});
		}
		isFormSavingStore.set({ saving: false });
	}
</script>

<ODeviceDetector showInMobile={true}>
	<h1>Forgot Password</h1>
</ODeviceDetector>
<Form on:submit={onSubmit}>
	<ODeviceDetector showInDesktop={true}>
		<FormGroup>
			<h1>Forgot Password</h1>
		</FormGroup>
	</ODeviceDetector>
	<FormGroup>
		<TextInput
			autofocus
			labelText=""
			name="email"
			type="email"
			placeholder="Email address"
			bind:value={formData.email}
			invalid={!!formErrors?.email}
			invalidText={formErrors?.email}
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
		<p>Got your password?</p>
		<Link href="/auth/sign-in">Sign in</Link>
	</div>
</Form>

<style lang="scss">
</style>
