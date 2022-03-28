<script lang="ts">
	import type { Advisor } from '$lib/store/advisor';
	import type {
		AffiliateAgencies,
		AffiliateBenefitPrograms,
		AffiliateNetwork
	} from '$lib/store/affiliate';
	import { CloseOutline20 } from 'carbon-icons-svelte';
	import { Link, Select, SelectItem } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { onDestroy } from 'svelte';
	import { focusInput } from '$lib/helpers/scripts';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { authStore } from '$lib/store/auth';

	export let type: string;
	export let name: string;
	export let label: string;
	export let affiliate: AffiliateAgencies[] | AffiliateBenefitPrograms[] | AffiliateNetwork[];
	export let list: AffiliateAgencies[] | AffiliateBenefitPrograms[] | AffiliateNetwork[];
	export let objectId: string;
	export let activeSection = '';
	export let allowEdit = false;

	let affiliateInput: AffiliateAgencies[] | AffiliateBenefitPrograms[] | AffiliateNetwork[];

	const resetAffiliateInput = () => {
		affiliateInput = [];
	};

	resetAffiliateInput();
	onDestroy(() => {
		resetAffiliateInput();
	});
	const onEdit = (groupName: string) => {
		activeSection = groupName;
		affiliateInput = [...affiliate];
	};
	const onCancel = () => {
		activeSection = '';
	};

	const handleName = (name: string) => {
		if (name === 'Benefit Programs') {
			return 'benefit_programs';
		}
		return name.toLocaleLowerCase();
	};

	const updateAffiliate = async () => {
		try {
			let affID: string[] = [];
			affID = affiliateInput.filter((item) => item.id !== '0').map((item) => item.id);

			if (affID.length == 0) {
				return;
			}
			let data = {};
			data[`affiliate_${handleName(name)}`] = affID;
			isFormSavingStore.set({ saving: true });

			const res = await fetch(`/common/${type}-${objectId}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});
			if (res.ok) {
				const data = await res.json();
				if (type == 'advisor') {
					affiliate = data.updateAdvisor.advisor[`affiliate_${handleName(name)}`];
				} else if (type == 'agency') {
					affiliate = data.updateAgency.agency[`affiliate_${handleName(name)}`];
					let user = $authStore.user;
					user.agencyMe[`affiliate_${handleName(name)}`] = affiliate;
					authStore.set({ user });
				}
				resetAffiliateInput();
				onCancel();
			}
		} catch (error) {}
		isFormSavingStore.set({ saving: false });
	};
</script>

{#if allowEdit == true}
	<FormGroup
		let:isEditing
		isEditing={activeSection === `affiliate-${name}`}
		on:edit={() => onEdit(`affiliate-${name}`)}
		on:cancel={onCancel}
		on:submit={updateAffiliate}
		groupClass={'group group-affiliations'}
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
							name="InaffiliateInput-{index}"
							selected={aff.id.toString()}
							on:change={(e) => {
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
						<CloseOutline20
							class="remove-aff-item"
							on:click={() => {
								affiliateInput = affiliateInput.filter(
									(ele) => ele.id !== affiliateInput[index].id
								);
							}}
						/>
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
