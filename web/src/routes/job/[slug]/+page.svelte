<script>
   
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    import PillButton from '$lib/common/button/PillButton.svelte'
    import InputText from '$lib/common/input_text/InputText.svelte'
    import LineChart from '$lib/common/chart/LineChart.svelte'

    import HeaderCard from '../../../lib/components/header/HeaderCard.svelte'
    import ReportPanel from '../../../lib/components/report/ReportPanel.svelte'
    import ReportCard from '$lib/components/report/ReportCard.svelte'
    import ReportTitle from '../../../lib/components/report/ReportTitle.svelte'
    import ReportSecTitle from '../../../lib/components/report/ReportSecTitle.svelte'
    import ReportSecPanel from '../../../lib/components/report/ReportSecPanel.svelte'
    import BarGaugeCardReport from '../../../lib/components/gauge/BarGaugeCardReport.svelte'
    import ConfigCard from '../../../lib/components/config/ConfigCard.svelte'
    import EventPanelRep from '../../../lib/components/event/EventPanelRep.svelte'

    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"
    import btn_img_add from "$lib/images/btn-img-add-aqua.svg"

    import btn_img_edit_pink from "$lib/images/btn-img-edit-pink.svg"
    import btn_img_edit_green from "$lib/images/btn-img-edit-green.svg"
    import btn_img_edit_aqua from "$lib/images/btn-img-edit-aqua.svg"
    import btn_img_edit_orange from "$lib/images/btn-img-edit-orange.svg"
    import btn_img_edit_yellow from "$lib/images/btn-img-edit-yellow.svg"
    
    import btn_img_add_pink from "$lib/images/btn-img-add-pink.svg"
    import btn_img_add_green from "$lib/images/btn-img-add-green.svg"
    import btn_img_add_aqua from "$lib/images/btn-img-add-aqua.svg"
    import btn_img_add_orange from "$lib/images/btn-img-add-orange.svg"
    import btn_img_add_yellow from "$lib/images/btn-img-add-yellow.svg"

    import { RGBA, BASE } from '$lib/common/colors'

    import { onMount } from "svelte"
	import { Config, Header, OP_CODES, Event, Report, Section, SectionDataSet, debug, Sample, validateMeasuredValue, COLORS, MODES, getMode  } from "../../../lib/des_api"
    
    export let data
    import { getContext } from 'svelte'
    $: JOBS = getContext(  'jobs' )
    $: job = $JOBS.filter( ( j ) => { return j.reg.des_job_name == data.job_name } )[0]
    $: btn_img_evt_list = btn_img_edit_pink
    $: selected_title = 'Report'
    $: selected_title_cls = 'fg-pink'

    /* TODO : RETRIEVE LAST HEADER FROM LIST */
    $: hdr = new Header( )
 
    let new_hdr = new Header( )

    $: rep = new Report( )
    const reportSelected = ( report ) => { 
        job.deselectSection( rep )
        rep = report // debug( "Selected Report: ", rep ) 
        job.selectReport( rep )
        job.chartZoomTo( hdr.hdr_start, hdr.hdr_end )
        sec = new Section( )
        cfg = new Config( )
        // cfg = job.configs.reduce( ( pre, cur ) => { return ( 
        //     pre &&
        //     pre.cfg_time >= sec.sec_start &&
        //     pre.cfg_time < sec.sec_end
        // ) ? pre : cur } )
        reportEvents( ) // debug( "Report Events: ", evts )
        btn_img_evt_list = btn_img_edit_pink
        selected_title = rep.rep_title
    }

    $: sec = new Section( )
    $: cfg = new Config( )
    const sectionSelected = async( section ) => { 
        job.deselectSection( rep )
        sec = section // debug( "Selected Section: ", sec ) 
        job.selectSectionMode( sec )
        cfg = job.configs.reduce( ( pre, cur ) => { return ( 
            pre &&
            pre.cfg_time >= sec.sec_start &&
            pre.cfg_time < sec.sec_end
        ) ? pre : cur } ) 
        job.chartZoomTo( sec.sec_start, sec.sec_end )
        sectionEvents( sec ) // debug( "Section Events: ", evts )
        btn_img_evt_list = btn_img_edit_green
        selected_title = sec.sec_name
        selected_title_cls = 'fg-green'
    } 

    $: color_code = BASE.PINK
    $: color_code_fg = 'fg-pink'
    $: btn_img_add_evt = btn_img_edit_pink
    $: color_code_border = RGBA(color_code, 0.5)
    $: { // debug( "Selected Section Mode SMP: ", sec.smp ) // debug( "Selected Section Mode CFG: ", sec.cfg )
        if ( sec.cfg.cfg_time > 0 && sec.smp.smp_time > 0  ){

            switch ( getMode( sec.cfg, sec.smp ) ) {

                case MODES.BUILD: 
                    color_code = COLORS.PRESS
                    color_code_fg = 'fg-green'
                    btn_img_add_evt = btn_img_add_green
                    break

                case MODES.VENT: 
                    color_code = BASE.AQUA
                    color_code_fg = 'fg-aqua'
                    btn_img_add_evt = btn_img_add_aqua
                    break

                case MODES.HI_FLOW:
                    color_code = COLORS.HI_FLOW
                    color_code_fg = 'fg-orange'
                    btn_img_add_evt = btn_img_add_orange
                    break

                case MODES.LO_FLOW:
                    color_code = COLORS.LO_FLOW
                    color_code_fg = 'fg-yellow'
                    btn_img_add_evt = btn_img_add_yellow
                    break
            }
        } else {
            color_code = BASE.PINK
            color_code_fg = 'fg-pink'
            btn_img_add_evt = btn_img_add_pink
        }
    }

    $: evts = [ ]
    const reportEvents = ( ) => { 
        evts = job.events.filter( e => { 
            return ( e.evt_addr == job.reg.des_dev_serial || e.evt_code > OP_CODES.OPERATOR_EVENT )
        } )
    }
    const sectionEvents = ( sec ) => { 
        evts = job.events.filter( e => {  // debug( "Section Event: ", e ) 
            return ( 
                ( e.evt_time >= sec.sec_start && e.evt_time <= sec.sec_end ) && 
                ( e.evt_addr == job.reg.des_dev_serial || e.evt_code > 2000 )
            )
        } )
    }

    $: loaded = false
    onMount( async( ) => {
        await job.getJobData( )
        hdr = job.headers.pop( )
        
        if ( job.reports.length > 0 ) {  // debug( "Selecting Report: ", job.reports[0].rep_title ) 
            reportSelected( job.reports[0] ) 
        }
        debug("Header:", hdr)
        loaded = true
    } )

    let making_report = false
    let new_rep = new Report( )
    const makeReport = async ( ) => {
        debug(  "new report title: ", new_rep.rep_title )
        await job.newReport( new_rep )
        new_rep = new Report( )
        making_report = false
    }

    let new_sec = new Section( )
    const makeSection = ( rep ) => {
        debug(  "new section name: ", new_sec.sce_name )
        rep.addSection( new_sec )
        new_sec = new Section( )
    }

    $: evt_code = 2001
    $: evt = new Event( )
    $: {  evt.evt_time = job.selection } 

    const makeMap = ( ctx ) => {

    let map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: [ validateMeasuredValue( hdr.hdr_geo_lng ), validateMeasuredValue( hdr.hdr_geo_lat ) ],
            zoom :  5.5,
            interactive: false
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

            <div class="flx-row new-rep">

                { #if making_report }
                
                    <PillButton 
                        on:click={ ( ) => { making_report = false } }
                        img={ btn_img_cancel }
                        hint={ 'Cancel' } 
                    />

                    <PillButton 
                        on:click={ ( new_rep.rep_title != "" ? makeReport : debug( "enter a report title" ) ) }
                        img={ btn_img_confirm }
                        hint={ 'Confirm' } 
                    />

                    <InputText bind:txt={ new_rep.rep_title } place={ "Please enter a report title" } enabled={ true } />

                { :else }

                    <PillButton 
                        on:click={ ( ) => { making_report = true } }
                        img={ btn_img_add }
                        hint={ null } 
                    />

                    <div class="flx-row new-rep-lbl">New Report</div>

                { /if }
            </div>

            <div class="flx-col report-list">
                { #each job.reports as rep ( rep.rep_id ) }
                <ReportTitle 
                    bind:job bind:rep 
                    on:report-selected={ ( e ) => { reportSelected( e.detail ) } }
                />
                { /each }
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


                <div class="flx-col rep-sections">
                    
                    <ReportCard
                        bind:job bind:rep 
                        on:report-selected={ ( e ) => { reportSelected( e.detail ) } }
                        on:section-selected={ ( e ) => { sectionSelected( e.detail ) } }
                    />

                </div>


                <div class="flx-col control-cont">
                    <EventPanelRep bind:job bind:cur_evt={evt} bind:evt_code bind:evts 
                        bind:rep_title={ rep.rep_title }
                        bind:title={ selected_title }
                        bind:btn_img_add_evt 
                        bind:color_code_border
                        bind:color_code_fg
                    />
                </div>

                <div class="flx-col gauge">
                    <br>
                    <div class="flx-col">
                        <BarGaugeCardReport bind:cfg bind:smp={ job.selected_smp }/>
                    </div>
                    <br>
                    <div class="flx-col">
                        <ConfigCard bind:cfg />
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
        gap: 1em;
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
        gap: 0.5em;
    }
    .new-rep {
        border-bottom: solid 0.1em var(--accent_aa);
        padding: 0 1em;
        padding-bottom: 0.5em;
        margin-bottom: 0.5em;
        gap: 0.75em;
    }
    .new-rep-lbl {
        align-items: center;
        font-size: 1.2em;
    }
    .map-cont {
        min-height: 28em;
        height: 28em;
    }
    .report-list {
        padding-right: 0.5em;
        overflow: auto;
        height: 100%;
        gap: 0.75em;
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
        gap:2em;
    }

    .rep-sections {
        height: 100%;;
    }

    .gauge {
        justify-content: flex-start; 
        height: auto;
    }

</style>
