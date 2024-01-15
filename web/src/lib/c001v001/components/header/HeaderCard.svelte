
<script>

    import HeaderCardSpaceTime from "./HeaderCardSpaceTime.svelte";

	import { Header } from '../../models'

    export let hdr = new Header( )
    
    export let full = true

</script>

<div class="flx-col container">

    <div class="flx-row field">
        <div class="flx-row title">Company</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ hdr.hdr_well_co }</div>
    </div>
    
    <div class="flx-row field">
        <div class="flx-row title">Well Name</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ hdr.hdr_well_name }</div>
    </div>
    
    <div class="flx-row field">
        <div class="flx-row title">Surf Loc</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ hdr.hdr_well_sf_loc }</div>
    </div>
    
    <div class="flx-row field">
        <div class="flx-row title">Bot Loc</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ hdr.hdr_well_bh_loc }</div>
    </div>
    
    <div class="flx-row field">
        <div class="flx-row title">License</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ hdr.hdr_well_lic }</div>
    </div>

    { #if full }
    <HeaderCardSpaceTime bind:hdr/>
    { /if }
</div>

<style>

    .container { 
        border-radius: 0.5em;
        height: 100%;
        padding: 0;
        gap: 0;
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

    .value { 
        align-items: center; 
    }


    /* LAP TOP */
    @media(max-width: 1440px) {
        
    }

    /* TABLET */
    @media(max-width: 1100px) {

    }

    /* MOBILE */
    @media(max-width: 450px) { 
    
    }

</style>