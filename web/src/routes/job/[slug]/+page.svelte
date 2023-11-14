<script>

    // export let data
    // $: job = data.resp.job
    // $: message = data.resp.message
    // $: status = data.resp.status
    // $: { debug( `./job/[slug]: ${ status.toUpperCase() }\t${ message }` ) }

    import PillButton from '$lib/common/button/PillButton.svelte'
    import InputText from '$lib/common/input_text/InputText.svelte'
    import LineChart from '$lib/common/chart/LineChart.svelte'

    import HeaderCard from '../../../lib/components/header/HeaderCard.svelte'
    import ReportCard from '$lib/components/report/ReportCard.svelte'
    import EventBuilderRep from '$lib/components/event/EventBuilderRep.svelte'

    import btn_img_report from "$lib/images/btn-img-report.svg"

    import { onMount } from "svelte"
	import { JOBS, Header, Event, Report, Section, SectionDataSet, debug  } from "../../../lib/des_api"
    
    export let data
    $: job = $JOBS.filter( ( j ) => { return j.reg.des_job_name == data.job_name } )[0]

    /* TODO : RETRIEVE LAST HEADER FROM LIST */
    $: hdr = JSON.parse( job.reg.des_job_json ).hdr
    // $: hdr = job.headers.pop( )
    
    let new_hdr = new Header( )

    $: loaded = false
    onMount( async( ) => {
        loaded = await job.getJobData( )
        debug( job )
    } )
    let cur_rep = new Report( )

    let new_rep = new Report( )
    const makeReport = ( ) => {
        debug(  "new report title: ", new_rep.rep_title )
        job.newReport( new_rep )
        cur_rep = new_rep
        new_rep = new Report( )
    }
    let new_sec = new Section( )
    const makeSection = ( rep ) => {
        debug(  "new section name: ", new_sec.sce_name )
        rep.addSection( new_sec )
        new_sec = new Section( )
    }
    

    $: evt_code = 2001
    let cur_evt = new Event( )
    $: { cur_evt.evt_time = job.selection } 


</script>
<div class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col status">

            <HeaderCard bind:hdr />
            <!-- <div class="flx-col title">
                <h3>Job Info</h3>
                { job.reg.des_job_name }
            </div> -->
            


            <div class="flx-col report-list">
            Reports
            { #each job.reports as rep ( rep.rep_id ) }
                <ReportCard bind:rep={ rep } bind:job/>
                <br>
            { /each }
            </div> 

        </div>

        <div class="flx-col panel">
    
            { #if loaded }
            <div class="flx-col chart">
                <LineChart bind:chartdata={ job.cht } />
            </div>
            { :else }
            <h3>loading...</h3>
            { /if }
    
            <div class="flx-row controls">

                <div class="flx-col btns">
    
                    <PillButton 
                        on:click={ ( new_rep.rep_title != "" ? makeReport : debug( "enter a report title" ) ) }
                        cls={ 'bg-pink' }
                        img={ btn_img_report }
                        hint={ 'New Report' } 
                    />

                    <PillButton 
                        on:click={ ( new_sec.sec_name != "" ? makeSection( cur_rep ) : debug( "enter a section name" ) ) }
                        cls={ 'bg-pink' }
                        img={ btn_img_report }
                        hint={ 'New Section' } 
                    />

                    <PillButton 
                        on:click={ ( ) => { job.newHeader( new_hdr ) } }
                        cls={ 'bg-pink' }
                        img={ btn_img_report }
                        hint={ 'New Header' } 
                    />

                    <PillButton 
                    on:click={ ( ) => { job.newEvent( cur_evt ) } }
                        cls={ 'bg-pink' }
                        img={ btn_img_report }
                        hint={ 'New Event' } 
                    />

                </div>

                <div class="flx-col txts">

                    <InputText bind:txt={ new_rep.rep_title } place={ "Please enter a report title" } enabled={ true } />
                    
                    <InputText bind:txt={ new_sec.sec_name } place={ "Please enter a section name" } enabled={ true } />

                </div>

                <div class="flx-col">

                    <EventBuilderRep 
                        bind:job
                        bind:evt={ cur_evt }
                        bind:evt_code
                    />

                </div>

                <div class="flx-col">
                    
                </div>

            </div>

        </div>
    
    </div>

</div>

<style>
    
    .container {
        overflow: hidden;
        height: 100%;
        gap: 1rem;
    }

    .content { 
        /* background-color: var(--light_01); */
        height: 100%;
    }

    .status {
        /* background-color: var(--light_01); */
        max-width: 25%;
        min-width: 25%;
        width: auto;
        padding-right: 0.5em;
    }

    .report-list {
        overflow: auto;
    }

    .panel {
        /* background-color: var(--light_01); */
        padding: 0 1em;
        padding-left: 0;
        height: auto;
    }

    .chart { min-height: 38em; }


    .btns { 
        justify-content: flex-start; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }


</style>
