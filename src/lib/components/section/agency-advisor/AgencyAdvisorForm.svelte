<script lang="ts">
	import { isValidEmail } from '$lib/helpers/utils';

	import type { Advisor } from '$lib/store/advisor';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { Checkbox, Select, SelectItem, TextInput } from 'carbon-components-svelte';

	import ListItemContainer from '../../form/listitemcontainer.svelte';
	import FormRow from '../../form/row.svelte';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { ppatch, ppost } from '$lib/utils/fetch';
	import { session } from '$app/stores';
	import { clear } from '$lib/store/activeForm';

	export let advisor: Advisor;
	export let activeSection = '';
	export let salutationTypes;

	type FormData = {
		firstname?: string;
		initials?: string;
		lastname?: string;
		email: string;
		reference?: string;
		active?: boolean;
		salutationType: string | null;
	};

	type FormError = {
		email?: string;
	};

	let formErrors: FormError;
	let formData: FormData = {
		firstname: advisor.firstname,
		initials: advisor.initials,
		lastname: advisor.lastname,
		email: advisor.email,
		reference: advisor.reference,
		active: advisor.active,
		salutationType: advisor.salutationType?.toString() || salutationTypes[0].id
	};

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};

	function onCancel() {
		activeSection = '';
	}

	const onSubmit = async () => {
		const errors: FormError = {};
		if (!formData.email) {
			errors.email = 'Email address is required';
		} else if (!isValidEmail(formData.email)) {
			errors.email = 'Email address is invalid';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		let finalFormData = { ...formData, salutationType: parseInt(formData.salutationType) };

		try {
			isFormSavingStore.set({ saving: true });
			const res = await ppatch(`advisors/${advisor.id}`, finalFormData);

			if (res.ok) {
				const advisor = await res.json();
				session.update((s) => {
					const idx = s.agencyMe.advisors.findIndex((a) => a.id === advisor.id);
					s.agencyMe.advisors[idx] = advisor;
					return s;
				});
				activeSection = '';
				clear();
			}
		} catch (error) {
			console.error(error);
		}
		isFormSavingStore.set({ saving: false });
		onCancel();
	};

	const reSendInvitation = async () => {
		try {
			isFormSavingStore.set({ saving: true });
			const res = await ppost(`advisors/reSendInvitation`, { id: advisor.id });
			if (res.ok) {
				activeSection = '';
				notify({
					kind: 'success',
					title: 'success',
					subtitle: 'Re-send success'
				});
			}
		} catch (error) {
			console.error(error);
			notify({
				kind: 'error',
				title: 'error',
				subtitle: 'Re-send fail'
			});
		}
		isFormSavingStore.set({ saving: false });
		onCancel();
	};
</script>

<ListItemContainer
	let:isEditing
	reSend={true}
	on:send={() => reSendInvitation()}
	on:edit={() => onEdit('advisor--' + advisor.id)}
	on:cancel={onCancel}
	on:submit={onSubmit}
	data={{ ...advisor }}
>
	<FormRow
		{isEditing}
		label={`${advisor.firstname || ''} ${advisor.initials || ''} ${advisor.lastname || ''}`}
		contentClass={'mtop-8'}
		class={'listitem-advisor'}
	>
		<div slot="value">{advisor.active ? 'Active' : 'Inactive'}</div>
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
				{#each salutationTypes as salutation}
					<SelectItem value={salutation.id} text={salutation.name} />
				{/each}
			</Select>
			<TextInput
				labelText="First name"
				placeholder="Enter advisor first name"
				bind:value={formData.firstname}
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
				name="lastname"
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
						placeholder="Enter advisor email"
						hideLabel
						bind:value={formData.email}
						invalid={!!formErrors?.email}
						invalidText={formErrors?.email}
						name="email"
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
						placeholder="Enter agency reference"
						hideLabel
						bind:value={formData.reference}
						name="reference"
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
							bind:checked={formData.active}
							value={formData.active}
							name="active"
						/>
					</fieldset>
				</div>
			</FormRow>
		</div>
	</FormRow>
</ListItemContainer>
