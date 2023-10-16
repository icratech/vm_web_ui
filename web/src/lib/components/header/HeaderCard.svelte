
<script>
	import { Header } from "../../des_api"
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte";

    export let header = new Header( )

    $: displayDate = ( header.hdr_job_start == 0 ? header.hdr_time : header.hdr_job_start )

</script>

<div class="flx-col card-content">
    
    <div class="flx-row card-title title">
        <div class="job"><span style="color: var(--aqua_aa); padding-right:0.5em;">Job ID:</span> { header.hdr_job_name }</div> 
        <div><DateTimeDisplay date={ displayDate } /></div>
    </div>

    <div class="flx-col card info">
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

    .info {
        gap: 0.75em;
        padding:0
    }

    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        /* font-size: 0.9rem; */
        width: 9em;
    }

    .job {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        color: var( --light_03);
        padding: 0em;
        font-size: 0.9rem;
        width: 100%;
    }
    @media(max-width:720px) {
        .title {
            display: none;
        }
        .lbl {
            display: none;
        }
    }
</style>