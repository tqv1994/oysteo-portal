<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../theme/oysteo.scss';
	import '$lib/utils/firebase';
	import {
		RadioButtonGroup,
		RadioButton,
		Form,
		FormGroup,
		Button,
		Link,
		TextInput,
		PasswordInput
	} from 'carbon-components-svelte';

	import { createUserWithEmailAndPassword, getAuth, inMemoryPersistence } from 'firebase/auth';
	import { authStore } from '$lib/store/auth';
	import { checkPasswordRule, validateEmail } from '$lib/helpers/utils';
	import { goto } from '$app/navigation';
	import type { Advisor } from '$lib/store/advisor';
	import { Agency, AGENCY_TYPE } from '$lib/store/agency';
	import { contactEmail } from '$lib/utils/_env';
	import { FIREBASE_EMAIL_EXIST_CODE, INVALID_DELAY_TIME } from '$lib/utils/constants';

	let registerData = {
		username: ' ',
		email: '',
		password: '',
		confirmPassword: '',
		type: 'AGENCY'
	};

	let invalidPassword = {
		status: false,
		message: ''
	};
	let invalidConfirmPassword = {
		status: false,
		message: 'Confirmation password is incorrect'
	};
	let invalidEmail = {
		status: false,
		message: ''
	};

	async function createAdvisor() {
		if ($authStore.user) {
			try {
				const res = await fetch('/advisor/create.json', {
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
				const res = await fetch('/agency/create.json', {
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

	async function handleSubmit() {
		if (!validateEmail(registerData.email)) {
			invalidEmail = {
				status: true,
				message: 'Invalid email'
			};
			setTimeout(() => {
				invalidEmail = {
					status: false,
					message: ''
				};
			}, INVALID_DELAY_TIME);
			return;
		}
		invalidPassword = checkPasswordRule(registerData.password);
		if (invalidPassword.status) {
			setTimeout(() => {
				invalidPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}

		if (registerData.password !== registerData.confirmPassword) {
			invalidConfirmPassword.status = true;
			setTimeout(() => {
				invalidConfirmPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		try {
			const auth = getAuth();
			await auth.setPersistence(inMemoryPersistence);
			const cred = await createUserWithEmailAndPassword(
				auth,
				registerData.email,
				registerData.password
			);
			if (cred && cred.user) {
				const token = await cred.user.getIdToken();
				const res = await fetch('/auth.json', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ token })
				});
				if (res.ok) {
					const user = await res.json();
					authStore.set({ user });
					// if (registerData.type === 'ADVISOR') {
					// 	await createAdvisor();
					// } else if (registerData.type === 'AGENCY') {
					// 	await createAgency();
					// } else if (registerData.type === 'BOTH') {
					// 	await createAdvisor();
					// 	await createAgency();
					// }
					await createAgency();

					redirectLogin();
				}
				console.error('Error authenticating: ', res);
			}
		} catch (error) {
			console.error('Error registering: ', error);
			if ((error.code = FIREBASE_EMAIL_EXIST_CODE)) {
				invalidEmail = {
					status: true,
					message: 'This email already exists'
				};
				setTimeout(() => {
					invalidEmail = {
						status: false,
						message: ''
					};
				}, INVALID_DELAY_TIME);
				return;
			}
		}
	}

	function redirectLogin() {
		return goto('/login');
	}

	const onChangeType = (event: CustomEvent) => {
		if (event.detail === 'ADVISOR') {
			window.openNotification({
				kind: 'warning',
				title: 'Warning',
				subtitle: 'You need an invitation from an agency to sign up as an advisor'
			});
			registerData.type = 'AGENCY';
		}
	};

	const passwordPattern = '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}';
	const emailPattern =
		'/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/';
</script>

<div class="container">
	<div class="overview-wrapper">
		<div class="overview-container">
			<div class="section-logo">
				<svg xmlns="http://www.w3.org/2000/svg" width="184" height="53" viewBox="0 0 92 21">
					<text
						id="OYSTEO"
						transform="translate(0 17)"
						font-size="18"
						font-family="GurmukhiMN, Gurmukhi MN"
						letter-spacing="0.2em"><tspan x="0" y="0">OYSTEO</tspan></text
					>
				</svg>
			</div>
			<div class="section-login">
				<div class="redirect-login-container">
					<p>ALREADY MEMBER?</p>
					<p on:click={redirectLogin}>LOG IN</p>
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
						selected={registerData.type}
						on:change={onChangeType}
					>
						<RadioButton labelText="ADVISOR" value="ADVISOR" />
						<RadioButton labelText="AGENCY" value="AGENCY" />
					</RadioButtonGroup>
					<small class="both-radio-button">*Advisor & Agency</small>
				</FormGroup>
			</div>
		</div>
	</div>

	<div class="register-wrapper" id="register-wrapper">
		<div class="section-redirect">
			<p>ALREADY MEMBER?</p>
			<p><Link href="/login">LOG IN</Link></p>
		</div>
		<div class="section-signup">
			<Form on:submit={handleSubmit}>
				<FormGroup legendText="Choose one of the following:" class="radio-group">
					<RadioButtonGroup
						orientation="vertical"
						selected={registerData.type}
						on:change={onChangeType}
					>
						<RadioButton labelText="ADVISOR" value="ADVISOR" />
						<RadioButton labelText="AGENCY" value="AGENCY" />
						<small class="both-radio-button">*Advisor & Agency</small>
					</RadioButtonGroup>
				</FormGroup>
				<FormGroup class="signup-login">
					<!-- <TextInput labelText="" placeholder="USERNAME *" required bind:value={registerData.username} pattern={emailPattern}/> -->
					<TextInput
						labelText=""
						placeholder="EMAIL *"
						required
						bind:value={registerData.email}
						invalid={invalidEmail.status}
						invalidText={invalidEmail.message}
					/>
					<PasswordInput
						labelText=""
						placeholder="PASSWORD *"
						required
						bind:value={registerData.password}
						invalid={invalidPassword.status}
						invalidText={invalidPassword.message}
					/>
					<PasswordInput
						labelText=""
						placeholder="CONFIRM PASSWORD *"
						required
						invalid={invalidConfirmPassword.status}
						invalidText={invalidConfirmPassword.message}
						bind:value={registerData.confirmPassword}
					/>
				</FormGroup>
				<Button kind="secondary" type="submit" class="btn-submit">SUBMIT</Button>
			</Form>
		</div>
		<div class="section-contact">
			<p>Need helps?</p>
			<Link href={`mailto:${contactEmail}`}>Contact OYSTEO</Link>
		</div>
	</div>
</div>
