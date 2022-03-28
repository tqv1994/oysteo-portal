<script lang="ts" context="module">
	import '$lib/utils/firebase';
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ url, params }) => {
		return {
			props: {}
		};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';
	import { Link } from 'carbon-components-svelte';
	import ODeviceDetector from '$lib/components/ODeviceDetector.svelte';
</script>

<ODeviceDetector showInMobile={true}>
	<h1>Account verification successful</h1>
</ODeviceDetector>
<div class="section-login--messenge register-success">
	<ODeviceDetector showInDesktop={true}>
		<h1>Account verification successful</h1>
	</ODeviceDetector>

	<div class="section-login--messenge-content">
		<p>Your account has been verified</p>
	</div>
	<div class="section-resetpw">
		<p>Go to sign in</p>
		<Link href="/auth/sign-in">Sign in</Link>
	</div>
</div>

<style lang="scss">
	b {
		font-weight: 700;
	}
	.section-login--messenge .section-login--messenge-content {
		text-align: center !important;
	}
	.register-success {
		--cds-disabled-03: #fff;
	}
</style>
