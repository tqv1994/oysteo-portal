<script lang="ts" context="module">
	import DesktopNavigationSection from '$lib/components/navigation/desktop_nav_section.svelte';
	import NavigationSection from '$lib/components/navigation/modal.svelte';
	import type { Load } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import OverlayLoading from '$lib/components/form/loading.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import type { User } from '$lib/store/auth';

	export const load: Load = async () => {
		return { props: {} };
	};
</script>

<script lang="ts">
	import MessagesList from './components/MessagesList.svelte';

	export let user: User;
	let loadingLabel = 'Saving ...';
	let y, prevY;
	let navFixed = '';
	let activeLoading = false;

	const messagesSections = [
		{ id: '', text: 'Home', link: '/account' },
		{ id: 'current-messages', text: 'Current Messages' },
		{ id: 'archived', text: 'Archived' }
	];

	afterUpdate(() => {
		navFixed = prevY > y ? 'nav-fixed' : '';
		prevY = y;
	});
</script>

<svelte:window bind:scrollY={y} />
<OverlayLoading bind:activeLoading bind:label={loadingLabel} />
<NavigationSection selectedItem={'Current Messages'} items={messagesSections} class={navFixed} />

<div class="content">
	<div class="title-content">
		<h1>Messages</h1>
		<DesktopNavigationSection items={messagesSections} className={'messages-screen'} />
	</div>
	<div class="section" id="home" />
	<div class="section" id="current-messages">
		<Accordion title="Current Messages" open={true} id="">
			<MessagesList />
		</Accordion>
	</div>
	<div class="section" id="archived">
		<Accordion title="Archived" id="" />
	</div>
	<div id="fake-height" />
</div>
