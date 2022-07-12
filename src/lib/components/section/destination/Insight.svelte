<script lang="ts">
	import { notify } from '$lib/components/Toast.svelte';
	import { session } from '$app/stores';
	import type { Destination } from '$lib/store/destination';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';
	import { TextArea } from 'carbon-components-svelte';
	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';

	export let destination: Destination;
	export let activeSection = '';

	type FormData = {
		description: string | null;
	};

	type FormError = {
		description?: string;
	};

	let formErrors: FormError;
	let formData: FormData = reset();

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};

	function onCancel() {
		activeSection = '';
	}

	function reset() {
		return {
			description: destination.description?.toString() || null
		};
	}

	const onSubmit = async () => {
		const errors: FormError = {};
		if (!formData.description) {
			errors.description = 'Insight is required';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(`destinations/${destination.id}`, formData);
			if (res.ok) {
				const destination = await res.json();
				session.update((s) => {
					for (const i in s.advisorMe.destinations) {
						if (s.advisorMe.destinations[i].id === destination.id) {
							s.advisorMe.destinations[i] = {
								...destination,
								country: destination.country.id
							};
							break;
						}
					}
					return s;
				});
				activeSection = '';
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
			console.error('Failed to update business insurance', error);
		}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'insignt-' + destination.id}
	on:edit={() => onEdit('insignt-' + destination.id)}
	on:cancel={onCancel}
	on:submit={onSubmit}
	groupClass={'group group-destinations'}
>
	<FormRow label="Insight" {isEditing} contentClass={'mtop-7'}>
		<div slot="value">
			<p class="destination-insight">
				{destination.description || ''}
			</p>
		</div>
		<div slot="fields">
			<TextArea
				autofocus
				labelText="Add Insight"
				placeholder="Enter insight"
				bind:value={formData.description}
				invalid={!!formErrors?.description}
				invalidText={formErrors?.description}
			/>
		</div>
	</FormRow>
</FormGroup>
