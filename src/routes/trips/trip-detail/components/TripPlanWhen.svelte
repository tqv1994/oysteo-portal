<script lang="ts">
	import { dateDiffInDays, formatDate, formatOutputDatePicker } from '$lib/helpers/datetime';
	import {
		tripStore,
		type Trip,
		type TRipInput
	} from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { DatePicker, DatePickerInput } from 'carbon-components-svelte';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { onMount } from 'svelte';
	import ODatePickerInput from '$lib/components/input/ODatePickerInput.svelte';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { session } from '$app/stores';
	import { clear } from '$lib/store/activeForm';
	export let trip: Trip | undefined;
	type FormData = {
		return_at?: string;
		depart_at?: string;
	};
	type FormError = {
		return_at?: string;
		depart_at?: string;
	};
	let activeSection = '';
	let return_at: string = trip?.return_at;
	let depart_at: string = trip?.depart_at;
	let formErrors: FormError;
	let formData: FormData = reset();

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset(): FormData {
		return {
			return_at: return_at || null,
			depart_at: depart_at || null
		};
	}

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
			const res = await ppatch(`trips/${trip.id}`, {
				...formData,
				return_at: new Date(formData.return_at),
				depart_at: new Date(formData.depart_at)
			});
			if (res.ok) {
				trip = await res.json();
				tripStore.update((s) => {
					const idx = s.findIndex((t) => t.id === trip.id);
					s[idx] = trip;
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
			console.error('Failed to update business insurance', error);
		}
		activeSection = '';
		isFormSavingStore.set({ saving: false });
	};

	const getMinDate = () => {
		const currentDate = new Date();
		currentDate.setDate(currentDate.getDate() - 1);
		if (trip) {
			if (trip?.depart_at) {
				const departAtDate = new Date(trip.depart_at);
				departAtDate.setDate(departAtDate.getDate() - 1);
				if (departAtDate <= currentDate) {
					return departAtDate;
				}
			}
		}
		return currentDate;
	};
</script>

<FormGroup
	let:isEditing
	on:cancel={onCancel}
	on:submit={onSubmit}
	data={{ depart_at: formData?.return_at, return_at: formData?.return_at }}
>
	<h6>When</h6>
	<FormRow label="Departure Date" {isEditing}>
		<div slot="value">
			{trip?.depart_at ? formatDate(trip?.depart_at) : ''}
		</div>
		<div slot="fields" style="poition: relative">
			<DatePicker
				class="fix-position"
				on:change={(e) => {
					formData.depart_at = e?.detail?.dateStr || '';
					if (formData.return_at < formData.depart_at) {
						formData.return_at = e.detail?.dateStr || '';
					}
				}}
				minDate={getMinDate()}
				maxDate={formData.return_at}
				value={formatOutputDatePicker(formData?.depart_at)}
				datePickerType="single"
			>
				<ODatePickerInput
					name="depart_at"
					bind:value={formData.depart_at}
					placeholder="mm/dd/yyyy"
				/>
			</DatePicker>
		</div>
	</FormRow>
	<FormRow label="Return Date" {isEditing}>
		<div slot="value">
			{trip?.return_at ? formatDate(trip?.return_at) : ''}
		</div>
		<div slot="fields" style="position: relative">
			<DatePicker
				on:change={(e) => {
					formData.return_at = e?.detail?.dateStr || '';
					if (formData.return_at < formData.depart_at) {
						formData.depart_at = e.detail?.dateStr || '';
					}
				}}
				minDate={formData?.depart_at ? formData?.depart_at : getMinDate()}
				value={formatOutputDatePicker(formData?.return_at)}
				datePickerType="single"
			>
				<ODatePickerInput
					name="return_at"
					bind:value={formData.return_at}
					placeholder="mm/dd/yyyy"
				/>
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
