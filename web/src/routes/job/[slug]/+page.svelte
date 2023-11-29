<script>
   
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    import PillButton from '$lib/common/button/PillButton.svelte'
    import InputText from '$lib/common/input_text/InputText.svelte'
    import LineChart from '$lib/common/chart/LineChart.svelte'

    import HeaderCard from '../../../lib/components/header/HeaderCard.svelte'
    import ReportPanel from '../../../lib/components/report/ReportPanel.svelte'
    import ReportCard from '$lib/components/report/ReportCard.svelte'
    import ReportCardTitle from '../../../lib/components/report/ReportCardTitle.svelte'
    import ReportSecPanel from '../../../lib/components/report/ReportSecPanel.svelte'
    import EventPanelRep from '../../../lib/components/event/EventPanelRep.svelte'
    import BarGaugeCardReport from '../../../lib/components/gauge/BarGaugeCardReport.svelte'

    import btn_img_report from "$lib/images/btn-img-edit-pink.svg"
    import btn_img_add from "$lib/images/btn-img-add-pink.svg"

    import btn_img_edit_pink from "$lib/images/btn-img-edit-pink.svg"
    import btn_img_edit_green from "$lib/images/btn-img-edit-green.svg"
    import btn_img_edit_aqua from "$lib/images/btn-img-edit-aqua.svg"
    import btn_img_edit_orange from "$lib/images/btn-img-edit-orange.svg"
    import btn_img_edit_yellow from "$lib/images/btn-img-edit-yellow.svg"

    import { onMount } from "svelte"
	import { Header, OP_CODES, Event, Report, Section, SectionDataSet, debug, Sample, validateMeasuredValue  } from "../../../lib/des_api"
    
    export let data
    import { getContext } from 'svelte'
    $: JOBS = getContext(  'jobs' )
    $: job = $JOBS.filter( ( j ) => { return j.reg.des_job_name == data.job_name } )[0]
    $: btn_img_evt_list = btn_img_edit_pink
    $: selected_title = 'Report'
    $: selected_title_cls = 'fg-pink'

    /* TODO : RETRIEVE LAST HEADER FROM LIST */
    $: hdr = JSON.parse( job.reg.des_job_json ).hdr
    // $: hdr = job.headers.pop( )
    
    /* TODO : RETRIEVE LAST HEADER FROM LIST */
    $: cfg = JSON.parse( job.reg.des_job_json ).cfg
    // $: cfg = job.configs.pop( )

    $: evts = [ ]
 
    let new_hdr = new Header( )

    const reportEvents = ( ) => { 
        return job.events.filter( e => { 
            return ( e.evt_addr == job.reg.des_dev_serial || e.evt_code > OP_CODES.OPERATOR_EVENT )
        } )
    }
    const sectionEvents = ( sec ) => { 
        return job.events.filter( e => { 
            // debug( "Section Event: ", e ) 
            return ( 
                ( e.evt_time >= sec.detail.sec_start && e.evt_time <= sec.detail.sec_end ) && 
                ( e.evt_addr == job.reg.des_dev_serial || e.evt_code > 2000 )
            )
        } )
    }

    $: loaded = false
    onMount( async( ) => {
        loaded = await job.getJobData( )
        hdr = job.headers.pop( )
        cfg = job.configs.pop( )
        evts = reportEvents( )
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

    // $: { 
    //     console.log( "Job page selected time:", job.selection ) 
    //     console.log( "Job page selected sample:", job.selected_smp ) 
    // }

    const makeMap = ( ctx ) => {

    let map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: [ validateMeasuredValue( hdr.hdr_geo_lng ), validateMeasuredValue( hdr.hdr_geo_lat ) ],
            zoom :  5.5,
            interactive: true
        } )

        job.s_mark.addTo( map )

    }

