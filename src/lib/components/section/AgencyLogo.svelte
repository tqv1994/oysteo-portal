<script lang="ts">
	import type { Agency } from '$lib/store/agency';
	import { session } from '$app/stores';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { pdelete, pupload } from '$lib/utils/fetch';
	import {
		Column,
		FileUploaderDropContainer,
		Grid,
		ImageLoader,
		Row
	} from 'carbon-components-svelte';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { notify } from '../Toast.svelte';
	import { clear } from '$lib/store/activeForm';

	export let agency: Agency;
	export let activeSection = '';

	let disabledRemoveLogo: boolean = false;

	const uploadFile = async (e: CustomEvent) => {
		const formData: FormData = new FormData();
		let file = e.detail[0];
		formData.append('files', file);

		isFormSavingStore.set({ saving: true });
		try {
			const res = await pupload('agencies/me/logo', formData);
			if (res.ok) {
				const image = await res.json();
				session.update((s) => {
					s.agencyMe.logo = image;
					return s;
				});
				agency.logo = agency.logo[0];
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
			console.error('Failed to update phone numbers', error);
		}
		isFormSavingStore.set({ saving: false });
		activeSection = '';
		formChangeStatusStore.set({ changing: false });
	};

	const removeLogo = async (isOldLogo = false) => {
		if (agency.logo == null) {
			return;
		}
		if (!isOldLogo) {
			const confirmDelete = confirm('Are you sure you want to remove this item?');
			if (!confirmDelete) {
				return;
			}
		}
		isFormSavingStore.set({ saving: true });

		try {
			const res = await pdelete(`agencies/me/images/${agency.logo.id}`);
			agency.logo = undefined;
			if (res.ok) {
				await res.json();
				session.update((s) => {
					s.agencyMe.logo = undefined;
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
			// notify({
			// 	title: 'Update failed',
			// 	subtitle: 'Failed to update information, please try again later.'
			// });
			// console.error('Failed to delete logo', error);
		}
		isFormSavingStore.set({ saving: false });
		activeSection = '';
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	on:submit={() => removeLogo()}
	editLabel="Add/Remove"
	disabledRemoveButton={disabledRemoveLogo}
	groupClass="group image-group group-destinations"
	isPhotoGroup={true}
>
	<FormRow label="Logo" {isEditing}>
		<div slot="value">
			{#if !agency.logo}
				no image selected
			{:else}
				<Grid fullWidth>
					<Row>
						<Column>
							<ImageLoader src={agency.logo.url} />
						</Column>
					</Row>
				</Grid>
			{/if}
		</div>
		<div slot="fields">
			<Grid fullWidth class="d-pleft-16 pright-8">
				<Row>
					<Column>
						<ImageLoader src={agency.logo?.url} class="mbottom-8" />
					</Column>
				</Row>
			</Grid>
			<FileUploaderDropContainer
				labelText="Upload logo"
				accept={['image/*']}
				on:add={(e) => uploadFile(e)}
			/>
		</div>
	</FormRow>
</FormGroup>
