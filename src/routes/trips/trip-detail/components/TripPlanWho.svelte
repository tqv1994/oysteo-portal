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

	export let trip: Trip;
	export let travellers: Traveller[] = [...$travellersStore];
	export let traveller: Traveller;

	type FormData = {
		travellers?: string[];
	};
	type FormError = {
		travellers?: string;
	};

	let activeSection = '';
	let relatives: Traveller[];
	let leadTraveller: Traveller | undefined;
	let otherTravellers: Traveller[];
	let travellerIds: string[] = (trip?.travellers || []).map((item) => item.id.toString());
	let formErrors: FormError;
	let formData: FormData = reset();
	let open = false;

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

	$: if (trip?.travellers?.length) {
		[travellers[0], ...otherTravellers] = trip.travellers;
		relatives = getRelativesByLeader(travellers[0]);
	}

	const getRelativesByLeader = (leader: Traveller): Traveller[] => {
		let result: Traveller[] = [];
		for (let key in RELATIVES) {
			if (key == 'children' && leader.children) {
				result.push({ ...leader.children });
			} else {
				if (leader[key]) {
					leader[key].map((traveller) => {
						result.push(traveller);
					});
				}
			}
		}
		return result;
	};

	const onChangeLeaderOption = (event: CustomEvent) => {
		if (event.detail == '') {
			relatives = [];
		}
		const selected = travellers.reduce((acc: Traveller, item: Traveller) => {
			if (!acc && event.detail?.toString() === item.id.toString()) {
				acc = item;
			}
			return acc;
		}, undefined);

		if (selected) {
			relatives = getRelativesByLeader(selected);
		}
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
			if ((trip.travellers[0].otherRelations || []).length > 0) {
				trip.travellers[0].otherRelations.push(event.detail);
			} else {
				trip.travellers[0].otherRelations = [event.detail];
			}
		} else {
			trip.travellers = [event.detail];
		}
		travellerIds = (trip?.travellers || []).map((item) => item.id.toString());
		formData = reset();
	}
	
</script>

<CreateTraveller bind:open bind:trip {relatives} on:created={onCreatedTraveller} />
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
	<FormRow label="Lead Traveler" {isEditing} class="mb-20">
		<div slot="value">
			<Grid>
				<Row>
					<Column lg={6} md={6}>
						<label>Name</label>
						{#if trip?.travellers[0]}
							<p>
								{trip?.travellers[0]?.forename}
								{trip?.travellers[0]?.surname}
							</p>
						{/if}
					</Column>
					<Column lg={6} md={6}>
						<label>DOB</label>
						{#if trip?.travellers[0]}
							<p>
								{traveller?.birthday ? formatDate(trip?.travellers[0]?.birthday) : ''}
							</p>
						{/if}
					</Column>
				</Row>
			</Grid>
		</div>
		<div slot="fields">
			{#if trip?.user != null}
				<TextInput
					autofocus
					value={`${trip?.travellers[0]?.forename} ${trip?.travellers[0]?.surname}`}
					disabled
				/>
			{:else}
				<Select
					hideLabel
					bind:selected={formData.travellers[0]}
					on:change={onChangeLeaderOption}
					invalid={!!formErrors?.travellers[0]}
					invalidText={formErrors?.travellers[0]}
				>
					<SelectItem text="Choose" value="" />
					{#each $travellersStore || [] as item}
						<SelectItem value={item.id.toString()} text={`${item.forename} ${item.surname}`} />
					{/each}
				</Select>
			{/if}
		</div>
	</FormRow>
	<FormRow label="Travelers" {isEditing}>
		<div slot="value">
			<Grid>
				{#each trip?.travellers || [] as traveller, index}
					{#if index != 0}
						<Row>
							<Column lg={6} md={6}>
								{getFullName(traveller)}
							</Column>
							<Column lg={6} md={6}>
								{formatDate(traveller?.birthday)}
							</Column>
						</Row>
					{/if}
				{/each}
			</Grid>
		</div>
		<div slot="fields">
			{#each formData.travellers || [] as id, index}
				{#if index > 0}
					<div class="travellers-container">
						<Select
							labelText="Traveller"
							hideLabel
							name="relative-{id}"
							bind:selected={id}
							invalid={!!formErrors?.travellers[index]}
							invalidText={formErrors?.travellers[index]}
						>
							<SelectItem text="Choose" value="" />
							{#each relatives as item}
								<SelectItem
									value={item.id.toString()}
									text={`${item.forename ?? 'No'} ${item.surname ?? 'Name'}`}
								/>
							{/each}
						</Select>
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
					</div>
				{/if}
			{/each}
			{#if relatives}
				<Link on:click={onAddTraveller} id="bx--link-add" class="w-100">Add Member</Link>
			{/if}
			<Link on:click={() => (open = true)} id="bx--link-add">Add Traveller</Link>
		</div>
	</FormRow>
</FormGroup>
