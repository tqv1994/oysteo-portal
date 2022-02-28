<script lang="ts">
	import type { User } from '$lib/store/user';
	import FormGroup from '../form/group.svelte';
	import FormRow from '../form/row.svelte';
	import { ListItem, PasswordInput, TextInput, UnorderedList } from 'carbon-components-svelte';
	import { INVALID_DELAY_TIME } from '$lib/utils/constants';
	import { checkPasswordRule } from '$lib/helpers/utils';
	import {
		browserSessionPersistence,
		EmailAuthProvider,
		getAuth,
		reauthenticateWithCredential,
		signInWithEmailAndPassword,
	} from 'firebase/auth';
	import { redirect } from '$lib/utils/router';
	import { authStore } from '$lib/store/auth';
	import { onDestroy } from 'svelte';

	export let user: User | undefined;
	export let activeSection: string = '';
	export let activeLoading: boolean = false;
	const onEdit = (groupName: string) => {
		activeSection = groupName;
	};
	const onCancel = () => {
		activeSection = '';
	};

	let passwordData = {
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	};
	let invalidPassword = {
		currentPassword: {
			status: false,
			message: 'please enter password'
		},
		newPassword: {
			status: false,
			message: 'please enter password'
		},
		confirmPassword: {
			status: false,
			message: 'please enter password'
		}
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
		if(passwordData.currentPassword == ''){
			invalidPassword.currentPassword.status = true;
			setTimeout(() => {
				invalidPassword.currentPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		if(passwordData.newPassword == ''){
			invalidPassword.newPassword.status = true;
			setTimeout(() => {
				invalidPassword.newPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		if(passwordData.confirmPassword == ''){
			invalidPassword.confirmPassword.status = true;
			setTimeout(() => {
				invalidPassword.confirmPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}
		invalidPassword.newPassword = checkPasswordRule(passwordData.newPassword);
		if (invalidPassword.newPassword.status) {
			setTimeout(() => {
				invalidPassword.newPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}

		if (passwordData.newPassword == '' || passwordData.currentPassword == '') {
			setTimeout(() => {
				invalidPassword.newPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			invalidPassword.confirmPassword = {
				status: true,
				message: 'Confirmation password is incorrect'
			};
			setTimeout(() => {
				invalidPassword.confirmPassword.status = false;
			}, INVALID_DELAY_TIME);
			return;
		}

		try {
			activeLoading = true;
			const auth = await getAuth();
			await auth.setPersistence(browserSessionPersistence); // To get the user from browser session
			const user = auth.currentUser;
			if (user) {
				// Check current password
				const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
				await reauthenticateWithCredential(user, credential)
					.then(async () => {
						//Current password is valid
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
							await signInWithEmailAndPassword(auth, user.email, passwordData.newPassword).then(
								async (cred) => {
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
											activeSection = "";
										} else {
											const error = await res.json();
											console.log(error);
										}
									}
								}
							);
						} else {
							const error = await res.json();
							console.log(error);
						}
					})
					.catch((error) => {
						// Current password is invalid
						invalidPassword.currentPassword = {
							status: true,
							message: 'Password was wrong'
						};
						setTimeout(() => {
							invalidPassword.currentPassword.status = false;
						}, INVALID_DELAY_TIME);
						return;
					});
			} else {
				window.openNotification({
					kind: 'warning',
					title: 'Warning',
					subtitle: 'The account has expired. Please log in again.'
				});
				redirect('/login', 500);
			}
		} catch (error) {
			window.openNotification({
				kind: 'error',
				title: 'Error',
				subtitle: error.message
			});
		}
		activeLoading = false;
	};
</script>

<FormGroup groupName="ID">
	<FormRow label="OYSTEO ID">
		<div slot="value">{user.email}</div>
		<div slot="fields">
			<TextInput labelText="OYSTEO ID" placeholder={user.email} />
		</div>
	</FormRow>
</FormGroup>

<FormGroup
	groupClass='group custom-invalid'
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
				type="password"
				labelText="Current Password"
				placeholder="Enter your current password"
				invalid={invalidPassword.currentPassword.status}
				invalidText={invalidPassword.currentPassword.message}
				bind:value={passwordData.currentPassword}
			/>
			<PasswordInput
				type="password"
				labelText="New Password"
				placeholder="Enter a new password"
				invalid={invalidPassword.newPassword.status}
				invalidText={invalidPassword.newPassword.message}
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
				invalid={invalidPassword.confirmPassword.status}
				invalidText={invalidPassword.confirmPassword.message}
			/>
		</div>
	</FormRow>
</FormGroup>
