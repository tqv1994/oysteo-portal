<script lang="ts">
	import { notify } from '$lib/components/Toast.svelte';
	import type { Advisor } from '$lib/store/advisor';
	import { session } from '$app/stores';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppost } from '$lib/utils/fetch';
	import { DatePicker, DatePickerInput, Modal, TextInput } from 'carbon-components-svelte';
	import FormRow from '../../form/row.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { clear } from '$lib/store/activeForm';
	import type { tripStore, Trip } from '$lib/store/trip';
	import { reformatDateToEn, reformatDateToIso, toIsoString } from '$lib/helpers/datetime';
	import type { DatePickerDate, DatePickerEvent } from '$lib/store/types';
	import { travellersStore, type Traveller } from '$lib/store/traveller';
	export let trip: Trip;
	export let open = false;

	let formData: TravellerForm;
	const dispatch = createEventDispatcher();

	function reset() {
		formData = {
			forename: '',
			surname: '',
			birthday: '',
		};
	}

	type TravellerForm = {
		forename: string;
		surname: string;
		birthday: string;
	};

	type FormError = {
		forename?: string;
		surname?: string;
		birthday?: string;
	};

	reset();
	onDestroy(reset);

	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const onSubmit = async () => {
		const errors: FormError = {};
		if (!formData.surname) {
			errors.surname = 'Surname is required';
		}
		if (!formData.forename) {
			errors.forename = 'Forename is required';
		}
		if (!formData.birthday) {
			errors.birthday = 'Birthday is required';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		let finalFormData = { ...formData, tripId: trip.id };

		isFormSavingStore.set({ saving: true });

		try {
			const res = await ppost('trip/createTraveller', finalFormData);
			if (res.ok) {
				const traveller = await res.json();
				travellersStore.update((s) => {
						const travellerSelectedIndex = (s || []).findIndex(
							(item) => item.id.toString() === traveller.id.toString()
						);
						if (travellerSelectedIndex >= 0) {
							s[travellerSelectedIndex] = traveller;
						} else {
							s.push(traveller);
						}

					return s;
				});
				dispatch('created', traveller);
				// tripStore.update((s) => {
				// 	const idx = s.findIndex((t) => t.id === trip.id);
				// 	s[idx].travellers.push(traveller);
				// 	trip = s[idx];
				// 	return s;
				// });

				// if (trip.travellers.length == 1) {
				// 	travellersStore.update((s) => {
				// 		s.push(traveller);
				// 		return s;
				// 	});
				// } else {
				// 	relatives.push(traveller);
				// }
			}
		} catch (error) {
			notify({
				title: 'create failed',
				subtitle: 'Failed to create traveller, please try again later.'
			});
			console.error('Failed to create traveller', error);
		}
		open = false;
		clear();
		reset();
		isFormSavingStore.set({ saving: false });
	};

	function onJoinedDateChange(e: DatePickerEvent) {
		const date = (e.detail as DatePickerDate).selectedDates[0];
		formData.birthday = reformatDateToIso(toIsoString(date));
	}
</script>

<Modal
	bind:open
	modalHeading="Create traveller"
	primaryButtonText="Confirm"
	secondaryButtonText="Cancel"
	on:click:button--secondary={() => (open = false)}
	on:open
	on:close
	on:submit={onSubmit}
>
	<TextInput
		labelText="Surname"
		placeholder="Enter traveller surname"
		bind:value={formData.surname}
		invalid={!!formErrors?.surname}
		invalidText={formErrors?.surname}
		name="surname"
	/>
	<TextInput
		labelText="Forename"
		placeholder="Enter traveller forename"
		bind:value={formData.forename}
		invalid={!!formErrors?.forename}
		invalidText={formErrors?.forename}
		name="forename"
	/>

	<DatePicker
		on:change={onJoinedDateChange}
		value={reformatDateToEn(formData.birthday)}
		dateFormat="d/m/Y"
		datePickerType="single"
	>
		<DatePickerInput
			labelText="Birthday"
			placeholder="mm/dd/yyyy"
			invalid={!!formErrors?.birthday}
			invalidText={formErrors?.birthday}
			name="birthday"
		/>
	</DatePicker>
</Modal>
