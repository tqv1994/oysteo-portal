<script>
	export let headerText;

	let expanded = false;
</script>

<div class="collapsible">
	<h3>
		<button aria-expanded={expanded} on:click={() => (expanded = !expanded)}
			>{headerText}
			<!-- <svg viewBox="0 0 20 20" fill="none" >
<path class="vert" d="M10 1V19" stroke="black" stroke-width="2"/>
<path d="M1 10L19 10" stroke="black" stroke-width="2"/>
</svg> -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="feather feather-chevron-down"
			>
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>
	</h3>

	<div class="contents" hidden={!expanded}>
		<slot />
	</div>
</div>

<style>
	.collapsible {
		margin-bottom: 3px;
		background-color: var(--cds-field-01, #f4f4f4);
		border-bottom: 1px solid var(--gray-light, #eee);
	}

	h3 {
		margin: 0;
	}

	button {
		background-color: var(--cds-field-01, #f4f4f4);
		color: var(--gray-darkest, #282828);
		display: flex;
		justify-content: space-between;
		width: 100%;
		border: none;
		border-bottom: 1px solid;
		margin: 0;
		padding: 11px 1.5em;
		margin-top: 6px;
	}

	button[aria-expanded='true'] {
		/* border-bottom: 1px solid var(--gray-light, #eee); */
	}

	button[aria-expanded='true'] .vert {
		display: none;
	}

	button:focus svg {
		outline: 2px solid;
	}

	button [aria-expanded='true'] rect {
		fill: currentColor;
	}

	svg {
		height: 1em;
		width: 1em;
	}

	.contents {
		border-top: 8px solid white;
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 10px;
	}
</style>
