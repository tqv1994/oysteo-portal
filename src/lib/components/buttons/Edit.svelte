<script lang="ts">
	import { focusInput } from '$lib/helpers/scripts';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { Link } from 'carbon-components-svelte';
	import { RequestQuote as RequestQuoteIcon } from 'carbon-icons-svelte';
	import { openWarningSaveForm } from '../form/PopupWarningSaveForm.svelte';
	function onEdit() {
		setTimeout(() => {
			const form = document.querySelector('form');
			if (form) {
				focusInput(form);
			}
		}, 0);
		// if ($formChangeStatusStore.changing === false) {
		setTimeout(() => {
			const form = document.querySelector('form');
			if (form) {
				focusInput(form);
				form.addEventListener('input', function () {
					formChangeStatusStore.set({ changing: true });
				});
			}
		}, 0);
		// } else {
		// 	openWarningSaveForm({ handleConfirm: onEdit });
		// }
	}
</script>

<span on:click>
	<Link href="javascript:void(0)" on:click={onEdit}>Edit <RequestQuoteIcon size={16} /></Link>
</span>

<style lang="scss">
	span :global(.bx--link) {
		color: var(--cds-link-01);
	}
</style>
