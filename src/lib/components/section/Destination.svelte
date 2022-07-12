<script lang="ts">
	import { CloseOutline as CloseOutlineIcon } from 'carbon-icons-svelte';
	import { Button, FormItem, Link, Select, SelectItem } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { focusInput } from '$lib/helpers/scripts';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { notify } from '../Toast.svelte';
	import { session } from '$app/stores';
	import { get } from 'svelte/store';
	import { activate, clear } from '$lib/store/activeForm';

	export let target: string = undefined;
	export let name: string;
	export let label: string;
	export let destination;
	export let list;
	export let activeSection = '';
	let formGroup: FormGroup;

	const dispatch = createEventDispatcher();

	let destinationInput;

	const resetDestinationInput = () => {
		destinationInput = [...destination];
	};

	resetDestinationInput();
	onDestroy(() => {
		resetDestinationInput();
	});

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		destinationInput = [...destination];
	};
	function onCancel() {
		activeSection = '';
	}

	const updateDestination = async () => {
		try {
			let desId: string[] = [];
			desId = destinationInput.filter((item) => item.id !== '0').map((item) => item.id);

			if (desId.length == 0) {
				return;
			}
			let data = {};
			data[`destinations`] = desId;
			isFormSavingStore.set({ saving: true });

			const res = await ppatch('advisors/me', data);

			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				destination = listIDToListItemAffliate(desId, list);
				clear();
			} else {
				notify({
					title: 'Update failed',
					subtitle: 'Failed to update information, please try again later.'
				});
			}
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update phone numbers', error);
		}
		isFormSavingStore.set({ saving: false });
	};

	function listIDToListItemAffliate(listId, destinations) {
		destinations = destinations.filter((des, index) => {
			let check = listId.find((id) => id == des.id);
			if (check) {
				return des;
			}
		});
		return destinations;
	}

</script>

<FormGroup
	let:isEditing
	on:submit={updateDestination}
	on:cancel={resetDestinationInput}
	data={destinationInput}
	bind:this={formGroup}
>
	<FormRow {label} {isEditing}>
		<div slot="value">
			{#each destination || [] as des}
				<p class="affiliation-advisor">{des.name ?? 'No name'}</p>
			{/each}
		</div>
		<div slot="fields">
			{#each destinationInput as des, index}
				<div class="aff-item">
					<Select
						labelText={label}
						hideLabel
						name="destinationInput-{index}"
						selected={des.id.toString()}
						on:change={(e) => {
							formGroup.activate();
							const affSelected = list.filter((ele) => ele.id.toString() == e.detail);
							if (affSelected.length > 0) {
								destinationInput[index] = affSelected[0];
							} else {
								destinationInput[index] = { id: '0', name: '' };
							}
						}}
					>
						<SelectItem text="Choose" value="" />
						{#each list as item}
							{#if item?.name != null}
								<SelectItem value={item?.id.toString()} text={item?.name} />
							{/if}
						{/each}
					</Select>
					<Button
						sizes="field"
						kind="ghost"
						class="remove-aff-item"
						iconDescription="Remove"
						icon={CloseOutlineIcon}
						on:click={() => {
							destinationInput = destinationInput.filter(
								(ele) => ele.id !== destinationInput[index].id
							);
						}}
					/>
					<!-- <CloseOutlineIcon
						size={20}
						class="remove-aff-item"
						on:click={() => {
							destinationInput = destinationInput.filter(
								(ele) => ele.id !== destinationInput[index].id
							);
						}}
					/> -->
				</div>
			{/each}
			<Link
				on:click={() => {
					destinationInput = [...destinationInput, { id: '0', name: '' }];
					setTimeout(() => {
						const form = document.querySelector('form');
						if (form != null) {
							focusInput(form);
						}
					}, 0);
				}}
				id="bx--link-add">Add {label}</Link
			>
		</div>
	</FormRow>
</FormGroup>
