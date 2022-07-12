<script lang="ts">
	import {
		isValidDateString,
		reformatDateToEn,
		reformatDateToIso,
		toIsoString
	} from '$lib/helpers/datetime';
	import { isValidEmail } from '$lib/helpers/utils';
	import { clear } from '$lib/store/activeForm';
	import type { Advisor } from '$lib/store/advisor';
	import type { Kind } from '$lib/store/category';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import type { DatePickerDate, DatePickerEvent } from '$lib/store/types';
	import { INVALID_DELAY_TIME, TIME_ZONES } from '$lib/utils/constants';
	import { ppatch } from '$lib/utils/fetch';
	import {
		DatePicker,
		DatePickerInput,
		Select,
		SelectItem,
		TextInput
	} from 'carbon-components-svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';

	export let target: string;
	export let advisor: Advisor;
	export let activeSection = '';
	export let languages;

	type AboutMeInput = {
		alternateEmail: string;
		website: string;
		language1: string | null;
		language2: string | null;
		language3: string | null;
		language4: string | null;
		language5: string | null;
		language6: string | null;
		timezone: string;
		joined_at: string | null;
		languageSelected: Kind | null;
		languageSelected2: Kind | null;
		languageSelected3: Kind | null;
		languageSelected4: Kind | null;
		languageSelected5: Kind | null;
		languageSelected6: Kind | null;
	};

	$: timezone = TIME_ZONES.find((z) => {
		return z.locale == advisor.timezone;
	});

	const dispatch = createEventDispatcher();

	let formData: AboutMeInput;
	function resetAboutMe() {
		formData = {
			alternateEmail: advisor.alternateEmail || '',
			website: advisor.website || '',
			language1: null,
			language2: null,
			language3: null,
			language4: null,
			language5: null,
			language6: null,
			timezone: advisor.timezone || '',
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
	onDestroy(resetAboutMe);

	// const onEdit = (groupName: string = '') => {
	// 	activeSection = groupName;
	// 	formData = {
	// 		alternateEmail: advisor.alternateEmail || '',
	// 		website: advisor.website || '',
	// 		language1: advisor.language1?.id || null,
	// 		language2: advisor.language2?.id || null,
	// 		language3: advisor.language3?.id || null,
	// 		language4: advisor.language4?.id || null,
	// 		language5: advisor.language5?.id || null,
	// 		language6: advisor.language6?.id || null,
	// 		timezone: advisor.timezone || '',
	// 		joined_at: advisor.joined_at || null,
	// 		languageSelected: advisor.language1 || null,
	// 		languageSelected2: advisor.language2 || null,
	// 		languageSelected3: advisor.language3 || null,
	// 		languageSelected4: advisor.language4 || null,
	// 		languageSelected5: advisor.language5 || null,
	// 		languageSelected6: advisor.language6 || null
	// 	};
	// };
	// function onCancel() {
	// 	activeSection = '';
	// }

	type FormError = {
		alternateEmail?: string;
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

	async function _ppatch(errors: FormError, payload: Record<string, unknown>) {
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

	async function onSubmitWebsite() {
		const errors: FormError = {};
		if (!formData.website) {
			errors.website = 'Website is required';
		}

		return _ppatch(errors, { website: formData.website });
	}

	async function onSubmitAltEmail() {
		const errors: FormError = {};
		if (!formData.alternateEmail) {
			errors.alternateEmail = 'Email is required';
		} else if (!isValidEmail(formData.alternateEmail)) {
			errors.alternateEmail = 'Email is invalid';
		}

		return _ppatch(errors, { alternateEmail: formData.alternateEmail });
	}

	async function onSubmitTimeZone() {
		return _ppatch({}, { timezone: formData.timezone });
	}

	async function onSubmitKind1() {
		await convertDataKindEmptyToNull(formData);
		return _ppatch({}, { language1: formData.language1 });
	}

	async function onSubmitOtherKinds() {
		await convertDataKindEmptyToNull(formData);
		return _ppatch(
			{},
			{
				language2: formData.language2,
				language3: formData.language3,
				language4: formData.language4,
				language5: formData.language5,
				language6: formData.language6
			}
		);
	}

	async function onSubmitJoinedAt() {
		const errors: FormError = {};
		if (!isValidDateString(formData.joined_at)) {
			errors.joined_at = 'Established date is required';
		}
		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}
		return _ppatch({}, { joined_at: reformatDateToIso(formData.joined_at) });
	}

	function onJoinedDateChange(e: DatePickerEvent) {
		const date = (e.detail as DatePickerDate).selectedDates[0];
		formData.joined_at = toIsoString(date);
	}

	function convertDataKindEmptyToNull(formData) {
		const pattern = /(language)([0-9])/;
		for (let property in formData) {
			if (pattern.test(property) && formData[property] == '') {
				formData[property] = null;
			}
		}
	}

	function getKindName(languageId) {
		if (!languageId) {
			return '';
		}
		let languageName;
		languages.forEach((element) => {
			if (element.id == languageId) {
				languageName = element.name;
			}
		});
		return languageName;
	}
	
</script>

<FormGroup
	let:isEditing
	on:submit={onSubmitWebsite}
	on:cancel={resetAboutMe}
	data={{ website: formData.website }}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Website" {isEditing}>
		<div slot="value">{advisor.website || ''}</div>
		<div slot="fields">
			<TextInput
				autofocus
				bind:value={formData.website}
				placeholder="Enter website"
				invalid={!!formErrors?.website}
				invalidText={formErrors?.website}
				name="website"
			/>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'alternate-email'}
	on:submit={onSubmitAltEmail}
	groupClass={'group group-aboutme'}
	data={{ alternateEmail: formData.alternateEmail }}
>
	<FormRow label="Alternate email" {isEditing}>
		<div slot="value">{advisor.alternateEmail || ''}</div>
		<div slot="fields">
			<TextInput
				autofocus
				bind:value={formData.alternateEmail}
				placeholder="Enter alternate email"
				invalid={!!formErrors?.alternateEmail}
				invalidText={formErrors?.alternateEmail}
				name="alternateEmail"
			/>
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'timezone'}
	on:submit={onSubmitTimeZone}
	groupClass={'group group-aboutme'}
	data={{ timezone: formData?.timezone || '' }}
>
	<FormRow label="Time Zone" {isEditing}>
		<div slot="value">
			{#if timezone}
				{timezone.gmt} {timezone.zone}
			{/if}
		</div>
		<div slot="fields">
			<Select bind:selected={formData.timezone} name="timezone">
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
	on:submit={onSubmitKind1}
	data={{ language1: advisor?.language1?.id?.toString() ?? advisor?.language1?.toString() }}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Preferred Language" {isEditing}>
		<div slot="value">
			{advisor?.language1?.name ?? getKindName(advisor.language1)}
		</div>
		<div slot="fields">
			<Select
				on:change={(e) => {
					formData.language1 = e.detail;
				}}
				selected={advisor?.language1?.id?.toString() ?? advisor?.language1?.toString()}
				name="language1"
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
	on:submit={onSubmitOtherKinds}
	groupClass={'group group-aboutme'}
	data={{
		language2: advisor?.language2?.id?.toString() ?? advisor?.language2?.toString(),
		language3: advisor?.language3?.id?.toString() ?? advisor?.language3?.toString(),
		language4: advisor?.language4?.id?.toString() ?? advisor?.language4?.toString(),
		language5: advisor?.language5?.id?.toString() ?? advisor?.language5?.toString(),
		language6: advisor?.language6?.id?.toString() ?? advisor?.language6?.toString()
	}}
>
	<FormRow label="Other Languages" {isEditing}>
		<div slot="value">
			{advisor?.language2?.name ?? getKindName(advisor?.language2)}
			{advisor?.language3?.name ?? getKindName(advisor?.language3)}
			{advisor?.language4?.name ?? getKindName(advisor?.language4)}
			{advisor?.language5?.name ?? getKindName(advisor?.language5)}
			{advisor?.language6?.name ?? getKindName(advisor?.language6)}
		</div>
		<div slot="fields">
			<Select
				on:change={(e) => {
					formData.language2 = e.detail;
				}}
				selected={advisor?.language2?.id?.toString() ?? advisor?.language2?.toString()}
				name="language2"
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
			<Select
				on:change={(e) => {
					formData.language3 = e.detail;
				}}
				name="language3"
				selected={advisor?.language3?.id?.toString() ?? advisor?.language3?.toString()}
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
			<Select
				on:change={(e) => {
					formData.language4 = e.detail;
				}}
				selected={advisor?.language4?.id?.toString() ?? advisor?.language4?.toString()}
				name="language4"
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
			<Select
				on:change={(e) => {
					formData.language5 = e.detail;
				}}
				selected={advisor?.language5?.id?.toString() ?? advisor?.language5?.toString()}
				name="language5"
			>
				<SelectItem value="" text="Choose" />
				{#each languages as language}
					<SelectItem value={language.id.toString()} text={language.name} />
				{/each}
			</Select>
			<Select
				on:change={(e) => {
					formData.language6 = e.detail;
				}}
				selected={advisor?.language6?.id?.toString() ?? advisor?.language6?.toString()}
				name="language6"
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
	on:submit={onSubmitJoinedAt}
	groupClass={'group group-aboutme'}
	data={{ joined_at: reformatDateToEn(advisor.joined_at) }}
>
	<FormRow label="Travel Advisor since" {isEditing}>
		<div slot="value">
			{reformatDateToEn(advisor?.joined_at)}
		</div>
		<div slot="fields" style="position:relative">
			<DatePicker
				on:change={onJoinedDateChange}
				value={reformatDateToEn(advisor.joined_at)}
				dateFormat="d/m/Y"
				datePickerType="single"
				maxDate={new Date()}
			>
				<DatePickerInput
					labelText=""
					placeholder="mm/dd/yyyy"
					invalid={!!formErrors?.joined_at}
					invalidText={formErrors?.joined_at}
					name="joined_at"
				/>
			</DatePicker>
		</div>
	</FormRow>
</FormGroup>
