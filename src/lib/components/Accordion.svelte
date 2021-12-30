<script lang="ts">
	import { Accordion, AccordionItem } from 'carbon-components-svelte';
	export let title: string = '';
    export let open: boolean = false;
    export let id: string;
</script>

<div class="accordion" id={id}>
	<Accordion>
		<AccordionItem bind:open>
			<div slot="title">
				<h4>{title}</h4>
			</div>
			<div class="accordion--content">
				<slot />
			</div>
		</AccordionItem>
	</Accordion>
</div>

<style lang="scss">
	.accordion {
        margin-bottom: 1rem;
		background-color: #fff;
		:global(.bx--accordion__item:last-child) {
			border-top: none;
		}
		:global(.bx--accordion__item) {
			:global(.bx--accordion__arrow) {
				-webkit-transform: rotate(0deg);
				transform: rotate(0deg);
			}
		}
		:global(.bx--accordion__item--active) {
			:global(.bx--accordion__arrow) {
				-webkit-transform: rotate(90deg);
				transform: rotate(90deg);
			}
			:global(.bx--accordion__content) {
				padding-right: 1em;
			}
		}

		:global(.bx--accordion__heading) {
			padding: 1rem 0;
			position: relative;
			&:after {
				content: '';
				position: absolute;
				width: 100%;
				height: 1.6px;
				background-color: #8d8d8d;
				left: 0;
				bottom: 0;

				// border-bottom: 1.6px solid #8D8D8D;
			}
		}
	}
</style>
