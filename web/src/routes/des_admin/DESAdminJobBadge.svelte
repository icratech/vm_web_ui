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
        
        <div class="flx-row sub-title">
            <div class="flx-col dates">
                <div class="flx-row start">
                    <div class="flx-row field">
                            <div class="flx-row field-title">Start</div>
                        <div class="vert-line"/> 
                        <div class="flx-row date"><DateTimeDisplay date={ job.reg.des_job_start } cls={ 'fg-purple' } /></div>
                    </div>        
                </div>
        
                <div class="flx-row end">
                    <div class="flx-row field">
                        <div class="flx-row field-title">End</div>
                        <div class="vert-line"/> 
                        <div class="flx-row date"><DateTimeDisplay date={ job.reg.des_job_end } cls={ 'fg-purple' } /></div>
                    </div>      
                </div>
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
        gap: 0.25em;
    }

    .title {
        border-bottom: solid 0.05em var(--light_02);
        padding-bottom: 0.25em;
    }
    /* .btns { 
        align-items: flex-start; 
        width: auto;
        gap: 0.75em;
    } */
    
    .sub-title {
        padding-left: 3em;
    }
    
    .dates {
        justify-content: space-between;
        padding: 0;
        gap:0;
    }

    .field { 
        height: 2em; 
        gap: 0;         
    }
    
    .field-title {
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 3em;
        min-width: 3em;
        width: 3em;
    }
    .start {
        align-items: flex-start;
        padding-bottom: 0.25em;
        gap: 0;
    }
    .end {
        align-items: flex-start;
        margin-top: -0.25em;
        gap: 0;
    }


</style>