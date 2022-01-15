<script lang="ts">
	import FormGroup from '$lib/components/form/group.svelte';
	import FormRow from '$lib/components/form/row.svelte';
	import type { User } from '$lib/store/auth';
	import type { Traveller } from '$lib/store/traveller';
	export let user: User|undefined = undefined;
	const destinationsString = () => {
		if(user && user?.destinationLikes.length > 0){
			return user.destinationLikes.reduce((acc: string, item)=>{
				if(item.name){
					if(acc === ''){
						acc = item.name;
					}else{
						acc += ', '+item.name;
					}
				}
				return acc;
			},'');
		}
		return '';
	}
	const experiencesString = () => {
		if(user && user?.experienceLikes.length > 0){
			return user.experienceLikes.reduce((acc: string, item)=>{
				if(item.name){
					if(acc === ''){
						acc = item.name;
					}else{
						acc += ', '+item.name;
					}
				}
				return acc;
			},'');
		}
		return '';
	}
	const productsString = () => {
		if(user && user?.productLikes.length > 0){
			return user.productLikes.reduce((acc: string, item)=>{
				if(item.name){
					if(acc === ''){
						acc = item.name;
					}else{
						acc += ', '+item.name;
					}
				}
				return acc;
			},'');
		}
		return '';
	}
</script>

<FormGroup hideEditButton>
	<FormRow label="Editorial Features">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="Destinations">
		<div slot="value">{destinationsString()}</div>
	</FormRow>
    <FormRow label="Experiences">
		<div slot="value">{experiencesString()}</div>
	</FormRow>
    <FormRow label="Products">
		<div slot="value">{productsString()}</div>
	</FormRow>
    <FormRow label="Search terms">
		<div slot="value"></div>
	</FormRow>
    <FormRow label="OYSTEO TrueMatch">
		<div slot="value"></div>
	</FormRow>
</FormGroup>
