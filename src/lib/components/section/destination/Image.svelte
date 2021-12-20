<script lang="ts">
	import { range } from '$lib/helpers/utils';
	import { Close16 } from 'carbon-icons-svelte';
	import type { Destination } from '$lib/store/destination';
	import { cmsUrlPrefix, imageUrlPrefix } from '$lib/utils/_env';
	import { Column, FileUploader, Grid, ImageLoader, Row } from 'carbon-components-svelte';

	import FormGroup from '../../form/group.svelte';
	import FormRow from '../../form/row.svelte';

	export let index: number;
	export let destinations: Destination[];
	export let activeSection: string = '';
	export let activeLoading: boolean;
	export let loadingLabel: string;

	let disabledRemove: boolean = true;
	let mediaSelected: number;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
		disabledRemove = true;
	};
	const onCancel = () => {
		mediaSelected = 0;
		activeSection = '';
	};

	const uploadFile = async (e: Event, index: number, field: string) => {
		const formData: FormData = new FormData();
		let file = e.target.files[0];
		formData.append('files', file);
		formData.append('ref', 'destination');
		formData.append('refId', destinations[index].id.toString());
		formData.append('field', field);
		activeLoading = true;
		loadingLabel = 'Uploading ...';

		const res = await fetch(cmsUrlPrefix + '/upload', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			const content = await res.json();
			if (content.length > 0) {
				destinations[index][field] = [...destinations[index][field], content[0]];
			}
		}
		activeLoading = false;
		loadingLabel = 'Saving ...';
	};

	const removeMedia = async (destinationIndex: number) => {
		if (mediaSelected == 0) {
			return;
		}
		const confirmDelete = confirm('Are you sure you want to remove this item?');
		if (!confirmDelete) {
			return;
		}
		activeLoading = true;
		loadingLabel = 'Removing ...';

		const res = await fetch('/file.json', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data: mediaSelected })
		});

		if (res.ok) {
			destinations[destinationIndex].gallery = destinations[destinationIndex].gallery.filter(
				(item) => item.id != mediaSelected
			);

			activeSection = '';
		}
		activeLoading = false;
		loadingLabel = 'Saving ...';
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'destination-images-' + index}
	on:edit={() => onEdit('destination-images-' + index)}
	on:cancel={onCancel}
	on:submit={() => removeMedia(index)}
	editLabel="Add/Remove"
	disabledRemoveButton={disabledRemove}
	groupClass="group image-group group-destinations"
	isPhotoGroup={true}
>
	<FormRow label="Images" {isEditing}>
		<div slot="value">
			<Grid fullWidth>
				{#each range(0, destinations[index].gallery.length, 2) as i}
					<Row>
						<Column>
							<ImageLoader src={imageUrlPrefix + destinations[index].gallery[i].url} />
						</Column>
						{#if i + 1 < destinations[index].gallery.length}
							<Column>
								<ImageLoader src={imageUrlPrefix + destinations[index].gallery[i + 1].url} />
							</Column>{:else}
							<Column>
								<div style="width:100%" />
							</Column>
						{/if}
					</Row>
				{/each}
			</Grid>
		</div>
		<div slot="fields">
			<Grid fullWidth class="d-pleft-16">
				{#each range(0, destinations[index].gallery.length, 2) as i}
					<Row>
						<Column>
							<ImageLoader
								src={imageUrlPrefix + destinations[index].gallery[i].url}
								class="media-destination {mediaSelected == destinations[index].gallery[i].id
									? 'active'
									: ''}"
							/>
							<Close16
								class="remove-media-icon {mediaSelected == destinations[index].gallery[i].id
									? 'active'
									: ''}"
							/>
							<div
								on:click={() => {
									if (mediaSelected != destinations[index].gallery[i].id) {
										mediaSelected = destinations[index].gallery[i].id;
										disabledRemove = false;
									} else {
										mediaSelected = 0;
										disabledRemove = true;
									}
								}}
								class="remove-media-layout"
							/>
						</Column>
						{#if i + 1 < destinations[index].gallery.length}
							<Column>
								<ImageLoader
									src={imageUrlPrefix + destinations[index].gallery[i + 1].url}
									class="media-destination {mediaSelected == destinations[index].gallery[i + 1].id
										? 'active'
										: ''}"
								/>
								<Close16
									class="remove-media-icon {mediaSelected == destinations[index].gallery[i + 1].id
										? 'active'
										: ''}"
								/>
								<div
									on:click={() => {
										if (mediaSelected != destinations[index].gallery[i + 1].id) {
											mediaSelected = destinations[index].gallery[i + 1].id;
											disabledRemove = false;
										} else {
											mediaSelected = 0;
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
				<FileUploader
					style="text-align: center;"
					buttonLabel="Add photo"
					accept={['image/*']}
					status="complete"
					on:change={(e) => uploadFile(e, index, 'gallery')}
				/>
			</div>
		</div>
	</FormRow>
</FormGroup>
