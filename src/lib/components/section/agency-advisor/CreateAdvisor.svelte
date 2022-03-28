<script lang="ts">
	import { notify } from '$lib/components/Toast.svelte';

	import { mergeName, isValidEmail } from '$lib/helpers/utils';

	import type { Advisor, AdvisorAgency } from '$lib/store/advisor';
	import { authStore } from '$lib/store/auth';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { SalutationType, salutationTypeStore } from '$lib/store/salutationType';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { Checkbox, Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { getAuth, inMemoryPersistence, sendPasswordResetEmail } from 'firebase/auth';

	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';

	export let agencyId: string;
	export let advisors: AdvisorAgency[];
	export let activeSection = '';

	const salutationTypes = Object.values($salutationTypeStore.items);

	let firstName = '';
	let lastName = '';

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		resetAdvisorData();
	};
	const onCancel = () => {
		activeSection = '';
		resetAdvisorData();
	};

	const resetAdvisorData = () => {
		createAdvisorData = {
			salutationType: salutationTypes[0]?.id || '',
			name: '',
			initials: '',
			email: '',
			reference: '',
			active: false
		};
		firstName = '';
		lastName = '';
	};

	let createAdvisorData = {
		salutationType: '',
		name: '',
		initials: '',
		email: '',
		reference: '',
		active: false
	};
	resetAdvisorData();

	type FormError = {
		email?: string;
		firstName?: string;
		lastName?: string;
	};

	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

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
		const errors: FormError = {};
		if (!isValidEmail(createAdvisorData.email)) {
			errors.email = 'Email address is invalid';
		}
		if (firstName == '') {
			errors.firstName = 'First name is required';
		}
		if (lastName == '') {
			errors.lastName = 'Last name is required';
		}
		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		createAdvisorData.name = firstName + ' ' + lastName;

		isFormSavingStore.set({ saving: true });
		try {
			const res = await fetch('/account/agency/advisors/create.json', {
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
				advisors = advisors || [];
				advisors.push(data);
				if ($authStore.user.agencyMe) {
					$authStore.user.agencyMe.advisors = advisors;
				}
				authStore.set({ user: $authStore.user });
				const auth = getAuth();
				onCancel();
			} else {
				let error = await res.json();
				notify({ kind: 'error', title: 'Error', subtitle: error.message });
			}
		} catch (error) {
			notify({ kind: 'error', title: 'Error', subtitle: error.message });
		}
		isFormSavingStore.set({ saving: false });
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
				autofocus
				labelText="First name"
				placeholder="Enter advisor first name"
				bind:value={firstName}
				invalid={!!formErrors?.firstName}
				invalidText={formErrors?.firstName}
			/>
			<TextInput
				labelText="Middle Initial (optional)"
				placeholder=""
				class="agency-advisors-initials"
				bind:value={createAdvisorData.initials}
			/>
			<TextInput
				labelText="Last name"
				placeholder="Enter advisor last name"
				bind:value={lastName}
				invalid={!!formErrors?.lastName}
				invalidText={formErrors?.lastName}
			/>

			<TextInput
				labelText="Email Address"
				placeholder="Enter advisor email"
				bind:value={createAdvisorData.email}
				invalid={!!formErrors?.email}
				invalidText={formErrors?.email}
			/>
			<TextInput
				labelText="Agency Reference"
				placeholder="Enter agency reference"
				bind:value={createAdvisorData.reference}
			/>

			<fieldset class="bx--fieldset">
				<legend class="bx--label">Check if active</legend>
				<Checkbox id="agency-active-status" bind:checked={createAdvisorData.active} />
			</fieldset>
		</div>
	</FormRow>
</FormGroup>
