<script lang="ts">
	import type { Advisor } from '$lib/store/advisor';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';

	import { Checkbox, TextArea, TextInput } from 'carbon-components-svelte';
	import { onDestroy } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let advisor: Advisor;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	let invalidInstagram = {
		status: false,
		message: 'Invalid instagram id'
	};

	type ProfileInput = {
		facebook: string;
		instagram: string;
		twitter: string;
		pinterest: string;
		linkedIn: string;
		description: string;
		planningFee?: boolean;
	};

	let profileInput: ProfileInput;

	const resetProfileInput = () => {
		profileInput = {
			facebook: '',
			instagram: '',
			twitter: '',
			pinterest: '',
			linkedIn: '',
			description: ''
		};
	};

	resetProfileInput();
	onDestroy(() => {
		resetProfileInput();
	});

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		profileInput = {
			facebook: advisor.facebook || '',
			instagram: advisor.instagram || '',
			twitter: advisor.twitter || '',
			pinterest: advisor.pinterest || '',
			linkedIn: advisor.linkedIn || '',
			description: advisor.description || ''
		};
	};
	const onCancel = () => {
		activeSection = '';
	};

	const updateProfile = async (isPlanningFee = false) => {
		if (profileInput.instagram.indexOf('@') != 0){
			invalidInstagram.status = true
			setTimeout(() => {
				invalidInstagram.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		const planningFee =
			advisor.planningFee === null
				? true
				: isPlanningFee
				? !advisor.planningFee
				: advisor.planningFee;
		if (isPlanningFee) {
			profileInput = {
				facebook: advisor.facebook || '',
				instagram: advisor.instagram || '',
				twitter: advisor.twitter || '',
				pinterest: advisor.pinterest || '',
				linkedIn: advisor.linkedIn || '',
				description: advisor.description || ''
			};
		}
		profileInput.planningFee = planningFee;
		try {
			activeLoading = true;

			const res = await fetch(`/common/${type}-${advisor.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...profileInput })
			});

			if (res.ok) {
				for (const key in profileInput) {
					advisor[key] = profileInput[key];
				}
				resetProfileInput();
				onCancel();
			}
		} catch (error) {
			console.log(error);
		}
		activeLoading = false;
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'bio'}
	on:edit={() => onEdit('bio')}
	on:cancel={onCancel}
	on:submit={() => updateProfile()}
>
	<FormRow label="Description" {isEditing}>
		<div slot="value">
			<p class="advisor-profile">
				{advisor?.description === null ? '' : advisor?.description}
			</p>
		</div>
		<div slot="fields">
			<TextArea
				labelText="Max: 120 character"
				placeholder="Enter your description..."
				bind:value={profileInput.description}
				maxlength={120}
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
			on:change={() => updateProfile(true)}
		/>
	</div>
</FormRow>
<FormGroup
	let:isEditing
	isEditing={activeSection === 'sns'}
	on:edit={() => onEdit('sns')}
	on:cancel={onCancel}
	on:submit={() => updateProfile()}
	groupClass={'group group-profile'}
>
	<FormRow label="Instagram" {isEditing}>
		<div slot="value">{advisor?.instagram === null ? '' : advisor?.instagram}</div>
		<div slot="fields">
			<TextInput
				labelText="{advisor?.instagram === null ? 'Add instagram' : 'Edit instagram'}"
				placeholder="Enter..."
				bind:value={profileInput.instagram}
				invalid={invalidInstagram.status}
				invalidText={invalidInstagram.message}
			/>
		</div>
	</FormRow>
	<FormRow label="Twitter" {isEditing}>
		<div slot="value">{advisor?.twitter === null ? '' : advisor?.twitter}</div>
		<div slot="fields">
			<TextInput labelText="{advisor?.twitter === null ? 'Add twitter' : 'Edit twitter'}" 
			placeholder="Enter..." 
			bind:value={profileInput.twitter} />
		</div>
	</FormRow>
	<FormRow label="Facebook" {isEditing}>
		<div slot="value">{advisor?.facebook === null ? '' : advisor?.facebook}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor?.facebook === null ? 'Add facebook' : 'Edit facebook'}
				placeholder="Enter..."
				bind:value={profileInput.facebook}
			/>
		</div>
	</FormRow>
	<FormRow label="LinkedIn" {isEditing}>
		<div slot="value">{advisor?.linkedIn === null ? '' : advisor?.linkedIn}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor?.linkedIn === null ? 'Add linkedIn' : 'Edit linkedIn'}
				placeholder="Enter..."
				bind:value={profileInput.linkedIn}
			/>
		</div>
	</FormRow>
	<FormRow label="Pinterest" {isEditing}>
		<div slot="value">{advisor?.pinterest === null ? '' : advisor?.pinterest}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor?.pinterest === null ? 'Add pinterest' : 'Edit pinterest'}
				placeholder="Enter..."
				bind:value={profileInput.pinterest}
			/>
		</div>
	</FormRow>
</FormGroup>
