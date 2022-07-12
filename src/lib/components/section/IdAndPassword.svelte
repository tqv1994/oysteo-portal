<script lang="ts">
	import type { User } from '$lib/store/auth';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { ListItem, PasswordInput, TextInput, UnorderedList } from 'carbon-components-svelte';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { isPasswordComplex } from '$lib/helpers/utils';
	import {
		browserSessionPersistence,
		EmailAuthProvider,
		getAuth,
		reauthenticateWithCredential,
		signInWithEmailAndPassword,
		updatePassword
	} from 'firebase/auth';
	import { session } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { notify } from '../Toast.svelte';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { goto } from '$app/navigation';
	import { pauth, ppost } from '$lib/utils/fetch';
	import { clear } from '$lib/store/activeForm';

	export let user: User | undefined;

	type FormData = {
		currentPassword?: string;
		password?: string;
		confirm?: string;
	};

	type FormError = {
		currentPassword?: string;
		password?: string;
		confirm?: string;
	};

	let formErrors: FormError;
	let formData: FormData;

	function reset() {
		formData = {
			currentPassword: '',
			password: '',
			confirm: ''
		};
	}

	onMount(reset);
	onDestroy(reset);

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}

	function clearFormData() {
		formData.currentPassword = '';
		formData.confirm = '';
		formData.password = '';
	}

	const onUpdatePassword = async () => {
		const errors: FormError = {};
		if (!formData.currentPassword) {
			errors.currentPassword = 'Your current password is required';
		} else if (formData.currentPassword == formData.password) {
			errors.password = 'The new password must be different from the current password.';
		}
		if (!formData.password) {
			errors.password = 'A new password is required';
		} else if (!isPasswordComplex(formData.password)) {
			errors.password =
				'Password must be at least 8 characters (including 1 uppercase letter, 1 number and 1 lowercase letter)';
		}
		if (!formData.confirm) {
			errors.confirm = 'A password is required';
		} else if (formData.confirm != formData.password) {
			errors.password = 'Passwords do not match';
			errors.confirm = 'Passwords do not match';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		try {
			isFormSavingStore.set({ saving: true });
			const auth = await getAuth();
			await auth.setPersistence(browserSessionPersistence); // To get the user from browser session
			if (auth.currentUser) {
				try {
					// Check current password
					await reauthenticateWithCredential(
						auth.currentUser,
						EmailAuthProvider.credential(auth.currentUser.email, formData.currentPassword)
					);
					await updatePassword(auth.currentUser, formData.password);
					const cred = await signInWithEmailAndPassword(auth, user.email, formData.password);
					const token = await cred.user.getIdToken();
					await ppost('auth/sign-out', {});
					const res = await pauth(token);

					if (res.ok) {
						let user = await res.json();
						session.update((s) => {
							s.user = user;
							return s;
						});
						notify({
							kind: 'success',
							title: 'Password changed',
							subtitle: 'Your password has been changed. Please sign-in again.'
						});
						reset();
						clear();
					} else {
						notify({
							title: 'An error has occured',
							subtitle:
								'Something unexpected has happened. Please refresh the browser and sign-in again.'
						});
						console.error(await res.text());
						// location.reload();
					}
					// setTimeout(location.reload, 4000);
				} catch (error) {
					switch (error.code) {
						case 'auth/wrong-password':
							errors.currentPassword = 'The current password supplied does not match our records';
							break;
						default:
							console.error(error.errorInfo);
					}

					isFormSavingStore.set({ saving: false });
					if (Object.keys(errors).length) {
						showErrors(errors);
						return;
					}
				}
			} else {
				notify({
					kind: 'warning',
					title: 'Warning',
					subtitle: 'Your session has expired. Please sign in again.'
				});
				goto('/auth/sign-in');
			}
		} catch (error) {
			notify({
				kind: 'error',
				title: 'Error',
				subtitle: error.message
			});
		}
		isFormSavingStore.set({ saving: false });

		clearFormData();
	};
</script>

<FormGroup groupName="ID">
	<FormRow label="OYSTEO ID">
		<div slot="value">{user.email || ''}</div>
		<div slot="fields">
			<TextInput autofocus labelText="OYSTEO ID" placeholder={user.email} />
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	groupClass="group custom-invalid"
	let:isEditing
	on:submit={onUpdatePassword}
	on:cancel={reset}
	data={{...formData}}
>
	<FormRow label="Password" {isEditing}>
		<div slot="value">********</div>
		<div slot="fields">
			<PasswordInput
				autofocus
				type="password"
				labelText="Current Password"
				placeholder="Enter your current password"
				invalid={!!formErrors?.currentPassword}
				invalidText={formErrors?.currentPassword}
				bind:value={formData.currentPassword}
				name="currentPassword"
			/>
			<PasswordInput
				type="password"
				labelText="New Password"
				placeholder="Enter a new password"
				invalid={!!formErrors?.password}
				invalidText={formErrors?.password}
				bind:value={formData.password}
				name="password"
			/>

			<UnorderedList class="rules-password">
				<ListItem>8 character minimun</ListItem>
				<ListItem>One uppercase letter</ListItem>
				<ListItem>One number</ListItem>
				<ListItem>One lowercase letter</ListItem>
			</UnorderedList>

			<PasswordInput
				type="password"
				labelText="Confirm New Password"
				bind:value={formData.confirm}
				placeholder="Confirm the new password again"
				invalid={!!formErrors?.confirm}
				invalidText={formErrors?.confirm}
				name="confirm"
			/>
		</div>
	</FormRow>
</FormGroup>
