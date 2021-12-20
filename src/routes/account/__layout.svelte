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
	import { afterUpdate, beforeUpdate, onDestroy, onMount } from 'svelte';
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
	import PopupWarningSaveForm from '$lib/components/form/PopupWarningSaveForm.svelte';
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
import { goto } from '$app/navigation';
	let isSideNavOpen = false;
	let isOpen = false;
	let selected = '0';
	export let navSelected: string;
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

	const onLoad = () => {
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
						if (sectionEl.id == sectionActive.id) {
							keyActive = key;
							heightOfSections += sectionEl.clientHeight;
						} else if (keyActive !== null && key > keyActive) {
							heightOfSections += sectionEl.clientHeight;
						}
					});
					if (heightOfSections < screen.height) {
						divFakeHeight.style.height = screen.height - heightOfSections + marginTop + 'px';
					} else {
						divFakeHeight.style.height = '0';
					}
					window.scrollTo(0, getOffset(sectionActive).top - marginTop);
				});
				return false;
			});
			// The event handler after clicking the edit button will be on top to the section
			contentEl.querySelectorAll('.section .btn-edit').forEach((btnEl, key) => {
				btnEl.addEventListener('click', (e: PointerEvent) => {
					if ($formChangeStatusStore.changing === false) {
						if (e.path && Array.isArray(e.path)) {
							const sectionCurrent = e.path.reduce((acc: Element, item: Element) => {
								if (item.classList && item.classList.contains('section')) {
									acc = item;
								}
								return acc;
							}, null);
							desktopNavSectionEl.querySelectorAll('a').forEach((element) => {
								if (element.getAttribute('href') == `#${sectionCurrent.id}`) {
									element.click();
								}
							});
						}
					}
				});
			});
		}
	};

	const onScroll = () => {
		const marginTop = 60;
		const doc = document.documentElement;
		const desktopNavSectionEl = document.getElementById('desktop-nav-section');
		const contentEl = document.querySelector('.content');
		if (desktopNavSectionEl) {
			let scrollDistance: number = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
			contentEl.querySelectorAll('.section').forEach((sectionEl, key) => {
				if (getOffset(sectionEl).top - marginTop <= scrollDistance) {
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

	afterUpdate(onLoad);

	const gotoAgency = () => {
		if(!$formChangeStatusStore.changing){
			goto('/account/agency');
			isSideNavOpen = false;
		}else{
			window.openWarningSaveForm({handleConfirm: gotoAgency});
		}
		
	}

	const gotoAdvisor = () => {
		if(!$formChangeStatusStore.changing){
			goto('/account/advisor');
			isSideNavOpen = false;
		}else{
			window.openWarningSaveForm({handleConfirm: gotoAdvisor});
		}
	}

	const gotoAccount = () => {
		if(!$formChangeStatusStore.changing){
			goto('/account/agency');
			isSideNavOpen = false;
		}else{
			window.openWarningSaveForm({handleConfirm: gotoAdvisor});
		}
	}

	const gotoLogout = () => {
		if(!$formChangeStatusStore.changing){
			goto('/account/logout');
			isSideNavOpen = false;
		}else{
			window.openWarningSaveForm({handleConfirm: gotoLogout});
		}
	}
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
		<HeaderNavItem href="#" text="My Oysteo" on:click={gotoAccount}/>
		<HeaderNavItem isSelected={navSelected == 'advisor'} href="#" text="Advisor" on:click={() => {gotoAdvisor()}}/>
		<HeaderNavItem isSelected={navSelected == 'agency'} href="#" text="Agency" on:click={() => {gotoAgency()}}/>
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
				<HeaderPanelLink class="btn-logout" href="#" on:click={gotoLogout}>Logout</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav isOpen={isSideNavOpen} id="main-sidebar">
	<SideNavItems>
		<SideNavLink text="My Oysteo" href="#" on:click={gotoAccount} />
		<SideNavLink
			text="Advisors"
			href="#"
			isSelected={navSelected == 'advisor'}
			on:click={() => {gotoAdvisor()}}
		/>
		<SideNavLink
			text="Agency"
			href="#"
			isSelected={navSelected == 'agency'}
			on:click={() => {gotoAgency()}}
		/>
	</SideNavItems>
</SideNav>

<Content>
	<slot {isSideNavOpen} />
</Content>
<PopupWarningSaveForm />

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
