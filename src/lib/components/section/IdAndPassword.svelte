<script lang="ts">
	import type { User } from '$lib/store/auth';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { ListItem, PasswordInput, TextInput, UnorderedList } from 'carbon-components-svelte';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { checkPasswordRule, isPasswordComplex } from '$lib/helpers/utils';
	import {
		browserSessionPersistence,
		EmailAuthProvider,
		getAuth,
		reauthenticateWithCredential,
		signInWithEmailAndPassword
	} from 'firebase/auth';
	import { authStore } from '$lib/store/auth';
	import { onDestroy } from 'svelte';
	import { notify } from '../Toast.svelte';
	import { formChangeStatusStore } from '$lib/store/formChangeStatus';
	import { isFormSavingStore } from '$lib/store/isFormSaving';
	import { redirect } from '$lib/helpers/redirect.svelte';
	import { goto } from '$app/navigation';

	export let user: User | undefined;
	export let activeSection = '';
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	type FormError = {
		currentPassword?: string;
		newPassword?: string;
		confirmPassword?: string;
	};

	let formErrors: FormError;

	function showErrors(errors: FormError) {
		formErrors = errors;
		setTimeout(() => {
			formErrors = undefined;
		}, INVALID_DELAY_TIME);
	}
	let passwordData = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	};

	const resetPasswordData = () => {
		passwordData = {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		};
	};

	onDestroy(() => {
		resetPasswordData();
	});

	const onUpdatePassword = async () => {
		const errors: FormError = {};
		if (!passwordData.currentPassword) {
			errors.currentPassword = 'A password is required';
		} else if (passwordData.currentPassword == passwordData.newPassword) {
			errors.newPassword = 'The new password must be different from the current password.';
		}
		if (!passwordData.newPassword) {
			errors.newPassword = 'A password is required';
		} else if (!isPasswordComplex(passwordData.newPassword)) {
			errors.newPassword =
				'Password must be at least 8 characters (including 1 uppercase letter, 1 number and 1 lowercase letter)';
		}
		if (!passwordData.confirmPassword) {
			errors.confirmPassword = 'A password is required';
		} else if (passwordData.confirmPassword != passwordData.newPassword) {
			errors.confirmPassword = 'Confirmation password is incorrect';
		}

		if (Object.keys(errors).length) {
			showErrors(errors);
			return;
		}

		try {
			isFormSavingStore.set({ saving: true });
			const auth = await getAuth();
			await auth.setPersistence(browserSessionPersistence); // To get the user from browser session
			const user = auth.currentUser;
			if (user) {
				try {
					// Check current password
					const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
					await reauthenticateWithCredential(user, credential);
					const res = await fetch('/auth/change-password.json', {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							password: passwordData.newPassword,
							passwordConfirmation: passwordData.confirmPassword
						})
					});
					if (res.ok) {
						try {
							await fetch(`/auth/sign-out.json?_z=${Date.now()}`);
						} catch (error) {}
						try {
							const cred = await signInWithEmailAndPassword(
								auth,
								user.email,
								passwordData.newPassword
							);
							if (cred.user) {
								const token = await cred.user.getIdToken();
								const res = await fetch('/auth.json', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										token
									})
								});
								if (res.ok) {
									const user = await res.json();
									authStore.set({ user });
									activeSection = '';
								} else {
									const error = await res.json();
									console.log(error);
								}
							}
						} catch (error) {
							console.error(error);
						}
					} else {
						const error = await res.json();
						console.log(error);
					}
				} catch (error) {
					// Current password is invalid
					errors.currentPassword = 'Password was wrong';
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
	};
</script>

<FormGroup groupName="ID">
	<FormRow label="OYSTEO ID">
		<div slot="value">{user.email}</div>
		<div slot="fields">
			<TextInput autofocus labelText="OYSTEO ID" placeholder={user.email} />
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	groupClass="group custom-invalid"
	let:isEditing
	isEditing={activeSection === 'password'}
	on:edit={() => onEdit('password')}
	on:cancel={onCancel}
	on:submit={onUpdatePassword}
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
				bind:value={passwordData.currentPassword}
			/>
			<PasswordInput
				type="password"
				labelText="New Password"
				placeholder="Enter a new password"
				invalid={!!formErrors?.newPassword}
				invalidText={formErrors?.newPassword}
				bind:value={passwordData.newPassword}
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
				bind:value={passwordData.confirmPassword}
				placeholder="Confirm the new password again"
				invalid={!!formErrors?.confirmPassword}
				invalidText={formErrors?.confirmPassword}
			/>
		</div>
	</FormRow>
</FormGroup>
