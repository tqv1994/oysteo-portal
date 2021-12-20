<script lang="ts" context="module">
	import {
		Header,
		SkipToContent,
		HeaderNav,
		HeaderNavItem,
		HeaderUtilities,
		HeaderPanelLinks,
		HeaderPanelLink,
		HeaderAction,
		SideNav,
		SideNavItems,
		SideNavLink,
		Content
	} from 'carbon-components-svelte';
	import { User20 } from 'carbon-icons-svelte';
	import { expoIn } from 'svelte/easing';
	import { authStore } from '$lib/store/auth';
	import { onMount } from 'svelte';
	import type { Load } from '@sveltejs/kit';
	import type { Locals } from '$lib/store/local';
	export const load: Load<{ session: Locals }> = async ({ session, page }) => {
		return {
			props: {
				navSelected: page.path.startsWith('/account/agency')
					? 'agency'
					: page.path.startsWith('/account/advisor')
					? 'advisor'
					: ''
			}
		};
	};
</script>

<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	let isSideNavOpen = false;
	let isOpen = false;
	let selected = '0';
	export let navSelected: string;
	console.log(navSelected);
	let transitions = {
		'0': {
			text: 'Default (duration: 200ms)',
			value: { duration: 200 }
		},
		'1': {
			text: 'Custom (duration: 600ms, delay: 50ms, easing: expoIn)',
			value: { duration: 600, delay: 50, easing: expoIn }
		},
		'2': {
			text: 'Disabled',
			value: false
		}
	};

	onMount(() => {
		const marginTop = 60;
		const desktopNavSectionEl = document.getElementById('desktop-nav-section');
		const contentEl = document.querySelector('.content');
		const divFakeHeight = document.getElementById('fake-height');
		if (desktopNavSectionEl && contentEl && divFakeHeight) {
			desktopNavSectionEl.querySelectorAll('a').forEach((element) => {
				element.addEventListener('click', (e) => {
					e.preventDefault();
					const target = element.getAttribute('href');
					// Handling when the height of the screen is not enough, can't scroll to the position of the last sections
					let heightOfSections = 0;
					let keyActive = null;
					const sectionActive = contentEl.querySelector(target);
					contentEl.querySelectorAll('.section').forEach((sectionEl, key) => {
						if(sectionEl.id == sectionActive.id){
							keyActive = key;
							heightOfSections += sectionEl.clientHeight;
						}else if(keyActive !== null && key > keyActive){
							heightOfSections += sectionEl.clientHeight;
						}
					});
					if(heightOfSections < screen.height){
						divFakeHeight.style.height = (screen.height - heightOfSections + marginTop)+"px";
					}else{
						divFakeHeight.style.height = "0";
					}
					window.scrollTo(0, getOffset(sectionActive).top - marginTop);
				});
				return false;
			});
		}
	});

	const onScroll = () => {
		const marginTop = 60;
		const doc = document.documentElement;
		const desktopNavSectionEl = document.getElementById('desktop-nav-section');
		const contentEl = document.querySelector('.content');
		if (desktopNavSectionEl) {
			let scrollDistance: number = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
			contentEl.querySelectorAll('.section').forEach((sectionEl, key) => {
				if ((getOffset(sectionEl).top - marginTop) <= scrollDistance) {
					desktopNavSectionEl.querySelectorAll('li.active').forEach((activeEl) => {
						activeEl.classList.remove('active');
					});
					if (desktopNavSectionEl.querySelectorAll('li')[key]) {
						desktopNavSectionEl.querySelectorAll('li')[key].classList.add('active');
					}
				}
			});
		}
	};

	const getOffset = (el: Element) => {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.scrollX,
			top: rect.top + window.scrollY
		};
	};
</script>

<svelte:window on:scroll={onScroll} />
<Header
	bind:isSideNavOpen
	persistentHamburgerMenu={true}
	class={isSideNavOpen ? 'header-dark' : ''}
>
	<div id="logo">
		<svg xmlns="http://www.w3.org/2000/svg" width="92" height="21" viewBox="0 0 92 21">
			<text
				id="OYSTEO"
				transform="translate(0 17)"
				font-size="18"
				font-family="GurmukhiMN, Gurmukhi MN"
				letter-spacing="0.2em"><tspan x="0" y="0">OYSTEO</tspan></text
			>
		</svg>
	</div>
	<div slot="skip-to-content">
		<SkipToContent />
	</div>

	<HeaderNav>
		<HeaderNavItem href="/account" text="My Oysteo" />
		<HeaderNavItem isSelected={navSelected == 'advisor'} href="/account/advisor" text="Advisor" />
		<HeaderNavItem isSelected={navSelected == 'agency'} href="/account/agency" text="Agency" />
	</HeaderNav>
	<HeaderUtilities>
		<HeaderAction
			bind:isOpen
			icon={User20}
			transition={transitions[selected].value}
			class="ultilities-logout"
		>
			<HeaderPanelLinks>
				<p id="account-name">{$authStore.user?.email || ''}</p>
				<HeaderPanelLink class="btn-logout" href="/account/logout">Logout</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav isOpen={isSideNavOpen} id="main-sidebar">
	<SideNavItems>
		<SideNavLink text="My Oysteo" href="/account" on:click={() => (isSideNavOpen = false)} />
		<SideNavLink
			text="Advisors"
			href="/account/advisor"
			isSelected={navSelected == 'advisor'}
			on:click={() => (isSideNavOpen = false)}
		/>
		<SideNavLink
			text="Agency"
			href="/account/agency"
			isSelected={navSelected == 'agency'}
			on:click={() => (isSideNavOpen = false)}
		/>
	</SideNavItems>
</SideNav>

<Content>
	<slot {isSideNavOpen} />
</Content>

<style lang="scss">
	:global(#main-sidebar) {
		z-index: 9999;
	}
	@media (max-width: 1056px) {
		:global(.bx--side-nav ~ .bx--content) {
			margin-left: 0;
			padding-left: 1rem;
			padding-right: 1rem;
		}
	}
	:global(header) {
		:global(.btn-logout.btn-logout:hover) {
			color: rgba(255, 255, 255, 0.7);
		}
	}
</style>
