<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { interestTypeStore } from '$lib/store/interest';
	import {
		personalPreferenceTypeStore,
		TravelPreference,
		TravelPreferenceType,
		travelPreferenceTypeStore
	} from '$lib/store/preference';
	import type { Traveller } from '$lib/store/traveller';
	import { get } from 'svelte/store';
	export let traveller: Traveller;
	const travelPreferenceTypes = Object.values(get(travelPreferenceTypeStore).items);
	const personalPreferenceTypes = Object.values(get(personalPreferenceTypeStore).items);
	const preferences: { name: string; value: string }[] = travelPreferenceTypes.reduce(
		(acc, item) => {
			const selected: TravelPreference[] = [];
			for (let travelPreference of item.preferences) {
				const checkExist = traveller.travelPreferences.find(
					(itemPreference) => itemPreference.id === travelPreference.id
				);
				if (checkExist) {
					selected.push(checkExist);
				}
			}
			acc.push({
				name: item.name,
				value: selected.reduce((accSelected: string, itemSelected, index) => {
					if (index > 0) {
						accSelected += `,${itemSelected.name}`;
					} else {
						accSelected += `${itemSelected.name}`;
					}
					return accSelected;
				}, '')
			});
			return acc;
		},
		[]
	);
	personalPreferenceTypes.map((item) => {
		const selected: TravelPreference[] = [];
		for (let travelPreference of item.preferences) {
			const checkExist = traveller.travelPreferences.find(
				(itemPreference) => itemPreference.id === travelPreference.id
			);
			if (checkExist) {
				selected.push(checkExist);
			}
		}
		preferences.push({
			name: item.name,
			value: selected.reduce((accSelected: string, itemSelected, index) => {
				if (index > 0) {
					accSelected += `,${itemSelected.other || itemSelected.name}`;
				} else {
					accSelected += `${itemSelected.other || itemSelected.name}`;
				}
				return accSelected;
			}, '')
		});
	});
	// const experiences = traveller.personalPreferences.reduce((item)=>{
	//     item.type
	// });
</script>

<FormGroup hideEditButton>
	{#each preferences as preference}
		<FormRow label={preference.name}>
			<div slot="value">
				{preference.value}
			</div>
		</FormRow>
	{/each}
</FormGroup>
