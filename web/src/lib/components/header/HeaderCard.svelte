
<script>
	import { Header } from "../../des_api"
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte";

    export let hdr = new Header( )

    // $: displayDate = ( header.hdr_job_start == 0 ? null : header.hdr_job_start )

</script>

<div class="flx-col container">

    <div class="flx-row card-title">

        <DateTimeDisplay date={ hdr.hdr_job_start } />
        <div class="job">{ hdr.hdr_job_name }</div> 

    </div>

    <div class="flx-col card-content info">

        <div class="flx-row">
            <p class="lbl">Company:</p>
            <p>{ hdr.hdr_well_co }</p>
        </div>
        
        <div class="flx-row">
            <p class="lbl">Well Name:</p>
            <p>{ hdr.hdr_well_name }</p>
        </div>
        
        <div class="flx-row">
            <p class="lbl">Surface Loc:</p>
            <p>{ hdr.hdr_well_sf_loc }</p>
        </div>
        
        <div class="flx-row">
            <p class="lbl">Bottom Loc:</p>
            <p>{ hdr.hdr_well_bh_loc }</p>
        </div>
        
        <div class="flx-row">
            <p class="lbl">License:</p>
            <p>{ hdr.hdr_well_lic }</p>
        </div>

    </div>
    
</div>

<style>

    .container {
        gap: 0.75em;
    }
    
    .job {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --light_03);
        padding: 0em;
        font-size: 0.9rem;
        width: 100%;
    }

    .info {
        gap: 0.75em;
        padding: 0.5em;
    }

    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        width: 6em;
    }

</style>