<script lang="ts">
	import { range } from '$lib/helpers/utils';
	import { Close as CloseIcon } from 'carbon-icons-svelte';
	import {
		Column,
		FileUploaderDropContainer,
		Grid,
		ImageLoader,
		Row
	} from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import type { Agency } from '$lib/store/agency';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { notify } from '../Toast.svelte';
	import { pdelete, pupload } from '$lib/utils/fetch';
	import type { Media } from '$lib/store/media';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { session } from '$app/stores';
	import { clear } from '$lib/store/activeForm';

	export let agency: Agency;
	export let activeSection = '';

	let disabledRemove = true;
	let selectedPhoto: Media;

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		disabledRemove = true;
	};
	const onCancel = () => {
		selectedPhoto = undefined;
		activeSection = '';
	};

	async function uploadFile(event: CustomEvent<File[]>) {
		if (!event.detail.length) {
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			const formData: FormData = new FormData();
			for (const file of event.detail) {
				formData.append('files', file);
			}
			const res = await pupload('agencies/me/images', formData);
			if (res.ok) {
				const images = await res.json();
				session.update((s) => {
					s.agencyMe.images = [...(s.agencyMe.images || []), ...images];
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
			console.error('Failed to update agency images', error);
		}
		isFormSavingStore.set({ saving: false });
		formChangeStatusStore.set({ changing: false });
	}

	const removePhoto = async () => {
		if (!selectedPhoto) {
			return;
		}
		if (!confirm('Are you sure you want to remove this item?')) {
			return;
		}
		isFormSavingStore.set({ saving: true });
		try {
			const res = await pdelete(`agencies/me/images/${selectedPhoto.id}`);
			if (res.ok) {
				session.update((s) => {
					s.agencyMe.images = agency.images.filter((item) => item.id != selectedPhoto.id);
					return s;
				});
				onCancel();
			}
		} catch (error) {
			notify({
				title: 'Delete failed',
				subtitle: 'Failed to delete image, please try again later.'
			});
			console.error('Failed to delete agency image', error);
		}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	id="agency-photo"
	let:isEditing
	on:submit={removePhoto}
	editLabel="Add/Remove"
	disabledRemoveButton={!selectedPhoto}
	groupClass="group image-group group-destinations"
	isPhotoGroup={true}
>
	<FormRow label="Images" {isEditing}>
		<Grid fullWidth class="d-pleft-16">
			{#each range(0, agency.images.length, 2) as i}
				<Row>
					<Column>
						<ImageLoader
							src={agency.images[i].url}
							class="media-destination {selectedPhoto === agency.images[i] ? 'active' : ''}"
						/>
						<CloseIcon
							size={16}
							class="remove-media-icon {selectedPhoto === agency.images[i] ? 'active' : ''}"
						/>
						<div
							on:click={() => {
								if (!isEditing) {
									return;
								}
								if (selectedPhoto === agency.images[i]) {
									selectedPhoto = undefined;
								} else {
									selectedPhoto = agency.images[i];
								}
							}}
							class="remove-media-layout"
						/>
					</Column>
					{#if i + 1 < agency.images.length}
						<Column>
							<ImageLoader
								src={agency.images[i + 1].url}
								class="media-destination {selectedPhoto === agency.images[i + 1] ? 'active' : ''}"
							/>
							<CloseIcon
								size={16}
								class="remove-media-icon {selectedPhoto === agency.images[i + 1] ? 'active' : ''}"
							/>
							<div
								on:click={() => {
									if (!isEditing) {
										return;
									}
									if (selectedPhoto === agency.images[i + 1]) {
										selectedPhoto = undefined;
									} else {
										selectedPhoto = agency.images[i + 1];
									}
								}}
								class="remove-media-layout"
							/>
						</Column>
					{:else}
						<Column>
							<div style="width:100%" />
						</Column>
					{/if}
				</Row>
			{/each}
		</Grid>
		<div slot="fields">
			<div id="button-uploadfile">
				<FileUploaderDropContainer
					multiple
					labelText="Add photo"
					accept={['image/*']}
					on:change={uploadFile}
				/>
			</div>
		</div>
	</FormRow>
</FormGroup>
