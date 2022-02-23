<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../theme/oysteo.scss';
	import '$lib/utils/firebase';
	import { Form, FormGroup, Button, Link, TextInput } from 'carbon-components-svelte';
	import { getAuth, inMemoryPersistence, sendPasswordResetEmail } from 'firebase/auth';
	import { validateEmail } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME, TIME_RESEND_EMAIL_FORGOT_PW } from '$lib/utils/constants';

	let forgotPasswordData = {
		email: '',
		emailSend: false
	};

	let invalidPassword = {
		status: false,
		message: ''
	};
	let invalidEmail = {
		status: false,
		message: 'Invalid email'
	};

	let count = TIME_RESEND_EMAIL_FORGOT_PW;
	let countDownStart: boolean = false;
	const countDown = () => {
		if (count > 0 && countDownStart) {
			count--;
			setTimeout(countDown, 1000);
		} else {
			countDownStart = false;
			count = TIME_RESEND_EMAIL_FORGOT_PW;
		}
	};

	async function handleSubmit() {
		if (!validateEmail(forgotPasswordData.email)) {
			invalidEmail.status = true;
			setTimeout(() => {
				invalidEmail.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		const auth = getAuth();
		sendPasswordResetEmail(auth, forgotPasswordData.email)
		.then(() => {
			if (forgotPasswordData.emailSend) {
				countDownStart = true;
				countDown();
			}
			forgotPasswordData.emailSend = true;
		})
		.catch((error) => {
			invalidEmail = {
				status: true,
				message: error.message
			};
			setTimeout(() => {
				invalidEmail.status = false;
			}, INVALID_DELAY_TIME);
			// ..
		});
	}

	const passwordPattern = '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}';
	const emailPattern =
		'/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/';
</script>

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
			<h1>Forgot Password</h1>
		</div>
		<div class="section-login">
			<Form on:submit={handleSubmit}>
				{#if !forgotPasswordData.emailSend}
					<FormGroup class="signup-login">
						<TextInput
							labelText=""
							placeholder="EMAIL *"
							bind:value={forgotPasswordData.email}
							required
							invalid={invalidEmail.status}
							invalidText={invalidEmail.message}
						/>
					</FormGroup>
					<Button kind="secondary" type="submit" class="btn-submit">SUBMIT</Button>
				{:else}
					<div class="section-login--messenge">
						<p>
							We have sent a password reset link to email <b>{forgotPasswordData.email}</b>. Please
							check your email again
						</p>
						<p>If you do not receive our email, please click the <b>Resend</b> Button</p>
					</div>
					{#if !countDownStart}
						<Button kind="secondary" type="submit" class="btn-submit">RESEND</Button>
					{:else}
						<Button kind="secondary" type="button" disabled class="btn-submit btn-count-down"
							>{count}</Button
						>
					{/if}
				{/if}
			</Form>
		</div>
		<div class="section-resetpw">
			<p>You don't have an account?</p>
			<Link href="/">Register</Link>
		</div>
	</div>
</div>

<style lang="scss">
	b {
		font-weight: 700;
	}
	.section-login {
		--cds-disabled-03: #fff;
		.section-login--messenge {
			text-align: center;
			p {
				margin-bottom: 10px;
			}
		}
	}
</style>
