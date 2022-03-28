<script lang="ts">
	import { formatDate } from '$lib/helpers/datetime';
	import { convertTripToInput, Trip, TRipInput } from '$lib/store/trip';
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
	import {
		ENUM_DOCUMENT_TYPE,
		ENUM_DOCUMENT_TYPE_LABEL,
		Document,
		DocumentInput
	} from '$lib/store/document';
	import { CloseOutline20 } from 'carbon-icons-svelte';
	import ListItemContainer from '$lib/components/form/listitemcontainer.svelte';
	import { createDocumentService, deleteDocumentService } from '$lib/services/document.service';
	import { uploadFileService } from '$lib/services/uploadFile.service';
	import { getItems } from '$lib/store/types';
import { isFormSavingStore } from '$lib/store/isFormSaving';
	export let trip: Trip | undefined;
	let activeSection = '';
	let documentInputs: DocumentInput[];
	let fileDocuments: { files: File[] }[] = [];
	let documentDeleteIds: string[] = [];
	export let type: ENUM_DOCUMENT_TYPE;
	const onEdit = (section: string) => {
		handleResetForm();
		activeSection = section;
	};
	let documents: Document[];
	let tripInput: TRipInput;
	const handleResetForm = () => {
		if (trip) {
			tripInput = convertTripToInput(trip);
		} else {
			tripInput = new TRipInput();
		}
		documents = trip.documents.reduce((acc: Document[], item: Document) => {
			if (item.type === type) {
				acc.push(item);
			}
			return acc;
		}, []);
		documentInputs = [];
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
		isFormSavingStore.set({saving: true});
		for (const deleteId of documentDeleteIds) {
			await deleteDocumentService(deleteId).then(() => {
				trip.documents = trip.documents.filter((item, index) => item.id !== deleteId);
			});
		}

		if (documentInputs && documentInputs.length > 0) {
			for (const [index, documentInput] of documentInputs.entries()) {
				await createDocumentService({ ...documentInput, type, trip: trip.id }).then(
					async (document) => {
						if (fileDocuments[index] && fileDocuments[index].files.length > 0) {
							await uploadFileService(
								fileDocuments[index].files[0],
								'document',
								document.id,
								'documents'
							).then((file) => {
								document.documents = [file];
							});
						}
						trip.documents.push(document);
					}
				);
			}
		}
		activeSection = '';
		handleResetForm();
		isFormSavingStore.set({saving: false});
	};

	const handleClearInput = (index) => {
		// let data: any[] = documentInputs;
		documentInputs = documentInputs.filter((item, indexItem) => indexItem !== index);
		fileDocuments = fileDocuments.filter((item, indexItem) => indexItem !== index);
	};

	const onAddDocument = () => {
		let dataFileDocuments: any = [...fileDocuments];
		dataFileDocuments.push({ files: [] });
		fileDocuments = dataFileDocuments;
		let dataDocumentInputs: any = [...documentInputs];
		dataDocumentInputs.push(new DocumentInput());
		documentInputs = dataDocumentInputs;
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === `documents-${type}`}
	on:edit={() => onEdit(`documents-${type}`)}
	on:cancel={onCancel}
	on:submit={onSubmit}
	editLabel="Add/Remove"
	hideEditIcon={true}
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
							<CloseOutline20
								on:click={() => {
									documents = documents.filter((ele, key) => {
										if (ele.id === documents[index].id) {
											documentDeleteIds.push(ele.id);
										}
										return ele.id !== documents[index].id;
									});
								}}
							/>
						</Column>
					</Row>
				{/each}
				{#each documentInputs as input, index}
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
							<CloseOutline20
								on:click={() => {
									handleClearInput(index);
								}}
							/>
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
