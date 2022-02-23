<script lang="ts">
	import type { Advisor } from '$lib/store/advisor';
	import type { Experience, Experience } from '$lib/store/experience';
	import { Link, Select, SelectItem } from 'carbon-components-svelte';
	import { CloseOutline20 } from 'carbon-icons-svelte';
	import { onDestroy } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let advisorId: string;
	export let experiences: Experience[];
	export let experienceList: Experience[];
	export let activeSection: string = '';
	export let activeLoading: boolean = false;

	let experienceInput: Experience[];

	const resetExperienceInput = () => {
		experienceInput = [];
	};

	resetExperienceInput();
	onDestroy(() => {
		resetExperienceInput();
	});

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		experienceInput = [...experiences];
	};
	const onCancel = () => {
		activeSection = '';
	};
	const updateExperience = async () => {
		try {
			let experienceIdSelected: string[];
			experienceIdSelected = experienceInput
				.filter((item) => item.id !== '0')
				.map((item) => item.id);

			if (experienceIdSelected.length == 0) {
				return;
			}

			const data = {
				experiences: experienceIdSelected
			};
			console.log(data);

			activeLoading = true;

			const res = await fetch(`/common/${type}-${advisorId}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});
			if (res.ok) {
				const data = await res.json();
				experiences = data.updateAdvisor.advisor.experiences;
				resetExperienceInput();
				onCancel();
			}
		} catch (error) {}
		activeLoading = false;
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'experiences'}
	on:edit={() => onEdit('experiences')}
	on:cancel={onCancel}
	on:submit={updateExperience}
>
	<FormRow label="" {isEditing} contentClass={'mtop-0'}>
		<div slot="value">
			{#each experiences as experience}
				<p class="advisor-experiences">{experience.name}</p>
			{/each}
		</div>
		<div slot="fields">
			{#each experienceInput as experience, index}
				<div class="experiences-container">
					<Select
						labelText="Experience"
						hideLabel
						name="experiences-{experience.id}"
						selected={experience.id.toString()}
						on:change={(e) => {
							const expSelected = experienceList.filter((ele) => ele.id.toString() == e.detail);
							if (expSelected.length > 0) {
								experienceInput[index] = expSelected[0];
							}
						}}
					>
						<SelectItem text="Choose..." value="" />
						{#each experienceList as item}
							<SelectItem value={item.id.toString()} text={item.name} />
						{/each}
					</Select>
					<CloseOutline20
						class="remove-experiences"
						on:click={() => {
							experienceInput = experienceInput.filter(
								(ele) => ele.id !== experienceInput[index].id
							);
						}}
					/>
				</div>
			{/each}
			{#if experienceInput.length < 5}
				<Link
					on:click={() => {
						experienceInput = [...experienceInput, { id: '0', name: '' }];
					}}
					id="bx--link-add">Add Specialities</Link
				>
			{/if}
		</div>
	</FormRow>
</FormGroup>
