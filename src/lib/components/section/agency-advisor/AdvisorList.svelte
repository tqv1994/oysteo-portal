<script lang="ts">
	import type { Advisor } from '$lib/store/advisor';
	import FormRow from '../../form/row.svelte';
	import AgencyAdvisorForm from './AgencyAdvisorForm.svelte';

	export let advisors: Advisor[];
	export let activeSection = '';
	export let salutationTypes;
</script>

<FormRow label="" class={'mbottom-32'} contentClass={'mtop-d16 list-advisors'}>
	<div slot="value">
		{#each advisors as advisor}
			<AgencyAdvisorForm {advisor} bind:activeSection {salutationTypes} />
		{/each}
	</div>
</FormRow>
