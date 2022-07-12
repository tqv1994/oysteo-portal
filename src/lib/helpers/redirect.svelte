<script lang="ts" context="module">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	export function redirect(
		pathname: string,
		search?: string | Record<string, string> | string[][] | URLSearchParams
	): {} | { status: number; redirect: string } {
		let searchString = '';
		if (search) {
			searchString = '?' + new URLSearchParams(search);
		}
		const path = pathname + searchString;
		if (browser) {
			goto(path);
			return {};
		} else {
			return {
				status: 302,
				redirect: path
			};
		}
	}
</script>
