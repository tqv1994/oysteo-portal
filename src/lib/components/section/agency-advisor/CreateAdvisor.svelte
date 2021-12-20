<script lang="ts">
	import { mergeName, validateEmail } from '$lib/helpers/utils';

	import type { Advisor, AdvisorAgency } from '$lib/store/advisor';
	import type { SalutationType } from '$lib/store/salutationType';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { Checkbox, Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { getAuth, inMemoryPersistence, sendPasswordResetEmail } from 'firebase/auth';

	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';

	export let agencyId: string;
	export let advisors: AdvisorAgency[];
	export let salutationTypes: SalutationType[];
	export let activeSection: string = '';
	export let activeLoading: boolean;

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		createAdvisorData = {
			salutationType: '',
			firstName: '',
			lastName: '',
			name: '',
			initials: '',
			email: '',
			reference: '',
			active: false
		};
	};
	const onCancel = () => {
		activeSection = '';
	};

	let createAdvisorData = {
		salutationType: '',
		firstName: '',
		lastName: '',
		name: '',
		initials: '',
		email: '',
		reference: '',
		active: false
	};
	let invalidAdvisorEmail = {
		status: false,
		message: 'Invalid email'
	};
	let invalidAdvisorFirstName = {
		status: false,
		message: 'Firstname is required'
	};
	let invalidAdvisorLastName = {
		status: false,
		message: 'Lastname is required'
	};
	const createAdvisor = async () => {
		if (!validateEmail(createAdvisorData.email)) {
			invalidAdvisorEmail.status = true;
			setTimeout(() => {
				invalidAdvisorEmail.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		if (createAdvisorData.firstName == '') {
			invalidAdvisorFirstName.status = true;
			setTimeout(() => {
				invalidAdvisorFirstName.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		if (createAdvisorData.lastName == '') {
			invalidAdvisorLastName.status = true;
			setTimeout(() => {
				invalidAdvisorLastName.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}

		createAdvisorData.name = mergeName({
			firstName: createAdvisorData.firstName,
			lastName: createAdvisorData.lastName
		});
		delete createAdvisorData.firstName;
		delete createAdvisorData.lastName;

		activeLoading = true;
		try {
			const res = await fetch('/agency/advisors/create.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...createAdvisorData,
					salutationType: createAdvisorData.salutationType || null
				})
			});
			if (res.ok) {
				const data: AdvisorAgency = await res.json();
				advisors.push(data);

				const auth = getAuth();
				await auth.setPersistence(inMemoryPersistence);
				await sendPasswordResetEmail(auth, data.email).then(() => {});
				onCancel();
			} else {
				let error = await res.json();
				window.openNotification({ kind: 'error', title: 'Error', subtitle: error.message });
			}
		} catch (error) {
			window.openNotification({ kind: 'error', title: 'Error', subtitle: error.message });
		}
		createAdvisorData.lastName = "";
		createAdvisorData.firstName = "";
		activeLoading = false;
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'advisor-add'}
	on:edit={() => onEdit('advisor-add')}
	on:cancel={onCancel}
	on:submit={createAdvisor}
	groupClass={'group group-add'}
>
	<FormRow label="" {isEditing} contentClass={'add-advisor'}>
		<div slot="fields">
			<Select
				labelText="Salutation"
				class="half-width"
				bind:selected={createAdvisorData.salutationType}
			>
				{#each salutationTypes || [] as salutation}
					<SelectItem value={salutation.id} text={salutation.name} />
				{/each}
			</Select>
			<TextInput
				labelText="First name"
				placeholder="Enter advisor firstname"
				bind:value={createAdvisorData.firstName}
				invalid={invalidAdvisorFirstName.status}
				invalidText={invalidAdvisorFirstName.message}
			/>
			<TextInput
				labelText="Initials (optional)"
				placeholder=""
				class="agency-advisors-initials"
				bind:value={createAdvisorData.initials}
			/>
			<TextInput
				labelText="Last name"
				placeholder="Enter advisor lastname"
				bind:value={createAdvisorData.lastName}
				invalid={invalidAdvisorLastName.status}
				invalidText={invalidAdvisorLastName.message}
			/>

			<TextInput
				labelText="Email Address"
				placeholder="Enter advisor email"
				bind:value={createAdvisorData.email}
				invalid={invalidAdvisorEmail.status}
				invalidText={invalidAdvisorEmail.message}
			/>
			<TextInput
				labelText="Agency Reference"
				placeholder="Enter agency reference"
				bind:value={createAdvisorData.reference}
			/>

			<fieldset class="bx--fieldset">
				<legend class="bx--label">Check if actives</legend>
				<Checkbox id="agency-active-status" bind:checked={createAdvisorData.active} />
			</fieldset>
		</div>
	</FormRow>
</FormGroup>
