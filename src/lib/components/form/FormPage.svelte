<script lang="ts">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import { onMount } from 'svelte';
	import type { SideNavItem } from '$lib/store/types';

	export let title: string;

	let root: HTMLElement;
	let sections: Element[];
	let currentIndex: number = 0;
	let menuItems: SideNavItem[] = [];

	onMount(() => {
		sections = Array.from(root.getElementsByClassName('section'));
		menuItems = sections.map((el) => {
			const text = el
				.querySelector('.bx--tile > h4, .bx--accordion__title > div > h4')
				.textContent.trim();
			const id = 'section-' + text.toLowerCase().replace(/[^a-z0-9]/g, '-');
			el.setAttribute('id', id);
			return { id, text };
		});
		const lastSectionHeight = sections[sections.length - 1].clientHeight;
		const padder = document.createElement('div');
		padder.style.height = `calc(100vh - ${lastSectionHeight + 150}px)`;
		root.appendChild(padder);
		onScroll();
	});

	function onScroll() {
		currentIndex = sections.findIndex((el) => {
			const viewportOffset = el.getBoundingClientRect();
			return viewportOffset.bottom >= 170;
		});
	}
</script>

<svelte:window on:scroll={onScroll} />
{#if menuItems}
	<NavigationSection items={menuItems} bind:activeIndex={currentIndex} />
{/if}
<div class="content" bind:this={root}>
	<div class="title-content">
		<p class="tab-mobile">{title}</p>
		<h1>{title}</h1>
		<DesktopNavigationSection items={menuItems} activeIndex={currentIndex} class="advisor-screen" />
	</div>
	<slot />
</div>
