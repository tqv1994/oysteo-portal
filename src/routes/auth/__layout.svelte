<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { get } from 'svelte/store';
	import { authStore } from '$lib/store/auth';
	import '$lib/utils/firebase';
	import Toast from '$lib/components/Toast.svelte';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { Link } from 'carbon-components-svelte';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';

	export const load: Load = async () => {
		const { user } = get(authStore);
		if (user) {
			return redirect('/account');
		}
		return {};
	};
</script>

<div class="login-container">
	<div class="login-wrapper">
		<div class="section-logo">
			<div class="logo login-logo">
				<Link href="/">
					<OysteoLogo width={130} height={17.217} />
				</Link>
			</div>
		</div>
		<div class="section-login">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	@use '../../theme/color';
	@use '../../theme/mixins';
	:global(.saving-modal) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.4);
	}

	@include mixins.desktop {
		.login-wrapper {
			padding: 0;
			:global(input) {
				font-family: Surt;
				padding: 0 2rem;
				height: 50px;
				background: color.$oysteo-white;
				font-size: 1rem;
			}
			:global(input:focus) {
				border: 1px solid color.$oysteo-black;
			}
			:global(.btn-submit) {
				font-family: Surt;
				max-width: 25rem;
				margin: 0;
				text-align: center;
				font-size: 1rem;
			}
			.section-logo {
				text-align: center;
			}
		}

		.login-container {
			min-height: 770px;
			height: 100vh;
		}

		.login-wrapper,
		.overview-wrapper {
			:global(.section-logo svg) {
				width: 200px;
				height: auto;
				margin-top: 42px;
			}
		}
		.login-wrapper {
			left: 8%;
			top: 12%;
			color: black;
			background: rgba(255, 255, 255, 0.75);
			width: 400px;
			height: auto;
			padding-bottom: 65px;
			position: relative;

			@include mixins.mobile {
				max-width: 100%;
				.section-login {
					flex-basis: unset;
				}
			}

			:global(input:-webkit-autofill),
			:global(input:-webkit-autofill:hover),
			:global(:-webkit-autofill:focus),
			:global(:-webkit-autofill:active) {
				-webkit-box-shadow: 0 0 0 30px color.$oysteo-white inset !important;
			}
			.section-login {
				padding: 48px 20px 0;
				:global(h1) {
					padding-top: 0;
					transform: translateY(-15%);
					padding-bottom: 0;
					font-size: 14px;
					font-family: Surt;
					text-align: center;
					display: block;
				}
				:global(button) {
					width: 100%;
				}
			}
			.section-logo {
				background-color: color.$oysteo-white;
				height: 115px;
			}
		}

		.login-container {
			position: relative;
			height: 100vh;
			background-size: cover;
			background-image: url('/static/bg-login.jpg');
		}
	}
	@include mixins.mobile {
		.login-container {
			position: relative;
			height: 100vh;
			background-size: cover;
			background-image: url('/static/bg-login.jpg');
		}
		.login-wrapper {
			max-width: 100%;
			height: 100vh;
			background-color: color.$white-secondary;
			padding: 1.25rem 2.25rem 2.25rem 2.25rem;
			color: color.$oysteo-gray-50;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			width: 100vw;
			min-height: 100%;
			.section-logo {
				text-align: center;
			}
			.section-login {
				flex-basis: unset;
				margin-top: 36px;
				:global(input),
				:global(.btn-submit) {
					font-family: Surt;
				}
				:global(h1) {
					padding-top: 20px;
					margin: 0;
					text-align: center;
					font-family: GTSupper;
					color: black;
					font-weight: 400;
					font-size: 2.25rem;
					line-height: 1.75rem;
					margin-bottom: 3rem;
				}
				:global(.section-resetpw) {
					margin-top: 0;
				}
				:global(::placeholder) {
					text-transform: uppercase;
				}
				text-align: center;
				:global(.section-login--messenge) {
					row-gap: 30px;
					:global(.section-login--messenge-content) {
						text-align: left;
					}
				}
			}
		}
	}
	.section-login {
		--cds-disabled-03: #fff;
		.section-login--messenge {
			text-align: center;
			:global(p) {
				margin-bottom: 10px;
			}
		}
		:global(form) {
			row-gap: 20px;
		}

		:global(.section-resetpw) {
			padding-top: 5px;
		}
		:global(.section-login--messenge) {
			display: flex;
			justify-content: space-between;
			row-gap: 20px;
			flex-direction: column;
			:global(.section-login--messenge-content p:last-child) {
				margin-bottom: 0;
			}
		}
	}
</style>
