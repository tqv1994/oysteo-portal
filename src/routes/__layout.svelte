<script lang="ts">
	import 'carbon-components-svelte/css/all.css';
	import Toast from '$lib/components/Toast.svelte';
	import PopupWarningSaveForm from '$lib/components/form/PopupWarningSaveForm.svelte';
	import * as Sentry from '@sentry/browser';
	import { BrowserTracing } from '@sentry/tracing';
	import { sentryDsn } from '$lib/env';
	import { onMount } from 'svelte';
	import '../theme/oysteo.scss';

	onMount(() => {
		if (sentryDsn) {
			Sentry.init({
				dsn: sentryDsn,
				integrations: [new BrowserTracing()],
				tracesSampleRate: 1.0
			});
		}
	});
</script>

<slot />
<Toast />
<PopupWarningSaveForm />
