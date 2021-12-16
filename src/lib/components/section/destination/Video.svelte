<script lang="ts">
</script>

<!-- <FormGroup
				let:isEditing
				isEditing={activeSection === 'destination-videos-' + index}
				on:edit={setEditing('destination-videos-' + index)}
				on:cancel={setEditing('')}
				on:submit={() => removeMedia(index)}
				editLabel="Add/Remove"
				disabledRemoveButton={disabledRemove}
				groupClass="group image-group group-destinations"
				isPhotoGroup={true}
			>
				<FormRow label="Videos" {isEditing}>
					<div slot="value">
						<Grid fullWidth>
							{#each range(0, destinations[index].videos.length, 2) as i}
								<Row>
									<Column>
										<video preload="auto" controls autoplay>
											<source src={imageUrlPrefix + destinations[index].videos[i].url} />
											<track kind="captions" />
										</video>
									</Column>
									{#if i + 1 < destinations[index].videos.length}
										<Column>
											<video preload="auto" controls autoplay>
												<source src={imageUrlPrefix + destinations[index].videos[i + 1].url} />
												<track kind="captions" />
											</video>
										</Column>
									{/if}
								</Row>
							{/each}
						</Grid>
					</div>
					<div slot="fields">
						<Grid fullWidth>
							{#each range(0, destinations[index].videos.length, 2) as i}
								<Row>
									<Column>
										<video
											preload="auto"
											controls
											autoplay
											class="media-destination {mediaSelected == destinations[index].videos[i].id
												? 'active'
												: ''}"
										>
											<source src={imageUrlPrefix + destinations[index].videos[i].url} />
											<track kind="captions" />
										</video>
										<Close16
											class="remove-media-icon {mediaSelected == destinations[index].videos[i].id
												? 'active'
												: ''}"
										/>
										<div
											on:click={() => {
												if (mediaSelected != destinations[index].videos[i].id) {
													mediaSelected = destinations[index].videos[i].id;
													disabledRemove = false;
												} else {
													mediaSelected = 0;
													disabledRemove = true;
												}
											}}
											class="remove-media-layout"
										/>
									</Column>
									{#if i + 1 < destinations[index].videos.length}
										<Column>
											<video
												preload="auto"
												controls
												autoplay
												class="media-destination {mediaSelected ==
												destinations[index].videos[i + 1].id
													? 'active'
													: ''}"
											>
												<source src={imageUrlPrefix + destinations[index].videos[i + 1].url} />
												<track kind="captions" />
											</video>
											<Close16
												class="remove-media-icon {mediaSelected ==
												destinations[index].videos[i + 1].id
													? 'active'
													: ''}"
											/>
											<div
												on:click={() => {
													if (mediaSelected != destinations[index].videos[i + 1].id) {
														mediaSelected = destinations[index].videos[i + 1].id;
														disabledRemove = false;
													} else {
														mediaSelected = 0;
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
								buttonLabel="Add video"
								accept={['video/mp4', 'video/x-m4v', 'video/*']}
								status="complete"
								on:add={(e) => uploadFile(e, index, 'videos')}
							/>
						</div>
					</div>
				</FormRow>
			</FormGroup> -->
