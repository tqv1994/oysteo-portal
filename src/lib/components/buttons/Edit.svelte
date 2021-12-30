<script lang="ts">
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';

	import { Link } from 'carbon-components-svelte';
	import { RequestQuote16 } from 'carbon-icons-svelte';
	function onEdit() {
		if ($formChangeStatusStore.changing === false) {
			setTimeout(() => {
				const form = document.querySelector('form');
				form.addEventListener('input', function () {
					formChangeStatusStore.set({ changing: true });
				});
			}, 0);
		} else {
			window.openWarningSaveForm({ handleConfirm: onEdit });
		}
	}
</script>

<span on:click>
	<Link href="javascript:void(0)" on:click={onEdit}>Edit <RequestQuote16 /></Link>
</span>

<style lang="scss">
	span :global(.bx--link) {
		color: var(--cds-link-01);
	}
</style>
