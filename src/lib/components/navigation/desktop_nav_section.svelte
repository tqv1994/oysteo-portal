<script lang="ts">
	import '../../../theme/oysteo.scss';
	import type { SideNavItem } from '$lib/store/types';

	export let items: SideNavItem[];
	export { className as class };
	export let activeIndex: number = 0;

	let className = '';
</script>

<ul id="desktop-nav-section" class={className}>
	<li>
		<a href="/profile">Home</a>
	</li>
	{#each items as item, i (item.id)}
		<li class:active={activeIndex === i}>
			<a href="#{item.id}">{item.text}</a>
		</li>
	{/each}
</ul>
