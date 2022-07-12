<script lang="ts">
	import { type Trip, tripStore } from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import ListItemContainer from '$lib/components/form/listitemcontainer.svelte';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { beforeUpdate } from 'svelte';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { convert2InternationalPhone, isValidPhoneNumber } from '$lib/helpers/phone-number';
	import type { Country } from '$lib/store/country';
	export let countries: Country[];
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { notify } from '$lib/components/Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { pdelete, ppatch, ppost } from '$lib/utils/fetch';
	import { clear } from '$lib/store/activeForm';
	export let trip: Trip | undefined;
	export let addContactFormOpen = false;
	type FormData = {
		name?: string;
		Role?: string;
		phoneCode?: string;
		numberPhone?: string;
		reference?: string;
	};
	type FormError = {
		name?: string;
		Role?: string;
		phonecode?: string;
		numberPhone?: string;
		reference?: string;
	};
	let formErrors: FormError;

	let formData: FormData = reset();
	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset(): FormData {
		return {
			name: null,
			Role: null,
			phoneCode: null,
			numberPhone: null,
			reference: null
		};
	}

	let activeSection = '';
	const onEdit = (section: string) => {
		activeSection = section;
		addContactFormOpen = false;
		const index = parseInt(section.replace('emergency--', ''));
		if (trip && trip.emergencies[index]) {
			const emergency = trip.emergencies[index];
			formData = {
				name: emergency.name,
				reference: emergency.reference,
				Role: emergency.Role,
				phoneCode: emergency.phoneCode,
				numberPhone: emergency.numberPhone
			};
		}
	};

	const onAdd = (section: string) => {
		if (activeSection !== 'add-emergency') {
			formData = reset();
			activeSection = section;
		}
	};
	const onCancel = () => {
		formData = reset();
		addContactFormOpen = false;
		activeSection = '';
	};

	const onSubmit = async (id?: string | number) => {
		const errors: FormError = {};
		if (!isValidPhoneNumber(formData.numberPhone, formData.phoneCode)) {
			errors.numberPhone = 'Phone number is invalid';
		}
		if (Object.keys(errors).length) {
			showErrors(errors);
			console.log(errors);
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			if (id) {
				const res = await ppatch(`emergencies/${id}`, { ...formData, trip: trip.id });
				if (res.ok) {
					const emergency = await res.json();
					const index = trip.emergencies.findIndex(
						(item) => item.id.toString() === emergency.id.toString()
					);
					if (index >= 0) {
						trip.emergencies[index] = emergency;
					}
					tripStore.update((s) => {
						const idx = s.findIndex((t) => t.id === trip.id);
						s[idx] = trip;
						return s;
					});
					activeSection = '';
					clear();
				} else {
					notify({
						title: 'Update failed',
						subtitle: 'Failed to update information, please try again later.'
					});
				}
			} else {
				const res = await ppost(`emergencies`, { ...formData, trip: trip.id });
				if (res.ok) {
					const emergency = await res.json();
					trip.emergencies.push(emergency);
					tripStore.update((s) => {
						const idx = s.findIndex((t) => t.id === trip.id);
						s[idx] = trip;
						return s;
					});
					activeSection = '';
					clear();
				} else {
					notify({
						title: 'Create failed',
						subtitle: 'Failed to create information, please try again later.'
					});
				}
			}
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update emergency', error);
		}

		isFormSavingStore.set({ saving: false });
		formChangeStatusStore.set({ changing: false });
		addContactFormOpen = false;
	};

	const onDelete = async (id: string | number) => {
		isFormSavingStore.set({ saving: true });
		try {
			const res = await pdelete(`emergencies/${id}`);
			if (res.ok) {
				const index = (trip.emergencies || []).findIndex(
					(item) => item.id.toString() === id.toString()
				);
				if (index > -1) {
					trip.emergencies.splice(index, 1);
					activeSection = '';
					clear();
				} else {
					notify({
						title: 'Delete failed',
						subtitle: 'Failed to delete information, please try again later.'
					});
				}
			}
		} catch (error) {
			notify({
				title: 'Delete failed',
				subtitle: 'Failed to delete information, please try again later.'
			});
			console.error('Failed to delete emergency', error);
		}
		isFormSavingStore.set({ saving: false });
		onCancel();
	};

	beforeUpdate(() => {
		if (addContactFormOpen) {
			onAdd('add-emergency');
		}
	});

	let classGroup = '';
</script>

