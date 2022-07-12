<script lang="ts">
	import { type Trip, tripStore } from '$lib/store/trip';
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
		TextArea,
		TextInput
	} from 'carbon-components-svelte';
	import { CloseOutline as CloseOutlineIcon } from 'carbon-icons-svelte';
	import type { TripWhere } from '$lib/store/tripWhere';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { pdelete, ppost } from '$lib/utils/fetch';
	import { notify } from '$lib/components/Toast.svelte';
	import type { Country } from '$lib/store/country';
	import { clear } from '$lib/store/activeForm';
import { focusInput } from '$lib/helpers/scripts';
import { formChangeStatusStore } from '$lib/store/formChangeStatus';

	export let trip: Trip | undefined;
	export let countries: Country[];
	let formGroup: FormGroup;
	//export let isEditing: boolean = false;
	//export let isEditing: boolean = false;
	type TripWhereInput = {
		country?: string;
		description?: string;
		noNights?: number;
		trip?: string;
	};
	type FormData = {
		tripWheres?: TripWhereInput[];
	};
	type FormError = {
		tripWheres?: TripWhereInput[];
	};
	let tripWhereInputs: TripWhereInput[] = [];
	let activeSection = '';
	let formErrors: FormError;
	let tripWheres: TripWhere[];
	let tripWhereDeleteIds: string[];
	let formData: FormData = reset();

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset(): FormData {
		tripWhereInputs = [];
		tripWhereDeleteIds = [];
		tripWheres = trip.tripWheres ? [...trip.tripWheres] : [];
		return {
			tripWheres: tripWhereInputs || []
		};
	}
	let maxInput: number = 0;

	const resetMaxInput = () => {
		maxInput = 0;
		if (trip?.tripWheres && trip?.tripWheres.length > 0) {
			maxInput = maxInput + trip?.tripWheres.length;
		}
	};

	resetMaxInput();

	// let countries: Country[] = Object.values(get(countryStore));

	const onCancel = () => {
		activeSection = '';
		onReset();
		resetMaxInput();
	};

	const onReset = () => {
		formData = reset()
	};

	const onSubmit = async () => {
		const errors: FormError = {};

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			for (let deleteId of tripWhereDeleteIds) {
				const res = await pdelete(`trip-wheres/${deleteId}`);
				if (res.ok) {
					trip.tripWheres = trip.tripWheres.filter((where) => where.id !== deleteId);
				} else {
					notify({
						title: 'Delete failed',
						subtitle: 'Failed to delete information, please try again later.'
					});
				}
			}

			for (let whereInput of formData.tripWheres) {
				const res = await ppost(`trip-wheres`, whereInput);
				if (res.ok) {
					if (!trip.tripWheres) {
						trip.tripWheres = [];
					}
					const where = await res.json();
					trip.tripWheres.push({...where, country: where.country?.id || null});
				} else {
					notify({
						title: 'Create failed',
						subtitle: 'Failed to create information, please try again later.'
					});
				}
			}
			tripStore.update((s) => {
				const idx = s.findIndex((t) => t.id === trip.id);
				s[idx] = trip;
				return s;
			});
			clear();
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update business insurance', error);
		}
		onReset();
		resetMaxInput();
		isFormSavingStore.set({ saving: false });
		activeSection = '';
	};

	const onAddWhere = () => {
		if (!formData.tripWheres) {
			formData.tripWheres = [];
		}
		maxInput++;
		const data = [...formData.tripWheres];
		data.push({ trip: trip.id + '' });
		
		formData.tripWheres = data;
		formGroup.activate();
	};

	const handleRemoveInput = (index) => {
		resetMaxInput();
		tripWhereInputs = tripWhereInputs.filter((where, whereIndex) => {
			whereIndex !== index;
		});
	};

	function getCountryName(where: TripWhere){
		const country = (countries || []).find(item=>item.id.toString() === where.country.toString());
		return country ? country.name : '';
	}
</script>

<FormGroup
	groupClass="group group-where"
	let:isEditing
	on:cancel={onCancel}
	on:submit={onSubmit}
	editLabel="Add/Remove"
	hideEditIcon={true}
	data={formData.tripWheres}
	bind:this={formGroup}
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
								{getCountryName(where)}
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
								<p><label>Country: {getCountryName(where)}</label></p>
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
							{getCountryName(where)}
						</Column>
						<Column>
							{where.description || ''}
						</Column>
						<Column>
							{where.noNights || ''}
						</Column>
						<Column lg={1}>
							<Button
								sizes="field"
								kind="ghost"
								class="remove-aff-item"
								iconDescription="Remove"
								icon={CloseOutlineIcon}
								on:click={() => {
									tripWheres = tripWheres.filter((ele, key) => {
										if (ele.id === where.id) {
											tripWhereDeleteIds.push(ele.id);
										}
										resetMaxInput();
										return ele.id !== where.id;
									});
								}}
							/>
						</Column>
					</Row>
				{/each}
				{#each formData.tripWheres || [] as whereInput, index}
					<Column class="travellers-container">
						<Row>
							<p><label>Country</label></p>
						</Row>
						<Row>
							<Select autofocus labelText="" hideLabel bind:selected={whereInput.country}>
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
							<TextArea bind:value={whereInput.description} />
						</Row>
						<Row>
							<p><label>No. Nights</label></p>
						</Row>
						<Row>
							<TextInput bind:value={whereInput.noNights} type="number" />
						</Row>
						<!-- <Row>
							<CloseOutlineIcon size={20}
								class="remove-where"
								on:click={() => {
									handleRemoveInput(index);
								}}
							/>
						</Row> -->
					</Column>
				{/each}
			</Grid>
			{#if maxInput < 5}
				<Link on:click={onAddWhere} id="bx--link-add">Add Country</Link>
			{/if}
		</div>
	</FormRow>
</FormGroup>

<style lang="scss">
	.item-where {
		padding-top: 16px;
	}
</style>
