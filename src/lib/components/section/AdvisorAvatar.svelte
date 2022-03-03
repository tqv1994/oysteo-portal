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
    import type { Advisor } from '$lib/store/advisor';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';

	export let advisor: Advisor;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	export let loadingLabel: string;
	let disabledRemoveLogo: boolean = false;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
		disabledRemoveLogo = advisor.avatar == null ? true : false;
	};
	const onCancel = () => {
		activeSection = '';
	};

	const uploadFile = async (e: CustomEvent) => {
		const formData: FormData = new FormData();
		let file = e.detail[0];
		formData.append('files', file);
		formData.append('ref', 'advisor');
		formData.append('refId', advisor.id.toString());
		formData.append('field', 'avatar');
        
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
				advisor.avatar = content[0];
			}
		}
		activeLoading = false;
		loadingLabel = 'Saving ...';
	};
	const removeLogo = async (isOldLogo = false) => {
		if (advisor.avatar == null) {
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
			body: JSON.stringify({ data: advisor.avatar.id })
		});

		if (res.ok) {
			advisor.avatar = null;
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
	isEditing={activeSection === 'advisor-avatar'}
	on:edit={() => onEdit('advisor-avatar')}
	on:cancel={onCancel}
	on:submit={() => removeLogo()}
	editLabel="Add/Remove"
	disabledRemoveButton={disabledRemoveLogo}
	groupClass="group image-group group-destinations"
	isPhotoGroup={true}
>
	<FormRow label="Avatar" {isEditing}>
		<div slot="value">
			{#if advisor.avatar == null}
				no image selected
			{:else}
				<Grid fullWidth>
					<Row>
						<Column>
							<ImageLoader src={imageUrlPrefix + advisor.avatar?.url} class="custom-logo-image"/>
						</Column>
					</Row>
				</Grid>
			{/if}
		</div>
		<div slot="fields">
			<Grid fullWidth class="d-pleft-16 pright-8">
				<Row>
					<Column>
						<ImageLoader src={imageUrlPrefix + advisor.avatar?.url} class="mbottom-8" />
					</Column>
				</Row>
			</Grid>

			<FileUploaderDropContainer
				labelText="Upload avatar"
				accept={['image/*']}
				on:add={(e) => uploadFile(e)}
			/>
		</div>
	</FormRow>
</FormGroup>
