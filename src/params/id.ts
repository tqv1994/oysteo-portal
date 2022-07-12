/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param: string) {
	return param === 'new' || /^\d+$/.test(param);
}
