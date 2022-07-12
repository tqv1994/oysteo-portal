<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import type { Traveller } from '$lib/store/traveller';

	export let traveller: Traveller | undefined = undefined;
	
	const destinationsString = () => {
		if (traveller?.destinationLikes?.length > 0) {
			return (traveller.destinationLikes || []).reduce((acc: string, item) => {
				if (item.name) {
					if (acc === '') {
						acc = item.name;
					} else {
						acc += ', ' + item.name;
					}
				}
				return acc;
			}, '');
		}
		return '';
	};
	const experiencesString = () => {
		if (traveller?.experienceLikes?.length > 0) {
			return traveller.experienceLikes.reduce((acc: string, item) => {
				if (item.name) {
					if (acc === '') {
						acc = item.name;
					} else {
						acc += ', ' + item.name;
					}
				}
				return acc;
			}, '');
		}
		return '';
	};
	const productsString = () => {
		if (traveller?.productLikes?.length > 0) {
			return traveller.productLikes.reduce((acc: string, item) => {
				if (item.name) {
					if (acc === '') {
						acc = item.name;
					} else {
						acc += ', ' + item.name;
					}
				}
				return acc;
			}, '');
		}
		return '';
	};
</script>

<FormGroup hideEditButton>
	<FormRow label="Editorial Features">
		<div slot="value" />
	</FormRow>
	<FormRow label="Destinations">
		<div slot="value">{destinationsString()}</div>
	</FormRow>
	<FormRow label="Experiences">
		<div slot="value">{experiencesString()}</div>
	</FormRow>
	<FormRow label="Products">
		<div slot="value">{productsString()}</div>
	</FormRow>
	<FormRow label="Search terms">
		<div slot="value" />
	</FormRow>
	<FormRow label="OYSTEO TrueMatch">
		<div slot="value" />
	</FormRow>
</FormGroup>
