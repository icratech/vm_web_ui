<script>

    import DateTimeDisplay from "../../../common/date_time/DateTimeDisplay.svelte"

	import { Header } from '../../models'

    export let hdr = new Header( )

</script>


<div class="flx-row ro-fields">

    <!-- DATES  -->
    <div class="flx-col start">
        <div class="flx-row field">
            <div class="flx-row field-title title">Start</div>
            <div class="vert-line"/>
            <div class="flx-row value"><DateTimeDisplay date={ hdr.hdr_job_start } showTime={ true} /></div>
        </div>    
        <div class="flx-row field">
            <div class="flx-row field-title title">End</div>
            <div class="vert-line"/>
            <div class="flx-row value"><DateTimeDisplay date={ hdr.hdr_job_end } showTime={ true } /></div>
        </div>
    </div>

    <div class="flx-col"></div>
    
    <!-- GEO LOC -->
    <div class="flx-col end">
        <div class="flx-row field">
            <div class="flx-row field-title geo-title">Lng.</div>
            <div class="vert-line"/>
            <div class="flx-row value">{ hdr.hdr_geo_lng.toFixed(5) }</div>
        </div>  
        <div class="flx-row field">
            <div class="flx-row field-title geo-title">Lat.</div>
            <div class="vert-line"/>
            <div class="flx-row value">{ hdr.hdr_geo_lat.toFixed(5) }</div>
        </div>
    </div>
    
</div>

<style>
    

    .field { 
        height: 2em; 
        gap: 0;         
    }
    .field-title {
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
        width: 6em;
    }
    
    .ro-fields {
        justify-content: space-between;
        padding: 0;
        gap:0;
    }

    .geo-title { 
        color: var(--orange_a); 
        max-width: 3em;
        min-width: 3em;
        width: 3em;
    }

    .start {
        align-items: flex-start;
        gap: 0;
    }
    .end {
        align-items: flex-end;
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

</style>