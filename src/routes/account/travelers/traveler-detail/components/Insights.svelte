<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import type { Traveller } from '$lib/store/traveller';
	export let traveller: Traveller;
</script>

<FormGroup hideEditButton>
	<FormRow label="Editorial Features">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Destinations">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Experiences">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Products">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Search terms">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="OYSTEO TrueMatch">
		<div slot="value"></div>
	</FormRow>
</FormGroup>
