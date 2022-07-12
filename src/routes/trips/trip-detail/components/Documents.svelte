<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import {
		type Trip,
		TRipInput,
		tripStore
	} from '$lib/store/trip';
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import {
		Column,
		FileUploader,
		FileUploaderButton,
		Grid,
		Link,
		Row,
		TextArea
	} from 'carbon-components-svelte';
	import type { Traveller } from '$lib/store/traveller';
	import { ENUM_DOCUMENT_TYPE, ENUM_DOCUMENT_TYPE_LABEL, type Document } from '$lib/store/document';
	import { CloseOutline as CloseOutlineIcon } from 'carbon-icons-svelte';
	import ListItemContainer from '$lib/components/form/listitemcontainer.svelte';
	import { createDocumentService, deleteDocumentService } from '$lib/services/document.service';
	import { uploadFileService } from '$lib/services/uploadFile.service';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { pdelete, ppost, pupload } from '$lib/utils/fetch';
	import { notify } from '$lib/components/Toast.svelte';
	import { clear } from '$lib/store/activeForm';
	export let trip: Trip | undefined;
	let fileDocuments: { files: File[] }[] = [];
	let documentDeleteIds: string[] = [];
	let documents: Document[] = [];
	type DocumentInput = {
		type: string;
		documents: File[]; // ID[]
		description: string;
		trip: string;
	};
	let formGroup: FormGroup;
	export let type: ENUM_DOCUMENT_TYPE;
	type FormData = {
		documents: DocumentInput[];
	};
	type FormError = {
		documents: { files: string[] };
	};
	let activeSection = '';
	let formErrors: FormError;
	let formData: FormData = reset();

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function reset(): FormData {
		return {
			documents: []
		};
	}

	const onEdit = (section: string) => {
		activeSection = section;
	};
	const handleResetForm = () => {
		documents = (trip.documents || []).reduce((acc: Document[], item: Document) => {
			if (item.type === type) {
				acc.push(item);
			}
			return acc;
		}, []);
		formData = reset();
		documentDeleteIds = [];
		fileDocuments = [];
	};

	handleResetForm();

	const onCancel = () => {
		handleResetForm();
		activeSection = '';
	};

	const onSubmit = async () => {
		// if(documentInputs && documentInputs.length > 0){
		// 	documentInputs.forEach(documentInput => {
		// 		if(documentInput.documents == null && documentInput.description == ''){
		// 			activeSection = '';
		// 			handleResetForm();
		// 			return;
		// 		}
		// 	});
		// }
		isFormSavingStore.set({ saving: true });
		try {
			for (const deleteId of documentDeleteIds) {
				const res = await pdelete(`documents/${deleteId}`);
				if (res.ok) {
					trip.documents = trip.documents.filter((item) => item.id !== deleteId);
				} else {
					notify({
						title: 'Delete failed',
						subtitle: 'Failed to create information, please try again later.'
					});
				}
			}

			if (formData.documents && formData.documents.length > 0) {
				for (const [index, documentInput] of formData.documents.entries()) {
					const formData = new FormData();
					let file = fileDocuments[index].files[0];
					const data = JSON.stringify({ ...documentInput, type, trip: trip.id });
					formData.append('files.documents', file);
					formData.append('data', data);
					const res = await pupload(`documents`, formData);
					if (res.ok) {
						const document = await res.json();
						trip.documents.push(document);
						activeSection = '';
						tripStore.update((s) => {
							const idx = s.findIndex((t) => t.id === trip.id);
							s[idx] = trip;
							return s;
						});
					} else {
						notify({
							title: 'Create failed',
							subtitle: 'Failed to create information, please try again later.'
						});
					}
					// .then(
					// 	async (document) => {
					// 		if (fileDocuments[index] && fileDocuments[index].files.length > 0) {
					// 			await uploadFileService(
					// 				fileDocuments[index].files[0],
					// 				'document',
					// 				document.id,
					// 				'documents'
					// 			).then((file) => {
					// 				document.documents = [file];
					// 			});
					// 		}
					// 		trip.documents.push(document);
					// 	}
					// );
				}
			}
			clear();
		} catch (error) {
			notify({
				title: 'Update failed',
				subtitle: 'Failed to update information, please try again later.'
			});
			console.error('Failed to update documents', error);
		}
		handleResetForm();
		isFormSavingStore.set({ saving: false });
	};

	const handleClearInput = (index) => {
		// let data: any[] = documentInputs;
		formData.documents = formData.documents.filter((item, indexItem) => indexItem !== index);
		fileDocuments = fileDocuments.filter((item, indexItem) => indexItem !== index);
	};

	const onAddDocument = () => {
		let dataFileDocuments: any = [...fileDocuments];
		dataFileDocuments.push({ files: [] });
		fileDocuments = dataFileDocuments;
		let dataDocumentInputs: any = [...formData.documents];
		dataDocumentInputs.push({ trip: trip.id });
		formData.documents = dataDocumentInputs;
		setTimeout(() => {
			formGroup.activate();
		}, 0);
	};
	
