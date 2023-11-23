
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
            <div class="flx-col sec-li">
                { sec.sec_name }
            
                { #each sec.sec_anns as ann ( ann.ann_id ) }
                    { #if ann.evt.evt_addr == job.reg.des_dev_serial }
                        <div class="flx-col sec-ann">{ ann.evt.evt_title }</div> 
                    { /if }
                { /each }

            </div> 

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
        gap: 1em;
    }

    .sec-li {
       /* align-items: center; */
       background-color: var(--light_002);
       padding: 1em 2em;
       padding-bottom: 0.5em;
        gap: 0.5em;
    }

    .sec-ann {
        /* align-items: flex-end; */
       background-color: var(--aqua_005);
       padding: 0.5em 2em;
        gap: 0;
    }


</style>
