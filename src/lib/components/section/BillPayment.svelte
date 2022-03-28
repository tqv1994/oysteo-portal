<script lang="ts">
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { salutationTypeStore } from '$lib/store/salutationType';
	import type { Payment } from '$lib/store/payment';
	import { countryStore } from '$lib/store/country';
	import { convert2InternationalPhone, isValidPhoneNumber } from '$lib/helpers/phone-number';
	import { isValidEmail } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { onDestroy } from 'svelte';
	import { paymentMethodStore } from '$lib/store/paymentMethod';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { sortByName, sortByOrder } from '$lib/utils/sort';

	export let agencyId: string;
	export let payments: Payment[];

	const salutationTypes = Object.values($salutationTypeStore.items);
	const paymentMethods = Object.values($paymentMethodStore.items);
	const countries = sortByOrder(sortByName(Object.values($countryStore.items)));

	export let activeSection = '';

	let havePayment: boolean;
	type PaymentInput = {
		firstName: string;
		lastName: string;
		phone: string;
		countryCode: string;
		email: string;
		initials: string;
		paymentMethod: string | null;
		salutationType: string | null;
	};

	let paymentInput: PaymentInput;
	const resetBillPaymentInput = () => {
		paymentInput = {
			firstName: '',
			lastName: '',
			phone: '',
			countryCode: '',
			email: '',
			initials: '',
			paymentMethod: null,
			salutationType: null
		};
	};
	resetBillPaymentInput();
	onDestroy(() => {
		resetBillPaymentInput();
	});

	type FormError = {
		email?: string;
		paymentMethod?: string;
		phone?: string;
	};

	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const invalidEmail = {
		status: false,
		message: 'Invalid email'
	};
	const invalidPhoneNumber = {
		status: false,
		message: 'Invalid phone number'
	};
	const requirePaymentMethod = {
		status: false,
		message: 'Payment method is required'
	};

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		if ((payments || []).length == 0) {
			havePayment = false;
			resetBillPaymentInput();
		} else {
			havePayment = true;
			paymentInput = {
				firstName: payments[0].firstName || '',
				lastName: payments[0].lastName || '',
				phone: payments[0].phone || '',
				countryCode: payments[0].countryCode || '',
				email: payments[0].email || '',
				initials: payments[0].initials || '',
				paymentMethod: payments[0].paymentMethod?.id || null,
				salutationType: payments[0].salutationType?.id || null
			};
		}
	};
	const onCancel = () => {
		activeSection = '';
	};

	const handleValidate = (data: PaymentInput) => {
		if (!data.paymentMethod) {
			requirePaymentMethod.status = true;
			setTimeout(() => {
				requirePaymentMethod.status = false;
			}, INVALID_DELAY_TIME);
			return false;
		}

		if (!isValidPhoneNumber(data.phone, data.countryCode)) {
			invalidPhoneNumber.status = true;
			setTimeout(() => {
				invalidPhoneNumber.status = false;
			}, INVALID_DELAY_TIME);
			return false;
		}

		if (!isValidEmail(data.email)) {
			invalidEmail.status = true;
			setTimeout(() => {
				invalidEmail.status = false;
			}, INVALID_DELAY_TIME);
			return false;
		}
		return true;
	};

	const createPayment = async () => {
		const errors: FormError = {};
		if (!paymentInput.paymentMethod) {
			errors.paymentMethod = 'Payment method is required';
		}
		if (!isValidEmail(paymentInput.email)) {
			errors.email = 'Email address is invalid';
		}
		if (!isValidPhoneNumber(paymentInput.phone, paymentInput.countryCode)) {
			errors.phone = 'Phone number is invalid';
		}
		if (Object.keys(errors).length) {
			showErrors(errors);
			return false;
		}
		try {
			const res = await fetch(`/account/agency/payments/create.json`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...paymentInput, phone: (paymentInput.phone || '').toString() })
			});
			if (res.ok) {
				const data = await res.json();
				return data.createBillPayment.billPayment.id;
			}
		} catch (error) {
			console.log('create payment', error);
		}
	};
	const updatePayment = async () => {
		try {
			let url = ``;
			let data: PaymentInput | string;

			if (havePayment) {
				data = { ...paymentInput, phone: (paymentInput.phone || '').toString() };
				url = `/account/agency/payments/update-${payments[0].id}.json`;
				if (!handleValidate(paymentInput)) {
					return;
				}
				isFormSavingStore.set({ saving: true });
			} else {
				isFormSavingStore.set({ saving: true });
				data = await createPayment();
				if (!data) {
					isFormSavingStore.set({ saving: false });
					return;
				}
				url = `/account/agency/payments/assign-${agencyId}.json`;
			}

			const res = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ data })
			});
			if (res.ok) {
				const data = await res.json();
				if (havePayment) {
					payments[0] = data.updateBillPayment.billPayment;
				} else {
					payments = data.updateAgency.agency.payments;
				}
				resetBillPaymentInput();
				onCancel();
			}
		} catch (error) {
			console.log('update payment', error);
		}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'billing'}
	on:edit={() => onEdit('billing')}
	on:cancel={onCancel}
	on:submit={updatePayment}
