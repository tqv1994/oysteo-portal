<script lang="ts">
	import { authStore } from '$lib/store/auth';
	import {
		Header,
		HeaderAction,
		HeaderNav,
		HeaderNavItem,
		HeaderPanelLink,
		HeaderPanelLinks,
		HeaderUtilities,
		Link,
		SideNav,
		SideNavItems,
		SideNavLink,
		SkipToContent
	} from 'carbon-components-svelte';
	import OysteoLogo from '$lib/components/icons/OysteoLogo.svelte';
	import { page } from '$app/stores';
	import { User20 } from 'carbon-icons-svelte';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { goto } from '$app/navigation';
	import { openWarningSaveForm } from '../form/PopupWarningSaveForm.svelte';

	let isToolbarOpen = false;
	let isSideNavOpen = false;

	const hideSideNav = () => {
		isSideNavOpen = false;
		if (!$formChangeStatusStore.changing) {
			return goto('/account/agency');
		} else {
			openWarningSaveForm({ handleConfirm: gotoAgency });
		}
	};

	const gotoAdvisor = () => {
		isSideNavOpen = false;
		if (!$formChangeStatusStore.changing) {
			return goto('/account/advisor');
		} else {
			openWarningSaveForm({ handleConfirm: gotoAdvisor });
		}
	};

	const gotoAccount = () => {
		if (!$formChangeStatusStore.changing) {
			goto('/account');
		} else {
			openWarningSaveForm({ handleConfirm: gotoAccount });
		}
	};

	const gotoLogout = () => {
		if (!$formChangeStatusStore.changing) {
			return goto('/account/sign-out');
			isSideNavOpen = false;
		} else {
			openWarningSaveForm({ handleConfirm: gotoLogout });
		}
	};
</script>

<Header
	bind:isSideNavOpen
	persistentHamburgerMenu={true}
	class={isSideNavOpen ? 'header-dark' : ''}
>
	<div id="logo" class="logo">
		<Link href="/">
			<OysteoLogo width={130} height={17.217} />
		</Link>
	</div>
	<div slot="skip-to-content">
		<SkipToContent />
	</div>

	<HeaderNav>
		<HeaderNavItem href="#" text="My OYSTEO" on:click={gotoAccount} />
		<HeaderNavItem
			isSelected={$page.url.pathname === '/account/advisor'}
			text="Advisor"
			href="/account/advisor"
		/>
		{#if $authStore.user?.agencyMe}
			<HeaderNavItem
				isSelected={$page.url.pathname === '/account/agency'}
				text="Agency"
				href="/account/agency"
			/>
		{/if}
	</HeaderNav>
	<HeaderUtilities>
		<HeaderAction
			bind:isOpen={isToolbarOpen}
			icon={User20}
			transition={{ duration: 200 }}
			class="ultilities-logout"
		>
			<HeaderPanelLinks>
				<p id="account-name">{$authStore.user?.email || ''}</p>
				<HeaderPanelLink class="btn-logout" href="/account/sign-out">Sign out</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav isOpen={isSideNavOpen} id="main-sidebar">
	<SideNavItems>
		<SideNavLink text="My OYSTEO" href="#" on:click={gotoAccount} />
		<SideNavLink
			text="Advisor"
			isSelected={$page.url.pathname === '/account/advisor'}
			href="/account/advisor"
			on:click={hideSideNav}
		/>
		{#if $authStore.user?.agencyMe}
			<SideNavLink
				text="Agency"
				isSelected={$page.url.pathname === '/account/agency'}
				href="/account/agency"
				on:click={hideSideNav}
			/>
		{/if}
	</SideNavItems>
</SideNav>

<style lang="scss">
	@use '../../../styles/grid';
	
	@media screen and (min-width: 1056px) {
		.page-container {
			max-width: 100%;
			width: calc(100% - 16%);
			margin: auto;
		}
		.boxes {
			padding: 0 8rem;
		}
	}
	.boxes {
		:global(.bx--link) {
			display: block;
			color: #000;
			&:hover {
				text-decoration: none;
				color: var(--cds-interactive-01);
			}
		}
		.boxes--item-content {
			background-color: #fff;
			padding: 50px 15px 30px;
			.boxes--item-title {
				padding-bottom: 130px;
			}
		}
	}
</style>
