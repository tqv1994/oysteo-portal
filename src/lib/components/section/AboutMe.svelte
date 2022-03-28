<script lang="ts">
	import {
		formatOutputDatePicker,
		handleDisplayTimeZone,
		normalizeInputDatePicker,
		validateMMDDYYYY
	} from '$lib/helpers/datetime';
	import { isValidEmail, validateWebsite } from '$lib/helpers/utils';
	import type { Advisor } from '$lib/store/advisor';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { Language, languageStore } from '$lib/store/language';
	import { INVALID_DELAY_TIME, TIME_ZONES } from '$lib/utils/constants';
	import { sortByName } from '$lib/utils/sort';
	import {
		DatePicker,
		DatePickerInput,
		Select,
		SelectItem,
		TextInput
	} from 'carbon-components-svelte';
	import { onDestroy } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let type: string;
	export let advisor: Advisor;
	const languages = sortByName(Object.values($languageStore.items));
	export let activeSection = '';

	type AboutMeInput = {
		email2: string;
		website: string;
		language1: string | null;
		language2: string | null;
		language3: string | null;
		language4: string | null;
		language5: string | null;
		language6: string | null;
		timezone: string;
		joined_at: string | null;
		languageSelected: Language | null;
		languageSelected2: Language | null;
		languageSelected3: Language | null;
		languageSelected4: Language | null;
		languageSelected5: Language | null;
		languageSelected6: Language | null;
	};

	let aboutMeInput: AboutMeInput;
	const resetAboutMe = () => {
		aboutMeInput = {
			email2: '',
			website: '',
			language1: null,
			language2: null,
			language3: null,
			language4: null,
			language5: null,
			language6: null,
			timezone: '',
			joined_at: '',
			languageSelected: null,
			languageSelected2: null,
			languageSelected3: null,
			languageSelected4: null,
			languageSelected5: null,
			languageSelected6: null
		};
	};

	resetAboutMe();
	onDestroy(() => {
		resetAboutMe();
	});

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		aboutMeInput = {
			email2: advisor.email2 || '',
			website: advisor.website || '',
			language1: advisor.language1?.id || null,
			language2: advisor.language2?.id || null,
			language3: advisor.language3?.id || null,
			language4: advisor.language4?.id || null,
			language5: advisor.language5?.id || null,
			language6: advisor.language6?.id || null,
			timezone: advisor.timezone || '',
			joined_at: advisor.joined_at || null,
			languageSelected: advisor.language1 || null,
			languageSelected2: advisor.language2 || null,
			languageSelected3: advisor.language3 || null,
			languageSelected4: advisor.language4 || null,
			languageSelected5: advisor.language5 || null,
			languageSelected6: advisor.language6 || null
		};
	};
	const onCancel = () => {
		activeSection = '';
	};

	type FormError = {
		email2?: string;
		website?: string;
		joined_at?: string;
	};

	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	const updateAboutMe = async (field: string) => {
		const errors: FormError = {};
		if (field == 'email2' && !isValidEmail(aboutMeInput.email2)) {
			errors.email2 = 'Email address is invalid';
		}

		if (field == 'website' && !validateWebsite(aboutMeInput.website)) {
			errors.website = 'Website address is invalid';
		}

		if (field == 'joined_at') {
			aboutMeInput.joined_at = formatOutputDatePicker(aboutMeInput.joined_at);
			if (!validateMMDDYYYY(aboutMeInput.joined_at)) {
				errors.joined_at = 'Date is invalid';
			}
			aboutMeInput.joined_at = normalizeInputDatePicker(aboutMeInput.joined_at);
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		const {
			languageSelected,
			languageSelected2,
			languageSelected3,
			languageSelected4,
			languageSelected5,
			languageSelected6,
			...data
		} = aboutMeInput;
		try {
			isFormSavingStore.set({ saving: true });
			const res = await fetch(`/common/${type}-${advisor.id}.json`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data })
			});

			if (res.ok) {
				for (const key in aboutMeInput) {
					if (
						key == 'language1' ||
						key == 'language2' ||
						key == 'language3' ||
						key == 'language4' ||
						key == 'language5' ||
						key == 'language6'
					) {
						advisor[key] = languageSelected;
						advisor.language2 = languageSelected2;
						advisor.language3 = languageSelected3;
						advisor.language4 = languageSelected4;
						advisor.language5 = languageSelected5;
						advisor.language6 = languageSelected6;
					} else {
						advisor[key] = aboutMeInput[key];
					}
				}
				resetAboutMe();
				onCancel();
			}
		} catch (error) {
			console.log(error);
		}
		isFormSavingStore.set({ saving: false });
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
				autofocus
				bind:value={aboutMeInput.website}
				placeholder="Enter website"
				invalid={!!formErrors?.website}
				invalidText={formErrors?.website}
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
				autofocus
				bind:value={aboutMeInput.email2}
				placeholder="Enter alternate email"
				invalid={!!formErrors?.email2}
				invalidText={formErrors?.email2}
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
			<Select bind:selected={aboutMeInput.timezone}>
				<SelectItem value="" text="Choose" />
				{#each TIME_ZONES as timeZone}
					<SelectItem value={timeZone.locale} text={`(${timeZone.gmt}) ${timeZone.zone}`} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'language1'}
	on:edit={() => onEdit('language1')}
	on:cancel={onCancel}
	on:submit={() => updateAboutMe('language1')}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Preferred Language" {isEditing}>
		<div slot="value">
			{advisor.language1 ? advisor.language1.name : ''}
		</div>
		<div slot="fields">
			<Select
				on:change={(e) => {
					const languageSelected = languages.filter((ele) => ele.id.toString() == e.detail);
					if (languageSelected.length > 0) {
						aboutMeInput.languageSelected = {
							id: languageSelected[0].id,
							name: languageSelected[0].name
						};
						aboutMeInput.language1 = languageSelected[0].id;
					} else {
						aboutMeInput.languageSelected = null;
						aboutMeInput.language1 = null;
					}
				}}
				selected={advisor?.language1 === null ? '' : advisor?.language1.id.toString()}
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
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
	on:submit={() => updateAboutMe('languages')}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Other Languages" {isEditing}>
		<div slot="value">
			{advisor.language2 ? advisor.language2.name : ''}
			{advisor.language3 ? advisor.language3.name : ''}
			{advisor.language4 ? advisor.language4.name : ''}
			{advisor.language5 ? advisor.language5.name : ''}
			{advisor.language6 ? advisor.language6.name : ''}
		</div>
		<div slot="fields">
			<Select
				on:change={(e) => {
					const languageSelected2 = languages.filter((ele) => ele.id.toString() == e.detail);
					if (languageSelected2.length > 0) {
						aboutMeInput.languageSelected2 = {
							id: languageSelected2[0].id,
							name: languageSelected2[0].name
						};
						aboutMeInput.language2 = languageSelected2[0].id;
					} else {
						aboutMeInput.languageSelected2 = null;
						aboutMeInput.language2 = null;
					}
				}}
				selected={advisor?.language2 === null ? '' : advisor?.language2.id.toString()}
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
			<Select
				on:change={(e) => {
					const languageSelected3 = languages.filter((ele) => ele.id.toString() == e.detail);
					if (languageSelected3.length > 0) {
						aboutMeInput.languageSelected3 = {
							id: languageSelected3[0].id,
							name: languageSelected3[0].name
						};
						aboutMeInput.language3 = languageSelected3[0].id;
					} else {
						aboutMeInput.languageSelected3 = null;
						aboutMeInput.language3 = null;
					}
				}}
				selected={advisor?.language3 === null ? '' : advisor?.language3.id.toString()}
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
			<Select
				on:change={(e) => {
					const languageSelected4 = languages.filter((ele) => ele.id.toString() == e.detail);
					if (languageSelected4.length > 0) {
						aboutMeInput.languageSelected4 = {
							id: languageSelected4[0].id,
							name: languageSelected4[0].name
						};
						aboutMeInput.language4 = languageSelected4[0].id;
					} else {
						aboutMeInput.languageSelected4 = null;
						aboutMeInput.language4 = null;
					}
				}}
				selected={advisor?.language4 === null ? '' : advisor?.language4.id.toString()}
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
			<Select
				on:change={(e) => {
					const languageSelected5 = languages.filter((ele) => ele.id.toString() == e.detail);
					if (languageSelected5.length > 0) {
						aboutMeInput.languageSelected5 = {
							id: languageSelected5[0].id,
							name: languageSelected5[0].name
						};
						aboutMeInput.language5 = languageSelected5[0].id;
					} else {
						aboutMeInput.languageSelected5 = null;
						aboutMeInput.language5 = null;
					}
				}}
				selected={advisor?.language5 === null ? '' : advisor?.language5.id.toString()}
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
			<Select
				on:change={(e) => {
					const languageSelected6 = languages.filter((ele) => ele.id.toString() == e.detail);
					if (languageSelected6.length > 0) {
						aboutMeInput.languageSelected6 = {
							id: languageSelected6[0].id,
							name: languageSelected6[0].name
						};
						aboutMeInput.language6 = languageSelected6[0].id;
					} else {
						aboutMeInput.languageSelected6 = null;
						aboutMeInput.language6 = null;
					}
				}}
				selected={advisor?.language6 === null ? '' : advisor?.language6.id.toString()}
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'joined_at'}
	on:edit={() => onEdit('joined_at')}
	on:cancel={onCancel}
	on:submit={() => updateAboutMe('joined_at')}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Travel Advisor since" {isEditing}>
		<div slot="value">
			{advisor?.joined_at === null ? '' : formatOutputDatePicker(advisor?.joined_at)}
		</div>
		<div slot="fields" style="position:relative">
			<DatePicker
				on:change={(e) => {
					aboutMeInput.joined_at = e.detail.dateStr;
				}}
				value={formatOutputDatePicker(advisor.joined_at)}
				datePickerType="single"
				maxDate={new Date()}
			>
				<DatePickerInput
					labelText=""
					placeholder="mm/dd/yyyy"
					invalid={!!formErrors?.joined_at}
					invalidText={formErrors?.joined_at}
				/>
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
