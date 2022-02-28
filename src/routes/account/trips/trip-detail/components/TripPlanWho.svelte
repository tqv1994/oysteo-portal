<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { Column, Grid, Link, Row, Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { RELATIVES, Traveller } from '$lib/store/traveller';
	import { onMount } from 'svelte';
	import { CloseOutline20 } from 'carbon-icons-svelte';
	import { createTripService, updateTripService } from '$lib/services/trip.services';
	import type { Destination } from '$lib/store/destination';
	export let trip: Trip | undefined;
	//export let isEditing: boolean = false;
	let activeSection = '';
	let relatives: Traveller[];
	let tripInput: TRipInput;
	export let travellers: Traveller[];
	
	const onEdit = (section: string) => {
		activeSection = section;
		if(trip){
			tripInput = convertTripToInput(trip);
		}else{
			tripInput = new TRipInput();
		}
	};
	const onCancel = () => {
		activeSection = "";
	};


	const onSubmit = async () => {
        window.openLoading(true, 'Saving');
		if(trip){
			await updateTripService(trip.id, {
				...tripInput}).then(output=>{
				trip = output;
			}).catch((error)=>{
				window.openNotification({kind:'error',title: 'Error',subtitle: error.message});
			});
		}else{
			await createTripService({
				...tripInput}).then(output=>{
				trip = output;
			}).catch((error)=>{
				window.openNotification({kind:'error',title: 'Error',subtitle: error.message});
			});
		}
        window.openLoading(false);
        activeSection = '';
	}

	onMount(() => {
		if (trip?.lead_traveller) {
			relatives = getRelativesByLeader(trip.lead_traveller);
		}
	});

	const getRelativesByLeader = (leader: Traveller) :Traveller[] =>{
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
		console.log(result);

		return result;
	};

	const onChangeLeaderOption = (event: CustomEvent) => {
		const selected = travellers.reduce((acc: Traveller,item: Traveller)=>{
			if(!acc && event.detail === item.id){
				acc = item;
			}
			return acc;
		},undefined);
		if(selected){
			relatives = getRelativesByLeader(selected);
		}
	}

	const getFullName = (traveller?: Traveller) => {
		let result = '';
		traveller = traveller || trip?.lead_traveller;
		if (traveller) {
			result = `${traveller.forename || ''} ${traveller.surname || ''}`;
		}
		return result;
	};

	const onAddTraveller = () => {
		const data: string[] = tripInput.travellers ? [...tripInput.travellers] : [];
		data.push("0");
		tripInput.travellers = data;
	}

	if(!trip){
		activeSection = 'trip-plan';
		tripInput = new TRipInput();
	}else{
		tripInput = convertTripToInput(trip);
	}
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'trip-plan'}
	on:edit={() => {onEdit('trip-plan');}}
	on:cancel={onCancel}
	on:submit={onSubmit}
	editLabel="Add/Remove"
	hideEditIcon={true}
>
	<h6>Who</h6>
	<FormRow label="Lead Traveler" {isEditing} class="mb-20">
		<div slot="value">
			<Grid>
				<Row>
					<Column lg={6} md={6}>
						<label>Name</label>
						<p>{getFullName()}</p>
					</Column>
					<Column lg={6} md={6}>
						<label>DOB</label>
						<p>{trip?.lead_traveller?.birthday ? formatDate(trip?.lead_traveller?.birthday) : ''}</p>
					</Column>
				</Row>
			</Grid>
		</div>
		<div slot="fields">
			{#if trip?.lead_traveller}
				<TextInput value={`${trip.lead_traveller.forename || ''} ${trip.lead_traveller.surname}`} disabled></TextInput>
			{:else}
				<Select
					labelText=""
					hideLabel
					bind:selected={tripInput.lead_traveller}
					on:change={onChangeLeaderOption}
				>
					<SelectItem text="Choose" value="" />
					{#each travellers || [] as item}
						<SelectItem value={item.id.toString()} text={`${item.forename} ${item.surname}`} />
					{/each}
			</Select>
			{/if}
		</div>
	</FormRow>
	<FormRow label="Travelers" {isEditing}>
		<div slot="value">
			<Grid>
				{#each trip?.travellers || [] as traveller}
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
			{#each tripInput.travellers || [] as id, index}
				<div class="travellers-container">
					<Select
						labelText="Traveller"
						hideLabel
						name="relative-{id}"
						bind:selected={id}
						on:change()
					>
						<SelectItem text="Choose" value="" />
						{#each relatives as item}
							<SelectItem value={item.id.toString()} text={`${item.forename} ${item.surname}`} />
						{/each}
					</Select>
					<CloseOutline20
						class="remove-traveller"
						on:click={() => {
							tripInput.travellers = tripInput.travellers.filter(
								(ele, key) => ele !== tripInput.travellers[index]
							);
						}}
					/>
				</div>
			{/each}
			{#if relatives}
				<Link
					on:click={onAddTraveller}
					id="bx--link-add">Add Member</Link
				>
			{/if}
		</div>
	</FormRow>
</FormGroup>
