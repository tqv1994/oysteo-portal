<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { Column, Grid, Link, Row, Select, SelectItem } from 'carbon-components-svelte';
	import type { Traveller } from '$lib/store/traveller';
import { authStore } from '$lib/store/auth';
import { CloseOutline20 } from 'carbon-icons-svelte';
import type { Destination } from '$lib/store/destination';
import { createTripService, updateTripService } from '$lib/services/trip.services';
	export let trip: Trip | undefined;
    let destinations = $authStore.user?.advisorMe?.destinations || [];
	//export let isEditing: boolean = false;
    let tripInput: TRipInput;
    if(trip){
        tripInput = convertTripToInput(trip);
    }else{
        tripInput = new TRipInput();
    }
	if(trip?.destinations){
		for(let destination of trip?.destinations){
			let destinationFind = destinations.reduce((acc: Destination, item: Destination)=>{
				if(!acc && item.id == destination.id){
					acc = item;
				}
				return acc;
			},undefined);
			if(!destinationFind){
				destinations.push(destination);
			}
		}
	}
	let activeSection = '';
	const onEdit = (section: string) => {
		activeSection = section;
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
    const onAddDestination = () => {
		const data: string[] = tripInput.destinations ? [...tripInput.destinations] : [];
		data.push("0");
		tripInput.destinations = data;
	}

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
            <Grid>
                <Row>
                    <Column >
                        <p><label>Country</label></p>
                    </Column>
                    <Column>
                        <p><label>Description</label></p>
                    </Column>
                    <Column>
                        <p><label>No. Nights</label></p>
                    </Column>
                </Row>
                {#each (trip?.destinations || []) as destination}
                <Row>
                    <Column >
                        {destination.country?.name || ''}
                    </Column>
                    <Column>
                        {destination.name}
                    </Column>
                    <Column>
                        1
                    </Column>
                </Row>
                {/each}
            </Grid>
        </div>
		<div slot="fields">
			{#each tripInput.destinations || [] as id, index}
				<div class="travellers-container">
					<Select
						labelText="Traveller"
						hideLabel
						name="relative-{id}"
						bind:selected={id}
					>
						<SelectItem text="Choose..." value="" />
						{#each destinations as item}
							<SelectItem value={item.id.toString()} text={`${item.name}`} />
						{/each}
					</Select>
					<CloseOutline20
						class="remove-traveller"
						on:click={() => {
							tripInput.destinations = tripInput.destinations.filter(
								(ele, key) => ele !== tripInput.destinations[index]
							);
						}}
					/>
				</div>
			{/each}
			<Link
				on:click={onAddDestination}
				id="bx--link-add">Add Destination</Link
			>
		</div>
	</FormRow>
</FormGroup>
