<script lang="ts">
	import { validateEmail } from '$lib/helpers/utils';

	import type { Advisor } from '$lib/store/advisor';
	import type { Agency } from '$lib/store/agency';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { TextInput } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let object: Advisor | Agency;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	export let type: string;

	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	let invalidContactEmail = {
		status: false,
		message: 'Invalid email'
	};
	const updateContact = async (field: string) => {
		try {
			let data = {
				name: object.name || '',
				email: object.email || ''
			};

			if (field == 'email' && !validateEmail(object[field])) {
				invalidContactEmail.status = true;
				setTimeout(() => {
					invalidContactEmail.status = false;
				}, INVALID_DELAY_TIME);
				return;
			}

			activeLoading = true;

			const res = await fetch(`/common/${type}-${object.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});
			if (res.ok) {
				alert('Update successfully');
				activeSection = '';
			}
		} catch (error) {}
		activeLoading = false;
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
				labelText={object?.name === null ? '' : object?.name}
				placeholder={`Enter ${type == 'advisor' ? 'your' : "agency manager's"} name...`}
				bind:value={object.name}
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
				labelText={object?.email === null ? '' : object?.email}
				bind:value={object.email}
				placeholder="Enter email address..."
				invalid={invalidContactEmail.status}
				invalidText={invalidContactEmail.message}
			/>
		</div>
	</FormRow>
</FormGroup>
