<script lang="ts">
	import { notify } from '$lib/components/Toast.svelte';
	import { session } from '$app/stores';
	import { countryStore } from '$lib/store/country';
	import type { Destination } from '$lib/store/destination';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';
	import { Select, SelectItem } from 'carbon-components-svelte';
	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';

	export let destination: Destination;
	export let activeSection = '';
	export let countries;

	type FormData = {
		country: string | null;
	};

	type FormError = {
		country?: string;
	};

	let formErrors: FormError;
	let formData: FormData = reset();

	function getCountry(destination) {
		if (typeof destination.country == 'object') {
			return countries.find((country) => country.id == destination.country.id);
		}
		return countries.find((country) => country.id == destination.country);
	}

	$: country = getCountry(destination);

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
			country:
				typeof destination.country == 'object'
					? destination?.country?.id.toString() || null
					: destination.country.toString() || null
		};
	}

	const onSubmit = async () => {
		const errors: FormError = {};
		if (!formData.country) {
			errors.country = 'Country is required';
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
				country = getCountry(destination);
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
	isEditing={activeSection === 'destination-name-' + destination.id}
	on:edit={() => onEdit('destination-name-' + destination.id)}
	on:cancel={onCancel}
	on:submit={onSubmit}
	groupClass={'group group-destinations'}
>
	<FormRow label="Destination" {isEditing}>
		<div slot="value">
			{country?.name || ''}
		</div>
		<div slot="fields">
			<Select
				on:change={(e) => {
					formData.country = e.detail;
				}}
				labelText="Country"
				selected={formData.country}
				invalid={!!formErrors?.country}
				invalidText={formErrors?.country}
			>
				<SelectItem value="" text="Choose" />
				{#each $countryStore as country}
					<SelectItem value={country.id} text={country.name} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>
