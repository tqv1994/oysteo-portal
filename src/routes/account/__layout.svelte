<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
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

	let isSideNavOpen = false;
	let isOpen = false;
	let selected = '0';

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

	onMount(()=>{
		const desktopNavSectionEl = document.getElementById('desktop-nav-section');
		const contentEl = document.querySelector('.content');
		if(desktopNavSectionEl && contentEl){
			desktopNavSectionEl.querySelectorAll('a').forEach((element)=>{
				element.addEventListener("click",(e)=>{
					e.preventDefault();
					const target = element.getAttribute("href");
					window.scrollTo(0,getOffset(contentEl.querySelector(target)).top);
				});
				return false;
			});
		}
	});

	const onScroll = () =>{
		const doc = document.documentElement;
		const desktopNavSectionEl = document.getElementById('desktop-nav-section');
		const contentEl = document.querySelector('.content');
		if(desktopNavSectionEl){
			let scrollDistance: number = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
			contentEl.querySelectorAll('.section').forEach((sectionEl, key)=>{
				if(getOffset(sectionEl).top <= scrollDistance){
					desktopNavSectionEl.querySelectorAll('li.active').forEach(activeEl=>{
						activeEl.classList.remove("active");
					});
					if(desktopNavSectionEl.querySelectorAll('li')[key]){
						desktopNavSectionEl.querySelectorAll('li')[key].classList.add("active");
					}
				}
			});

		}
	}

	const getOffset = (el: Element) => {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.scrollX,
			top: rect.top + window.scrollY
		};
	}
</script>
<svelte:window
on:scroll={onScroll}
/>
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
		<HeaderNavItem href="/account/advisor" text="Advisor" />
		<HeaderNavItem href="/account/agency" text="Agency" />
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
		<SideNavLink text="Advisors" href="/account/advisor" on:click={() => (isSideNavOpen = false)} />
		<SideNavLink text="Agency" href="/account/agency" on:click={() => (isSideNavOpen = false)} />
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
