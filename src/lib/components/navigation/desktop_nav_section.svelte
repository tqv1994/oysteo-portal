<script>
	import '../../../theme/oysteo.scss';
	export let items = [];
	export let className = '';
	let itemActiveID = items.reduce((acc , item)=>{ if(item.link || acc != ''){ return acc; } acc = item.id; return acc  },'');

	const handleClick = (itemId) => {
		itemActiveID = itemId;
	};
</script>

<ul id="desktop-nav-section" class={className}>
	{#each items as item (item.id)}
		<li class={itemActiveID == item.id ? 'active' : ''}>
			<a
				href={item.link || `#${item.id}`}
				on:click={() => {
					if(!item.link){
						handleClick(item.id);
					}
				}}>{item.text}</a
			>
		</li>
	{/each}
</ul>

<style lang="scss">
</style>
