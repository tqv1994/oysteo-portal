<script lang="ts" context="module">
	import { ToastNotification } from 'carbon-components-svelte';

	import { writable } from 'svelte/store';

	export type Toast = {
		id?: string;
		kind?: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';
		lowContrast?: boolean;
		timeout?: number;
		role?: string;
		title?: string;
		subtitle?: string;
		caption?: string;
		iconDescription?: string;
		hideCloseButton?: boolean;
		closed?: boolean;
	};

	const toasts = writable<Toast[]>([]);

	export function notify(toast: Toast) {
		toasts.update((toasts) => {
			let i = toasts.length;
			// Remove all toasts that have been marked for removal
			while (i--) {
				if (toast.closed) {
					toasts.splice(i, 1);
				}
			}
			toasts.push({
				...toast,
				lowContrast: toast.lowContrast === false ? false : true, // Low Contrast is true by default
				timeout: toast.timeout >= 0 ? toast.timeout : 3000 // 3s default timeout
			});
			return toasts;
		});
	}

	function removeToast(toast: Toast) {
		// Mark toast for removal later
		toast.closed = true;
	}

	export function cancel(id: string) {
		toasts.update((toasts) => {
			const index = toasts.findIndex((toast) => {
				return toast.id === id;
			});
			if (index >= 0) {
				toasts.splice(index, 1);
			}
			return toasts;
		});
	}
</script>
<div class="toasts">
	{#each $toasts as toast}
		<ToastNotification {...toast} on:close={() => removeToast(toast)} />
	{/each}
</div>

<style lang="scss">
	@use '../../theme/mixins';
	.toasts {
		position: fixed;
		top: 3rem;
		right: 0;
		@include mixins.mobile {
			position: absolute;
			top: 4rem;
			right: auto;
			left: 50%;
			width: calc(100vw - 4.5rem);
			background-color: #fff;
			padding: 0 1rem 0.5rem;
			transform: translateX(-50%);
			:global(.bx--toast-notification) {
				width: 100%;
			}
		}
		&:empty{
			display: none;
		}
	}
</style>
