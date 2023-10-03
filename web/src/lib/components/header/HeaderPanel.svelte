
<script>
    import { onMount } from 'svelte'
	import { Header } from "../../des_api";

    import PillButton from "../../common/button/PillButton.svelte";
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte"
    import InputText from "../../common/input_text/InputText.svelte";
    import UserBadge from "../user/UserBadge.svelte"

    export let header = new Header( )

    // onMount( ( ) => {
    //     const interval = setInterval( ( ) => { 
    //         header.hdr_time = Date.now( ) //  console.log( "T: ", header.hdr_time )
    //     }, 1000 )
    //     return ( ) => { clearInterval( interval ) }
    // } )

    </script>

<div class="flx-col container">

    <div class="flx-col  card-content">

        <div class="flx-row">
            <p class="lbl">Company:</p>
            <InputText enabled={ true } bind:txt={ header.hdr_well_co } place="Company name"/>
        </div>
        
        <div class="flx-row">
            <p class="lbl">Well Name:</p>
            <InputText enabled={ true } bind:txt={ header.hdr_well_name } place="Well name" />
        </div>
        
        <div class="flx-row">
            <p class="lbl">Surface Loc:</p>
            <InputText enabled={ true } bind:txt={ header.hdr_well_sf_loc } place="Well location / UWI"/>
        </div>
        
        <div class="flx-row">
            <p class="lbl">Bottom-Hole Loc:</p>
            <InputText enabled={ true } bind:txt={ header.hdr_well_bh_loc } place="Bottom-hole location"/>
        </div>
        
        <div class="flx-row">
            <p class="lbl">License:</p>
            <InputText enabled={ true } bind:txt={ header.hdr_well_lic } place="Well License #"/>
        </div>

        <br>
        <div class="flx-row card-title">
            <div><DateTimeDisplay bind:date={ header.hdr_time } /></div>
            <UserBadge uid={ header.hdr_user_id } />
        </div>

    </div>
    
</div>

<style>

    .container {
        width: 42em;
    }    

    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        /* font-size: 0.9rem; */
        width: 13em;
    }

</style>