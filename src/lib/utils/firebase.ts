import { browser } from '$app/env';
import { firebaseConfig } from '$lib/utils/_env';
import { getApps, initializeApp } from 'firebase/app';
if (browser && !getApps().length) {
	initializeApp(firebaseConfig);
}
