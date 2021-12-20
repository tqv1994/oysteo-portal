<script lang="ts">
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { Modal } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	let warningSaveOpen: boolean = false;
	const onSaveCancel = () => {
		warningSaveOpen = false;
		if (handleCallBackCancel) {
			handleCallBackCancel();
		}
	};

	let handleCallBackConfirm;
	let handleCallBackCancel;

	const onSaveConfirm = () => {
		warningSaveOpen = false;
		formChangeStatusStore.set({ changing: false });
		if (handleCallBackConfirm) {
			handleCallBackConfirm();
		}
	};
	const openWarningSaveForm = (config: {
		handleClose?: any;
		handleConfirm?: any;
	}) => {
		warningSaveOpen = true;
		if (typeof config.handleClose == 'function') {
			// handleCallBackConfirm;
			handleCallBackCancel = config.handleClose;
		}
		// console.log(typeof config.handleConfirm);
		if (typeof config.handleConfirm == 'function') {
			handleCallBackConfirm = config.handleConfirm;
		}
	};

	onMount(() => {
		window.openWarningSaveForm = openWarningSaveForm;
	});
</script>

<Modal
	size="sm"
	preventCloseOnClickOutside
	bind:open={warningSaveOpen}
	modalHeading="Your changes have not been saved"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	on:click:button--secondary={onSaveCancel}
	on:submit={onSaveConfirm}
>
	<p>Do you want to save those changes?</p>
</Modal>
