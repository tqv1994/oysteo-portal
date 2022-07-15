<script lang="ts">
	import { session } from '$app/stores';
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
	import { User as UserIcon } from 'carbon-icons-svelte';
	import { beforeNavigate } from '$app/navigation';
	import { disableMyOysteo } from '$lib/env';

	let isToolbarOpen = false;
	let isSideNavOpen = false;

	beforeNavigate(({ cancel }) => {
		isSideNavOpen = false;
		isToolbarOpen = false;
	});
</script>

<Header
	bind:isSideNavOpen
	persistentHamburgerMenu={true}
	class={isSideNavOpen ? 'header-dark' : ''}
>
	<div id="logo" class="logo">
		<Link href="/profile">
			<OysteoLogo width={130} height={17.217} />
		</Link>
	</div>
	<div slot="skip-to-content">
		<SkipToContent />
	</div>

	<HeaderNav>
		{#if !disableMyOysteo}
			<HeaderNavItem href="/profile" text="My OYSTEO" />
		{/if}
		<HeaderNavItem
			isSelected={$page.url.pathname === '/profile/advisor'}
			text="Advisor"
			href="/profile/advisor"
		/>
		{#if $session.agencyMe}
			<HeaderNavItem
				isSelected={$page.url.pathname === '/profile/agency'}
				text="Agency"
				href="/profile/agency"
			/>
		{/if}
	</HeaderNav>
	<HeaderUtilities>
		<HeaderAction
			bind:isOpen={isToolbarOpen}
			icon={UserIcon}
			transition={{ duration: 200 }}
			class="ultilities-logout"
		>
			<p id="account-name">{$session.user?.email || ''}</p>
			<HeaderPanelLinks>
				<HeaderPanelLink class="btn-logout" href="/auth/sign-out">Sign out</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav isOpen={isSideNavOpen} id="main-sidebar">
	<SideNavItems>
		{#if !disableMyOysteo}
			<SideNavLink text="My OYSTEO" href="/profile" />
		{/if}
		<SideNavLink
			text="Advisor"
			isSelected={$page.url.pathname === '/profile/advisor'}
			href="/profile/advisor"
		/>
		{#if $session.agencyMe}
			<SideNavLink
				text="Agency"
				isSelected={$page.url.pathname === '/profile/agency'}
				href="/profile/agency"
			/>
		{/if}
	</SideNavItems>
</SideNav>

<style lang="scss">
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
