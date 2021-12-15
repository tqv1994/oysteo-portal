<script lang="ts">
	import type { Advisor } from '$lib/store/advisor';
	import type { Experience } from '$lib/store/experience';
	import { Link, Select, SelectItem } from 'carbon-components-svelte';
	import { CloseOutline20 } from 'carbon-icons-svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let advisorId: string;
	export let experiences: Experience[];
	export let experienceList: Experience[];
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};
	const updateExperience = async () => {
		try {
			let experienceId = [];
			experiences.forEach((experience) => {
				if (experience.id != 0) {
					experienceId = [...experienceId, experience.id];
				}
			});
			if (experienceId.length == 0) {
				return;
			}
			const data = {
				experiences: experienceId
			};
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
				alert('Update successfully');
				activeSection = '';
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
			{#each experiences as experience, index}
				<div class="experiences-container">
					<Select
						labelText="Experience"
						hideLabel
						name="experiences-{index}"
						selected={experience.id.toString()}
						on:change={(e) => {
							const expSelected = experienceList.filter((ele) => ele.id.toString() == e.detail);
							if (expSelected.length > 0) {
								experiences[index] = expSelected[0];
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
							experiences = experiences.filter((ele) => ele.id !== experiences[index].id);
						}}
					/>
				</div>
			{/each}
			<Link
				on:click={() => {
					experiences = [{ id: 0, name: '', description: '' }, ...experiences];
				}}
				id="bx--link-add">Add Experience</Link
			>
		</div>
	</FormRow>
</FormGroup>
