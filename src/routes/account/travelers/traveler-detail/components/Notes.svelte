<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { TextArea } from 'carbon-components-svelte';
    import type {Traveller} from '$lib/store/traveller';
    import { convertTravellerToInput, TravellerInput } from '$lib/store/traveller';
    import { updateTravellerService } from '$lib/services/traveller.service';

	export let traveller: Traveller;
	let activeSection = '';
    let travellerInput: TravellerInput;
	const onEdit = (section: string) => {
		activeSection = section;
        travellerInput = convertTravellerToInput(traveller);
	}
	const onCancel = () =>{
        activeSection = '';
        travellerInput = new TravellerInput();
	}

	const onSubmit = async () => {
        window.openLoading(true, 'Saving');
        await updateTravellerService(traveller.id, travellerInput).then((output)=>{
            console.log(output);
            traveller = output;
        }).catch((error)=>{
            window.openNotification({kind:'error',title: 'Error',subtitle: error.message});
        });
        window.openLoading(false);
        activeSection = '';
	}
</script>

<FormGroup
    let:isEditing
    isEditing={activeSection === 'notes'}
    on:edit={() => onEdit('notes')}
    on:cancel={onCancel}
    on:submit={onSubmit}
>
	<FormRow label="Notes" {isEditing}>
		<div slot="value">
			{traveller.notes || ''}
		</div>
		<div slot="fields">
			<TextArea bind:value={travellerInput.notes} />
		</div>
	</FormRow>
</FormGroup>
