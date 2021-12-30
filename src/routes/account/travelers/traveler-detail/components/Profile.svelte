<script lang="ts">
import type { Traveller } from "$lib/store/traveller";

import { Button, Column, Grid, Link, Row } from "carbon-components-svelte";
import { Forum16, Forum32 } from "carbon-icons-svelte";

export let traveller: Traveller;
</script>
<div class="mt-15">
<Grid narrow padding>
    <Row>
        <Column><label>Name</label></Column>
        <Column><label>Language</label></Column>
        <Column><label>Phone</label></Column>
        <Column><label>Pref. Contact</label></Column>
        <Column><label>Email</label></Column>
        <Column lg={1}></Column>
    </Row>
    <Row>
        <Column>{`${traveller.forename || ''} ${traveller.surname || ''}`}</Column>
        <Column>{traveller.language || ''}</Column>
        <Column>{traveller.mobilePhone || ''}</Column>
        <Column>{traveller.whatsapp || ''}</Column>
        <Column>{traveller.email || ''}</Column>
        <Column lg={1}><Link href="#"><Forum16/></Link></Column>
    </Row>
    <Row>
        <Column><label>Country</label></Column>
        <Column><label>Address</label></Column>
        <Column><label>Time Zone</label></Column>
        <Column><label>Age</label></Column>
        <Column></Column>
        <Column lg={1}></Column>
    </Row>
    <Row>
        <Column>{traveller.residence?.name || ''}</Column>
        <Column>
            {#if traveller.addresses && traveller.addresses[0]}
                {`${traveller.addresses[0]?.line1 || ''}, ${traveller.addresses[0]?.province || ''}, ${traveller.addresses[0]?.country?.code || ''} ${traveller.addresses[0]?.zipcode || ''}`}
            {/if}
        </Column>
        <Column>{''}</Column>
        <Column>{new Date().getFullYear() - new Date(traveller.birthday).getFullYear()}</Column>
        <Column></Column>
        <Column lg={1}></Column>
    </Row>
</Grid>
<Grid narrow padding>
    <Row>
        <Column><label>Profile Description</label></Column>
    </Row>
    <Row>
        <Column>{''}</Column>
    </Row>
</Grid>
</div>
<style lang="scss">
    div{
        :global(.bx--row){
            margin-bottom: 0;
        }
    }
</style>