<script lang="ts">
	import { Checkbox, DatePicker, DatePickerInput } from 'carbon-components-svelte';
	import type { Destination } from '$lib/store/destination';
	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';
	import {
		reformatDateToEn,
		reformatDateToIso,
		reformatDateToMonthYear,
		toIsoString
	} from '$lib/helpers/datetime';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { session } from '$app/stores';
	import { notify } from '$lib/components/Toast.svelte';
	import { ppatch } from '$lib/utils/fetch';
	import type { DatePickerDate, DatePickerEvent } from '$lib/store/types';

	export let destination: Destination;
	export let activeSection = '';

	type FormData = {
		date_visited?: string;
		visible?: boolean;
	};

	type FormError = {
		date_visited?: string;
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
			date_visited: destination.date_visited || '',
			visible: !!destination.visible
		};
	}

	const onSubmit = async () => {
		const errors: FormError = {};
		if (!formData.date_visited) {
			errors.date_visited = 'Date is required';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });
		try {
			// return _ppatch({}, { joined_at: reformatDateToIso(formData.joined_at) });
			const res = await ppatch(`destinations/${destination.id}`, {
				date_visited: reformatDateToIso(formData.date_visited)
			});
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

	const onVisibleChange = async () => {
		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(`destinations/${destination.id}`, { visible: formData.visible });
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

	function onDateVisitedChange(e: DatePickerEvent) {
		const date = (e.detail as DatePickerDate).selectedDates[0];
		formData.date_visited = toIsoString(date);
	}

	function onDateVisitedInputChange(event: FocusEvent) {
		const field = event.target as HTMLInputElement;
		if (!field.value) {
			formData.date_visited = '';
		}
	}
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'date_visited' + destination.id}
	on:edit={() => onEdit('date_visited' + destination.id)}
	on:cancel={onCancel}
	on:submit={onSubmit}
	groupClass={'group group-destinations'}
>
	<FormRow label="Last Date Visited" {isEditing}>
		<div slot="value">
			{reformatDateToMonthYear(destination.date_visited)}
		</div>
		<div slot="fields" style="position:relative">
			<DatePicker
				on:change={onDateVisitedChange}
				value={reformatDateToEn(destination.date_visited)}
				dateFormat="d/m/Y"
				datePickerType="single"
				maxDate={new Date()}
			>
				<DatePickerInput
					id="date_visited"
					labelText="last date visited"
					on:blur={onDateVisitedInputChange}
					placeholder="dd/mm/yyyy"
					invalid={!!formErrors?.date_visited}
					invalidText={formErrors?.date_visited}
				/>
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
<Checkbox labelText="Visible" bind:checked={formData.visible} on:change={onVisibleChange} />
