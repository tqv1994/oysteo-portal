<script lang="ts">
	import {
		formatOutputDatePicker,
		handleDisplayTimeZone,
		normalizeInputDatePicker,
		validateMMDDYYYY
	} from '$lib/helpers/datetime';
	import { validateEmail, validateWebsite } from '$lib/helpers/utils';
	import type { Advisor } from '$lib/store/advisor';
	import type { Language } from '$lib/store/language';
	import { INVALID_DELAY_TIME, TIME_ZONES } from '$lib/utils/constants';
	import {
		DatePicker,
		DatePickerInput,
		Select,
		SelectItem,
		TextInput
	} from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let advisor: Advisor;
	export let languages: Language[];
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	let invalidAlternativeEmail = {
		status: false,
		message: 'Invalid email'
	};
	let invalidAdvisorWebsite = {
		status: false,
		message: 'Invalid website'
	};
	let invalidJoinedAt = {
		status: false,
		message: 'Invalid date'
	};
	const updateAboutMe = async (field: string) => {
		try {
			let data = {
				email2: advisor.email2 || '',
				website: advisor.website || '',
				language1: advisor.language1?.id || null,
				timezone: advisor.timezone || '',
				joined_at: advisor.joined_at || null
			};
			if (field == 'email2' && !validateEmail(advisor[field])) {
				invalidAlternativeEmail.status = true;
				setTimeout(() => {
					invalidAlternativeEmail.status = false;
				}, INVALID_DELAY_TIME);
				return;
			}

			if (field == 'website' && !validateWebsite(advisor[field])) {
				invalidAdvisorWebsite.status = true;
				setTimeout(() => {
					invalidAdvisorWebsite.status = false;
				}, INVALID_DELAY_TIME);
				return;
			}

			if (field == 'joined_at') {
				data.joined_at = formatOutputDatePicker(data.joined_at);
				if (!validateMMDDYYYY(data.joined_at)) {
					invalidJoinedAt.status = true;
					setTimeout(() => {
						invalidJoinedAt.status = false;
					}, INVALID_DELAY_TIME);
					return;
				}
				data.joined_at = normalizeInputDatePicker(data.joined_at);
			}
			console.log(data);
			activeLoading = true;

			const res = await fetch(`/common/${type}-${advisor.id}.json`, {
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
	isEditing={activeSection === 'website'}
	on:edit={() => onEdit('website')}
	on:cancel={onCancel}
	on:submit={() => updateAboutMe('website')}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Website" {isEditing}>
		<div slot="value">{advisor.website || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor.website || ''}
				bind:value={advisor.website}
				placeholder="Enter website ..."
				invalid={invalidAdvisorWebsite.status}
				invalidText={invalidAdvisorWebsite.message}
			/>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'alternate-email'}
	on:edit={() => onEdit('alternate-email')}
	on:cancel={onCancel}
	on:submit={() => updateAboutMe('email2')}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Alternate email" {isEditing}>
		<div slot="value">{advisor.email2 || ''}</div>
		<div slot="fields">
			<TextInput
				labelText={advisor.email2 || ''}
				bind:value={advisor.email2}
				placeholder="Enter alternate email ..."
				invalid={invalidAlternativeEmail.status}
				invalidText={invalidAlternativeEmail.message}
			/>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'timezone'}
	on:edit={() => onEdit('timezone')}
	on:cancel={onCancel}
	on:submit={() => updateAboutMe('timezone')}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Time Zone" {isEditing}>
		<div slot="value">{handleDisplayTimeZone(advisor.timezone)}</div>
		<div slot="fields">
			<Select bind:selected={advisor.timezone}>
				<SelectItem value="" text="Choose ..." />
				{#each TIME_ZONES as timeZone}
					<SelectItem value={timeZone.locale} text={`(${timeZone.gmt}) ${timeZone.zone}`} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'languages'}
	on:edit={() => onEdit('languages')}
	on:cancel={onCancel}
	on:submit={() => updateAboutMe('language1')}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Languages" {isEditing}>
		<div slot="value">
			{advisor.language1 ? advisor.language1.name : ''}
		</div>
		<div slot="fields">
			<Select
				on:change={(e) => {
					const languageSelected = languages.filter((ele) => ele.id.toString() == e.detail);
					if (languageSelected.length > 0) {
						advisor.language1 = {
							id: languageSelected[0].id,
							name: languageSelected[0].name
						};
					} else {
						advisor.language1 = null;
					}
				}}
				labelText={advisor?.language1 === null ? '' : advisor?.language1.name}
				selected={advisor?.language1 === null ? '' : advisor?.language1.id.toString()}
			>
				<SelectItem value="" text="Choose ..." />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'dateadd'}
	on:edit={() => onEdit('dateadd')}
	on:cancel={onCancel}
	on:submit={() => updateAboutMe('joined_at')}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Travel Advisor since" {isEditing}>
		<div slot="value">
			{advisor?.joined_at === null ? '' : formatOutputDatePicker(advisor?.joined_at)}
		</div>
		<div slot="fields">
			<DatePicker
				on:change={(e) => {
					advisor.joined_at = e.detail.toString();
				}}
				value={formatOutputDatePicker(advisor.joined_at)}
			>
				<DatePickerInput
					labelText="joined at"
					placeholder="mm/dd/yyyy"
					invalid={invalidJoinedAt.status}
					invalidText={invalidJoinedAt.message}
				/>
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
