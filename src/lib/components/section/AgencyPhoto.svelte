<script lang="ts">
	import { range } from '$lib/helpers/utils';
	import { Close16 } from 'carbon-icons-svelte';
	import { cmsUrlPrefix, imageUrlPrefix } from '$lib/utils/_env';
	import { Column, FileUploader, FileUploaderDropContainer, Grid, ImageLoader, Row } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import type { Agency } from '$lib/store/agency';
	import type { Media } from '$lib/store/media';
	import { isFormSavingStore } from '$lib/store/isFormSaving';

	export let agency: Agency;
	export let activeSection = '';

	let disabledRemove = true;
	let photoSelected: number;

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		disabledRemove = true;
	};
	const onCancel = () => {
		photoSelected = 0;
		activeSection = '';
	};
	let images: Media[] = [];
	$: if (Array.isArray(agency.images) && agency.images.length > 0) {
		images = agency.images;
	} else {
		images = [];
	}

	const uploadFile = async (e: Event) => {
		isFormSavingStore.set({ saving: true });
		try {
			const formData: FormData = new FormData();
			let file = e.target?.files[0];
			if (!file) {
				file = e.detail[0];
			}

			formData.append('files', file);
			formData.append('ref', 'agency');
			formData.append('refId', agency.id.toString());
			formData.append('field', 'images');
			const res = await fetch(cmsUrlPrefix + '/upload', {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				const content = await res.json();
				if (content.length > 0) {
					agency.images = [...agency.images, content[0]];
				}
			}
		} catch (error) {
			console.log(error);
		}
		isFormSavingStore.set({ saving: false });
	};

	const removePhoto = async () => {
		if (photoSelected == 0) {
			return;
		}
		const confirmDelete = confirm('Are you sure you want to remove this item?');
		if (!confirmDelete) {
			return;
		}
		isFormSavingStore.set({ saving: true });

		const res = await fetch('/file.json', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data: photoSelected })
		});

		if (res.ok) {
			agency.images = agency.images.filter((item) => item.id != photoSelected);
			console.log(agency.images);
			onCancel();
		}
		isFormSavingStore.set({ saving: false });
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'agency-photo'}
	on:edit={() => onEdit('agency-photo')}
	on:cancel={onCancel}
	on:submit={removePhoto}
	editLabel="Add/Remove"
	disabledRemoveButton={disabledRemove}
	groupClass="group image-group group-destinations"
	isPhotoGroup={true}
>
	<FormRow label="Images" {isEditing}>
		<div slot="value">
			{#if !Array.isArray(images) || images.length == 0}
				no image selected
			{:else}
				<Grid fullWidth>
					{#each range(0, (images || []).length, 2) as i}
						<Row>
							<Column>
								<ImageLoader src={imageUrlPrefix + images[i].url} />
							</Column>
							{#if i + 1 < images.length}
								<Column>
									<ImageLoader src={imageUrlPrefix + images[i + 1].url} />
								</Column>
							{:else}
								<Column>
									<div style="width:100%" />
								</Column>
							{/if}
						</Row>
					{/each}
				</Grid>
			{/if}
		</div>
		<div slot="fields">
			<Grid fullWidth class="d-pleft-16">
				{#each range(0, agency.images.length, 2) as i}
					<Row>
						<Column>
							<ImageLoader
								src={imageUrlPrefix + agency.images[i].url}
								class="media-destination {photoSelected == agency.images[i].id ? 'active' : ''}"
							/>
							<Close16
								class="remove-media-icon {photoSelected == agency.images[i].id ? 'active' : ''}"
							/>
							<div
								on:click={() => {
									if (photoSelected != agency.images[i].id) {
										photoSelected = agency.images[i].id;
										disabledRemove = false;
									} else {
										photoSelected = 0;
										disabledRemove = true;
									}
								}}
								class="remove-media-layout"
							/>
						</Column>
						{#if i + 1 < agency.images.length}
							<Column>
								<ImageLoader
									src={imageUrlPrefix + agency.images[i + 1].url}
									class="media-destination {photoSelected == agency.images[i + 1].id
										? 'active'
										: ''}"
								/>
								<Close16
									class="remove-media-icon {photoSelected == agency.images[i + 1].id
										? 'active'
										: ''}"
								/>
								<div
									on:click={() => {
										if (photoSelected != agency.images[i + 1].id) {
											photoSelected = agency.images[i + 1].id;
											disabledRemove = false;
										} else {
											photoSelected = 0;
											disabledRemove = true;
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

			<div id="button-uploadfile">
				<FileUploaderDropContainer
					labelText="Add photo"
					accept={['image/*']}
					on:change={(e) => uploadFile(e)}
				/>
			</div>
		</div>
	</FormRow>
</FormGroup>
