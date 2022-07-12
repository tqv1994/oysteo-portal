<script lang="ts">
	import { isValidEmail } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import {
		Checkbox,
		DatePicker,
		DatePickerInput,
		Select,
		SelectItem,
		TextInput
	} from 'carbon-components-svelte';

	import ListItemContainer from '../../form/listitemcontainer.svelte';
	import FormRow from '../../form/row.svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { session } from '$app/stores';
	import { clear } from '$lib/store/activeForm';
	import type { Traveller } from '$lib/store/traveller';
	import { tripStore, type Trip } from '$lib/store/trip';
	import { reformatDateToEn, reformatDateToIso, toIsoString } from '$lib/helpers/datetime';
	import type { DatePickerDate, DatePickerEvent } from '$lib/store/types';

	export let traveller: Traveller;
	export let trip: Trip;
	export let activeSection = '';

	type FormData = {
		forename: string;
		surname: string;
		birthday: string;
	};

	type FormError = {
		forename?: string;
		surname?: string;
		birthday?: string;
	};

	let formErrors: FormError;
	let formData: FormData = {
		surname: traveller.surname,
		forename: traveller.forename,
		birthday: traveller.birthday
	};

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

		try {
			isFormSavingStore.set({ saving: true });
			const res = await ppatch(`traveller/${traveller.id}`, formData);

			if (res.ok) {
				const trip = await res.json();
				tripStore.update((s) => {
					const idx = s.findIndex((t) => t.id === trip.id);
					s[idx] = trip;
					return s;
				});
				activeSection = '';
				clear();
			}
		} catch (error) {
			console.error(error);
		}
		isFormSavingStore.set({ saving: false });
		onCancel();
	};

	function onJoinedDateChange(e: DatePickerEvent) {
		const date = (e.detail as DatePickerDate).selectedDates[0];
		formData.birthday = reformatDateToIso(toIsoString(date));
	}

    
</script>

<ListItemContainer
	let:isEditing
	on:edit={() => onEdit('traveller--' + traveller.id)}
	on:cancel={onCancel}
	on:submit={onSubmit}
	data={{ ...traveller }}
>
	<FormRow
		{isEditing}
		label={`${traveller.surname || ''} ${traveller.forename || ''}`}
		contentClass={'mtop-8'}
		class={'listitem-traveller'}
	>
		<div slot="fields">
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
		</div>
	</FormRow>
</ListItemContainer>
