<script lang="ts">
	import { validateWebsite } from '$lib/helpers/utils';

	import type { Agency } from '$lib/store/agency';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';

	import { TextArea, TextInput } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let agency: Agency;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	let invalidMarketingWebsite = {
		status: false,
		message: 'Invalid website'
	};
	const updateMarketingInformation = async () => {
		try {
			const data = {
				description: agency.description || '',
				profile: agency.profile || '',
				website: agency.website || ''
			};

			if (!validateWebsite(data.website)) {
				invalidMarketingWebsite.status = true;
				setTimeout(() => {
					invalidMarketingWebsite.status = false;
				}, INVALID_DELAY_TIME);
				return;
			}

			activeLoading = true;
			const res = await fetch(`/common/${type}-${agency.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});
			if (res.ok) {
				window.openNotification({
					kind: 'success',
					title: 'Success',
					subtitle: 'Update successfully'
				});
				onCancel();
			}
		} catch (error) {}
		activeLoading = false;
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'marketing-information'}
	on:edit={() => onEdit('marketing-information')}
	on:cancel={onCancel}
	on:submit={updateMarketingInformation}
>
	<FormRow label="Agency Description" {isEditing} contentClass={'mtop-6'}>
		<div slot="value">
			<p class="marketing-info">
				{agency.description == null ? '' : agency.description}
			</p>
		</div>
		<div slot="fields">
			<TextArea
				labelText="Max: 100 character"
				cols={50}
				placeholder="Enter agency description..."
				rows={4}
				maxlength={100}
				bind:value={agency.description}
			/>
		</div>
	</FormRow>
	<FormRow label="Agency Profile" {isEditing} contentClass={'mtop-6'}>
		<div slot="value">
			<p class="marketing-info">
				{agency.profile == null ? '' : agency.profile}
			</p>
		</div>
		<div slot="fields">
			<TextArea
				labelText="Max: 750 character"
				cols={50}
				placeholder="Enter agency profile..."
				rows={5}
				maxlength={750}
				bind:value={agency.profile}
			/>
		</div>
	</FormRow>
</FormGroup>

<slot />

<FormGroup
	let:isEditing
	isEditing={activeSection === 'marketing-website'}
	on:edit={() => onEdit('marketing-website')}
	on:cancel={onCancel}
	on:submit={updateMarketingInformation}
>
	<FormRow label="Website" {isEditing}>
		<div slot="value">{agency.website == null ? '' : agency.website}</div>
		<div slot="fields">
			<TextInput
				placeholder="Enter your website"
				bind:value={agency.website}
				invalid={invalidMarketingWebsite.status}
				invalidText={invalidMarketingWebsite.message}
			/>
		</div>
	</FormRow>
</FormGroup>