</script>

<FormGroup
	let:isEditing
	on:cancel={onCancel}
	on:submit={onSubmit}
	editLabel="Add/Remove"
	hideEditIcon={true}
	data={formData.documents}
	bind:this={formGroup}
>
	<h6>{ENUM_DOCUMENT_TYPE_LABEL[type]}</h6>
	<FormRow label="Document" {isEditing}>
		<div slot="value">
			<Grid class="document-desktop">
				<Row>
					<Column>
						<label>File</label>
					</Column>
					<Column>
						<label>Description</label>
					</Column>
					<Column>
						<label>Uploaded</label>
					</Column>
				</Row>
				{#each documents || [] as document}
					<Row>
						<Column>
							{#if document.documents && document.documents[0]}
								<Link href={document.documents[0].url} target="_blank"
									>{document.documents[0].name}</Link
								>
							{/if}
						</Column>
						<Column>
							{document.description || ''}
						</Column>
						<Column>
							{formatDate(document.created_at || '')}
						</Column>
					</Row>
				{/each}
			</Grid>

			<Grid class="document-mobile">
				{#each documents || [] as document}
					<Column>
						<Row>
							<label>
								File:
								{#if document.documents && document.documents[0]}
									<Link href={document.documents[0].url} target="_blank"
										>{document.documents[0].name}</Link
									>
								{/if}
							</label>
						</Row>
						<Row>
							<label>Description: {document.description || ''}</label>
						</Row>
						<Row>
							<label>Uploaded: {formatDate(document.created_at || '')}</label>
						</Row>
					</Column>
				{/each}
			</Grid>
		</div>
		<div slot="fields">
			<Grid>
				<Row>
					<Column>
						<label>File</label>
					</Column>
					<Column>
						<label>Description</label>
					</Column>
					<Column lg={1} />
				</Row>
				{#each documents || [] as document, index}
					<Row>
						<Column>
							{#if document.documents && document.documents[0]}
								<Link href={document.documents[0].url} target="_blank"
									>{document.documents[0].name}</Link
								>
							{/if}
						</Column>
						<Column>{document.description || ''}</Column>
						<Column lg={1}>
							<Link
								on:click={() => {
									documents = documents.filter((ele, key) => {
										if (ele.id === documents[index].id) {
											documentDeleteIds.push(ele.id);
										}
										return ele.id !== documents[index].id;
									});
								}}
							>
								<CloseOutlineIcon size={20} />
							</Link>
						</Column>
					</Row>
				{/each}
				{#each formData.documents as input, index}
					<Row>
						<Column>
							<FileUploader
								buttonLabel="Add files"
								bind:files={fileDocuments[index].files}
								status="complete"
							/>
						</Column>
						<Column>
							<TextArea autofocus bind:value={input.description} rows={3} />
						</Column>
						<Column lg={1}>
							<Link
								on:click={() => {
									handleClearInput(index);
								}}
							>
								<CloseOutlineIcon size={20} />
							</Link>
						</Column>
					</Row>
				{/each}
			</Grid>
			<div>
				<Link on:click={onAddDocument} id="bx--link-add">Add Document</Link>
			</div>
		</div>
	</FormRow>
</FormGroup>

<style lang="scss">
	div {
		:global(.bx--file-container) {
			display: block;
		}
	}
</style>
