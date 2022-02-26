<script lang="ts">
	import { mergeName, separateFirstAndLastName, validateEmail } from '$lib/helpers/utils';

	import type { AdvisorAgency } from '$lib/store/advisor';
	import type { SalutationType } from '$lib/store/salutationType';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { Checkbox, Select, SelectItem, TextInput } from 'carbon-components-svelte';

	import ListItemContainer from '../../form/listitemcontainer.svelte';
	import FormRow from '../../form/row.svelte';
	import FormGroup from '../../form/group.svelte';

	export let advisors: AdvisorAgency[];
	export let salutationTypes: SalutationType[];
	export let activeSection: string = '';
	export let activeLoading: boolean;

	type AdvisorInput = {
		name: string;
		initials: string;
		email: string;
		reference: string;
		active: boolean;
		salutationType: string | null;
	};
	console.log('abc',advisors);
	
	const advisorInputs: AdvisorInput[] = advisors.reduce((acc: AdvisorInput[], advisor) => {
		acc.push({
			name: advisor.name,
			initials: advisor.initials,
			email: advisor.email,
			reference: advisor.reference,
			active: advisor.active,
			salutationType: advisor.salutationType?.id+"" || null
		});
		return acc;
	}, []);

	console.log(advisorInputs);

	const onEdit = (groupName: string) => {
		
		activeSection = groupName;
		if (groupName.includes('advisor--')) {
			const advisorIndex = parseInt(groupName.split('--')[1]);
			advisorNameData = separateFirstAndLastName(advisors[advisorIndex].name);
			if (!advisorInputs[advisorIndex]) {
				console.log('salutationType', advisors[advisorIndex].salutationType?.id);
				advisorInputs.push({
					name: advisors[advisorIndex].name,
					initials: advisors[advisorIndex].initials,
					email: advisors[advisorIndex].email,
					reference: advisors[advisorIndex].reference,
					active: advisors[advisorIndex].active,
					salutationType: advisors[advisorIndex].salutationType?.id+"" || null
				});
			}
		}
	};
	const onCancel = () => {
		activeSection = '';
	};
	let advisorNameData = {
		firstName: '',
		lastName: ''
	};

	let invalidAdvisorEmail = {
		status: false,
		message: 'Invalid email'
	};

	const updateAdvisor = async (advisorIndex: number) => {
		const name = mergeName(advisorNameData);
		const advisorSelected = advisors[advisorIndex];
		const data = {
			name,
			initials: advisorInputs[advisorIndex].initials || '',
			email: advisorInputs[advisorIndex].email || '',
			reference: advisorInputs[advisorIndex].reference || '',
			active: advisorInputs[advisorIndex].active || false,
			salutationType: advisorInputs[advisorIndex].salutationType || null
		};

		if (!validateEmail(data.email)) {
			invalidAdvisorEmail.status = true;
			setTimeout(() => {
				invalidAdvisorEmail.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		try {
			activeLoading = true;
			const res = await fetch(`/agency/advisors/update-${advisorSelected.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});

			if (res.ok) {
				activeSection = '';
				const dataUpdate = await res.json();
				advisors[advisorIndex] = dataUpdate.updateAdvisor.advisor;
			}
		} catch (error) {
			console.log(error);
		}
		activeLoading = false;
	};
</script>

<FormRow label="" class={'mbottom-32'} contentClass={'mtop-d16 list-advisors'}>
	<div slot="value">
		{#each advisors as advisor, index}
			<ListItemContainer
				let:isEditing
				reSend={true}
				isEditing={activeSection === 'advisor--' + index}
				on:edit={() => onEdit('advisor--' + index)}
				on:cancel={onCancel}
				on:submit={() => updateAdvisor(index)}
			>
				<FormRow
					label={advisor.name}
					{isEditing}
					contentClass={'mtop-8'}
					class={'listitem-advisor'}
				>
					<div slot="value">{advisor.active ? 'Active' : 'Inactive'}</div>
					<div slot="fields">
						{#if advisorInputs[index]}
							<Select
								labelText="Salutation"
								bind:selected={advisorInputs[index].salutationType}
								class="half-width"
							>
								{#each salutationTypes as salutation}
									<SelectItem value={salutation.id} text={salutation.name} />
								{/each}
							</Select>
							<TextInput
								labelText="First name"
								placeholder="Enter advisor firstname..."
								bind:value={advisorNameData.firstName}
							/>
							<TextInput
								labelText="Middle Initial (optional)"
								placeholder=""
								class="agency-advisors-initials"
								bind:value={advisorInputs[index].initials}
							/>
							<TextInput
								labelText="Last name"
								placeholder="Enter advisor lastname..."
								bind:value={advisorNameData.lastName}
							/>

							<FormRow
								label="Email Address"
								{isEditing}
								contentClass={'mtop-4-5'}
								class={'mtop-17-5 row-item'}
							>
								<div slot="fields">
									<TextInput
										labelText="Email Address"
										placeholder="Enter advisor email..."
										hideLabel
										bind:value={advisorInputs[index].email}
										invalid={invalidAdvisorEmail.status}
										invalidText={invalidAdvisorEmail.message}
									/>
								</div>
							</FormRow>

							<FormRow
								label="Agency Reference"
								{isEditing}
								contentClass={'mtop-4-5'}
								class={'mtop-17-5 row-item'}
							>
								<div slot="fields">
									<TextInput
										labelText="Agency Reference"
										placeholder="Enter agency reference..."
										hideLabel
										bind:value={advisorInputs[index].reference}
									/>
								</div>
							</FormRow>

							<FormRow
								label="Active Status"
								{isEditing}
								contentClass={'mtop-4-5'}
								class={'mtop-17-5 mbottom-32 row-item'}
							>
								<div slot="fields">
									<fieldset class="bx--fieldset">
										<legend class="bx--label">Check if active</legend>
										<Checkbox
											id="agency-active-status"
											bind:checked={advisorInputs[index].active}
										/>
									</fieldset>
								</div>
							</FormRow>
						{/if}
					</div>
				</FormRow>
			</ListItemContainer>
		{/each}
	</div>
</FormRow>
