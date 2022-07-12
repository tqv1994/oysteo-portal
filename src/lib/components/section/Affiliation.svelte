<script lang="ts">
	import { CloseOutline as CloseOutlineIcon } from 'carbon-icons-svelte';
	import { Button, FormItem, Link, Select, SelectItem } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { focusInput } from '$lib/helpers/scripts';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { ppatch } from '$lib/utils/fetch';
	import { notify } from '../Toast.svelte';
	import { clear } from '$lib/store/activeForm';

	export let target: string = undefined;
	export let name: string;
	export let label: string;
	export let affiliate;
	export let list;
	export let activeSection = '';

	let formGroup;
	const dispatch = createEventDispatcher();

	let affiliateInput;

	const resetAffiliateInput = () => {
		if (Array.isArray(affiliate)) {
			affiliateInput = [...affiliate];
		} else {
			affiliateInput = [];
		}
	};

	resetAffiliateInput();
	onDestroy(() => {
		resetAffiliateInput();
	});

	function onCancel() {
		resetAffiliateInput();
	}

	const handleName = (name: string) => {
		if (name === 'Benefit Programs') {
			return 'benefit_programs';
		}
		return name.toLocaleLowerCase();
	};

	const updateAffiliate = async () => {
		if (!target) {
			return;
		}
		try {
			let affID: string[] = [];
			affID = affiliateInput.filter((item) => item.id !== '0').map((item) => item.id);

			if (affID.length == 0) {
				return;
			}
			let data = {};
			data[`affiliate_${handleName(name)}`] = affID;
			isFormSavingStore.set({ saving: true });

			const res = await ppatch(target, data);
			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				affiliate = listIDToListItemAffliate(affID, list);
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

	function listIDToListItemAffliate(listId, affiliates) {
		affiliates = affiliates.filter((aff, index) => {
			let check = listId.find((id) => id == aff.id);
			if (check) {
				return aff;
			}
		});
		return affiliates;
	}
</script>

{#if !!target}
	<FormGroup
		let:isEditing
		on:submit={updateAffiliate}
		on:cancel={onCancel}
		groupClass={'group group-affiliations'}
		on:cancel={onCancel}
		data={affiliateInput}
		bind:this={formGroup}
	>
		<FormRow label={`Affiliate ${label}`} {isEditing} contentClass={'mtop-7'}>
			<div slot="value">
				{#each affiliate || [] as aff}
					<p class="affiliation-advisor">{aff.name}</p>
				{/each}
			</div>
			<div slot="fields">
				{#each affiliateInput as aff, index}
					<div class="aff-item">
						<Select
							labelText={`Affiliation ${label}`}
							hideLabel
							name="id"
							selected={aff.id.toString()}
							on:change={(e) => {
								formGroup.activate();
								const affSelected = list.filter((ele) => ele.id.toString() == e.detail);
								if (affSelected.length > 0) {
									affiliateInput[index] = affSelected[0];
								} else {
									affiliateInput[index] = { id: '0', name: '' };
								}
							}}
						>
							<SelectItem text="Choose" value="" />
							{#each list as item}
								<SelectItem value={item.id.toString()} text={item.name} />
							{/each}
						</Select>
						<Button
							sizes="field"
							kind="ghost"
							class="remove-aff-item"
							iconDescription="Remove"
							icon={CloseOutlineIcon}
							on:click={() => {
								affiliateInput = affiliateInput.filter(
									(ele) => ele.id !== affiliateInput[index].id
								);
							}}
						/>
						<!-- <CloseOutlineIcon
							size={20}
							class="remove-aff-item"
							on:click={() => {
								affiliateInput = affiliateInput.filter(
									(ele) => ele.id !== affiliateInput[index].id
								);
							}}
						/> -->
					</div>
				{/each}
				<Link
					on:click={() => {
						affiliateInput = [...affiliateInput, { id: '0', name: '' }];
						setTimeout(() => {
							const form = document.querySelector('form');
							if (form != null) {
								focusInput(form);
							}
						}, 0);
					}}
					id="bx--link-add">Add Affiliate {label}</Link
				>
			</div>
		</FormRow>
	</FormGroup>
{:else}
	<FormGroup hideEditButton groupClass={'group group-affiliations'}>
		<FormRow label={`Affiliate ${label}`} contentClass={'mtop-7'}>
			<div slot="value">
				{#each affiliate || [] as aff}
					<p class="affiliation-advisor">{aff.name}</p>
				{/each}
			</div>
		</FormRow>
	</FormGroup>
{/if}
