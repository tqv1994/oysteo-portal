<script lang="ts">
	import type { Address } from '$lib/store/address';
	import type { Country } from '$lib/store/country';
	import { Select, SelectItem, TextInput } from 'carbon-components-svelte';

	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	export let userId: string;
	export let objectId: string;
	export let type: string;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	export let address: Address[];
	export let countries: Country[];
	const onEdit = (groupName: string) => {
		activeSection = groupName;
		if (address.length == 0) {
			address = [
				{
					id: null,
					line1: '',
					line2: '',
					locality: '',
					zipcode: '',
					country: null,
					province: '',
					city: null
				}
			];
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
			let createData = {
				line1: address[0].line1,
				line2: address[0].line2,
				province: address[0].province,
				locality: address[0].locality,
				city: address[0].city,
				zipcode: address[0].zipcode,
				country: address[0].country?.id || null,
				users_permissions_user: userId
			};
			const res = await fetch(`/address/create.json`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...createData })
			});
			if (res.ok) {
				const data = await res.json();
				return data.createAddress.address.id;
			}
		} catch (error) {}
	};

	const updateAddress = async () => {
		try {
			let addressData;
			let addressId: string;
			let isAvailable = false;
			if (address[0].id == null) {
				addressId = await createAddress();
			} else {
				isAvailable = true;
				addressData = { ...address[0] };
			}

			let data: string | Address[];
			let url = ``;
			if (isAvailable) {
				url = `/address/update-${addressData.id}.json`;
				delete addressData.users_permissions_user;
				delete addressData.__typename;
				(addressData.country = addressData.country?.id || null), (data = { ...addressData });
				activeLoading = true;
			} else {
				url = `/address/assign-${type}-${objectId}.json`;
				data = addressId;
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
				if (isAvailable) {
					address[0] = data.updateAddress.address;
				} else {
					if (type == 'agency') {
						address = data.updateAgency.agency.addresses;
					} else if (type == 'advisor') {
						address = data.updateAdvisor.advisor.address;
					}
				}
				alert('Update successfully');
				activeSection = '';
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
							address[0].country = {
								id: countrySelected[0].id,
								name: countrySelected[0].name,
								code: countrySelected[0].code,
								phone: countrySelected[0].phone
							};
						} else {
							address[0].country = null;
						}
					}}
					labelText="Country / Region"
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
					placeholder="Enter your province or state ..."
					bind:value={address[0].province}
				/>
			</div>

			<TextInput
				labelText="Street address #1"
				placeholder="Enter your address #1..."
				bind:value={address[0].line1}
			/>
			<TextInput
				labelText="Street address #2"
				placeholder="Enter your address #2..."
				bind:value={address[0].line2}
			/>
			<div class="select-container">
				<TextInput
					labelText="Locality"
					placeholder="Enter your locality..."
					bind:value={address[0].locality}
				/>
				<TextInput
					labelText="Zip code / Postal code"
					placeholder="Enter your zip code..."
					bind:value={address[0].zipcode}
				/>
			</div>
		</div>
	</FormRow>
</FormGroup>
<!-- address -->
