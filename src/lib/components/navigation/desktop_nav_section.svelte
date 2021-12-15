<script>
	import '../../../theme/oysteo.scss';
	export let items = [];
	export let className = '';
	let itemActiveID = items[0].id;

	const handleClick = (itemId) => {
		itemActiveID = itemId;
	};
</script>

<ul id="desktop-nav-section" class={className}>
	{#each items as item (item.id)}
		<li class={itemActiveID == item.id ? 'active' : ''}>
			<a
				href="#{item.id}"
				on:click={() => {
					handleClick(item.id);
				}}>{item.text}</a
			>
		</li>
	{/each}
</ul>

<style lang="scss">
</style>
