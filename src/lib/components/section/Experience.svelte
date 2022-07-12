<script lang="ts">
	import { clear } from '$lib/store/activeForm';

	import type { Advisor } from '$lib/store/advisor';
	import { getCollection } from '$lib/store/collection';

	import { experienceTypeStore } from '$lib/store/experienceType';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { ppatch } from '$lib/utils/fetch';
	import { sortByName, sortByOrder } from '$lib/utils/sort';
	import { Select, SelectItem } from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';

	export let target: string;
	export let advisor: Advisor;
	export let experienceType;
	export let activeSection = '';

	type FormData = {
		experienceType1?: string;
		experienceType2?: string;
		experienceType3?: string;
		experienceType4?: string;
		experienceType5?: string;
	};

	let formData: FormData = resetExperienceInput();
	const dispatch = createEventDispatcher();

	function resetExperienceInput() {
		return {
			experienceType1: advisor.experienceType1?.id?.toString(),
			experienceType2: advisor.experienceType2?.id?.toString(),
			experienceType3: advisor.experienceType3?.id?.toString(),
			experienceType4: advisor.experienceType4?.id?.toString(),
			experienceType5: advisor.experienceType5?.id?.toString()
		};
	}

	onDestroy(() => {
		resetExperienceInput();
	});

	async function onSubmit() {
		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, formData);
			if (res.ok) {
				dispatch('change', await res.json());
				clear();
				activeSection = '';
			} else {
				notify({
					title: 'An error has occured',
					subtitle:
						'Something unexpected has happened. Please refresh the browser and sign-in again.'
				});
				console.error(await res.text());
			}
		} catch (err) {
			notify({
				title: 'An error has occured',
				subtitle: 'Something unexpected has happened. Please try again later.'
			});
			console.error(err);
		}
		isFormSavingStore.set({ saving: false });
	}

	function getExperienceName(experienceId) {
		if (!experienceId) {
			return '';
		}
		let experienceName;
		experienceType.forEach((element) => {
			if (element.id == experienceId) {
				experienceName = element.name;
			}
		});
		return experienceName;
	}
</script>

<FormGroup
	let:isEditing
	on:submit={onSubmit}
	on:cancel={resetExperienceInput}
	data={{
		experienceType1:
			advisor?.experienceType1?.id?.toString() ?? advisor?.experienceType1?.toString(),
		experienceType2:
			advisor?.experienceType2?.id?.toString() ?? advisor?.experienceType2?.toString(),
		experienceType3:
			advisor?.experienceType3?.id?.toString() ?? advisor?.experienceType3?.toString(),
		experienceType4:
			advisor?.experienceType4?.id?.toString() ?? advisor?.experienceType4?.toString(),
		experienceType5:
			advisor?.experienceType5?.id?.toString() ?? advisor?.experienceType5?.toString()
	}}
>
	<FormRow label="" {isEditing} contentClass={'mtop-0'}>
		<div slot="value">
			{#if advisor.experienceType1}
				<p class="advisor-experiences">
					{advisor.experienceType1?.name ?? getExperienceName(advisor.experienceType1)}
				</p>
			{/if}
			{#if advisor.experienceType2}
				<p class="advisor-experiences">
					{advisor.experienceType2?.name ?? getExperienceName(advisor.experienceType2)}
				</p>
			{/if}
			{#if advisor.experienceType3}
				<p class="advisor-experiences">
					{advisor.experienceType3?.name ?? getExperienceName(advisor.experienceType3)}
				</p>
			{/if}
			{#if advisor?.experienceType4}
				<p class="advisor-experiences">
					{advisor?.experienceType4?.name ?? getExperienceName(advisor.experienceType4)}
				</p>
			{/if}
			{#if advisor?.experienceType5}
				<p class="advisor-experiences">
					{advisor?.experienceType5?.name ?? getExperienceName(advisor.experienceType5)}
				</p>
			{/if}
		</div>
		<div slot="fields">
			<Select
				labelText="Experience type"
				hideLabel
				name="experienceType1"
				selected={advisor?.experienceType1?.id?.toString() ?? advisor?.experienceType1?.toString()}
				on:change={(e) => {
					formData.experienceType1 = e.detail;
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceType as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>

			<Select
				labelText="Experience type"
				hideLabel
				name="experienceType2"
				selected={advisor?.experienceType2?.id?.toString() ?? advisor?.experienceType2?.toString()}
				on:change={(e) => {
					formData.experienceType2 = e.detail;
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceType as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>
			<Select
				labelText="Experience type"
				hideLabel
				name="experienceType3"
				selected={advisor?.experienceType3?.id?.toString() ?? advisor?.experienceType3?.toString()}
				on:change={(e) => {
					formData.experienceType3 = e.detail;
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceType as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>
			<Select
				labelText="Experience type"
				hideLabel
				name="experienceType4"
				selected={advisor?.experienceType4?.id?.toString() ?? advisor?.experienceType4?.toString()}
				on:change={(e) => {
					formData.experienceType4 = e.detail;
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceType as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>
			<Select
				labelText="Experience type"
				hideLabel
				name="experienceType5"
				selected={advisor?.experienceType5?.id?.toString() ?? advisor?.experienceType5?.toString()}
				on:change={(e) => {
					formData.experienceType5 = e.detail;
				}}
			>
				<SelectItem text="Choose" value="0" />
				{#each experienceType as item}
					<SelectItem value={item.id.toString()} text={item.name} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>
