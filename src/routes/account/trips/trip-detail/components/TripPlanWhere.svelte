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
	export let trip: Trip | undefined;
	//export let isEditing: boolean = false;
	let tripWhereInputs: TripWhereInput[];
	let tripWheres: TripWhere[];
	let activeSection = '';
	let tripWhereDeleteIds: string[];
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
	};

	const onReset = () => {
		tripWhereDeleteIds = [];
		tripWheres = [];
		tripWhereInputs = [];
	};

	const onSubmit = async () => {
		window.openLoading(true, 'Saving');
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
		window.openLoading(false);
		activeSection = '';
	};
	const onAddWhere = () => {
		if (!tripWhereInputs) {
			tripWhereInputs = [];
		}
		const data = [...tripWhereInputs];
		data.push(new TripWhereInput({ trip: trip.id + '' }));
		tripWhereInputs = data;
	};

	const handleRemoveInput = (index) => {
		tripWhereInputs = tripWhereInputs.filter((where, whereIndex) => whereIndex !== index);
	};
</script>

<FormGroup
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
				<Row>
					<Column>
						<p><label>Country</label></p>
					</Column>
					<Column>
						<p><label>No. Nights</label></p>
					</Column>
					<Column>
						<p><label>Description</label></p>
					</Column>
				</Row>
				{#each trip?.tripWheres || [] as where}
					<Row>
						<Column>
							{where.country?.name || ''}
						</Column>
						<Column>
							{where.noNights || ''}
						</Column>
						<Column>
							{where.description || ''}
						</Column>
					</Row>
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
						<p><label>No. Nights</label></p>
					</Column>
					<Column>
						<p><label>Description</label></p>
					</Column>
					<Column lg={1} />
				</Row>
				{#each tripWheres || [] as where, index}
					<Row>
						<Column>
							{where.country?.name || ''}
						</Column>
						<Column>
							{where.noNights || ''}
						</Column>
						<Column>
							{where.description || ''}
						</Column>
						<Column lg={1}>
							<CloseOutline20
								on:click={() => {
									// console.log(index);
									console.log(tripWheres);
									tripWheres = tripWheres.filter((ele, key) => {
										if (ele.id === where.id) {
											tripWhereDeleteIds.push(ele.id);
										}
										console.log(ele, where);
										return ele.id !== where.id;
									});
									console.log(tripWheres);
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
								<SelectItem text="Choose..." value="" />
								{#each countries as country}
									<SelectItem value={country.id.toString()} text={`${country.name}`} />
								{/each}
							</Select>
						</Row>
						<Row>
							<p><label>No. Nights</label></p>
						</Row>
						<Row>
							<TextInput bind:value={whereInput.noNights} type="number" />
						</Row>
						<Row>
							<p><label>Description</label></p>
						</Row>
						<Row>
							<TextArea bind:value={whereInput.description} />
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
			<Link on:click={onAddWhere} id="bx--link-add">Add Where</Link>
		</div>
	</FormRow>
</FormGroup>
<style lang="scss">
	.item-where{
		padding-top: 16px;
	}
</style>