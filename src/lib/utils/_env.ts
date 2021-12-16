export const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG as string);
export const cmsUrlPrefix = import.meta.env.VITE_API_PREFIX as string;
export const graphApiUrl = cmsUrlPrefix + '/graphql';
export const contactEmail = (import.meta.env?.VITE_CONTACT_EMAIL as string) || 'hello@oysteo.com';
export const imageUrlPrefix = cmsUrlPrefix.includes('localhost') ? cmsUrlPrefix : '';
