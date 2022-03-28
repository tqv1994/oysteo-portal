<script lang="ts">
	import { DatePickerInput } from 'carbon-components-svelte';
	export let placeholder: string = 'mm/dd/yyyy';
	const formatInputValue = (value, event: any) => {
		let newValue = value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1');
		const dayOrMonth = (index) => index % 2 === 1 && index < 4;
		// on delete key.
		if (!event.data) {
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
		event.target.value = formatInputValue(event.target.value, event);
	}}
	placeholder="mm/dd/yyyy"
/>
