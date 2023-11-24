<script>

    import PillButton from '$lib/common/button/PillButton.svelte'
    import InputText from '$lib/common/input_text/InputText.svelte'
    import LineChart from '$lib/common/chart/LineChart.svelte'

    import HeaderCard from '../../../lib/components/header/HeaderCard.svelte'
    import ReportCard from '$lib/components/report/ReportCard.svelte'
    import EventPanelRep from '../../../lib/components/event/EventPanelRep.svelte'
    import BarGaugeCardReport from '../../../lib/components/gauge/BarGaugeCardReport.svelte'

    import btn_img_report from "$lib/images/btn-img-report.svg"
    import btn_img_add from "$lib/images/btn-img-add.svg"

    import { onMount } from "svelte"
	import { Header, Event, Report, Section, SectionDataSet, debug, Sample  } from "../../../lib/des_api"
    
    export let data
    import { getContext } from 'svelte'
    $: JOBS = getContext(  'jobs' )
    $: job = $JOBS.filter( ( j ) => { return j.reg.des_job_name == data.job_name } )[0]

    /* TODO : RETRIEVE LAST HEADER FROM LIST */
    $: hdr = JSON.parse( job.reg.des_job_json ).hdr
    // $: hdr = job.headers.pop( )
    
    /* TODO : RETRIEVE LAST HEADER FROM LIST */
    $: cfg = JSON.parse( job.reg.des_job_json ).cfg
    // $: cfg = job.configs.pop( )

    let new_hdr = new Header( )

    $: loaded = false
    onMount( async( ) => {
        loaded = await job.getJobData( )
        hdr = job.headers.pop( )
        cfg = job.configs.pop( )
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
    $: {  cur_evt.evt_time = job.selection } 

    $: { 
        console.log( "Job page selected time:", job.selection ) 
        console.log( "Job page selected sample:", job.selected_smp ) 
    }

</script>
<div class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col status">

            <div class="flx-col">
            <HeaderCard bind:hdr />
            </div>
            
            <br>

            Reports
            <div class="flx-row btns">
                <!-- <BarGaugeCardReport bind:cfg bind:smp={ job.selected_smp }/> -->
                
                <PillButton 
                    on:click={ ( new_rep.rep_title != "" ? makeReport : debug( "enter a report title" ) ) }
                    cls={ 'bg-aqua' }
                    img={ btn_img_add }
                    hint={ 'New Report' } 
                />

                <InputText bind:txt={ new_rep.rep_title } place={ "Please enter a report title" } enabled={ true } />
            </div>
            


            <div class="flx-col report-list">
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


                <div class="flx-col gauge">
                    <BarGaugeCardReport bind:cfg bind:smp={ job.selected_smp }/>
                    <!-- <BarGaugeCardReport bind:cfg /> -->
                </div>

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
                { #if loaded }
                <div class="flx-col control-cont">

                    <EventPanelRep
                        bind:job
                        bind:cur_evt
                        bind:evt_code
                    />

                </div>
                { :else }
                <h3>loading...</h3>
                { /if }

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
        height: 100%;
    }

    .panel {
        /* background-color: var(--light_01); */
        padding: 0 1em;
        padding-left: 0;
        height: auto;
    }

    .controls {
        overflow: hidden;
        justify-content: space-between;
        height: 100%;
    }

    .control-cont { 
        background-color: var(--light_002);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        padding: 1em;
        gap: 0.5em; 
    }

    .chart { min-height: 38em; }


    .btns { 
        justify-content: flex-start; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }

    .gauge{
        justify-content: flex-start; 
        height: auto;
    }

</style>