{#if addContactFormOpen}
	<FormGroup
		let:isEditing
		on:cancel={onCancel}
		on:submit={() => onSubmit()}
		data={{
			name: formData.name || '',
			Role: formData.Role || '',
			phonecode: formData.phoneCode || '',
			numberPhone: formData.numberPhone || '',
			reference: formData.reference || ''
		}}
	>
		<FormRow label="Name" {isEditing}>
			<div slot="fields">
				<TextInput
					autofocus
					bind:value={formData.name}
					invalid={!!formErrors?.name}
					invalidText={formErrors?.name}
					name="name"
				/>
			</div>
		</FormRow>
		<FormRow label="Role" {isEditing}>
			<div slot="fields">
				<TextInput
					bind:value={formData.Role}
					invalid={!!formErrors?.Role}
					invalidText={formErrors?.Role}
					name="Role"
				/>
			</div>
		</FormRow>

		<FormRow label="Phone number" {isEditing}>
			<div slot="fields" class="emergency-fields">
				<Select
					class="half-width"
					selected={formData.phoneCode}
					on:change={(e) => {
						formData.phoneCode = e.detail;
					}}
					invalid={!!formErrors?.phonecode}
					invalidText={formErrors?.phonecode}
					name="phonecode"
				>
					<SelectItem value="" text="Choose" />
					{#each countries as country}
						<SelectItem value={country.code} text={`${country.name} + ${country.phone}`} />
					{/each}
				</Select>
				<TextInput
					type="text"
					class="custom-phone-number"
					labelText=""
					placeholder=""
					bind:value={formData.numberPhone}
					invalid={!!formErrors?.numberPhone}
					invalidText={formErrors?.numberPhone}
					name="numberPhone"
				/>
			</div>
		</FormRow>
		<FormRow label="Reference" {isEditing}>
			<div slot="fields">
				<TextInput bind:value={formData.reference} name="reference" />
			</div>
		</FormRow>
	</FormGroup>
{/if}

<FormGroup hideEditButton={true}>
	{#each trip?.emergencies || [] as emergency, index}
		<ListItemContainer
			let:isEditing
			reSend={false}
			isEditing={activeSection === 'emergency--' + index}
			on:edit={() => onEdit('emergency--' + index)}
			on:cancel={onCancel}
			on:submit={() => onSubmit(emergency.id)}
			hasDelete={true}
			on:delete={() => onDelete(emergency.id)}
			data={{
				name: emergency.name || '',
				Role: emergency.Role || '',
				phonecode: emergency.phoneCode || '',
				numberPhone: emergency.numberPhone || '',
				reference: emergency.reference || ''
			}}
		>
			<FormRow label="Name" {isEditing} class="custom-emergency">
				<div slot="value"><span>Name: </span>{emergency?.name || ''}</div>
				<div slot="fields">
					<TextInput
						autofocus
						bind:value={formData.name}
						invalid={!!formErrors?.name}
						invalidText={formErrors?.name}
						name="name"
					/>
				</div>
			</FormRow>
			<FormRow label="Role" {isEditing} class="custom-emergency">
				<div slot="value"><span>Role: </span>{emergency?.Role || ''}</div>
				<div slot="fields">
					<TextInput
						bind:value={formData.Role}
						invalid={!!formErrors?.Role}
						invalidText={formErrors?.Role}
						name="Role"
					/>
				</div>
			</FormRow>
			<FormRow label="Phone number" {isEditing} class="custom-emergency">
				<!-- <div slot="value">{emergency?.numberPhone || ''}</div> -->
				<div slot="value">
					<span>Phone number: </span>{emergency?.numberPhone == null || emergency?.numberPhone == ''
						? ''
						: convert2InternationalPhone(emergency?.numberPhone, emergency?.phoneCode)}
				</div>
				<div slot="fields" class="emergency-fields">
					<Select
						class="half-width"
						selected={formData.phoneCode}
						on:change={(e) => {
							formData.phoneCode = e.detail;
						}}
						invalid={!!formErrors?.phonecode}
						invalidText={formErrors?.phonecode}
						name="phonecode"
					>
						<SelectItem value="" text="Choose" />
						{#each countries as country}
							<SelectItem value={country.code} text={`${country.name} + ${country.phone}`} />
						{/each}
					</Select>
					<TextInput
						type="text"
						class="custom-phone-number"
						bind:value={formData.numberPhone}
						invalid={!!formErrors?.numberPhone}
						invalidText={formErrors?.numberPhone}
						name="numberPhone"
					/>
				</div>
			</FormRow>
			<FormRow label="Reference" {isEditing} class="custom-emergency">
				<div slot="value"><span>Reference: </span>{emergency?.reference || ''}</div>
				<div slot="fields">
					<TextInput
						bind:value={formData.reference}
						invalid={!!formErrors?.reference}
						invalidText={formErrors?.reference}
						name="reference"
					/>
				</div>
			</FormRow>
		</ListItemContainer>
	{/each}
</FormGroup>
