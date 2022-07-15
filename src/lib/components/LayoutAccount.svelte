<script lang="ts">
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
	import PopupWarningSaveForm from '$lib/components/form/PopupWarningSaveForm.svelte';
	import { expoIn } from 'svelte/easing';
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { goto } from '$app/navigation';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';
	import { User as UserIcon } from 'carbon-icons-svelte';
	import { session } from '$app/stores';
	import { afterUpdate } from 'svelte';
	import { disableMyOysteo } from '$lib/env';

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
				element.addEventListener('click', () => {
					const target = element.getAttribute('href');

					if (target.indexOf('#') > -1) {
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
					}
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
								if (
									element.getAttribute('href') == `#${sectionCurrent.id}` &&
									`#${sectionCurrent.id}` != '#documents'
								) {
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
		const marginTop = 50;
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

	// afterUpdate(onLoad);

	const gotoAgency = () => {
		formChangeStatusStore.subscribe((s) => {
			s.changing = false;
		});
		goto('/profile/agency');
		isSideNavOpen = false;

		// if (!$formChangeStatusStore.changing) {
		// 	goto('/profile/agency');
		// 	isSideNavOpen = false;
		// } else {
		// 	openWarningSaveForm({ handleConfirm: gotoAgency });
		// }
	};

	const gotoAdvisor = () => {
		formChangeStatusStore.subscribe((s) => {
			s.changing = false;
		});
		if (!$formChangeStatusStore.changing) {
			goto('/profile/advisor');
			isSideNavOpen = false;
		} else {
			// openWarningSaveForm({ handleConfirm: gotoAdvisor });
		}
	};

	const gotoAccount = () => {
		formChangeStatusStore.subscribe((s) => {
			s.changing = false;
		});
		goto('/');
		isSideNavOpen = false;
		// if (!$formChangeStatusStore.changing) {
		// 	goto('/');
		// 	isSideNavOpen = false;
		// } else {
		// 	openWarningSaveForm({ handleConfirm: gotoAccount });
		// }
	};

	const gotoLogout = () => {
		formChangeStatusStore.subscribe((s) => {
			s.changing = false;
		});
		goto('/auth/sign-out');
		isSideNavOpen = false;
		// if (!$formChangeStatusStore.changing) {
		// 	goto('/logout');
		// 	isSideNavOpen = false;
		// } else {
		// 	openWarningSaveForm({ handleConfirm: gotoLogout });
		// }
	};
</script>

<!-- <svelte:window on:scroll={onScroll} /> -->
<Header
	bind:isSideNavOpen
	persistentHamburgerMenu={true}
	class={isSideNavOpen ? 'header-dark' : ''}
>
	<div id="logo" class="logo">
		<OysteoLogo width={130} height={17.217} />
	</div>
	<div slot="skip-to-content">
		<SkipToContent />
	</div>

	<HeaderNav>
		{#if !disableMyOysteo}
			<HeaderNavItem href="/profile" text="My OYSTEO" on:click={gotoAccount} />
		{/if}
		<HeaderNavItem
			isSelected={navSelected == 'advisor'}
			href="#"
			text="Advisor"
			on:click={() => {
				gotoAdvisor();
			}}
		/>
		{#if $session.agencyMe}
			<HeaderNavItem
				isSelected={navSelected == 'agency'}
				href="#"
				text="Agency"
				on:click={() => {
					gotoAgency();
				}}
			/>
		{:else}
			<HeaderNavItem class="disable-agency" href="#" text="Agency" />
		{/if}
	</HeaderNav>
	<HeaderUtilities>
		<HeaderAction
			bind:isOpen
			icon={UserIcon}
			transition={transitions[selected].value}
			class="ultilities-logout"
		>
			<HeaderPanelLinks>
				<p id="account-name">{$session.user?.email || ''}</p>
				<HeaderPanelLink class="btn-logout" href="#" on:click={gotoLogout}>Sign out</HeaderPanelLink
				>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav isOpen={isSideNavOpen} id="main-sidebar">
	<SideNavItems>
		{#if !disableMyOysteo}
			<SideNavLink text="My OYSTEO" href="#" on:click={gotoAccount} />
		{/if}
		<SideNavLink
			text="Advisor"
			href="#"
			isSelected={navSelected == 'advisor'}
			on:click={() => {
				gotoAdvisor();
			}}
		/>
		{#if $session.agencyMe}
			<SideNavLink
				text="Agency"
				href="#"
				isSelected={navSelected == 'agency'}
				on:click={() => {
					gotoAgency();
				}}
			/>
		{/if}
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
