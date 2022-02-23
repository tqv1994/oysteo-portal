import preprocess from 'svelte-preprocess';
import { optimizeImports } from 'carbon-preprocess-svelte';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').PrerenderErrorHandler} */
const handleError = ({ status, path, referrer, referenceType }) => {
	// if (path.startsWith('/blog')) throw new Error('Missing a blog page!');
	console.warn(
		`Render error: ${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`
	);
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess(), optimizeImports()],

	kit: {
		adapter: vercel(),
	},
	prerender: {
		onError: handleError
	}
};

export default config;
