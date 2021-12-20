<script lang="ts">
	import type { Address, AddressInput } from '$lib/store/address';
	import type { Country, Country } from '$lib/store/country';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';
	import { onDestroy } from 'svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	export let userId: string;
	export let objectId: string;
	export let type: string;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	export let address: Address[];
	export let countries: Country[];

	let haveAddress: boolean;
	type AddressInput = {
		line1: string;
		line2: string;
		locality: string;
		zipcode: string;
		country: string | null;
		province: string;
	};

	let addressInput: AddressInput;

	const resetAddresInput = () => {
		addressInput = {
			line1: '',
			line2: '',
			locality: '',
			zipcode: '',
			country: null,
			province: ''
		};
	};

	resetAddresInput();
	onDestroy(() => {
		resetAddresInput();
	});

	const onEdit = (groupName: string) => {
		activeSection = groupName;
		if (address.length == 0) {
			haveAddress = false;
			resetAddresInput();
		} else {
			haveAddress = true;
			addressInput = {
				line1: address[0].line1 || '',
				line2: address[0].line2 || '',
				locality: address[0].locality || '',
				zipcode: address[0].zipcode || '',
				country: address[0].country?.id || null,
				province: address[0].province || ''
			};
		}
	};
	const onCancel = () => {
		activeSection = '';
	};

	const handleDisplay = (field: string) => {
		if (!address || address.length == 0) {
			return '';
		} else if (!address[0][field]) {
			return '';
		} else if (field == 'country') {
			return address[0][field].name;
		}
		return address[0][field];
	};

	const createAddress = async () => {
		activeLoading = true;
		try {
			const res = await fetch(`/address/create.json`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...addressInput })
			});
			if (res.ok) {
				const data = await res.json();
				return data.createAddress.address.id;
			}
		} catch (error) {}
	};

	const updateAddress = async () => {
		try {
			let data: string | AddressInput;
			let url: string = ``;

			if (haveAddress) {
				// true when address created
				url = `/address/update-${address[0].id}.json`;
				data = { ...addressInput };
				activeLoading = true;
			} else {
				data = await createAddress();
				url = `/address/assign-${type}-${objectId}.json`;
			}

			const res = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ data })
			});
			if (res.ok) {
				const data = await res.json();
				if (haveAddress) {
					address[0] = data.updateAddress.address;
				} else {
					if (type == 'agency') {
						address = data.updateAgency.agency.addresses;
					} else if (type == 'advisor') {
						address = data.updateAdvisor.advisor.address;
					}
				}
				resetAddresInput();
				onCancel();
			}
		} catch (error) {}
		activeLoading = false;
	};
</script>

<FormGroup
	let:isEditing
	isEditing={activeSection === 'address'}
	on:edit={() => onEdit('address')}
	on:cancel={onCancel}
	on:submit={updateAddress}
	groupClass={'group group-aboutme'}
>
	<FormRow label="Address" {isEditing} contentClass={'mtop-5'}>
		<div slot="value">
			<p class="advisor-address">
				{handleDisplay('line1')}
			</p>
			<p class="advisor-address">
				{handleDisplay('line2')}
			</p>
			<p class="advisor-address">
				{handleDisplay('locality')}
			</p>
			<p class="advisor-address">
				{handleDisplay('province')}
			</p>
			<p class="advisor-address">
				{handleDisplay('country')}
				{handleDisplay('zipcode')}
			</p>
		</div>
		<div slot="fields">
			<div class="select-container">
				<Select
					on:change={(e) => {
						const countrySelected = countries.filter((ele) => ele.id.toString() == e.detail);
						if (countrySelected.length > 0) {
							addressInput.country = countrySelected[0].id;
						} else {
							addressInput.country = null;
						}
					}}
					labelText="Country"
					selected={address == null || address.length == 0
						? ''
						: address[0].country == null
						? ''
						: address[0].country.id.toString()}
				>
					<SelectItem value="" text="Choose..." />
					{#each countries as country}
						<SelectItem value={country.id.toString()} text={country.name} />
					{/each}
				</Select>

				<TextInput
					labelText="Province / State"
					placeholder="Your province or state ..."
					bind:value={addressInput.province}
				/>
			</div>

			<TextInput
				labelText="Street address #1"
				placeholder="Your street #1..."
				bind:value={addressInput.line1}
			/>
			<TextInput
				labelText="Street address #2"
				placeholder="Your street #2..."
				bind:value={addressInput.line2}
			/>
			<div class="select-container">
				<TextInput
					labelText="Locality"
					placeholder="Your locality..."
					bind:value={addressInput.locality}
				/>
				<TextInput
					labelText="Zip code / Postal code"
					placeholder="Your zip code..."
					bind:value={addressInput.zipcode}
				/>
			</div>
		</div>
	</FormRow>
</FormGroup>
<!-- address -->
