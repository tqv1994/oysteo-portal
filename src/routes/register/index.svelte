<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import '$lib/utils/firebase';
	import {
		RadioButtonGroup,
		RadioButton,
		Form,
		FormGroup,
		Button,
		Link,
		TextInput,
		PasswordInput,
		InlineLoading
	} from 'carbon-components-svelte';

	import { createUserWithEmailAndPassword, getAuth, inMemoryPersistence } from 'firebase/auth';
	import { isPasswordComplex, isValidEmail } from '$lib/helpers/utils';
	import type { Advisor } from '$lib/store/advisor';
	import { Agency, AGENCY_TYPE } from '$lib/store/agency';
	import { contactEmail } from '$lib/utils/_env';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';
	import { sendEmailVerificationLink } from '$lib/services/user.service';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { tick } from 'svelte';
	import { authStore } from '$lib/store/auth';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { goto } from '$app/navigation';

	type FormError = {
		email?: string;
		password?: string;
		confirm?: string;
	};

	let formErrors: FormError;
	let formData = {
		email: '',
		password: '',
		confirm: ''
	};

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	async function createAdvisor() {
		if ($authStore.user) {
			try {
				const res = await fetch('/account/advisor/create.json', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userMe: $authStore.user.id,
						avatar: $authStore.user.avatar?.id,
						active: true
					})
				});
				if (res.ok) {
					const data: Advisor = await res.json();
					$authStore.user.advisorMe = data;
					authStore.set({ user: $authStore.user });
				}
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function createAgency() {
		if ($authStore.user) {
			try {
				const res = await fetch('/account/agency/create.json', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						userMe: $authStore.user.id,
						type: AGENCY_TYPE.individual
					})
				});
				if (res.ok) {
					const data: Agency = await res.json();
					$authStore.user.agencyMe = data;
					authStore.set({ user: $authStore.user });
				}
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function onSubmit() {
		const errors: FormError = {};
		if (!formData.email) {
			errors.email = 'Email address is required';
		} else if (!isValidEmail(formData.email)) {
			errors.email = 'Email address is invalid';
		}

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
		const res = await fetch(`/auth/register.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});
		if (res.ok) {
			goto('/auth/verify');
		} else if (res.status === 409) {
			errors.email = 'This email is linked an existing account';
			showErrors(errors);
		} else {
			notify({
				title: 'Something went wrong',
				subtitle: 'Your account could not be registered, please try again later'
			});
		}
		isFormSavingStore.set({ saving: false });
	}

	const onChangeType = (event: CustomEvent) => {
		if (event.detail === 'ADVISOR') {
			notify({
				kind: 'warning',
				title: 'Warning',
				subtitle: 'You need an invitation from an agency to sign up as an advisor'
			});
			formData.type = 'AGENCY';
		}
	};
</script>

<div class="container">
	<div class="overview-wrapper">
		<div class="overview-container">
			<div class="section-logo">
				<div class="logo-index">
					<Link href="/">
						<OysteoLogo width={130} height={17.217} />
					</Link>
				</div>
			</div>
			<div class="section-login">
				<div class="redirect-login-container">
					<p>ALREADY A MEMBER?</p>
					<p on:click={() => redirect('/auth/sign-in')}>SIGN IN</p>
				</div>
			</div>
			<div class="section-title">
				<h1>Member Registration</h1>
			</div>
			<div class="section-description">
				<p>Get access to exclusive tools and connections to grow your business.</p>
			</div>
			<div class="section-register">
				<h3>Let's get started</h3>
				<a href="#register-wrapper">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="30"
						height="30"
						fill="white"
						class="bi bi-chevron-down"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
						/>
					</svg>
				</a>
			</div>
			<div class="section-radio">
				<FormGroup legendText="Choose one of the following:" class="radio-group-desktop">
					<RadioButtonGroup
						orientation="horizontal"
						selected={formData.type}
						on:change={onChangeType}
					>
						<!-- <RadioButton labelText="ADVISOR" value="ADVISOR" /> -->
						<RadioButton labelText="AGENCY" value="AGENCY" />
					</RadioButtonGroup>
					<small class="both-radio-button">*Advisor & Agency</small>
				</FormGroup>
			</div>
		</div>
	</div>

	<div class="register-wrapper" id="register-wrapper">
		<div class="section-redirect">
			<p>ALREADY A MEMBER?</p>
			<p><Link href="/auth/sign-in">SIGN IN</Link></p>
		</div>
		<div class="section-signup">
			<Form on:submit={onSubmit}>
				<FormGroup legendText="Choose one of the following:" class="radio-group">
					<RadioButtonGroup
						orientation="vertical"
						selected={formData.type}
						on:change={onChangeType}
					>
						<!-- <RadioButton labelText="ADVISOR" value="ADVISOR" /> -->
						<RadioButton labelText="AGENCY" value="AGENCY" />
						<small class="both-radio-button">*Advisor & Agency</small>
					</RadioButtonGroup>
				</FormGroup>
				<FormGroup class="signup-login">
					<!-- <TextInput labelText="" placeholder="USERNAME *" required bind:value={registerData.username} pattern={emailPattern}/> -->
					<TextInput
						autofocus
						labelText=""
						name="email"
						type="email"
						placeholder="EMAIL *"
						bind:value={formData.email}
						invalid={!!formErrors?.email}
						invalidText={formErrors?.email}
					/>
					<PasswordInput
						labelText=""
						placeholder="PASSWORD *"
						bind:value={formData.password}
						invalid={!!formErrors?.password}
						invalidText={formErrors?.password}
					/>
					<PasswordInput
						labelText=""
						placeholder="CONFIRM PASSWORD *"
						bind:value={formData.confirm}
						invalid={!!formErrors?.confirm}
						invalidText={formErrors?.confirm}
					/>
				</FormGroup>
				{#if $isFormSavingStore.saving}
					<div class="saving-modal" />
					<InlineLoading status="active" description="Processing..." />
				{:else}
					<Button kind="secondary" type="submit" class="btn-submit">SUBMIT</Button>
				{/if}
			</Form>
		</div>
		<div class="section-contact">
			<p>Need help?</p>
			<Link href={`mailto:${contactEmail}`}>Contact OYSTEO</Link>
		</div>
	</div>
</div>

<style lang="scss">
	.register-wrapper {
		:global(input) {
			font-size: 1.25rem;
		}
	}
</style>
