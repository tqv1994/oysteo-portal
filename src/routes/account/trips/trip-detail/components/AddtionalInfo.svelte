<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import type { Trip } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { Column, Grid, Row, TextArea } from 'carbon-components-svelte';
import type { Traveller } from '$lib/store/traveller';
import type { Insurance } from '$lib/store/insurance';
	export let trip: Trip | undefined;
	//export let isEditing: boolean = false;
	let activeSection = '';
	let additionalInfo = '';
	const onEdit = (section: string) => {
		activeSection = section;
	}
	const onCancel = () =>{
		activeSection = '';
	}

	const onSubmit = () => {
		activeSection = '';
	}
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'additional-info'}
	on:edit={() => onEdit('additional-info')}
	on:cancel={onCancel}
	on:submit={onSubmit}
>
	<FormRow label="Addtional Info" {isEditing}>
		<div slot="fields">
			<TextArea bind:value={additionalInfo} />
		</div>
	</FormRow>
</FormGroup>