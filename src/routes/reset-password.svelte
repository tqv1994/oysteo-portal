<script lang="ts" context="module">
	import '$lib/utils/firebase';
	import { Form, FormGroup, Button, Link, PasswordInput } from 'carbon-components-svelte';
	import { getAuth, confirmPasswordReset, browserSessionPersistence } from 'firebase/auth';
	import { checkPasswordRule } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import type { Locals } from '$lib/store/local';
	import type { Load } from '@sveltejs/kit';
	export const load: Load<{ session: Locals }> = async ({ url, params }) => {
		const resetPasswordToken = url.searchParams.get('oobCode');
		const mode = url.searchParams.get('mode');
		if (!resetPasswordToken || mode !== 'resetPassword') {
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
	import '../theme/oysteo.scss';
	import { goto } from '$app/navigation';
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
		const auth = getAuth();
		await auth.setPersistence(browserSessionPersistence); // To save user after logging into the browser session
		await confirmPasswordReset(auth, resetPasswordToken, resetPasswordData.newPassword)
			.then((res) => {
				goto('/login');
			})
			.catch((error) => {
				window.openNotification({
					kind: 'error',
					title: 'Error',
					subtitle: error.message
				});
			});
	}
</script>

<div class="login-container">
	<div class="login-wrapper">
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
			<h1>Reset Password</h1>
		</div>
		<div class="section-login">
			<Form on:submit={handleSubmit}>
				<FormGroup class="signup-login">
					<PasswordInput
						labelText=""
						placeholder="NEW PASSWORD *"
						bind:value={resetPasswordData.newPassword}
						required
						invalid={invalidNewPassword.status}
						invalidText={invalidNewPassword.message}
					/>
					<PasswordInput
						labelText=""
						placeholder="CONFIRM PASSWORD *"
						bind:value={resetPasswordData.confirmPassword}
						required
						invalid={invalidConfirmPassword.status}
						invalidText={invalidConfirmPassword.message}
					/>
				</FormGroup>
				<Button kind="secondary" type="submit" class="btn-submit">SUBMIT</Button>
			</Form>
		</div>
		<div class="section-resetpw">
			<p>Is this a mistake?</p>
			<Link href="/login">Log in now</Link>
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
