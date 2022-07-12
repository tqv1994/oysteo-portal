<script lang="ts">
	import { type Trip, tripStore } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { TextInput } from 'carbon-components-svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { clear } from '$lib/store/activeForm';
	export let trip: Trip | undefined;
	type FormData = {
		policyId?: string;
		contact?: string;
		website?: string;
	};
	type FormError = {
		policyId?: string;
		contact?: string;
		website?: string;
	};
	let policyId: string = trip?.policyId;
	let contact: string = trip?.contact;
	let website: string = trip?.website;
	let formErrors: FormError;

	let formData: FormData = reset();
	let activeSection = '';
	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset(): FormData {
		return {
			policyId: policyId || null,
			contact: contact || null,
			website: website || null
		};
	}
	const onEdit = (section: string) => {
		activeSection = section;
	};
	const onCancel = () => {
		activeSection = '';
	};

	const onSubmit = async () => {
		const errors: FormError = {};
		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(`trips/${trip.id}`, formData);
			if (res.ok) {
				trip = await res.json();
				tripStore.update((s) => {
					const idx = s.findIndex((t) => t.id === trip.id);
					s[idx] = trip;
					return s;
				});
				activeSection = '';
				clear();
			} else {
				notify({
					title: 'Update failed',
					subtitle: 'Failed to update information, please try again later.'
				});
			}
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update emergency info', error);
		}

		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	groupClass="custom-group group"
	let:isEditing
	on:edit={() => onEdit('emergency-info')}
	on:cancel={onCancel}
	on:submit={onSubmit}
	data={{
		policyId: formData.policyId || '',
		contact: formData.contact || '',
		website: formData.website || ''
	}}
>
	<FormRow label="Insurance Policy" {isEditing}>
		<div slot="value">{trip?.policyId || ''}</div>
		<div slot="fields">
			<TextInput
				autofocus
				bind:value={formData.policyId}
				invalid={!!formErrors?.policyId}
				invalidText={formErrors?.policyId}
				name="policyId"
			/>
		</div>
	</FormRow>
	<FormRow label="Contact" {isEditing}>
		<div slot="value">{trip?.contact || ''}</div>
		<div slot="fields">
			<TextInput
				bind:value={formData.contact}
				invalid={!!formErrors?.contact}
				invalidText={formErrors?.contact}
				name="contact"
			/>
		</div>
	</FormRow>
	<FormRow label="Website" {isEditing}>
		<div slot="value">{trip?.website || ''}</div>
		<div slot="fields">
			<TextInput
				bind:value={formData.website}
				invalid={!!formErrors?.website}
				invalidText={formErrors?.website}
				name="website"
			/>
		</div>
	</FormRow>
</FormGroup>
