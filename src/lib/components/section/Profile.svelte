<script lang="ts">
	import { isInstagram } from '$lib/helpers/utils';
	import { clear } from '$lib/store/activeForm';

	import type { Advisor } from '$lib/store/advisor';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';

	import { Checkbox, TextArea, TextInput } from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';

	export let target: string;
	export let advisor: Advisor;
	export let activeSection = '';
	let invalidInstagram = {
		status: false,
		message: 'Instagram must contain the "@" character.'
	};

	type ProfileInput = {
		facebook: string;
		instagram: string;
		twitter: string;
		pinterest: string;
		linkedIn: string;
		biography: string;
	};

	type FormError = {
		facebook?: string;
		instagram?: string;
		twitter?: string;
		pinterest?: string;
		linkedIn?: string;
		biography?: string;
	};

	let formData: ProfileInput;
	let formErrors: FormError;

	const dispatch = createEventDispatcher();

	const resetProfileInput = () => {
		formData = {
			facebook: advisor.facebook || '',
			instagram: advisor.instagram || '',
			twitter: advisor.twitter || '',
			pinterest: advisor.pinterest || '',
			linkedIn: advisor.linkedIn || '',
			biography: advisor.biography || ''
		};
	};

	resetProfileInput();
	onDestroy(() => {
		resetProfileInput();
	});

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		formData = {
			facebook: advisor.facebook || '',
			instagram: advisor.instagram || '',
			twitter: advisor.twitter || '',
			pinterest: advisor.pinterest || '',
			linkedIn: advisor.linkedIn || '',
			biography: advisor.biography || ''
		};
	};
	function onCancel() {
		activeSection = '';
	}

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	async function _ppatch(errors: FormError, payload: Record<string, unknown>) {
		if (formData.instagram && !isInstagram(formData.instagram)) {
			errors.instagram = 'Instagram must contain the "@" character.';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, payload);
			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				clear();
			} else {
				notify({
					title: 'An error has occured',
					subtitle:
						'Something unexpected has happened. Please refresh the browser and sign-in again.'
				});
				console.error(await res.text());
				// location.reload();
			}
		} catch (err) {
			notify({
				title: 'An error has occured',
				subtitle: 'Something unexpected has happened. Please try again later.'
			});
			console.error(err);
		}
		isFormSavingStore.set({ saving: false });
	}

	async function onSubmitBiography() {
		const errors: FormError = {};
		if (!formData.biography) {
			errors.biography = 'Biography is required';
		}

		return _ppatch(errors, { biography: formData.biography });
	}

	async function onChangePlanningFee() {
		const planningFee = advisor.planningFee;
		return _ppatch({}, { planningFee });
	}

	async function onSubmitSocialIds() {
		return _ppatch(
			{},
			{
				instagram: formData.instagram,
				twitter: formData.twitter,
				facebook: formData.facebook,
				linkedIn: formData.linkedIn,
				pinterest: formData.pinterest
			}
		);
	}
</script>

<FormGroup
	let:isEditing
	on:submit={onSubmitBiography}
	on:cancel={resetProfileInput}
	data={{ biography: formData.biography }}
>
	<FormRow label="Biography" {isEditing}>
		<div slot="value">
			<p class="advisor-profile">
				{advisor?.biography || ''}
			</p>
		</div>
		<div slot="fields">
			<TextArea
				autofocus
				labelText="Max: 500 character"
				placeholder="Enter your biography"
				bind:value={formData.biography}
				name="biography"
				maxlength={500}
			/>
		</div>
	</FormRow>
</FormGroup>
<FormRow label="Planning Fee" class={'advisor-planning-fee mtop-d32'} contentClass={'mtop-0'}>
	<div slot="value">
		<Checkbox
			labelText="Planning Fee"
			hideLabel
			bind:checked={advisor.planningFee}
			name="planningFee"
			on:change={onChangePlanningFee}
		/>
	</div>
</FormRow>
<FormGroup
	let:isEditing
	isEditing={activeSection === 'sns'}
	on:edit={() => onEdit('sns')}
	on:cancel={onCancel}
	on:submit={onSubmitSocialIds}
	groupClass={'group group-profile'}
	data={{
		instagram: formData.instagram,
		twitter: formData.twitter,
		facebook: formData.facebook,
		linkedIn: formData.linkedIn,
		pinterest: formData.pinterest
	}}
>
	<FormRow label="Instagram" {isEditing}>
		<div slot="value">{advisor?.instagram || ''}</div>
		<div slot="fields">
			<TextInput
				autofocus
				labelText={advisor?.instagram ? 'Add instagram' : 'Edit instagram'}
				placeholder="Enter"
				bind:value={formData.instagram}
				invalid={!!formErrors?.instagram}
				invalidText={formErrors?.instagram}
				name="instagram"
			/>
		</div>
	</FormRow>
	<FormRow label="Twitter" {isEditing}>
		<div slot="value">{advisor?.twitter || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor?.twitter ? 'Add twitter' : 'Edit twitter'}
				placeholder="Enter"
				bind:value={formData.twitter}
				name="twitter"
			/>
		</div>
	</FormRow>
	<FormRow label="Facebook" {isEditing}>
		<div slot="value">{advisor?.facebook || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor?.facebook ? 'Add facebook' : 'Edit facebook'}
				placeholder="Enter"
				bind:value={formData.facebook}
				name="facebook"
			/>
		</div>
	</FormRow>
	<FormRow label="LinkedIn" {isEditing}>
		<div slot="value">{advisor?.linkedIn || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor?.linkedIn ? 'Add linkedIn' : 'Edit linkedIn'}
				placeholder="Enter"
				bind:value={formData.linkedIn}
				name="linkedIn"
			/>
		</div>
	</FormRow>
	<FormRow label="Pinterest" {isEditing}>
		<div slot="value">{advisor?.pinterest || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor?.pinterest ? 'Add pinterest' : 'Edit pinterest'}
				placeholder="Enter"
				bind:value={formData.pinterest}
				name="pinterest"
			/>
		</div>
	</FormRow>
</FormGroup>
