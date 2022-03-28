<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import {
		Form,
		FormGroup,
		Button,
		Link,
		TextInput,
		PasswordInput,
		InlineLoading
	} from 'carbon-components-svelte';

	import { browserSessionPersistence, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
	import { isPasswordComplex, isValidEmail } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { authStore } from '$lib/store/auth';
	import { notify } from '$lib/components/Toast.svelte';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import ODeviceDetector from '$lib/components/ODeviceDetector.svelte';

	type FormError = {
		email?: string;
		password?: string;
	};

	let formErrors: FormError;

	let loginData = {
		email: '',
		password: ''
	};

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	async function onSubmit() {
		const errors: FormError = {};
		if (!loginData.email) {
			errors.email = 'Email address is required';
		} else if (!isValidEmail(loginData.email)) {
			errors.email = 'Email address is invalid';
		}

		if (!loginData.password) {
			errors.password = 'Your password is required';
		} else if (!isPasswordComplex(loginData.password)) {
			errors.password =
				'Passwords must be at least 8 characters (including 1 uppercase letter, 1 number and 1 lowercase letter)';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			const auth = getAuth();
			await auth.setPersistence(browserSessionPersistence); // To save user after logging into the browser session
			const cred = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
			if (cred && cred.user) {
				if (cred.user.emailVerified) {
					const token = await cred.user.getIdToken();
					const res = await fetch('/auth.json', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							token
						})
					});

					if (res.ok) {
						const user = await res.json();
						if (!user.advisorMe) {
							loginData.password = '';
							errors.email = 'Only advisors may sign in to MyOYSTEO';

							await fetch(`/auth/sign-out.json?_z=${Date.now()}`);
							authStore.set({ user: undefined });
							setTimeout(() => {
								location.reload();
							}, 1000);
							isFormSavingStore.set({ saving: false });
							return;
						}
						// TODO: Restore redirect when My OYSTEO tab is enabled
						// redirect('/account');
						isFormSavingStore.set({ saving: false });
						authStore.set({ user });
						await tick();
						if (user.agencyMe && !user.agencyMe.legalName) {
							goto('/account/agency');
						} else {
							goto('/account/advisor');
						}
						// TODO end
						return;
					} else if (res.status === 406) {
						authStore.set({ user: undefined });
						document.cookie = 'session=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
						await tick();
						goto('/auth/verify');
					} else {
						const error = await res.json();
						console.log(error);
					}
				} else {
					authStore.set({ user: undefined });
					document.cookie = 'session=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
					await tick();
					goto(`/auth/verify?email=${encodeURIComponent(loginData.email)}`);
				}
			} else {
				notify({
					kind: 'warning',
					title: 'Unable to connect',
					subtitle: 'There was a problem communicating with MyOYSTEO, please try again later'
				});
			}
		} catch (error) {
			console.log('error');
			// console.log(error);
			console.log('error code', error.code);
			console.log(error.message);
			switch (error.code) {
				case 'auth/user-not-found':
					errors.email = 'Email is not linked to an account';
					break;
				case 'auth/wrong-password':
					errors.password = 'Password is incorrect';
					break;
				case 400:
					switch (error.message) {
						case 'INVALID_PASSWORD':
							errors.password = 'Password is incorrect';
							break;
						case 'EMAIL_NOT_FOUND':
							errors.email = 'Email is not linked to an account';
							break;
					}
					break;
				default:
					notify({
						kind: 'warning',
						title: 'Something went wrong',
						subtitle: "Something went wrong with the app. Don't worry, we'll look into it"
					});
					console.error('Error logging in', error);
			}
			if (Object.keys(errors).length) {
				showErrors(errors);
			}
		}
		isFormSavingStore.set({ saving: false });
	}
</script>

<ODeviceDetector showInMobile={true}>
	<h1>Welcome</h1>
</ODeviceDetector>
<Form on:submit={onSubmit}>
	<ODeviceDetector showInDesktop={true}>
		<FormGroup>
			<h1>Welcome to OYSTEO’s Advisor Portal!</h1>
		</FormGroup>
	</ODeviceDetector>
	<FormGroup>
		<TextInput
			autofocus
			labelText=""
			name="email"
			type="email"
			placeholder="Email address"
			bind:value={loginData.email}
			invalid={!!formErrors?.email}
			invalidText={formErrors?.email}
		/>
	</FormGroup>
	<FormGroup>
		<PasswordInput
			labelText=""
			placeholder="Password"
			bind:value={loginData.password}
			invalid={!!formErrors?.password}
			invalidText={formErrors?.password}
		/>
	</FormGroup>
	<FormGroup>
		{#if $isFormSavingStore.saving}
			<div class="saving-modal" />
			<InlineLoading status="active" description="Checking account..." />
		{:else}
			<Button kind="secondary" type="submit" class="btn-submit">SUBMIT</Button>
		{/if}
	</FormGroup>
	<div class="section-resetpw">
		<p>Can't login?</p>
		<Link href="/auth/forgot-password">Reset password</Link>
	</div>
</Form>
