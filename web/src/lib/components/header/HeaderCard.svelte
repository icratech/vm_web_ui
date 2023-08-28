
<script>
	import { Header } from "../../des_api"
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte";

    export let header = new Header( )

</script>

<div class="flx-col card-content">
    
    <div class="flx-row card-title">
        <h4>{ header.hdr_well_name }</h4> 
        <div><DateTimeDisplay date={ header.hdr_job_start } /></div>
    </div>

    <div class="flx-col card">
        <div class="flx-row">
            <p class="lbl">Company:</p>
            <p>{ header.hdr_well_co }</p>
        </div>
        
        <div class="flx-row">
            <p class="lbl">Well Name:</p>
            <p>{ header.hdr_well_name }</p>
        </div>
        
        <div class="flx-row">
            <p class="lbl">Surface Loc:</p>
            <p>{ header.hdr_well_sf_loc }</p>
        </div>
        
        <div class="flx-row">
            <p class="lbl">Bottom-Hole Loc:</p>
            <p>{ header.hdr_well_bh_loc }</p>
        </div>
        
        <div class="flx-row">
            <p class="lbl">License:</p>
            <p>{ header.hdr_well_lic }</p>
        </div>
    </div>
    

</div>

<style>

    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        /* font-size: 0.9rem; */
        width: 9em;
    }

</style>