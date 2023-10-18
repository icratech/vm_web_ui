
<script>
	import { Header } from "../../des_api"

    export let hdr = new Header( )

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
        <div class="flx-row title">Surface Loc</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ hdr.hdr_well_sf_loc }</div>
    </div>
    
    <div class="flx-row field">
        <div class="flx-row title">Bottom Loc</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ hdr.hdr_well_bh_loc }</div>
    </div>
    
    <div class="flx-row field">
        <div class="flx-row title">License</div>
        <div class="vert-line"/>
        <div class="flx-row value">{ hdr.hdr_well_lic }</div>
    </div>
    
</div>

<style>

    .container { 
        justify-content: center;
        border-radius: 0.5em;
        height: 100%;
        padding: 0;
        gap: 0;
    }

    .field { 
        height: 2em; gap: 0;         
        justify-content: flex-start;
        width: 100%;
    }
    
    .title {
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 1em;
        width: 8em;
    }

    /* LAP TOP */
    @media(max-width: 1440px) {
        
    }

    /* TABLET */
    @media(max-width: 1024px) {

    }

    /* MOBILE */
    @media(max-width: 425px) { 
    
    }

</style>