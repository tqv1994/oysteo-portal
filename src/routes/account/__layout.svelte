<script lang="ts" context="module">
	import 'carbon-components-svelte/css/all.css';
	import '$lib/utils/firebase';
	import { Content } from 'carbon-components-svelte';
	import OHeader from '$lib/components/navigation/OHeader.svelte';
	import type { Load } from '@sveltejs/kit';
	import { get } from 'svelte/store';
	import { authStore } from '$lib/store/auth';
	import { afterUpdate } from 'svelte';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { redirect } from '$lib/helpers/redirect.svelte';

	export const load: Load = async () => {
		const { user } = get(authStore);
		if (!user) {
			return redirect('/auth/sign-in');
		}
		return {};
	};
</script>

<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { globalState } from '$lib/store/state';
	import { notify } from '$lib/components/Toast.svelte';

	beforeNavigate(({ cancel }) => {
		const anchor = get(globalState).editingAnchor;
		if (anchor) {
			notify({
				title: 'Unsaved changes',
				subtitle: 'You must cancel the changes to navigate away from this page',
				timeout: 3000
			});
			document.querySelector(anchor).scrollIntoView({
				behavior: 'smooth'
			});
			cancel();
		}
	});

	const onLoad = () => {
		const marginTop = 60;
		const desktopNavSectionEl = document.getElementById('desktop-nav-section');
		const contentEl = document.querySelector('.content');
		const divFakeHeight = document.getElementById('fake-height');
		if (desktopNavSectionEl && contentEl && divFakeHeight) {
			desktopNavSectionEl.querySelectorAll('a').forEach((element) => {
				element.addEventListener('click', () => {
					console.log('clickky');
					const target = element.getAttribute('href');

					if (target.indexOf('#') > -1) {
						// Handling when the height of the screen is not enough, can't scroll to the position of the last sections
						let heightOfSections = 0;
						let keyActive = null;
						const sectionActive = contentEl.querySelector(target);
						contentEl.querySelectorAll('.section').forEach((sectionEl, key) => {
							if (sectionEl.id == sectionActive.id) {
								keyActive = key;
								heightOfSections += sectionEl.clientHeight;
							} else if (keyActive !== null && key > keyActive) {
								heightOfSections += sectionEl.clientHeight;
							}
						});
						if (heightOfSections < screen.height) {
							divFakeHeight.style.height = screen.height - heightOfSections + marginTop + 'px';
						} else {
							divFakeHeight.style.height = '0';
						}
					}
				});
				return false;
			});
			// The event handler after clicking the edit button will be on top to the section
			contentEl.querySelectorAll('.section .btn-edit').forEach((btnEl, key) => {
				btnEl.addEventListener('click', (e: PointerEvent) => {
					if ($formChangeStatusStore.changing === false) {
						if (e.path && Array.isArray(e.path)) {
							const sectionCurrent = e.path.reduce((acc: Element, item: Element) => {
								if (item.classList && item.classList.contains('section')) {
									acc = item;
								}
								return acc;
							}, null);
							desktopNavSectionEl.querySelectorAll('a').forEach((element) => {
								if (
									element.getAttribute('href') == `#${sectionCurrent.id}` &&
									`#${sectionCurrent.id}` != '#documents'
								) {
									element.click();
								}
							});
						}
					}
				});
			});
		}
	};

	const onScroll = () => {
		const marginTop = 50;
		const doc = document.documentElement;
		const desktopNavSectionEl = document.getElementById('desktop-nav-section');
		const contentEl = document.querySelector('.content');

		if (desktopNavSectionEl) {
			let scrollDistance: number = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

			contentEl.querySelectorAll('.section').forEach((sectionEl, key) => {
				if (getOffset(sectionEl).top - marginTop <= scrollDistance) {
					desktopNavSectionEl.querySelectorAll('li.active').forEach((activeEl) => {
						activeEl.classList.remove('active');
					});
					if (desktopNavSectionEl.querySelectorAll('li')[key]) {
						desktopNavSectionEl.querySelectorAll('li')[key].classList.add('active');
					}
				}
			});
		}
	};

	const getOffset = (el: Element) => {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.scrollX,
			top: rect.top + window.scrollY
		};
	};

	afterUpdate(onLoad);
</script>

<svelte:window on:scroll={onScroll} />
<OHeader />
<Content>
	<slot />
</Content>
