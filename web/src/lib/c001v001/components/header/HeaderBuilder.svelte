
<script>

    import { getContext } from "svelte"

    import InputText from "../../../common/input_text/InputText.svelte"
    import UserBadge from "../../../des/components/UserBadge.svelte"

	import { Header } from '../../models'
    
    export let hdr = new Header( )

    $: USERS = getContext( 'users' )
    $: user = $USERS.filter( u  => { return u.id == hdr.hdr_user_id } )[0]

    </script>

<div class="flx-col container">

    <div class="flx-row field">
        <div class="flx-row title">Company</div>
        <div class="vert-line vl"/>
        <InputText enabled={ true } bind:txt={ hdr.hdr_well_co } place="Company name"/>
    </div>
    
    <div class="flx-row field">
        <div class="flx-row title">Well Name</div>
        <div class="vert-line vl"/>
        <InputText enabled={ true } bind:txt={ hdr.hdr_well_name } place="Well name" />
    </div>

    <div class="flx-row field">
        <div class="flx-row title">Surf Loc</div>
        <div class="vert-line vl"/>
        <InputText enabled={ true } bind:txt={ hdr.hdr_well_sf_loc } place="Well location / UWI"/>
    </div>

    <div class="flx-row field">
        <div class="flx-row title">Bot Loc</div>
        <div class="vert-line vl"/>
        <InputText enabled={ true } bind:txt={ hdr.hdr_well_bh_loc } place="Bottom-hole location"/>
    </div>

    <div class="flx-row field">
        <div class="flx-row title">License</div>
        <div class="vert-line vl"/>
        <InputText enabled={ true } bind:txt={ hdr.hdr_well_lic } place="Well License #"/>
    </div>

    <div class="flx-row card-title meta">
        <UserBadge bind:user={ user } />
    </div>
    
</div>

<style>

    .container {
        gap: 0.5em;
    }    
    .field { 
        height: 2em; 
        gap: 0;         
    }
    .title {
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
    }
    .vl {
        margin-bottom: -0.5em;
    }
    .meta {
        padding: 0;
        gap: 0.5em;
    }

    /* MOBILE */
    @media(max-width: 450px) { 
        
        .container {
            min-width: none;
        }  
    }
</style>