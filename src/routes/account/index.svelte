<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import {
		SideNav,
		SideNavItems,
		SideNavLink,
		Content,
		Grid,
		Row,
		Column,
		Button,
		Link
	} from 'carbon-components-svelte';
	import { authStore } from '$lib/store/auth';
	import IconHome1 from '$lib/components/icons/IconHome1.svelte';
	import IconHome2 from '$lib/components/icons/IconHome2.svelte';
	import IconHome3 from '$lib/components/icons/IconHome3.svelte';
	import IconHome4 from '$lib/components/icons/IconHome4.svelte';
	import IconHome5 from '$lib/components/icons/IconHome5.svelte';
	import IconHome6 from '$lib/components/icons/IconHome6.svelte';
import { getTripsService } from '$lib/services/trip.services';
import { Trip, TRipInput } from '$lib/store/trip';
import { goto } from '$app/navigation';

	const openEnquiries = async () => {
		let enquiry: Trip | undefined;
		await getTripsService(new TRipInput({state: 'enquired'})).then((output)=>{
			if(output.length > 0){
				enquiry = output[0];
			}
		});
		if(enquiry){
			goto(`/account/trips/enquiry-${enquiry.id}`);
		}else{
			window.openNotification({kind:"warning",title: "Warning", subtitle: "There is no enquiry"});
		}
	};
</script>

<SideNav isOpen={false}>
	<SideNavItems>
		<SideNavLink text="Coming soon" />
		<SideNavLink text="..." />
		<SideNavLink text="..." />
	</SideNavItems>
</SideNav>

<Content>
	<div class="content-header">
		<Grid>
			<Row>
				<Column>
					<h1 class="pt-0">Hello {$authStore.user?.email || ''}</h1>
				</Column>
				<Column class="text-right">
					<Button kind="secondary" class="pl-30 pr-30" href="/account/trips/trip-detail">Create New Trip</Button>
					<Button kind="primary" class="pl-30 pr-30" href="/account/messages">Messages (0)</Button>
				</Column>
			</Row>
		</Grid>
	</div>
	<section class="boxes">
		<Grid class="boxes--list">
			<Row>
				<Column class="boxes--item" lg={5} md={6}>
					<Link href="/account/trips">
						<div class="boxes--item-content">
							<h3 class="boxes--item-title">Trips</h3>
							<IconHome1 class="boxes--item-icon" width="91" height="91" />
						</div>
					</Link>
				</Column>
				<Column class="boxes--item" lg={5} md={6}>
					<Link href="/account/travelers">
						<div class="boxes--item-content">
							<h3 class="boxes--item-title">Travelers</h3>
							<IconHome2 class="boxes--item-icon" width="91" height="91" />
						</div>
					</Link>
				</Column>
				<Column class="boxes--item" lg={5} md={6}>
					<Link href="javascript:void(0)" on:click={openEnquiries}>
						<div class="boxes--item-content">
							<h3 class="boxes--item-title">Enquiries</h3>
							<IconHome3 class="boxes--item-icon" width="91" height="91" />
						</div>
					</Link>
				</Column>
				<Column class="boxes--item" lg={5} md={6}>
					<Link href="#">
						<div class="boxes--item-content">
							<h3 class="boxes--item-title">O-Connect</h3>
							<IconHome4 class="boxes--item-icon" width="91" height="91" />
						</div>
					</Link>
				</Column>
				<Column class="boxes--item" lg={5} md={6}>
					<Link href="#">
						<div class="boxes--item-content">
							<h3 class="boxes--item-title">Dashboard</h3>
							<IconHome5 class="boxes--item-icon" width="91" height="91" />
						</div>
					</Link>
				</Column>
				<Column class="boxes--item" lg={5} md={6}>
					<Link href="#">
						<div class="boxes--item-content">
							<h3 class="boxes--item-title">Documents</h3>
							<IconHome6 class="boxes--item-icon" width="91" height="91" />
						</div>
					</Link>
				</Column>
			</Row>
		</Grid>
	</section>
</Content>

<style lang="scss">
	.content-header{
		background: rgb(231,239,255);
		background: linear-gradient(90deg, rgba(231,239,255,1) 0%, rgba(15,97,253,1) 100%);
		padding-top: 80px;
		padding-bottom: 150px;
		margin-left: calc(-100vw / 2 + (100vw - 8rem) / 2);
    	margin-right: calc(-100vw / 2 + (100vw - 8rem) / 2);
		margin-top: -4rem;
		margin-bottom: 2rem;
		box-shadow: 0 10px 10px -5px rgba(0,0,0,.16);
		:global(.bx--btn--primary){
			font-weight: bold;
			background-color: #fff;
			border-color: #fff;
			color: #000;
			&:hover{
				background-color: var(--cds-interactive-01);
				border-color: var(--cds-interactive-01);
				color: #fff;
				font-weight: normal;
			}
		}
	}
	.boxes {
		padding: 0 8rem;
		:global(.bx--link) {
			display: block;
			color: #000;
			&:hover {
				text-decoration: none;
				color: var(--cds-interactive-01);
			}
		}
		:global(.boxes--item) {
			padding-bottom: 2rem;
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
