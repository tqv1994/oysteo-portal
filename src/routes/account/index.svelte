<script>
	import 'carbon-components-svelte/css/all.css';
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		Content,
		Grid,
		Row,
		Column,
		Button
	} from 'carbon-components-svelte';
</script>

<SideNav isOpen={false}>
	<SideNavItems>
		<SideNavLink text="Coming soon" />
		<SideNavLink text="..." />
		<SideNavLink text="..." />
	</SideNavItems>
</SideNav>

<Content>
	<Grid>
		<Row>
			<Column>
				<h1>My Oysteo</h1>
				<p>Coming soon</p>
			</Column>
		</Row>
	</Grid>
</Content>
