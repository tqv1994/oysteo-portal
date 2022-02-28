<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		if (session.user) {
			window.location.href = '/account';
		}
		return {
			props: {}
		};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../theme/oysteo.scss';
	import '$lib/utils/firebase';
	import {
		Form,
		FormGroup,
		Button,
		Link,
		TextInput,
		PasswordInput,
		Loading
	} from 'carbon-components-svelte';

	import {
		browserSessionPersistence,
		getAuth,
		inMemoryPersistence,
		signInWithEmailAndPassword
	} from 'firebase/auth';
	import { authStore } from '$lib/store/auth';
	import { checkPasswordRule, validateEmail } from '$lib/helpers/utils';
	import { redirect } from '$lib/utils/router';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';

	let loginData = {
		email: '',
		password: ''
	};

	let invalidPassword = {
		status: false,
		message: ''
	};
	let invalidEmail = {
		status: false,
		message: 'Invalid email'
	};

	let activeLoading = false;

	async function handleSubmit() {
		if (!validateEmail(loginData.email)) {
			invalidEmail.status = true;
			setTimeout(() => {
				invalidEmail.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		activeLoading = true;
		try {
			const auth = getAuth();
			await auth.setPersistence(browserSessionPersistence); // To save user after logging into the browser session
			const cred = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
			if (cred && cred.user) {
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
					authStore.set({ user });
					redirect('/account');
					return;
				} else {
					const error = await res.json();
					console.log(error);
				}
			}
		} catch (error) {
			invalidPassword = { status: true, message: 'Email or password is incorrect' };
			setTimeout(() => {
				invalidPassword.status = false;
			}, INVALID_DELAY_TIME);
			console.error('Error login', error);
		}
		activeLoading = false;
	}
</script>

<Loading active={activeLoading} />
<div class="login-container">
	<div class="login-wrapper">
		<div class="section-logo">
			<svg xmlns="http://www.w3.org/2000/svg" width="184" height="53" viewBox="0 0 92 21">
				<text
					id="OYSTEO"
					transform="translate(0 17)"
					font-size="18"
					letter-spacing="0.2em"><tspan x="0" y="0">OYSTEO</tspan></text
				>
			</svg>
			<h1>Welcome</h1>
		</div>
		<div class="section-login">
			<Form on:submit={handleSubmit}>
				<FormGroup class="signup-login">
					<TextInput
						labelText=""
						placeholder="EMAIL *"
						bind:value={loginData.email}
						required
						invalid={invalidEmail.status}
						invalidText={invalidEmail.message}
					/>
					<PasswordInput
						labelText=""
						placeholder="PASSWORD *"
						bind:value={loginData.password}
						required
						invalid={invalidPassword.status}
						invalidText={invalidPassword.message}
					/>
				</FormGroup>
				<Button kind="secondary" type="submit" class="btn-submit">SUBMIT</Button>
			</Form>
		</div>
		<div class="section-resetpw">
			<p>Can't login?</p>
			<Link href="/forgot-password">Reset password</Link>
		</div>
	</div>
</div>
