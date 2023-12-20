<script>

    import { debug } from '../../des/utils'
    import { Job, Report } from "../../des_api"

    import ReportSecTitle from './ReportSecTitle.svelte'
    
    export let job = new Job( )
    export let rep = new Report( )

    const testFunc = ( sec ) => {
        let cfg = job.configs.reduce( ( pre, cur ) => { 
            return ( 
                pre &&
                pre.cfg_time >= sec.sec_start &&
                pre.cfg_time < sec.sec_end
            ) ? pre : cur } )

        debug( "Section Start: ", sec.sec_start )
        debug( "Section End: ", sec.sec_end )
        debug( "Section Config.CfgVlvTgt: ", cfg.cfg_vlv_tgt )

        let smp = job.samples.reduce( ( pre, cur ) => {
            return ( 
                pre && 
                pre.smp_time > sec.sec_start && 
                pre.smp_time < sec.sec_end && 
                pre.smp_hi_flow > cur.smp_hi_flow 
            ) ? pre : cur
        } )
        debug( "Section Sample.SmpHiFlow: ", smp.smp_hi_flow )
    }

</script>

<div class="flx-col container">
    <div class="flx-col section-list">
        { #each rep.rep_secs as sec ( sec.sec_id ) }
            <div class="flx-co">

                <ReportSecTitle bind:job bind:sec on:section-selected />

                <!-- { #each sec.sec_anns as ann ( ann.ann_id ) }
                    { #if ann.evt.evt_addr == job.reg.des_dev_serial }
                        <EventCard bind:evt={ ann.evt } />
                    { /if }
                { /each } -->

            </div> 

        { /each }
    </div>
    <!-- <div class="flx-col section-list">
        { #each rep.rep_secs as sec ( sec.sec_id ) }
        <div class="flx-col sec-li" on:click={ ( ) => { testFunc( sec ) } } on:keydown>
            
            <ReportSecTitle bind:job bind:sec />
            
            { #each sec.sec_anns as ann ( ann.ann_id ) }
            { #if ann.evt.evt_addr == job.reg.des_dev_serial }
                <EventCard bind:evt={ ann.evt } />
            { /if }
            { /each }

        </div> 
        { /each }
    </div> -->

</div>

<style>
    
    .container {
        height: 100%;
        gap: 1rem;
    }


    .section-list {
        overflow: auto;
        padding-right: 0.5em;
        gap: 1em;
    }

</style>