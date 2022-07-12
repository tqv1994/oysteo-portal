<script lang="ts">
	export let label: string;
	export let isEditing = false;
	let additionalClasses = '';
	let additionalContentClasses = '';
	export { additionalClasses as class };
	export { additionalContentClasses as contentClass };
	export let hideLabelEditing = false;
</script>

<div class="row {additionalClasses}">
	{#if isEditing}
		{#if !hideLabelEditing}
			<div class="label">{label}</div>
		{/if}
	{:else}
		<div class="label">{label}</div>
	{/if}
	<div class="content {additionalContentClasses}">
		<slot />
		{#if isEditing}
			<slot name="fields" />
		{:else}
			<slot name="value" />
		{/if}
	</div>
</div>

<style lang="scss">
	.row {
		flex: 1;
		margin-top: 2em;
	}
	.label {
		flex: 0 0 10em;
	}
	.content {
		flex: 1;
		margin-top: 1em;
	}
	@media (min-width: 1056px) {
		.row {
			flex: 1;
			display: flex;
			flex-wrap: wrap;
			margin-top: 1rem;
			&.advisor-planning-fee {
				margin-top: -2rem;
			}
		}
		.content {
			flex: 1;
			margin-top: 0em;
		}
		.label {
			flex: 0 0 10rem;
		}
	}
</style>