>
	<FormRow label="Payment method" {isEditing}>
		<div slot="value">
			{(payments || []).length == 0
				? ''
				: !payments[0].paymentMethod
				? ''
				: payments[0].paymentMethod.name}
		</div>
		<div slot="fields">
			<Select
				labelText="Payment Method"
				hideLabel
				on:change={(e) => {
					const paymentMethodSelected = paymentMethods.filter(
						(ele) => ele.id.toString() == e.detail
					);
					if (paymentMethodSelected.length > 0) {
						paymentInput.paymentMethod = paymentMethodSelected[0].id;
					} else {
						paymentInput.paymentMethod = null;
					}
				}}
				selected={payments == null || payments.length == 0
					? ''
					: payments[0].paymentMethod == null
					? ''
					: payments[0].paymentMethod.id.toString()}
				invalid={!!formErrors?.paymentMethod}
				invalidText={formErrors?.paymentMethod}
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
			{(payments || []).length != 0
				? (payments[0].salutationType?.name || '') +
				  '.' +
				  payments[0].firstName +
				  ' ' +
				  payments[0].lastName
				: ''}
		</div>
		<div slot="fields">
			<Select
				labelText="Salutation"
				class="half-width"
				on:change={(e) => {
					const salutationSelected = salutationTypes.filter((ele) => ele.id.toString() == e.detail);
					if (salutationSelected.length > 0) {
						paymentInput.salutationType = salutationSelected[0].id;
					} else {
						paymentInput.salutationType = null;
					}
				}}
				selected={payments == null || payments.length == 0
					? ''
					: payments[0].salutationType == null
					? ''
					: payments[0].salutationType.id.toString()}
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
				bind:value={paymentInput.firstName}
			/>
			<TextInput
				labelText="Initials (optional)"
				placeholder=""
				id="agency-billing-initials"
				bind:value={paymentInput.initials}
			/>
			<TextInput
				labelText="Last name"
				placeholder="Enter billing contact last name"
				bind:value={paymentInput.lastName}
			/>
		</div>
	</FormRow>
	<FormRow label="Phone" {isEditing}>
		<div slot="value">
			{(payments || []).length != 0
				? convert2InternationalPhone(payments[0].phone, payments[0].countryCode)
				: ''}
		</div>
		<div slot="fields" class="phone-billing">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={payments.length != 0 ? payments[0].countryCode : ''}
				on:change={(e) => {
					paymentInput.countryCode = e.detail;
				}}
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
				bind:value={paymentInput.phone}
				invalid={!!formErrors?.phone}
				invalidText={formErrors?.phone}
			/>
		</div>
	</FormRow>
	<FormRow label="Email" {isEditing}>
		<div slot="value">{Array.isArray(payments) && payments[0] ? payments[0].email : ''}</div>
		<div slot="fields">
			<TextInput
				placeholder="Enter billing email"
				bind:value={paymentInput.email}
				invalid={!!formErrors?.email}
				invalidText={formErrors?.email}
			/>
		</div>
	</FormRow>
</FormGroup>