</script>
<div class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col status">

            { #if loaded }
            <div class="flx-col map map-cont">
                <div class="map-container" use:makeMap />
            </div>
            { /if }
        
            <div class="flx-col">
                <HeaderCard bind:hdr />
            </div>

            <div class="flx-col report-list">
                <ReportPanel 
                    bind:job 
                    on:section-selected={ ( sec ) => { // debug( "Selected Section: ", sec.detail ) 
                        job.chartZoomTo( sec.detail.sec_start, sec.detail.sec_end )
                        evts = sectionEvents( sec ) // debug( "Section Events: ", evts )
                        btn_img_evt_list = btn_img_edit_green
                        selected_title = sec.detail.sec_name
                        selected_title_cls = 'fg-green'
                    } } 
                    on:report-selected={ ( rep ) => { // debug( "Selected Report: ", rep.detail ) 
                        job.chartZoomTo( hdr.hdr_start, hdr.hdr_end )
                        evts = reportEvents( ) // debug( "Report Events: ", evts )
                        btn_img_evt_list = btn_img_edit_pink
                        selected_title = rep.detail.rep_title
                    } } 
                />
            </div>

        </div>

        <div class="flx-col panel">
    
            { #if !loaded }
            <div class="flx-row loading">
                <h1>loading...</h1>
            </div>
            { :else }

            <div class="flx-col chart">
                <LineChart bind:chartdata={ job.cht } />
            </div>
            
            <div class="flx-row controls">


                <div class="flx-col report-list">
                    <ReportPanel 
                        bind:job 
                        on:section-selected={ ( sec ) => { // debug( "Selected Section: ", sec.detail ) 
                            job.chartZoomTo( sec.detail.sec_start, sec.detail.sec_end )
                            evts = sectionEvents( sec ) // debug( "Section Events: ", evts )
                            btn_img_evt_list = btn_img_edit_green
                            selected_title = sec.detail.sec_name
                            selected_title_cls = 'fg-green'
                        } } 
                        on:report-selected={ ( rep ) => { // debug( "Selected Report: ", rep.detail ) 
                            job.chartZoomTo( hdr.hdr_start, hdr.hdr_end )
                            evts = reportEvents( ) // debug( "Report Events: ", evts )
                            btn_img_evt_list = btn_img_edit_pink
                            selected_title = rep.detail.rep_title
                        } } 
                    />
                </div>

                <div class="flx-col control-cont">
                    <EventPanelRep bind:job bind:cur_evt bind:evt_code bind:evts 
                        bind:btn_img_evt_list 
                        bind:title={ selected_title }
                        bind:title_cls={ selected_title_cls }
                    />
                </div>

                <div class="flx-col gauge">
                    <div class="flx-col">
                        <BarGaugeCardReport bind:cfg bind:smp={ job.selected_smp }/>
                    </div>
                </div>

                <!-- <div class="flx-col btns">
    
                    <PillButton 
                        on:click={ ( new_rep.rep_title != "" ? makeReport : debug( "enter a report title" ) ) }
                        img={ btn_img_report }
                        hint={ 'New Report' } 
                    />

                    <PillButton 
                        on:click={ ( new_sec.sec_name != "" ? makeSection( cur_rep ) : debug( "enter a section name" ) ) }
                        img={ btn_img_report }
                        hint={ 'New Section' } 
                    />

                    <PillButton 
                        on:click={ ( ) => { job.newHeader( new_hdr ) } }
                        img={ btn_img_report }
                        hint={ 'New Header' } 
                    />

                    <PillButton 
                    on:click={ ( ) => { job.newEvent( cur_evt ) } }
                        img={ btn_img_report }
                        hint={ 'New Event' } 
                    />

                </div> -->

                <!-- <div class="flx-col txts">

                    <InputText bind:txt={ new_rep.rep_title } place={ "Please enter a report title" } enabled={ true } />
                    
                    <InputText bind:txt={ new_sec.sec_name } place={ "Please enter a section name" } enabled={ true } />

                </div> -->

            </div>
            { /if }
    

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
    .map-cont {
        min-height: 28em;
        height: 28em;
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

    .loading {
        justify-content: center;
        align-items: center;
        height: 50%;
    }

    .chart { min-height: 30em; }

    .controls {
        overflow: hidden;
        justify-content: space-between;
        height: 100%;
    }

    /* .control-cont { 
        background-color: var(--light_002);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        padding: 1em;
        gap: 0.5em; 
    } */

    .btns { 
        justify-content: flex-start; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }

    .gauge {
        justify-content: flex-start; 
        height: auto;
    }

</style>
