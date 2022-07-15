export const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG as string);
export const cmsUrlPrefix = import.meta.env.VITE_API_PREFIX as string;
export const contactEmail = (import.meta.env?.VITE_CONTACT_EMAIL as string) || 'hello@oysteo.com';
export const sentryDsn = (import.meta.env?.VITE_SENTRY_DSN as string) || '';
export const meilisearchUrl = import.meta.env.VITE_MEILISEARCH_URL as string;
export const meilisearchPublicApiKey = import.meta.env.VITE_MEILISEARCH_PUBLIC_API_KEY as string;
export const meilisearchAdminApiKey = import.meta.env.VITE_MEILISEARCH_ADMIN_API_KEY as string;
export const disableMyOysteo =
	((import.meta.env.VITE_DISABLE_MY_OYSTEO as string) || '').trim().toLocaleLowerCase() === 'true';
