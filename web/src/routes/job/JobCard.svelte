<script>

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )
    
    import PillButton from "$lib/common/button/PillButton.svelte"
    import DateTimeDisplay from '../../lib/common/date_time/DateTimeDisplay.svelte'
    import HeaderCard from '../../lib/components/header/HeaderCard.svelte'
    import ReportTitle from "../../lib/components/report/ReportTitle.svelte"
    import EventCard from '../../lib/components/event/EventCard.svelte'

    import btn_img_report from "$lib/images/btn-img-edit-aqua.svg"

    import { Job } from "../../lib/des_api"
    
    export let job = new Job( )
    $: stat  = JSON.parse( job.reg.des_job_json )
    $: hdr = stat.hdr
    $: evt = stat.evt

    $: highlight = ( job.highlight ? 'highlight' : '' ) 

</script>

<div class="flx-row container { highlight } "
    on:keydown on:click={ ( ) => { dispatch( "job-selected", job ) } } >

    <div class="flx-col layout">
        <HeaderCard bind:hdr />

        <div class="flx-row job-cont">
            <div class="flx-row fg-accent job-lbl">Job ID</div>
            <div class="vert-line"/>
            <div class="flx-row job">{ job.reg.des_job_name }</div>
        </div>  

    </div>

    <div class="vert-line sep"/>
    <div class="flx-col report-list">
        <!-- { #each job.reports as rep ( rep.rep_id ) }
            <ReportTitle bind:job bind:rep />
        { /each } -->
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
        max-height: 20em;
        padding: 1em;
    }
    .container:hover { background-color: var(--light_007); }
    .highlight { background-color: var(--light_007); }

    .layout {  
        padding: 0; 
        padding-right: 0.5em;
        gap: 0; 
    }

    .job-cont { 
        gap: 0;         
    }
    .job-lbl { 
        color: var( --purple);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.6em;
        max-width: 6em;
        min-width: 6em;
    }
    .job { 
        color: var( --grey_05);
        align-items: center; 
        width: auto;
    }

    .report-list {
        overflow-y: auto;
        padding-right: 0.5em;
    }

</style>
