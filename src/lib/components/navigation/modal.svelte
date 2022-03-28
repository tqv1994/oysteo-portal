<script>
	import { Modal } from 'carbon-components-svelte';
	import '../../../theme/oysteo.scss';
	import { TableOfContents20 } from 'carbon-icons-svelte';
	import { goto } from '$app/navigation';
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
	<div class="menu-mobile">
		<ul>
			{#each items as item (item.id)}
				<a
					href={item.link || `#${item.id}`}
					on:click={() => {
						if (item.link) {
							goto(item.link);
							return;
						}
						selectedItem = item.text;
						open = false;
					}}><li>{item.text}</li></a
				>
			{/each}
		</ul>
	</div>
</Modal>

<style lang="scss">
</style>
