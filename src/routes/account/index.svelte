<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import '../../theme/oysteo.scss';
	import { Grid, Row, Column, Button, Link } from 'carbon-components-svelte';
	import IconHome1 from '$lib/components/icons/IconHome1.svelte';
	import IconHome2 from '$lib/components/icons/IconHome2.svelte';
	import IconHome3 from '$lib/components/icons/IconHome3.svelte';
	import IconHome4 from '$lib/components/icons/IconHome4.svelte';
	import IconHome5 from '$lib/components/icons/IconHome5.svelte';
	import IconHome6 from '$lib/components/icons/IconHome6.svelte';
	import { Forum32 } from 'carbon-icons-svelte';
	import type { Load } from '@sveltejs/kit';
	import { authStore } from '$lib/store/auth';
	import { get } from 'svelte/store';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async () => {
		const { user } = get(authStore);
		if (user) {
			if (user.agencyMe && !user.agencyMe.legalName) {
				return redirect('/account/agency');
			}
			return {};
		} else {
			return redirect('/register');
		}
	};
</script>

<div class="content-header">
	<div class="page-container">
		<Grid>
			<div class="text-right mobile-message">
				<Link href="/account/messages"><span> 0 </span><Forum32 /></Link>
			</div>
			<Row class="mt-25">
				<Column>
					<h1 class="pt-0">Hello {$authStore.user?.advisorMe?.name || 'there'}</h1>
				</Column>
				<Column class="text-right">
					<Button kind="secondary" class="pl-30 pr-30" href="/account/trips/trip-detail"
						>Create New Trip</Button
					>
					<Button kind="primary" class="pl-30 pr-30 desktop-message" href="/account/messages"
						>Messages (0)</Button
					>
				</Column>
			</Row>
		</Grid>
	</div>
</div>

<div class="page-container">
	<section class="boxes">
		<div class="row">
			<div class="d-col-4 m-col-6">
				<Link href="/account/trips/enquiries">
					<div class="boxes--item-content">
						<h3 class="boxes--item-title">Enquiries</h3>
						<IconHome3 class="boxes--item-icon" width="91" height="91" />
					</div>
				</Link>
			</div>
			<div class="d-col-4 m-col-6">
				<Link href="/account/trips">
					<div class="boxes--item-content">
						<h3 class="boxes--item-title">Trips</h3>
						<IconHome1 class="boxes--item-icon" width="91" height="91" />
					</div>
				</Link>
			</div>
			<div class="d-col-4 m-col-6">
				<Link href="/account/travelers">
					<div class="boxes--item-content">
						<h3 class="boxes--item-title">Travelers</h3>
						<IconHome2 class="boxes--item-icon" width="91" height="91" />
					</div>
				</Link>
			</div>

			<div class="d-col-4 m-col-6">
				<Link href="#">
					<div class="boxes--item-content">
						<h3 class="boxes--item-title">O-Connect</h3>
						<IconHome4 class="boxes--item-icon" width="91" height="91" />
					</div>
				</Link>
			</div>
			<div class="d-col-4 m-col-6">
				<Link href="#">
					<div class="boxes--item-content">
						<h3 class="boxes--item-title">Dashboard</h3>
						<IconHome5 class="boxes--item-icon" width="91" height="91" />
					</div>
				</Link>
			</div>
			<div class="d-col-4 m-col-6">
				<!-- <Link href="#"> -->
				<div class="boxes--item-content">
					<h3 class="boxes--item-title">Documents</h3>
					<IconHome6 class="boxes--item-icon" width="91" height="91" />
				</div>
				<!-- </Link> -->
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	@use '../../styles/grid';
	.content-header {
		background: rgb(231, 239, 255);
		background: linear-gradient(90deg, rgba(231, 239, 255, 1) 0%, rgba(15, 97, 253, 1) 100%);
		padding-top: 55px;
		padding-bottom: 46px;
		margin-left: calc(-100vw / 2 + (100vw - 8rem) / 2);
		margin-right: calc(-100vw / 2 + (100vw - 8rem) / 2);
		margin-top: -4rem;
		margin-bottom: 2rem;
		box-shadow: 0 10px 10px -5px rgba(0, 0, 0, 0.16);
		:global(.bx--btn--primary) {
			font-weight: bold;
			background-color: #fff;
			border-color: #fff;
			color: #000;
			&:hover {
				background-color: var(--cds-interactive-01);
				border-color: var(--cds-interactive-01);
				color: #fff;
				font-weight: normal;
			}
		}
		h1 {
			margin-left: 1rem;
		}
	}
	@media screen and (max-width: 1056px) {
		.content-header {
			padding-left: 3rem;
			padding-right: 3.2rem;
			margin-top: -55px;
			padding-bottom: 15px;
		}
	}
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
