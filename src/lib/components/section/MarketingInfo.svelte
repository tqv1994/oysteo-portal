<script lang="ts">
	import type { Agency } from '$lib/store/agency';
	import { session } from '$app/stores';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';
	import { TextArea, TextInput } from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';
	import { clear } from '$lib/store/activeForm';

	export let target: string;
	export let agency: Agency;
	export let activeSection = '';

	type MarketingInfoInput = {
		description: string;
		profile: string;
		website: string;
	};

	let formData: MarketingInfoInput;
	const reset = () => {
		formData = {
			description: agency.description,
			profile: agency.profile,
			website: agency.website
		};
	};

	onMount(reset);
	onDestroy(reset);

	type FormError = {
		website?: string;
	};

	const dispatch = createEventDispatcher();

	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const updateMarketingInformation = async (website = false) => {
		const errors: FormError = {};
		if (website == true) {
			if (Object.keys(errors).length) {
				showErrors(errors);
				return;
			}
		}

		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, formData);
			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				session.update((s) => {
					s.agencyMe.description = formData.description;
					s.agencyMe.profile = formData.profile;
					s.agencyMe.website = formData.website;
					return s;
				});
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
			console.error('Failed to update phone numbers', error);
		}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing={isEditingInfo}
	on:submit={() => updateMarketingInformation()}
	on:cancel={reset}
	data={{ ...formData }}
>
	<FormRow label="Agency Description" isEditing={isEditingInfo} contentClass={'mtop-6'}>
		<div slot="value">
			<p class="marketing-info">
				{agency.description || ''}
			</p>
		</div>
		<div slot="fields">
			<TextArea
				autofocus
				labelText="Max: 100 character"
				cols={50}
				placeholder="Enter agency description"
				rows={4}
				maxlength={100}
				bind:value={formData.description}
				name="description"
			/>
		</div>
	</FormRow>
	<FormRow label="Agency Profile" isEditing={isEditingInfo} contentClass={'mtop-6'}>
		<div slot="value">
			<p class="marketing-info">
				{agency.profile || ''}
			</p>
		</div>
		<div slot="fields">
			<TextArea
				labelText="Max: 750 character"
				cols={50}
				placeholder="Enter agency profile"
				rows={5}
				maxlength={750}
				bind:value={formData.profile}
				name="profile"
			/>
		</div>
	</FormRow>
</FormGroup>

<slot />

<FormGroup
	let:isEditing={isEditingWebsite}
	on:submit={() => updateMarketingInformation(true)}
	data={{ website: agency.website }}
>
	<FormRow label="Website" isEditing={isEditingWebsite}>
		<div slot="value">{agency.website || ''}</div>
		<div slot="fields">
			<TextInput
				autofocus
				name="website"
				placeholder="Enter your website"
				bind:value={formData.website}
				invalid={!!formErrors?.website}
				invalidText={formErrors?.website}
			/>
		</div>
	</FormRow>
</FormGroup>
