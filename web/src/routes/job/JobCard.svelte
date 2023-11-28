<script>

    import { goto } from '$app/navigation'
    
    import PillButton from "$lib/common/button/PillButton.svelte"
    import DateTimeDisplay from '../../lib/common/date_time/DateTimeDisplay.svelte'
    import HeaderCard from '../../lib/components/header/HeaderCard.svelte'
    import EventCard from '../../lib/components/event/EventCard.svelte'

    import btn_img_report from "$lib/images/btn-img-edit-aqua.svg"

    import { Job } from "../../lib/des_api"
    
    export let job = new Job( )
    $: stat  = JSON.parse( job.reg.des_job_json )
    $: hdr = stat.hdr
    $: evt = stat.evt

    $: highlight = ( job.highlight ? 'highlight' : '' ) 
</script>

<div class="flx-row container { highlight } ">

    <div class="flx-col layout">

        <div class="flx-row title-bar">

            <div class="flx-row job-cont">
                <div class="flx-row fg-accent job-lbl">Job ID</div>
                <div class="vert-line"/>
                <div class="flx-row job">{ job.reg.des_job_name }</div>
            </div>  

            <div class="flx-row btns">    

                <PillButton 
                    on:click={ ( ) => { goto( `job/${ job.reg.des_job_name }` ) } }
                    img={ btn_img_report }
                    hint={ 'Job Reports' } 
                />

            </div>
        
        </div>
        
        <div class="flx-row date-cont">
            <div class="flx-row fg-accent date-lbl">Start</div>
            <div class="vert-line"/>
            <div class="flx-row date"><DateTimeDisplay date={ job.reg.des_job_start }/></div>
        </div>
        <div class="flx-row date-cont">
            <div class="flx-row fg-accent date-lbl">End</div>
            <div class="vert-line"/>
            <div class="flx-row date"><DateTimeDisplay date={ job.reg.des_job_end }/></div>
        </div>

    </div>

    <div class="flx-row hdr">
        <div class="vert-line sep"/>
        <HeaderCard bind:hdr />
    </div>
        
    <div class="flx-row evt">
        <div class="vert-line sep"/>
        <EventCard bind:event={evt} />
    </div>

</div>

<style>
        
    .container{
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        justify-content: space-between;
        border-radius: 0.5em;
        padding: 1em;
    }
    .highlight { background-color: var(--light_009); }

    .layout {  
        padding: 0; 
        padding-right: 0.5em;
        gap: 0; 
    }
    .title-bar {
        justify-content: space-between;
        align-items: center;
        padding: 0.5em 0;
    }
        
    .job-cont { 
        width: auto;
        height: 2em; 
        gap: 0;         
    }
    .job-lbl { 
        font-size: 1.25em;  
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.6em;
        max-width: 4.8em;
        min-width: 4.8em;
    }
    .job { 
        font-size: 1.25em;  
        align-items: center; 
        width: auto;
    }
        
    .date-cont { 
        width: auto;
        height: 2em; 
        gap: 0;         
    }
    .date-lbl { 
        font-size: 1.25em;  
        color: var( --orange_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.6em;
        max-width: 4.8em;
        min-width: 4.8em;
    }
    .date { 
        font-size: 1.25em;  
        align-items: center; 
        width: auto;
    }

    .btns { 
        justify-content: flex-end; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }


</style>
