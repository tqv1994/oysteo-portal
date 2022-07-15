<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { type Trip, TRipInput, tripStore } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import {
		Button,
		Column,
		Grid,
		Link,
		Row,
		Select,
		SelectItem,
		TextInput
	} from 'carbon-components-svelte';
	import { RELATIVES, type Traveller, travellersStore } from '$lib/store/traveller';
	import { CloseOutline as CloseOutlineIcon } from 'carbon-icons-svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { clear } from '$lib/store/activeForm';
	import CreateTraveller from '$lib/components/section/trip-traveller/CreateTraveller.svelte';
	import { onMount } from 'svelte';

	export let trip: Trip;

	type FormData = {
		travellers?: string[];
	};
	type FormError = {
		travellers?: string;
	};

	let activeSection = '';
	let travellerIds: string[] = (trip?.travellers || []).map((item) => item.id.toString());
	let formErrors: FormError;
	let formData: FormData = reset();
	let open = false;

	const getTravellers = (): Traveller[] => {
		let result: Traveller[] = [];
		const travellerSelected = getTripCreator();
		if (travellerSelected) {
			result.push(travellerSelected);
			for (let key in RELATIVES) {
				if (key == 'children' && travellerSelected.children) {
					result.push({ ...travellerSelected.children });
				} else {
					if (travellerSelected[key]) {
						travellerSelected[key].map((traveller) => {
							result.push(traveller);
						});
					}
				}
			}
		}else{
			result = [...$travellersStore];
		}
		return result;
	};

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset(): FormData {
		return {
			travellers: travellerIds || null
		};
	}
	const onEdit = (section: string) => {
		activeSection = section;
	};
	function onCancel() {
		activeSection = '';
	}

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

	const getFullName = (traveller: Traveller) => {
		let result = '';
		if (traveller) {
			result = `${traveller.forename || ''} ${traveller.surname || ''}`;
		}
		return result;
	};

	const onAddTraveller = () => {
		const data: string[] = formData.travellers ? [...formData.travellers] : [];
		data.push('0');
		formData.travellers = data;
	};

	function onCreatedTraveller(event: CustomEvent<Traveller>) {
		if (trip.travellers && trip.travellers.length > 0) {
			trip.travellers.push(event.detail);
		} else {
			trip.travellers = [event.detail];
		}
		travellerIds = (trip?.travellers || []).map((item) => item.id.toString());
		formData = reset();
	}

	function getTripCreator(): Traveller | undefined{
		return (trip.travellers || []).find(item=>item?.userMe && (item?.userMe || '').toString() === (trip.user || '').toString());
	}
</script>

<CreateTraveller
	bind:open
	bind:trip
	on:created={onCreatedTraveller}
/>
<FormGroup
	let:isEditing
	on:edit={() => {
		onEdit('trip-plan');
	}}
	on:cancel={onCancel}
	on:submit={onSubmit}
	editLabel="Add/Remove"
	hideEditIcon={true}
	data={{ ...formData }}
>
	<h6>Who</h6>
	<FormRow label="Travelers" {isEditing}>
		<div slot="value">
			<Grid>
				{#each trip?.travellers || [] as traveller, index}
					<Row>
						<Column lg={6} md={6}>
							{getFullName(traveller)}
						</Column>
						<Column lg={6} md={6}>
							{formatDate(traveller?.birthday)}
						</Column>
					</Row>
				{/each}
			</Grid>
		</div>
		<div slot="fields">
			{#each formData.travellers || [] as id, index}
				<div class="travellers-container">
					<Select
						labelText="Traveller"
						hideLabel
						name="relative-{id}"
						bind:selected={id}
						invalid={!!formErrors?.travellers[index]}
						invalidText={formErrors?.travellers[index]}
						disabled={getTripCreator() && index === 0 ? true : false}
					>
						<SelectItem text="Choose" value="" />
						{#each (getTravellers() || []) as item}
							<SelectItem
								value={item.id.toString()}
								text={`${item.forename ?? 'No'} ${item.surname ?? 'Name'}`}
							/>
						{/each}
					</Select>
					{#if !getTripCreator() || index > 0}
					<Button
						sizes="field"
						kind="ghost"
						class="remove-aff-item"
						iconDescription="Remove"
						icon={CloseOutlineIcon}
						on:click={() => {
							formData.travellers = formData.travellers.filter(
								(ele, key) => ele !== formData.travellers[index]
							);
						}}
					/>
					{/if}
				</div>
			{/each}
			{#if getTravellers().length > 1}
				<Link on:click={onAddTraveller} id="bx--link-add" class="w-100">Add Member</Link>
			{/if}
			{#if !trip.user}
				<Link on:click={() => (open = true)} id="bx--link-add">Add Traveller</Link>
			{/if}
		</div>
	</FormRow>
</FormGroup>
