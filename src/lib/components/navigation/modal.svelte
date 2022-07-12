<script lang="ts">
	import { Button, Modal } from 'carbon-components-svelte';
	import '../../../theme/oysteo.scss';
	import { TableOfContents as TableOfContentsIcon } from 'carbon-icons-svelte';
	import type { SideNavItem } from '$lib/store/types';

	export { additionalClasses as class };
	export let items: SideNavItem[];
	export let activeIndex: number = 0;

	let open = false;
	let additionalClasses = '';

	$: activeSection = items[activeIndex];
</script>

<div class="nav-section {additionalClasses}">
	<p>{activeSection?.text}</p>
	<Button kind="ghost" on:click={() => (open = true)}>
		<TableOfContentsIcon size={20} />
	</Button>
</div>

<Modal passiveModal bind:open on:open>
	<div class="menu-mobile">
		<ul>
			<a href="/profile"><li>Home</li></a>
			{#each items as item, i (item.id)}
				<a
					href="#{item.id}"
					on:click={() => {
						activeIndex = i;
						open = false;
					}}><li>{item.text}</li></a
				>
			{/each}
		</ul>
	</div>
</Modal>

<style lang="scss">
</style>
