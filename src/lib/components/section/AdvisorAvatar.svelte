<script lang="ts">
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
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { pdelete, pupload } from '$lib/utils/fetch';
	import { notify } from '../Toast.svelte';
	import { session } from '$app/stores';
	import { clear } from '$lib/store/activeForm';

	export let advisor: Advisor;
	export let activeSection = '';
	let disabledRemoveLogo = false;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
		disabledRemoveLogo = advisor.avatar == null ? true : false;
	};
	function onCancel() {
		activeSection = '';
	}

	const uploadFile = async (e: CustomEvent) => {
		const formData: FormData = new FormData();
		let file = e.detail[0];
		formData.append('files', file);

		isFormSavingStore.set({ saving: true });
		try {
			const res = await pupload('advisors/me/avatar', formData);

			if (res.ok) {
				const avatar = await res.json();
				console.debug('Avatar uploaded', avatar);
				session.update((s) => {
					s.advisorMe.avatar = avatar;
					return s;
				});
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

	const removeAvatar = async (isOldAvatar = false) => {
		if (advisor.avatar == null) {
			return;
		}
		if (!isOldAvatar) {
			const confirmDelete = confirm('Are you sure you want to remove this item?');
			if (!confirmDelete) {
				return;
			}
		}
		isFormSavingStore.set({ saving: true });
		try {
			const res = await pdelete('advisors/me/avatar');
			if (res.ok) {
				session.update((s) => {
					s.advisorMe.avatar = undefined;
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
			console.error('Failed to delete avatar', error);
		}
		isFormSavingStore.set({ saving: false });
		activeSection = '';
	};
</script>

<FormGroup
	let:isEditing
	on:submit={() => removeAvatar()}
	on:cancel={onCancel}
	editLabel="Add/Remove"
	disabledRemoveButton={disabledRemoveLogo}
	groupClass="group image-group group-destinations"
	isPhotoGroup={true}
>
	<FormRow label="Profile Photo" {isEditing}>
		<div slot="value">
			{#if !advisor.avatar}
				no image selected
			{:else}
				<Grid fullWidth>
					<Row>
						<Column>
							<ImageLoader src={advisor.avatar.url} />
						</Column>
					</Row>
				</Grid>
			{/if}
		</div>
		<div slot="fields">
			<Grid fullWidth class="d-pleft-16 pright-8">
				<Row>
					<Column>
						<ImageLoader src={advisor.avatar?.url} class="mbottom-8" />
					</Column>
				</Row>
			</Grid>

			<FileUploaderDropContainer
				labelText="Upload photo"
				accept={['image/*']}
				on:add={(e) => uploadFile(e)}
			/>
		</div>
	</FormRow>
</FormGroup>
