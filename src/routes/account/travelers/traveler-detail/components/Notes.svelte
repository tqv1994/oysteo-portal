<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { TextArea } from 'carbon-components-svelte';
	import type { Traveller } from '$lib/store/traveller';
	import { convertTravellerToInput, TravellerInput } from '$lib/store/traveller';
	import { updateTravellerService } from '$lib/services/traveller.service';
	import { notify } from '$lib/components/Toast.svelte';
import { isFormSavingStore } from '$lib/store/isFormSaving';

	export let traveller: Traveller;
	let activeSection = '';
	let travellerInput: TravellerInput;
	const onEdit = (section: string) => {
		activeSection = section;
		travellerInput = convertTravellerToInput(traveller);
	};
	const onCancel = () => {
		activeSection = '';
		travellerInput = new TravellerInput();
	};

	const onSubmit = async () => {
		isFormSavingStore.set({saving: true});
		await updateTravellerService(traveller.id, travellerInput)
			.then((output) => {
				traveller = output;
			})
			.catch((error) => {
				notify({ kind: 'error', title: 'Error', subtitle: error.message });
			});
		isFormSavingStore.set({saving: false});
		activeSection = '';
	};
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
