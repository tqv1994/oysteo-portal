<script lang="ts">
	import { isValidEmail } from '$lib/helpers/utils';

	import type { Advisor } from '$lib/store/advisor';
	import type { Agency } from '$lib/store/agency';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { TextInput } from 'carbon-components-svelte';
	import { onDestroy } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let object: Advisor | Agency;
	export let activeSection = '';
	export let type: string;

	type ContactInput = {
		name: string;
		email: string;
	};

	let contactInput: ContactInput;

	const onResetContactInput = () => {
		contactInput = {
			name: '',
			email: ''
		};
	};

	onResetContactInput();
	onDestroy(() => {
		onResetContactInput();
	});

	const onEdit = (groupName: string) => {
		contactInput = {
			name: object.name,
			email: object.email
		};
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	type FormError = {
		email?: string;
	};

	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}
	const updateContact = async (field: string) => {
		const errors: FormError = {};
		try {
			if (field == 'email' && !isValidEmail(contactInput[field])) {
				errors.email = 'Email address is invalid';
			}
			if (Object.keys(errors).length) {
				showErrors(errors);
				return;
			}
			isFormSavingStore.set({ saving: true });

			const res = await fetch(`/common/${type}-${object.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...contactInput })
			});
			if (res.ok) {
				object.name = contactInput.name;
				object.email = contactInput.email;
				onResetContactInput();
				onCancel();
			}
		} catch (error) {}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'name'}
	on:edit={() => onEdit('name')}
	on:cancel={onCancel}
	on:submit={() => updateContact('name')}
>
	<FormRow label={type == 'advisor' ? 'Name' : 'Agency Manager Name'} {isEditing}>
		<div slot="value">{object?.name === null ? '' : object?.name}</div>
		<div slot="fields">
			<TextInput
				autofocus
				placeholder={`Enter ${type == 'advisor' ? 'your' : "agency manager's"} name`}
				bind:value={contactInput.name}
			/>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'email'}
	on:edit={() => onEdit('email')}
	on:cancel={onCancel}
	on:submit={() => updateContact('email')}
>
	<FormRow label="Email Address" {isEditing}>
		<div slot="value">{object?.email === null ? '' : object?.email}</div>
		<div slot="fields">
			<TextInput
				autofocus
				bind:value={contactInput.email}
				placeholder="Enter email address"
				invalid={!!formErrors?.email}
				invalidText={formErrors?.email}
			/>
		</div>
	</FormRow>
</FormGroup>
