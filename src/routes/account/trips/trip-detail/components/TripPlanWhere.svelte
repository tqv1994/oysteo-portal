<script lang="ts">
	import type { Trip } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import {
		Column,
		Grid,
		Link,
		Row,
		Select,
		SelectItem,
		TextArea,
		TextInput
	} from 'carbon-components-svelte';
	import { CloseOutline20 } from 'carbon-icons-svelte';
	import { TripWhere, TripWhereInput } from '$lib/store/tripWhere';
	import { get } from 'svelte/store';
	import { Country, countryStore } from '$lib/store/country';
	import { createTripWhereService, deleteTripWhereService } from '$lib/services/trip-where.service';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	export let trip: Trip | undefined;
	//export let isEditing: boolean = false;
	let tripWhereInputs: TripWhereInput[];
	let tripWheres: TripWhere[];
	let activeSection = '';
	let tripWhereDeleteIds: string[];
	let maxInput: number = 0;
	
	const resetMaxInput = () => {
		maxInput = 0;
		if(trip?.tripWheres.length > 0){
			maxInput = maxInput + trip?.tripWheres.length;
		}
	}

	resetMaxInput();
	console.log(maxInput);
	
	let countries: Country[] = Object.values(get(countryStore).items);
	const onEdit = (section: string) => {
		activeSection = section;
		tripWhereInputs = [];
		tripWhereDeleteIds = [];
		tripWheres = trip.tripWheres ? [...trip.tripWheres] : [];
	};
	const onCancel = () => {
		activeSection = '';
		onReset();
		resetMaxInput();
	};

	const onReset = () => {
		tripWhereDeleteIds = [];
		tripWheres = [];
		tripWhereInputs = [];
	};

	

	const onSubmit = async () => {
		isFormSavingStore.set({saving: true});
		for (let deleteId of tripWhereDeleteIds) {
			await deleteTripWhereService(deleteId).then(() => {
				trip.tripWheres = trip.tripWheres.filter((where) => where.id !== deleteId);
			});
		}
		for (let whereInput of tripWhereInputs) {
			await createTripWhereService(whereInput).then((where) => {
				if (!trip.tripWheres) {
					trip.tripWheres = [];
				}
				trip.tripWheres.push(where);
			});
		}
		onReset();
		resetMaxInput();
		isFormSavingStore.set({saving: false});
		activeSection = '';
	};
	console.log(trip?.tripWheres);
	
	const onAddWhere = () => {
		if (!tripWhereInputs) {
			tripWhereInputs = [];
		}
		maxInput++
		const data = [...tripWhereInputs];
		data.push(new TripWhereInput({ trip: trip.id + '' }));
		console.log(maxInput);
		
		tripWhereInputs = data;
	};

	const handleRemoveInput = (index) => {
		resetMaxInput();
		tripWhereInputs = tripWhereInputs.filter((where, whereIndex) => {
			whereIndex !== index
		});
	};
</script>

<FormGroup
	groupClass="group group-where"
	let:isEditing
	isEditing={activeSection === 'trip-plan-where'}
	on:edit={() => onEdit('trip-plan-where')}
	on:cancel={onCancel}
	on:submit={onSubmit}
	editLabel="Add/Remove"
	hideEditIcon={true}
>
	<h6>Where</h6>
	<FormRow label="" {isEditing}>
		<div slot="value">
			<Grid narrow>
				<div class="desktop-trip-where">
					<Row>
						<Column>
							<p><label>Country</label></p>
						</Column>
						<Column>
							<p><label>Description</label></p>
						</Column>
						<Column>
							<p><label>No. Nights</label></p>
						</Column>
					</Row>
					{#each trip?.tripWheres || [] as where}
						<Row>
							<Column>
								{where.country?.name || ''}
							</Column>
							<Column>
								{where.description || ''}
							</Column>
							<Column>
								{where.noNights || ''}
							</Column>
						</Row>
					{/each}
				</div>
				{#each trip?.tripWheres || [] as where}
					<div class="mobile-trip-where pb-15">
						<Column>
							<Row>
								<p><label>Country: {where.country?.name || ''}</label></p>
							</Row>
							<Row>
								<p><label>Description: {where.description || ''}</label></p>
							</Row>
							<Row>
								<p><label>No. Nights: {where.noNights || ''}</label></p>
							</Row>
						</Column>
					</div>
				{/each}
			</Grid>
		</div>
		<div slot="fields">
			<Grid narrow>
				<Row>
					<Column>
						<p><label>Country</label></p>
					</Column>
					<Column>
						<p><label>Description</label></p>
					</Column>
					<Column>
						<p><label>No. Nights</label></p>
					</Column>
					<Column lg={1} />
				</Row>
				{#each tripWheres || [] as where, index}
					<Row>
						<Column>
							{where.country?.name || ''}
						</Column>
						<Column>
							{where.description || ''}
						</Column>
						<Column>
							{where.noNights || ''}
						</Column>
						<Column lg={1}>
							<CloseOutline20
								on:click={() => {
									tripWheres = tripWheres.filter((ele, key) => {
										if (ele.id === where.id) {
											tripWhereDeleteIds.push(ele.id);
										}
										resetMaxInput();
										console.log(maxInput);
										return ele.id !== where.id;
									});
								}}
							/>
						</Column>
					</Row>
				{/each}
				{#each tripWhereInputs || [] as whereInput, index}
					<Column class="travellers-container">
						<Row>
							<p><label>Country</label></p>
						</Row>
						<Row>
							<Select labelText="" hideLabel bind:selected={whereInput.country}>
								<SelectItem text="Choose" value="" />
								{#each countries as country}
									<SelectItem value={country.id.toString()} text={`${country.name}`} />
								{/each}
							</Select>
						</Row>
						<Row>
							<p><label>Description</label></p>
						</Row>
						<Row>
							<TextArea autofocus bind:value={whereInput.description} />
						</Row>
						<Row>
							<p><label>No. Nights</label></p>
						</Row>
						<Row>
							<TextInput bind:value={whereInput.noNights} type="number" />
						</Row>
						<Row>
							<CloseOutline20
								class="remove-where"
								on:click={() => {
									handleRemoveInput(index);
								}}
							/>
						</Row>
					</Column>
				{/each}
			</Grid>
			{#if maxInput < 5 }
				<Link on:click={onAddWhere} id="bx--link-add">Add Where</Link>
			{/if}
		</div>
	</FormRow>
</FormGroup>

<style lang="scss">
	.item-where {
		padding-top: 16px;
	}
</style>
