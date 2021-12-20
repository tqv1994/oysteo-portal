<script lang="ts">
	import type { Agency } from '$lib/store/agency';
	import { cmsUrlPrefix, imageUrlPrefix } from '$lib/utils/_env';
	import {
		Column,
		FileUploaderDropContainer,
		Grid,
		ImageLoader,
		Row
	} from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let agency: Agency;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	export let loadingLabel: string;
	let disabledRemoveLogo: boolean = false;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
		disabledRemoveLogo = agency.logo == null ? true : false;
	};
	const onCancel = () => {
		activeSection = '';
	};

	const uploadFile = async (e: CustomEvent) => {
		const formData: FormData = new FormData();
		let file = e.detail[0];
		formData.append('files', file);
		formData.append('ref', 'agency');
		formData.append('refId', agency.id.toString());
		formData.append('field', 'logo');
		activeLoading = true;
		loadingLabel = 'Uploading ...';
		const res = await fetch(cmsUrlPrefix + '/upload', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			const content = await res.json();
			if (content.length > 0) {
				await removeLogo(true);
				agency.logo = content[0];
			}
		}
		activeLoading = false;
		loadingLabel = 'Saving ...';
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
		activeLoading = true;
		loadingLabel = 'Removing ...';

		const res = await fetch('/file.json', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ data: agency.logo.id })
		});

		if (res.ok) {
			agency.logo = null;
			if (!isOldLogo) {
				onCancel();
			}
		}
		activeLoading = false;
		loadingLabel = 'Saving ...';
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'agency-logo'}
	on:edit={() => onEdit('agency-logo')}
	on:cancel={onCancel}
	on:submit={() => removeLogo()}
	editLabel="Add/Remove"
	disabledRemoveButton={disabledRemoveLogo}
	groupClass="group image-group group-destinations"
	isPhotoGroup={true}
>
	<FormRow label="Logo" {isEditing}>
		<div slot="value">
			{#if agency.logo == null}
				no image selected
			{:else}
				<Grid fullWidth>
					<Row>
						<Column>
							<ImageLoader src={imageUrlPrefix + agency.logo?.url} />
						</Column>
					</Row>
				</Grid>
			{/if}
		</div>
		<div slot="fields">
			<Grid fullWidth class="d-pleft-16 pright-8">
				<Row>
					<Column>
						<ImageLoader src={imageUrlPrefix + agency.logo?.url} class="mbottom-8" />
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
