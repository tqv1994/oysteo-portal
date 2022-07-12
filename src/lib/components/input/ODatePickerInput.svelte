<script lang="ts">
	import { DatePickerInput } from 'carbon-components-svelte';
	export let placeholder: string = 'mm/dd/yyyy';
	export let value: string | Date = '';
	export let name: string | undefined = undefined;
	const formatInputValue = (value, event: any) => {
		let newValue = value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
		const dayOrMonth = (index) => index % 2 === 1 && index < 4;
		// on delete key.
		if (!event.data) {
			if (value == '') {
				return null;
			}
			return value;
		} else {
			value = newValue
				.split('')
				.map((v, i) => (dayOrMonth(i) ? v + '/' : v))
				.join('');
			return value;
		}
	};
</script>

<DatePickerInput
	on:blur
	on:input
	on:keydown
	on:keyup
	on:input={(event) => {
		setTimeout(() => {
			event.target.value = formatInputValue(event.target.value, event);
			if (!event.target.value) {
				value = null;
			}
		}, 100);
	}}
	on:blur={(event) => {
		setTimeout(() => {
			if (!event.target.value) {
				value = null;
			}
		}, 100);
	}}
	{name}
	placeholder="mm/dd/yyyy"
/>
