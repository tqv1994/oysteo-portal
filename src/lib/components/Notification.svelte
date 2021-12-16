<script lang="ts">
	import { ToastNotification } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	enum TOAST_NOTIFICATION_KIND {
		error = 'error',
		info = 'info',
		infoSquare = 'info-square',
		success = 'success',
		warning = 'warning',
		warningAlt = 'warning-alt'
	}
	type Config = {
		kind: TOAST_NOTIFICATION_KIND;
		title: string;
		subtitle: string;
		hideCloseButton?: boolean;
		timeout?: number;
	};
	export let kind: TOAST_NOTIFICATION_KIND = TOAST_NOTIFICATION_KIND.error;
	export let title: string = '';
	export let subtitle: string = '';
	export let hideCloseButton: boolean = false;
	export let timeout: number = 0;
	let open = false;

	const openNotification = (config: Config) => {
		kind = config.kind;
		title = config.title;
		subtitle = config.subtitle;
		hideCloseButton = config.hideCloseButton;
		timeout = config.timeout || 3000;
		open = true;
		setTimeout(() => {
			open = false;
		}, timeout + 1);
	};

	onMount(() => {
		window.openNotification = openNotification;
	});

	const onclose = () => {
		open = false;
	};
</script>

{#if open}
	<ToastNotification
		bind:hideCloseButton
		bind:kind
		bind:title
		bind:subtitle
		bind:timeout
		role="alert"
		caption={new Date().toLocaleString()}
		class="toast-notification"
		on:close={onclose}
	/>
{/if}

<style lang="scss">
	:global(.toast-notification) {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 8100;
	}
</style>
