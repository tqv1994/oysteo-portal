<script lang="ts">
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import type { SalutationType } from '$lib/store/salutationType';
	import type { Payment, PaymentMethod } from '$lib/store/payment';
	import type { Country } from '$lib/store/country';
	import {
		convert2InternationalPhone,
		isValidPhoneNumber,
		isValidPhoneNumber
	} from '$lib/helpers/phone-number';
	import { mergeName, validateEmail } from '$lib/helpers/utils';
	import { INVALID_DELAY_TIME, INVALID_DELAY_TIME } from '$lib/utils/constants';

	export let agencyId: string;
	export let payments: Payment[];
	export let salutationTypes: SalutationType[];
	export let paymentMethods: PaymentMethod[];
	export let countries: Country[];
	export let activeSection: string = '';
	export let activeLoading: boolean;

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
		if (payments.length == 0) {
			payments = [
				{
					id: null,
					firstName: '',
					lastName: '',
					phone: '',
					countryCode: '',
					email: '',
					initials: '',
					paymentMethod: null,
					salutationType: null
				}
			];
		}
	};
	const onCancel = () => {
		activeSection = '';
	};

	const handleValidate = (data) => {
		console.log(data);
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

		if (!validateEmail(data.email)) {
			invalidEmail.status = true;
			setTimeout(() => {
				invalidEmail.status = false;
			}, INVALID_DELAY_TIME);
			return false;
		}
		return true;
	};

	const createPayment = async () => {
		try {
			activeLoading = true;
			let createData = {
				firstName: payments[0].firstName || '',
				lastName: payments[0].lastName || '',
				phone: payments[0].phone || '',
				countryCode: payments[0].countryCode || '',
				email: payments[0].email || '',
				initials: payments[0].initials || '',
				paymentMethod: payments[0].paymentMethod?.id || null,
				salutationType: payments[0].salutationType?.id || null
			};
			if (!handleValidate(createData)) {
				return;
			}
			const res = await fetch(`/agency/payments/create.json`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...createData })
			});
			if (res.ok) {
				const data = await res.json();
				console.log('create data', data);
				return data.createBillPayment.billPayment.id;
			}
		} catch (error) {
			console.log('create payment', error);
		}
	};
	const updatePayment = async () => {
		try {
			if (!handleValidate(payments[0])) {
				return;
			}
			let paymentData;
			let paymentIds: string;
			let isAvailable = false;
			if (payments[0].id == null) {
				paymentIds = await createPayment();
			} else {
				isAvailable = true;
				paymentData = { ...payments[0] };
			}

			let data;
			let url = ``;
			if (isAvailable) {
				delete paymentData.__typename;
				paymentData.paymentMethod = paymentData.paymentMethod.id || '';
				paymentData.salutationType = paymentData.salutationType?.id || null;
				url = `/agency/payments/update-${paymentData.id}.json`;
				data = { ...paymentData };
				activeLoading = true;
			} else {
				url = `/agency/payments/assign-${agencyId}.json`;
				data = paymentIds;
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
				if (isAvailable) {
					payments[0] = data.updateBillPayment.billPayment;
				} else {
					payments = data.updateAgency.agency.payments;
				}
				console.log('abc', payments[0]);
				alert('Update successfully');
				activeSection = '';
			}
		} catch (error) {
			console.log('update payment', error);
		}
		activeLoading = false;
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
			{payments.length == 0 ? '' : !payments[0].paymentMethod ? '' : payments[0].paymentMethod.name}
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
						payments[0].paymentMethod = {
							id: paymentMethodSelected[0].id,
							name: paymentMethodSelected[0].name
						};
					} else {
						payments[0].paymentMethod = null;
					}
				}}
				selected={payments == null || payments.length == 0
					? ''
					: payments[0].paymentMethod == null
					? ''
					: payments[0].paymentMethod.id.toString()}
				invalid={requirePaymentMethod.status}
				invalidText={requirePaymentMethod.message}
			>
				<SelectItem value="" text="Choose..." />
				{#each paymentMethods as method}
					<SelectItem text={method.name} value={method.id} />
				{/each}
			</Select>
		</div>
	</FormRow>
	<FormRow label="Billing Contact Name" {isEditing}>
		<div slot="value">{payments[0] ? payments[0].firstName + ' ' + payments[0].lastName : ''}</div>
		<div slot="fields">
			<Select
				labelText="Salutation"
				class="half-width"
				on:change={(e) => {
					const salutationSelected = salutationTypes.filter((ele) => ele.id.toString() == e.detail);
					if (salutationSelected.length > 0) {
						payments[0].salutationType = {
							id: salutationSelected[0].id,
							name: salutationSelected[0].name
						};
					} else {
						payments[0].salutationType = null;
					}
				}}
				selected={payments == null || payments.length == 0
					? ''
					: payments[0].salutationType == null
					? ''
					: payments[0].salutationType.id.toString()}
			>
				<SelectItem value="" text="Choose..." />
				{#each salutationTypes as salutation}
					<SelectItem value={salutation?.id} text={salutation?.name} />
				{/each}
			</Select>
			<TextInput
				labelText="First name"
				placeholder="Enter billing contact firstname"
				bind:value={payments[0].firstName}
			/>
			<TextInput
				labelText="Initials (optional)"
				placeholder=""
				id="agency-billing-initials"
				bind:value={payments[0].initials}
			/>
			<TextInput
				labelText="Last name"
				placeholder="Enter billing contact lastname"
				bind:value={payments[0].lastName}
			/>
		</div>
	</FormRow>
	<FormRow label="Phone" {isEditing}>
		<div slot="value">
			{payments[0] ? convert2InternationalPhone(payments[0].phone, payments[0].countryCode) : ''}
		</div>
		<div slot="fields">
			<Select
				labelText="Country Code"
				class="half-width"
				selected={payments[0].countryCode}
				on:change={(e) => {
					payments[0].countryCode = e.detail;
				}}
			>
				<SelectItem value="" text="Choose..." />

				{#each countries as country}
					<SelectItem value={country?.code} text={country?.name} />
				{/each}
			</Select>
			<TextInput
				labelText="Number"
				placeholder="Enter phone number..."
				bind:value={payments[0].phone}
				invalid={invalidPhoneNumber.status}
				invalidText={invalidPhoneNumber.message}
			/>
		</div>
	</FormRow>
	<FormRow label="Email" {isEditing}>
		<div slot="value">{payments[0] ? payments[0].email : ''}</div>
		<div slot="fields">
			<TextInput
				placeholder="Enter billing email"
				bind:value={payments[0].email}
				invalid={invalidEmail.status}
				invalidText={invalidEmail.message}
			/>
		</div>
	</FormRow>
</FormGroup>
