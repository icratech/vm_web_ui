<script>

    import { createEventDispatcher } from "svelte"

    import DateTimeDisplay from '../../lib/common/date_time/DateTimeDisplay.svelte'

    import { Job } from "../../lib/c001v001/job"
    import HeaderCard from '../../lib/c001v001/components/header/HeaderCard.svelte'
    import HeaderCardSpaceTime from "../../lib/c001v001/components/header/HeaderCardSpaceTime.svelte"
    import EventCard from '../../lib/c001v001/components/event/EventCard.svelte'
    
    export let job = new Job( )
    $: stat  = JSON.parse( job.reg.des_job_json )
    $: hdr = stat.hdr
    $: evt = stat.evt

    $: highlight = ( job.highlight ? 'highlight' : '' ) 
    
    let dispatch = createEventDispatcher( )

</script>

<div class="flx-row container { highlight } "
    on:keydown on:click={ ( ) => { dispatch( "job-selected", job ) } } >

    <div class="flx-row sec">
        <HeaderCard bind:hdr />
        <div class="vert-line sep"/>
    </div>
        
    <div class="flx-col stat">
        <div class="flx-row title-bar">
            <div class="flx-row job-cont">
                <div class="flx-row fg-accent job-lbl">Job ID</div>
                <div class="vert-line"/>
                <div class="flx-row job">{ job.reg.des_job_name }</div>
            </div>  
        </div>
        <div class="flx-col w1440"><EventCard bind:evt /></div>
    </div>

    <div class="flx-row sec wFull">
        <div class="vert-line sep"/>
        <div class="flx-col"><EventCard bind:evt /></div>
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
    .container:hover { background-color: var(--light_007); }
    .highlight { background-color: var(--light_007); }

    .stat {  
        justify-content: space-between;
        padding: 0; 
        gap: 0; 
    }
    .sec {
        justify-content: space-between;
        gap: 0.5em;
    }
    .title-bar {
        /* border-bottom: solid 0.05em var(--light_01); */
        justify-content: space-between;
        padding-top: 0;
        width: 100%;
        height: 2.5em;
    }
    .job-cont { 
        gap: 0;         
    }
    .job-lbl { 
        color: var( --pink);
        justify-content: flex-end;
        align-items: center;
        font-size: 1.2em;
        padding-right: 0.6em;
        max-width: 5em;
        min-width: 5em;
    }
    .job { 
        color: var( --grey_07);
        font-size: 1.2em;
        align-items: center; 
        width: auto;
    }

    .wFull { display: flex; }
    .w1440 { display: none }

    /* LAP TOP */
    @media(max-width: 1440px) {
        .wFull { display: none; }
        .w1440 { display: flex }
    }

    /* TABLET */
    @media(max-width: 1100px) {
        .container {
            flex-direction: column;
            padding: 0.5em;
        }
        .stat { padding-right: 0; }
        .sep { display: none; }
    }

</style>
