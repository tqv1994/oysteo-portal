<script lang="ts">
	import type { Advisor } from '$lib/store/advisor';
	import type { Experience } from '$lib/store/experience';
	import { ExperienceType, experienceTypeStore } from '$lib/store/experienceType';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
import { sortByName } from '$lib/utils/sort';
	import { Link, Select, SelectItem, UnorderedList } from 'carbon-components-svelte';
	import { CloseOutline20 } from 'carbon-icons-svelte';
	import { onDestroy } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let advisorId: string;
	// export let experiences: Experience[];
	export let activeSection = '';
	export let experienceTypes1: ExperienceType;
	export let experienceTypes2: ExperienceType;
	export let experienceTypes3: ExperienceType;
	export let experienceTypes4: ExperienceType;
	export let experienceTypes5: ExperienceType;

	const experienceTypeList = sortByName(Object.values($experienceTypeStore.items));
	// let experienceInput: Expeience[]
	let experienceType1Input: ExperienceType;
	let experienceType2Input: ExperienceType;
	let experienceType3Input: ExperienceType;
	let experienceType4Input: ExperienceType;
	let experienceType5Input: ExperienceType;

	const resetExperienceInput = () => {
		// experienceTypeInput = '';
	};

	resetExperienceInput();
	onDestroy(() => {
		resetExperienceInput();
	});

	const onEdit = (groupName: string) => {
		activeSection = groupName;

		experienceType1Input = experienceTypes1;
		experienceType2Input = experienceTypes2;
		experienceType3Input = experienceTypes3;
		experienceType4Input = experienceTypes4;
		experienceType5Input = experienceTypes5;
		// experienceInput = [...experiences];
	};
	const onCancel = () => {
		activeSection = '';
	};
	const updateExperienceType = async () => {
		try {
			let experienceType1IdSelected: string;
			let experienceType2IdSelected: string;
			let experienceType3IdSelected: string;
			let experienceType4IdSelected: string;
			let experienceType5IdSelected: string;

			experienceType1IdSelected = experienceType1Input?.id || null;
			experienceType2IdSelected = experienceType2Input?.id || null;
			experienceType3IdSelected = experienceType3Input?.id || null;
			experienceType4IdSelected = experienceType4Input?.id || null;
			experienceType5IdSelected = experienceType5Input?.id || null;

			const data = {
				experienceTypes1: experienceType1IdSelected,
				experienceTypes2: experienceType2IdSelected,
				experienceTypes3: experienceType3IdSelected,
				experienceTypes4: experienceType4IdSelected,
				experienceTypes5: experienceType5IdSelected
			};

			isFormSavingStore.set({ saving: true });

			const res = await fetch(`/common/${type}-${advisorId}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});

			if (res.ok) {
				const data = await res.json();
				experienceTypes1 = data.updateAdvisor.advisor.experienceTypes1;
				experienceTypes2 = data.updateAdvisor.advisor.experienceTypes2;
				experienceTypes3 = data.updateAdvisor.advisor.experienceTypes3;
				experienceTypes4 = data.updateAdvisor.advisor.experienceTypes4;
				experienceTypes5 = data.updateAdvisor.advisor.experienceTypes5;
				resetExperienceInput();
				onCancel();
			}
		} catch (error) {}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'experienceType'}
	on:edit={() => onEdit('experienceType')}
	on:cancel={onCancel}
	on:submit={updateExperienceType}
>
	<FormRow label="" {isEditing} contentClass={'mtop-0'}>
		<div slot="value">
			{#if experienceTypes1 != null}
				<p class="advisor-experiences">{experienceTypes1.name}</p>
			{/if}
			{#if experienceTypes2 != null}
				<p class="advisor-experiences">{experienceTypes2.name}</p>
			{/if}
			{#if experienceTypes3 != null}
				<p class="advisor-experiences">{experienceTypes3.name}</p>
			{/if}
			{#if experienceTypes4 != null}
				<p class="advisor-experiences">{experienceTypes4.name}</p>
			{/if}
			{#if experienceTypes5 != null}
				<p class="advisor-experiences">{experienceTypes5.name}</p>
			{/if}
		</div>
		<div slot="fields">
			<Select
				labelText="Experience type"
				hideLabel
				name="experiences-{experienceTypes1 != null ? experienceTypes1.id : ''}"
				selected={experienceTypes1 != null ? experienceTypes1.id.toString() : ''}
				on:change={(e) => {
					const expSelected = experienceTypeList.filter((ele) => ele.id.toString() == e.detail);
					if (expSelected.length > 0) {
						experienceType1Input = expSelected[0];
					} else {
						experienceType1Input = null;
					}
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceTypeList as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>

			<Select
				labelText="Experience type"
				hideLabel
				name="experiences-{experienceTypes2 != null ? experienceTypes2.id : ''}"
				selected={experienceTypes2 != null ? experienceTypes2.id.toString() : ''}
				on:change={(e) => {
					const expSelected = experienceTypeList.filter((ele) => ele.id.toString() == e.detail);
					if (expSelected.length > 0) {
						experienceType2Input = expSelected[0];
					} else {
						experienceType2Input = null;
					}
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceTypeList as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>
			<Select
				labelText="Experience type"
				hideLabel
				name="experiences-{experienceTypes3 != null ? experienceTypes3.id : ''}"
				selected={experienceTypes3 != null ? experienceTypes3.id.toString() : ''}
				on:change={(e) => {
					const expSelected = experienceTypeList.filter((ele) => ele.id.toString() == e.detail);
					if (expSelected.length > 0) {
						experienceType3Input = expSelected[0];
					} else {
						experienceType3Input = null;
					}
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceTypeList as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>
			<Select
				labelText="Experience type"
				hideLabel
				name="experiences-{experienceTypes4 != null ? experienceTypes4.id : ''}"
				selected={experienceTypes4 != null ? experienceTypes4.id.toString() : ''}
				on:change={(e) => {
					const expSelected = experienceTypeList.filter((ele) => ele.id.toString() == e.detail);
					if (expSelected.length > 0) {
						experienceType4Input = expSelected[0];
					} else {
						experienceType4Input = null;
					}
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceTypeList as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>
			<Select
				labelText="Experience type"
				hideLabel
				name="experiences-{experienceTypes5 != null ? experienceTypes5.id : ''}"
				selected={experienceTypes5 != null ? experienceTypes5.id.toString() : ''}
				on:change={(e) => {
					const expSelected = experienceTypeList.filter((ele) => ele.id.toString() == e.detail);
					if (expSelected.length > 0) {
						experienceType5Input = expSelected[0];
					} else {
						experienceType5Input = null;
					}
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceTypeList as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>
