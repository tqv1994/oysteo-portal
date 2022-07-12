<script lang="ts">
	import { clear } from '$lib/store/activeForm';

	import type { Address } from '$lib/store/address';
	import type { Country } from '$lib/store/country';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';

	export let activeSection = '';
	export let address: Address;
	export let target: string;
	export let countries: Country[];

	type FormData = {
		line1: string;
		line2: string;
		city: string;
		postcode: string;
		country: string | null;
		province: string;
	};

	type FormError = {
		line1?: string;
		line2?: string;
		city?: string;
		postcode?: string;
		country?: string;
		province?: string;
	};

	const dispatch = createEventDispatcher();

	let formErrors: FormError;
	let formData: FormData;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset() {
		formData = {
			line1: address?.line1 || '',
			line2: address?.line2 || '',
			city: address?.city || '',
			postcode: address?.postcode || '',
			country: address?.country?.id || null,
			province: address?.province || ''
		};
	}

	onMount(reset);
	onDestroy(reset);

	async function onSubmit() {
		const errors: FormError = {};
		if (!formData.city) {
			errors.city = 'City is required';
		}
		if (!formData.line1) {
			errors.line1 = 'Street address is required';
		}
		if (!formData.country) {
			errors.country = 'Country is required';
		}
		if (!formData.postcode) {
			errors.postcode = 'Zip code / potal code is required';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });
		try {
			let data = { address: formData };
			const res = await ppatch(target, data);

			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				clear();
				// Object.assign(address, formData);
			} else {
				notify({
					title: 'An error has occured',
					subtitle:
						'Something unexpected has happened. Please refresh the browser and sign-in again.'
				});
				console.error(await res.text());
				// location.reload();
			}
		} catch (err) {
			notify({
				title: 'An error has occured',
				subtitle: 'Something unexpected has happened. Please try again later.'
			});
			console.error(err);
		}
		isFormSavingStore.set({ saving: false });
	}
</script>

<FormGroup
	let:isEditing
	on:submit={onSubmit}
	on:cancel={reset}
	data={{...formData}}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Address" {isEditing} contentClass={'mtop-5'}>
		<div slot="value">
			<p class="advisor-address">
				{address?.line1 || ''}
			</p>
			<p class="advisor-address">
				{address?.line2 || ''}
			</p>
			<p class="advisor-address">
				{address?.city || ''}
			</p>
			<p class="advisor-address">
				{address?.province || ''}
			</p>
			<p class="advisor-address">
				{address?.country?.name || ''}
				{address?.postcode || ''}
			</p>
		</div>
		<div slot="fields">
			<div class="select-container">
				<Select
					on:change={(e) => {
						formData.country = e.detail;
					}}
					labelText="Country"
					invalid={!!formErrors?.country}
					invalidText={formErrors?.country}
					selected={address?.country?.id.toString()}
					name="country"
				>
					<SelectItem value="" text="Choose" />
					{#each countries as country}
						<SelectItem value={country.id.toString()} text={country.name} />
					{/each}
				</Select>

				<TextInput
					autofocus
					labelText="Province / State"
					placeholder="Your province or state"
					bind:value={formData.province}
					invalid={!!formErrors?.province}
					invalidText={formErrors?.province}
					name="province"
				/>
			</div>

			<TextInput
				labelText="Street address"
				placeholder="Your street"
				bind:value={formData.line1}
				invalid={!!formErrors?.line1}
				invalidText={formErrors?.line1}
				name="line1"
			/>
			<TextInput
				labelText="Street address #2"
				placeholder="Your street #2"
				bind:value={formData.line2}
				invalid={!!formErrors?.line2}
				invalidText={formErrors?.line2}
				name="line2"
			/>
			<div class="select-container">
				<TextInput
					labelText="City"
					placeholder="Your city"
					bind:value={formData.city}
					invalid={!!formErrors?.city}
					invalidText={formErrors?.city}
					name="city"
				/>
				<TextInput
					labelText="Zip code / Postal code"
					placeholder="Your zip code"
					bind:value={formData.postcode}
					invalid={!!formErrors?.postcode}
					invalidText={formErrors?.postcode}
					name="postcode"
				/>
			</div>
		</div>
	</FormRow>
</FormGroup>
<!-- address -->
