<script lang="ts">
	import { isValidEmail } from '$lib/helpers/utils';
	import { session } from '$app/stores';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';
	import { TextInput } from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';
	import { clear } from '$lib/store/activeForm';

	export let target: string;
	export let activeSection = '';
	export let type: string;
	export let name: string | undefined = undefined;
	export let email: string | undefined = undefined;

	type FormData = {
		name?: string;
		email?: string;
	};

	type FormError = {
		email?: string;
		name?: string;
	};

	let formErrors: FormError;
	let formData: FormData = reset();

	const dispatch = createEventDispatcher();

	function reset() {
		return {
			email: email || '',
			name: name || ''
		};
	}

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const onSubmitEmail = async () => {
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

		return _submit({ email: formData.email });
	};

	const onSubmitName = async () => {
		const errors: FormError = {};
		if (!formData.name) {
			errors.name = 'Name is required';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		return _submit({ name: formData.name });
	};

	async function _submit(data: FormData) {
		isFormSavingStore.set({ saving: true });
		try {
			const res = await ppatch(target, data);
			if (res.ok) {
				dispatch('change', await res.json());
				activeSection = '';
				session.update((s) => {
					if (type == 'advisor') {
						Object.assign(s.advisorMe, formData);
					} else {
						Object.assign(s.agencyMe, formData);
					}
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
			console.error('Failed to update business insurance', error);
		}
		isFormSavingStore.set({ saving: false });
	}

	onMount(reset);
	onDestroy(reset);
</script>

<FormGroup
	let:isEditing={isEditingName}
	on:submit={onSubmitName}
	on:cancel={() => (formData.name = name)}
	data={{ name }}
>
	<FormRow label={type == 'advisor' ? 'Name' : 'Agency Manager Name'} isEditing={isEditingName}>
		<div slot="value">{name || ''}</div>
		<div slot="fields">
			<TextInput
				name="name"
				autofocus
				placeholder={`Enter ${type == 'advisor' ? 'your' : "agency manager's"} name`}
				bind:value={formData.name}
				invalid={!!formErrors?.name}
				invalidText={formErrors?.name}
			/>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing={isEditingEmail}
	on:submit={onSubmitEmail}
	on:cancel={() => (formData.email = email)}
	data={{ email }}
>
	<FormRow label="Email Address" isEditing={isEditingEmail}>
		<div slot="value">{email || ''}</div>
		<div slot="fields">
			<TextInput
				name="email"
				autofocus
				bind:value={formData.email}
				placeholder="Enter email address"
				invalid={!!formErrors?.email}
				invalidText={formErrors?.email}
			/>
		</div>
	</FormRow>
</FormGroup>
