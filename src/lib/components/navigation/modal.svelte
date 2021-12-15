<script>
	import { Modal } from 'carbon-components-svelte';
	import '../../../theme/oysteo.scss';
	import { TableOfContents20 } from 'carbon-icons-svelte';
	let open = false;
	export let items;
	export let selectedItem = 'ID and Password';
	let additionalClasses = '';
	export { additionalClasses as class };
</script>

<div class="nav-section {additionalClasses}">
	<p>{selectedItem}</p>
	<TableOfContents20 on:click={() => (open = true)} />
</div>

<Modal passiveModal bind:open on:open>
	<ul>
		{#each items as item (item.id)}
			<li>
				<a
					href="#{item.id}"
					on:click={() => {
						selectedItem = item.text;
						open = false;
					}}>{item.text}</a
				>
			</li>
		{/each}
	</ul>
</Modal>

<style lang="scss">
</style>
