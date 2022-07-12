<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import { interestTypeStore } from '$lib/store/interest';
	import type {
		PersonalPreference,
		TravelPreference,
		TravelPreferenceType
	} from '$lib/store/preference';
	import type { Traveller } from '$lib/store/traveller';
	import { get } from 'svelte/store';
	export let traveller: Traveller;
	export let travelPreferenceTypes;
	export let personalPreferenceTypes;

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
						accSelected += `, ${itemSelected.name}`;
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
		const selected: PersonalPreference[] = [];
		for (let personalPreference of item.preferences) {
			const checkExist = (traveller.personalPreferences || []).find(
				(itemPreference) => itemPreference.id === personalPreference.id
			);
			if (checkExist) {
				selected.push(checkExist);
			}
		}
		preferences.push({
			name: item.name,
			value: selected.reduce((accSelected: string, itemSelected, index) => {
				if (index > 0) {
					accSelected += `, ${itemSelected.other || itemSelected.name}`;
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
				{preference.value != '' ? preference.value : 'No Preferences'}
			</div>
		</FormRow>
	{/each}
</FormGroup>
