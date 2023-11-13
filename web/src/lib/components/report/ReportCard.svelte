
<script>
    
    import DateTimeDisplay from "$lib/common/date_time/DateTimeDisplay.svelte"
    import PillButton from '$lib/common/button/PillButton.svelte'

    import ReportCardTitle from './ReportCardTitle.svelte'

	import { Job, Report } from "../../des_api"
    export let job = new Job( )
    export let rep = new Report( )

</script>


<div class="flx-col container card-content">

    <ReportCardTitle bind:rep />

    <div class="flx-col section-list">
        { #each rep.rep_secs as sec ( sec.sec_id ) }
            <div class="flx-col sec-li">{ sec.sec_name }</div> 
            
            { #each sec.sec_anns as ann ( ann.ann_id ) }
                { #if ann.evt.evt_addr == job.reg.des_dev_serial }
                    <div class="flx-col sec-ann">{ ann.evt.evt_title }</div> 
                { /if }
            { /each }

        { /each }
    </div> 
    
</div>

<style>
    
    .container {
        /* background-color: var(--light_002); */
        padding: 1em;
        overflow: hidden;
        height: 100%;
        gap: 1rem;
    }

    .section-list {
        overflow: auto;
        gap: 0;
    }

    .sec-li {
       /* align-items: center; */
       padding-top: 1em;
       padding-left: 3em;
        gap: 0;
    }

    .sec-ann {
        /* align-items: flex-end; */
       padding-left: 6em;
        gap: 0;
    }


</style>
