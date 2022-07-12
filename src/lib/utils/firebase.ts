import { browser } from '$app/env';
import { firebaseConfig } from '$lib/env';
import { getApps, initializeApp } from 'firebase/app';
if (browser && !getApps().length) {
	initializeApp(firebaseConfig);
}
