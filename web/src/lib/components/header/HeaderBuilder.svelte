
<script>
    import { onMount } from 'svelte'
	import { Header } from "../../des_api";

    import PillButton from "../../common/button/PillButton.svelte"
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte"
    import InputText from "../../common/input_text/InputText.svelte"
    import UserBadge from "../user/UserBadge.svelte"

    export let hdr = new Header( )

    </script>

<div class="flx-col container">

    <div class="flx-col  card-content">

        <div class="flx-row in">
            <p class="lbl">Company:</p>
            <InputText enabled={ true } bind:txt={ hdr.hdr_well_co } place="Company name"/>
        </div>
        
        <div class="flx-row in">
            <p class="lbl">Well Name:</p>
            <InputText enabled={ true } bind:txt={ hdr.hdr_well_name } place="Well name" />
        </div>
        
        <div class="flx-row in">
            <p class="lbl">Surf Loc:</p>
            <InputText enabled={ true } bind:txt={ hdr.hdr_well_sf_loc } place="Well location / UWI"/>
        </div>
        
        <div class="flx-row in">
            <p class="lbl">Bot Loc:</p>
            <InputText enabled={ true } bind:txt={ hdr.hdr_well_bh_loc } place="Bottom-hole location"/>
        </div>
        
        <div class="flx-row in">
            <p class="lbl">License:</p>
            <InputText enabled={ true } bind:txt={ hdr.hdr_well_lic } place="Well License #"/>
        </div>

        <div class="flx-row card-title meta">
            <UserBadge uid={ hdr.hdr_user_id } />
        </div>

    </div>
    
</div>

<style>

    .container {
        min-width: 35em;
    }    

    .in {
        gap: 0.5em;
    }
    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        /* font-size: 0.9rem; */
        width: 7em;
    }
    .meta {
        /* flex-direction: column; */
        padding: 0;
        gap: 0.5em;
    }

    /* MOBILE */
    @media(max-width: 425px) { 
        
        .container {
            min-width: none;
        }  
    }
</style>