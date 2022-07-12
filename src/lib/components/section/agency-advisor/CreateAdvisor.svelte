<script lang="ts">
	import { notify } from '$lib/components/Toast.svelte';
	import { isValidEmail } from '$lib/helpers/utils';
	import type { Advisor } from '$lib/store/advisor';
	import { session } from '$app/stores';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppost } from '$lib/utils/fetch';
	import { Checkbox, Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { clear } from '$lib/store/activeForm';

	export let agencyId: string;
	export let advisors: Advisor[];
	export let activeSection = '';
	export let salutationTypes;

	export function activate() {
		formGroup.activate();
	}

	const reset = () => {
		formData = {
			salutationType: salutationTypes[0]?.id || '',
			firstname: '',
			initials: '',
			lastname: '',
			email: '',
			reference: '',
			active: true
		};
	};

	let formGroup: FormGroup;

	type FormData = {
		salutationType: string;
		firstname: string;
		initials?: string;
		lastname: string;
		email: string;
		reference?: string;
		active: boolean;
	};

	type FormError = {
		email?: string;
		firstname?: string;
		lastname?: string;
	};

	let formData: FormData;
	let formErrors: FormError;

	onMount(reset);
	onDestroy(reset);

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const onSubmit = async () => {
		const errors: FormError = {};
		if (!formData.email) {
			errors.email = 'Email address is required';
		} else if (!isValidEmail(formData.email)) {
			errors.email = 'Email address is invalid';
		}
		if (!formData.firstname) {
			errors.firstname = 'First name is required';
		}
		if (!formData.lastname) {
			errors.lastname = 'Last name is required';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		let finalFormData = { ...formData, salutationType: parseInt(formData.salutationType) };

		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppost('advisors/createAdvisor', finalFormData);
			if (res.ok) {
				const data: Advisor = await res.json();
				session.update((s) => {
					const advisors = s.agencyMe.advisors || [];
					advisors.unshift(data);
					s.agencyMe.advisors = advisors;
					return s;
				});
				activeSection = '';
				reset();
				clear();
			} else {
				switch (res.status) {
					case 400:
						errors.email = 'Email address is invalid';
						showErrors(errors);
						break;
					case 409:
						errors.email = 'A user with this email already exists';
						showErrors(errors);
						break;
					default:
						notify({
							title: 'Update failed',
							subtitle: 'Failed to update information, please try again later.'
						});
				}
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
</script>

<FormGroup
	bind:this={formGroup}
	let:isEditing
	on:submit={onSubmit}
	on:cancel={reset}
	data={{ ...formData }}
	groupClass={'group group-add'}
>
	<FormRow label="" {isEditing} contentClass={'add-advisor'}>
		<div slot="fields">
			<Select
				labelText="Salutation"
				class="half-width"
				bind:selected={formData.salutationType}
				on:change={(e) => {
					formData.salutationType = e.detail;
				}}
				name="salutationType"
			>
				{#each salutationTypes || [] as salutation}
					<SelectItem value={salutation.id} text={salutation.name} />
				{/each}
			</Select>
			<TextInput
				autofocus
				labelText="First name"
				placeholder="Enter advisor first name"
				bind:value={formData.firstname}
				invalid={!!formErrors?.firstname}
				invalidText={formErrors?.firstname}
				name="firstname"
			/>
			<TextInput
				labelText="Middle Initial (optional)"
				placeholder=""
				class="agency-advisors-initials"
				bind:value={formData.initials}
				name="initials"
			/>
			<TextInput
				labelText="Last name"
				placeholder="Enter advisor last name"
				bind:value={formData.lastname}
				invalid={!!formErrors?.lastname}
				invalidText={formErrors?.lastname}
				name="lastname"
			/>

			<TextInput
				labelText="Email Address"
				placeholder="Enter advisor email"
				bind:value={formData.email}
				invalid={!!formErrors?.email}
				invalidText={formErrors?.email}
				name="email"
			/>
			<TextInput
				labelText="Agency Reference"
				placeholder="Enter agency reference"
				bind:value={formData.reference}
				name="reference"
			/>

			<fieldset class="bx--fieldset">
				<legend class="bx--label">Check if active</legend>
				<Checkbox
					name="active"
					id="agency-active-status"
					bind:checked={formData.active}
					value={formData.active}
				/>
			</fieldset>
		</div>
	</FormRow>
</FormGroup>
