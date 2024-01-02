<script>

    import { createEventDispatcher } from "svelte"

    import { routeFixer, debug } from '../../lib/des/utils'

    import { Job } from '../../lib/c001v001/job'
    import { RGBA, BASE } from '../../lib/common/colors'
    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
    import PillButton from '../../lib/common/button/PillButton.svelte'

    export let job = new Job( )

    let color = BASE.PURPLE
    let border_color = RGBA(color, 0.7)
    let bg_color = RGBA(color, 0.1)

    let dispatch = createEventDispatcher( )

</script>

<div class="flx-row container"
    style="border: solid 0.1em { ( job.highlight ? border_color : 'transparent' ) };  
    background-color: { (  job.highlight ? bg_color : '' ) };" 
    on:keydown on:click={ ( ) => { 
        dispatch( "job-selected", job ) 
        job.selected = true
    } } 
> 
      
    <div class="flx-col title-block">
        <div class="flx-row title">{ job.reg.des_job_name }</div>
        <div class="flx-row job-status">
            <div class="flx-row secs">
                <div class="lbl">Start:</div>
                <DateTimeDisplay date={ job.reg.des_job_start } />
            </div>
            <div class="flx-row secs">
                <div class="lbl">End:</div>
                <DateTimeDisplay date={ job.reg.des_job_end } />
            </div>
        </div>
    </div>

    <!-- <div class="flx-row btns">
    
            <PillButton />
            <PillButton />
            <PillButton />
            <PillButton />
            <PillButton />
            <PillButton />
    
    </div> -->

</div>


<style>

    .container{
        justify-content: flex-start;
        /* align-items: center;  */
        border-radius: 0.5em;
        padding: 0.5em;
    }
    .container:hover {
        background-color: var(--light_007);
    }

    .title-block {
        justify-content: flex-start;
        gap: 0.75em;
    }

    /* .btns { 
        align-items: flex-start; 
        width: auto;
        gap: 0.75em;
    } */

</style>