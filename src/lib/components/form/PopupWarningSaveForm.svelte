<script lang="ts" context="module">
	import { focusInput } from '$lib/helpers/scripts';

	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { isPopupWarningSaveFormStore } from '$lib/store/isPopupWarningSaveForm';
	import { Modal } from 'carbon-components-svelte';
	const onSaveCancel = () => {
		isPopupWarningSaveFormStore.set({ open: false });
		if (handleCallBackCancel) {
			handleCallBackCancel();
		}
	};

	let handleCallBackConfirm;
	let handleCallBackCancel;

	const onSaveConfirm = () => {
		isPopupWarningSaveFormStore.set({ open: false });
		formChangeStatusStore.set({ changing: false });
		if (handleCallBackConfirm) {
			handleCallBackConfirm();
		}
	};
	export function openWarningSaveForm(config: { handleClose?: any; handleConfirm?: any }) {
		isPopupWarningSaveFormStore.set({ open: true });
		if (typeof config.handleClose == 'function') {
			// handleCallBackConfirm;
			handleCallBackCancel = config.handleClose;
		}
		// console.log(typeof config.handleConfirm);
		if (typeof config.handleConfirm == 'function') {
			handleCallBackConfirm = config.handleConfirm;
			setTimeout(() => {
				const form = document.querySelector('form');
				if (form != null) {
					const form = document.querySelector('form');
					focusInput(form);
				}
			});
		}
	}
</script>

<Modal
	class="custom-modal-mobile"
	size="sm"
	preventCloseOnClickOutside
	open={$isPopupWarningSaveFormStore.open}
	modalHeading="Your changes have not been saved"
	primaryButtonText="Yes"
	secondaryButtonText="No"
	on:click:button--secondary={onSaveCancel}
	on:submit={onSaveConfirm}
>
	<p>Do you want to save those changes?</p>
</Modal>
