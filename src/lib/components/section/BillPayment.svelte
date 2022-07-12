<script lang="ts">
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { convert2InternationalPhone, isValidPhoneNumber } from '$lib/helpers/phone-number';
	import { isValidEmail } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import type { Agency } from '$lib/store/agency';
	import { ppatch } from '$lib/utils/fetch';
	import { notify } from '../Toast.svelte';
	import { session } from '$app/stores';
	import type { Kind } from '$lib/store/category';
	import { clear } from '$lib/store/activeForm';

	export let target: string;
	export let agency: Agency;
	export let activeSection = '';
	export let paymentMethods: Kind[];
	export let salutationTypes: Kind[];
	export let countries;

	type FormData = {
		billingPhone?: string;
		billingEmail?: string;
		billingInitials?: string;
		billingFirstName?: string;
		billingLastName?: string;
		billingPaymentMethod?: string;
		billingCountryCode?: string;
		billingSalutationType?: string;
	};

	let formData: FormData;
	let formErrors: FormError;
	const dispatch = createEventDispatcher();

	function reset() {
		formData = {
			billingPhone: agency.billingPhone || '',
			billingEmail: agency.billingEmail || '',
			billingInitials: agency.billingInitials || '',
			billingFirstName: agency.billingFirstName || '',
			billingLastName: agency.billingLastName || '',
			billingPaymentMethod: agency.billingPaymentMethod?.toString(),
			billingCountryCode: agency.billingCountryCode || '',
			billingSalutationType: agency.billingSalutationType?.toString()
		};
	}

	onMount(reset);
	onDestroy(reset);

	type FormError = {
		billingPhone?: string;
		billingEmail?: string;
		billingInitials?: string;
		billingFirstName?: string;
		billingLastName?: string;
		billingPaymentMethod?: string;
		billingCountryCode?: string;
		billingSalutationType?: string;
	};

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const onSubmit = async () => {
		const errors: FormError = {};
		if (!formData.billingFirstName) {
			errors.billingFirstName = "Billing contact's first name is required";
		}
		if (!formData.billingLastName) {
			errors.billingLastName = "Billing contact's last name is required";
		}
		if (!isValidPhoneNumber(formData.billingPhone, formData.billingCountryCode)) {
			errors.billingPhone = 'Phone number is invalid';
			errors.billingCountryCode = 'Phone number is invalid';
		}
		if (!formData.billingEmail) {
			errors.billingEmail = 'Email address is required';
		} else if (!isValidEmail(formData.billingEmail)) {
			errors.billingEmail = 'Email address is invalid';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, formData);
			if (res.ok) {
				dispatch('change', await res.json());
				session.update((s) => {
					s.agencyMe.billingPhone = formData.billingPhone;
					s.agencyMe.billingEmail = formData.billingEmail;
					s.agencyMe.billingInitials = formData.billingInitials;
					s.agencyMe.billingFirstName = formData.billingFirstName;
					s.agencyMe.billingLastName = formData.billingLastName;
					// s.agencyMe.billingPaymentMethod = formData.billingPaymentMethod;
					s.agencyMe.billingCountryCode = formData.billingCountryCode;
					// s.agencyMe.billingSalutationType = parseInt(formData.billingSalutationType);
					return s;
				});
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
			console.error('Failed to update business info', error);
		}
		activeSection = '';
		isFormSavingStore.set({ saving: false });
	};

	function convertBillingPaymentMethod(id) {
		if (id == null) {
			return '';
		}
		let method;
		method = paymentMethods.find((method) => method.id == id);
		return method.name;
	}
</script>

<FormGroup let:isEditing on:submit={onSubmit} on:cancel={reset} data={{...formData}}>
	<FormRow label="Payment method" {isEditing}>
		<div slot="value">
			{#if typeof agency.billingPaymentMethod == 'number'}
				{convertBillingPaymentMethod(agency.billingPaymentMethod)}
			{:else}
				{agency.billingPaymentMethod?.name || ''}
			{/if}
		</div>
		<div slot="fields">
			<Select
				labelText="Payment Method"
				hideLabel
				on:change={(e) => {
					formData.billingPaymentMethod = e.detail;
				}}
				selected={formData.billingPaymentMethod}
				name="billingPaymentMethod"
			>
				<SelectItem value="" text="Choose" />
				{#each paymentMethods || [] as method}
					<SelectItem text={method.name} value={method.id} />
				{/each}
			</Select>
		</div>
	</FormRow>
	<FormRow label="Billing Contact Name" {isEditing}>
		<div slot="value">
			{agency.billingFirstName || ''}
			{agency.billingInitials || ''}
			{agency.billingLastName || ''}
		</div>
		<div slot="fields">
			<Select
				labelText="Salutation"
				class="half-width"
				on:change={(e) => {
					formData.billingSalutationType = e.detail;
				}}
				selected={formData.billingSalutationType}
				name="billingSalutationType"
			>
				<SelectItem value="" text="Choose" />
				{#each salutationTypes as salutation}
					<SelectItem value={salutation?.id} text={salutation?.name} />
				{/each}
			</Select>
			<TextInput
				autofocus
				labelText="First name"
				placeholder="Enter billing contact first name"
				bind:value={formData.billingFirstName}
				invalid={!!formErrors?.billingFirstName}
				invalidText={formErrors?.billingFirstName}
				name="billingFirstName"
			/>
			<TextInput
				labelText="Initials (optional)"
				placeholder=""
				id="agency-billing-initials"
				bind:value={formData.billingInitials}
				invalid={!!formErrors?.billingInitials}
				invalidText={formErrors?.billingInitials}
				name="billingInitials"
			/>
			<TextInput
				labelText="Last name"
				placeholder="Enter billing contact last name"
				bind:value={formData.billingLastName}
				invalid={!!formErrors?.billingLastName}
				invalidText={formErrors?.billingLastName}
				name="billingLastName"
			/>
		</div>
	</FormRow>
	<FormRow label="Phone" {isEditing}>
		<div slot="value">
			{agency.billingPhone
				? convert2InternationalPhone(agency.billingPhone, agency.billingCountryCode)
				: ''}
		</div>
		<div slot="fields" class="phone-billing">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={formData.billingCountryCode}
				on:change={(e) => {
					formData.billingCountryCode = e.detail;
				}}
				name="billingCountryCode"
			>
				<SelectItem value="" text="Choose" />

				{#each countries as country}
					<SelectItem value={country.code} text={country.name + ' +' + country.phone} />
				{/each}
			</Select>
			<TextInput
				type="text"
				labelText="Number"
				placeholder="Enter phone number"
				bind:value={formData.billingPhone}
				invalid={!!formErrors?.billingPhone}
				invalidText={formErrors?.billingPhone}
				name="billingPhone"
			/>
		</div>
	</FormRow>
	<FormRow label="Email" {isEditing}>
		<div slot="value">{agency.billingEmail || ''}</div>
		<div slot="fields">
			<TextInput
				placeholder="Enter billing email"
				bind:value={formData.billingEmail}
				invalid={!!formErrors?.billingEmail}
				invalidText={formErrors?.billingEmail}
				name="billingEmail"
			/>
		</div>
	</FormRow>
</FormGroup>
