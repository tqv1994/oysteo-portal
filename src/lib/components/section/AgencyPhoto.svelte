<script lang="ts">
	import { range } from '$lib/helpers/utils';
	import { Close16 } from 'carbon-icons-svelte';
	import { cmsUrlPrefix, imageUrlPrefix } from '$lib/utils/_env';
	import { Column, FileUploader, Grid, ImageLoader, Row } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import type { Agency } from '$lib/store/agency';

	export let agency: Agency;
	export let activeSection: string = '';
	export let activeLoading: boolean;

	let disabledRemove: boolean = true;
	let photoSelected: number;

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		disabledRemove = true;
	};
	const onCancel = () => {
		photoSelected = 0;
		activeSection = '';
	};

	const uploadFile = async (e: CustomEvent) => {
		activeLoading = true;

		const formData: FormData = new FormData();
		let file = e.detail[0];
		formData.append('files', file);
		formData.append('ref', 'agency');
		formData.append('refId', agency.id.toString());
		formData.append('field', 'photo');
		const res = await fetch(cmsUrlPrefix + '/upload', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			const content = await res.json();
			if (content.length > 0) {
				agency.images = [...agency.images, content[0]];
				alert('Upload successfully');
				activeSection = '';
			}
		}
		activeLoading = false;
	};

	const removePhoto = async () => {
		if (photoSelected == 0) {
			return;
		}
		const confirmDelete = confirm('Are you sure you want to remove this item?');
		if (!confirmDelete) {
			return;
		}
		activeLoading = true;

		const res = await fetch('/file.json', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data: photoSelected })
		});

		if (res.ok) {
			alert('Delete successfully');
			agency.images = agency.images.filter((item) => item.id != photoSelected);
		}
		activeLoading = false;
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
			<Grid fullWidth>
				{#each range(0, agency.images.length, 2) as i}
					<Row>
						<Column>
							<ImageLoader src={cmsUrlPrefix + agency.images[i].url} />
						</Column>
						{#if i + 1 < agency.images.length}
							<Column>
								<ImageLoader src={cmsUrlPrefix + agency.images[i + 1].url} />
							</Column>
						{/if}
					</Row>
				{/each}
			</Grid>
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
						{/if}
					</Row>
				{/each}
			</Grid>

			<div id="button-uploadfile">
				<FileUploader
					style="text-align: center;"
					buttonLabel="Add photo"
					accept={['image/*']}
					status="complete"
					on:add={(e) => uploadFile(e)}
				/>
			</div>
		</div>
	</FormRow>
</FormGroup>
