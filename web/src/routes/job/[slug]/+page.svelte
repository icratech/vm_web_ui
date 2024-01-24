<script>

    import { getContext, onMount } from "svelte"
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // 
    import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'

    import { debug } from '../../../lib/des/utils'
    import { RGBA, BASE } from '../../../lib/common/colors'
    import { CHT_COLORS, newChartScales } from '../../../lib/c001v001/chart_display'
    import { Header, Config, Event, Report, Section, OP_CODES, MODES } from '../../../lib/c001v001/models'
    import { generatePDF, generateCSV } from "../../../lib/c001v001/components/report/report_downloads"

    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import InputText from '../../../lib/common/input_text/InputText.svelte'
    import LineChart from '../../../lib/common/chart/LineChart.svelte'

    import HeaderPanel from '../../../lib/c001v001/components/header/HeaderPanel.svelte'
    import HeaderCard from '../../../lib/c001v001/components/header/HeaderCard.svelte'
    import ReportCard from '../../../lib/c001v001/components/report/ReportCard.svelte'
    import ReportBadge from "../../../lib/c001v001/components/report/ReportBadge.svelte"
    import BarGaugeCardReport from '../../../lib/c001v001/components/gauge/BarGaugeCardReport.svelte'
    import ConfigCard from '../../../lib/c001v001/components/config/ConfigCard.svelte'
    import EventPanelRep from '../../../lib/c001v001/components/event/EventPanelRep.svelte'

    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"
    import btn_img_add from "$lib/images/btn-img-add-pink.svg"
    import btn_img_edit_pink from "$lib/images/btn-img-edit-pink.svg"
    import btn_img_edit_green from "$lib/images/btn-img-edit-green.svg"
    import btn_img_add_pink from "$lib/images/btn-img-add-pink.svg"
    import btn_img_add_green from "$lib/images/btn-img-add-green.svg"
    import btn_img_add_aqua from "$lib/images/btn-img-add-aqua.svg"
    import btn_img_add_orange from "$lib/images/btn-img-add-orange.svg"
    import btn_img_add_yellow from "$lib/images/btn-img-add-yellow.svg"

    export let data
    $: JOBS = getContext(  'jobs' )
    $: job = $JOBS.filter( ( j ) => { return j.reg.des_job_name == data.job_name } )[0]

    const getWidth = ( ) => { return window.innerWidth }
    const getHeight = ( ) => { return window.innerHeight }
    $: mapSize =  getWidth( ) * 0.23
    $: mapZoom = 6.5
    $: screen = { w: 1920, h: 953, r: 1, x: 0 }
    onMount( (  ) => { 
        screen.w = window.innerWidth
        screen.h = window.innerHeight
        screen.r = window.devicePixelRatio
        if ( window.innerWidth <= 550 ) mapSize = getWidth( ) - 11 * 3.5
        else if ( window.innerHeight <= 550 ) mapSize = getHeight( ) - 70 
        else if ( window.innerWidth <= 1000 ) mapSize =  getHeight( ) * 0.25 
    } )

    $: loadingMsg = "Loading..."
    $: loaded = false
    const loadJobData = async( ) => {
        let res = await job.getJobData( )
        if ( res.ok ) {
            hdr = ( job.headers ? job.headers.pop( ) : new Header( ) )
            if ( job.reports.length > 0 ) { reportSelected( job.reports[0] ) }
            loaded = true
        } else {
            loadingMsg = res.msg
        }
    }

    /* CAUSES UPDATE ON RELOAD */
    $: { if ( job && !loaded ) { loadJobData( ) } }

    $: toggleAutScaleText = ( job && loaded && job.cht_auto_scale ? 'MAX' : 'AUTO' )
    const toggleAutoScale = ( ) => {
        if ( job && loaded ) {
            job.cht_auto_scale = !job.cht_auto_scale

            if ( job.cht_auto_scale ) {
                let start = job.cht_press.data[ 0 ].x
                let margin = job.cht_scale_margin
                let auto = job.cht_auto_scale
                job.cht.autoScale( job.cht_ch4, start, margin, auto )
                job.cht.autoScale( job.cht_press, start, margin, auto )
                job.cht.autoScale( job.cht_hi_flow, start, margin, auto )
                job.cht.autoScale( job.cht_lo_flow, start, margin, auto )
            } else {
                job.cht.options.scales = newChartScales( )
            }

            debug( "job.cht_auto_scale: ", job.cht_auto_scale )
        }
    }

    $: btn_img_evt_list = btn_img_edit_pink
    $: selected_title = 'All Sections'
    $: selected_title_cls = 'fg-pink'

    $: hdr = new Header( ) // TODO: ENABLE EDIT HEADER  let new_hdr = new Header( )

    $: rep = new Report( )
    const reportSelected = ( report ) => { 
        job.deselectSection( rep )
        rep = report // debug( "Selected Report: ", rep ) 
        job.selectReport( rep )
        job.chartZoomTo( hdr.hdr_start, hdr.hdr_end )
        sec = new Section( )
        evts_sec = null
        cfg = new Config( )
        // cfg = job.configs.reduce( ( pre, cur ) => { return ( 
        //     pre &&
        //     pre.cfg_time >= sec.sec_start &&
        //     pre.cfg_time < sec.sec_end
        // ) ? pre : cur } )
        reportEvents( ) // debug( "Report Events: ", evts )
        btn_img_evt_list = btn_img_edit_pink
        selected_title = 'All Sections'
    }

    $: sec = new Section( )
    $: cfg = new Config( )
    const sectionSelected = async( section ) => { 
        job.deselectSection( rep )
        sec = section // debug( "Selected Section: ", sec ) 
        evts_sec = section
        job.selectSectionMode( sec )
        cfg = job.configs.reduce( ( pre, cur ) => { return ( 
            pre &&
            pre.cfg_time >= sec.sec_start &&
            pre.cfg_time < sec.sec_end //&&
            // pre.cfg_vlv_tgt == pre.cfg_vlv_pos
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
    $: borderColor = RGBA(color_code, 0.35)
    $: { // debug( "Selected Section Mode SMP: ", sec.smp ) // debug( "Selected Section Mode CFG: ", sec.cfg )
        if ( sec.cfg.cfg_time > 0 && sec.smp.smp_time > 0  ){

            switch ( sec.cfg.cfg_vlv_tgt ) {

                case MODES.BUILD: 
                    color_code = CHT_COLORS.PRESS
                    color_code_fg = 'fg-green'
                    btn_img_add_evt = btn_img_add_green
                    break

                case MODES.VENT: 
                    color_code = BASE.AQUA
                    color_code_fg = 'fg-aqua'
                    btn_img_add_evt = btn_img_add_aqua
                    break

                case MODES.HI_FLOW:
                    color_code = CHT_COLORS.HI_FLOW
                    color_code_fg = 'fg-orange'
                    btn_img_add_evt = btn_img_add_orange
                    break

                case MODES.LO_FLOW:
                    color_code = CHT_COLORS.LO_FLOW
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
    $: evts_sec = null
    const reportEvents = ( ) => { 
        evts = job.events.filter( e => { 
            return ( e.evt_addr == job.reg.des_dev_serial || e.evt_code > OP_CODES.OPERATOR_EVENT )
        } )    
    }
    const sectionEvents = ( sec ) => { 
        evts = job.events.filter( e => {  // debug( "Section Event: ", e ) 
            return ( 
                ( e.evt_time >= sec.sec_start && e.evt_time <= sec.sec_end ) && 
                ( e.evt_addr == job.reg.des_dev_serial || e.evt_code >= OP_CODES.REPORT_EVENT )
            )
        } )
    }
    const reloadEvents = async( sec ) => { 
        evts = [ ]
        await job.getJobEvents( )
        if ( sec === null ) { 
            reportEvents( )
        } else {
            sectionEvents( sec )
        }
    }
    // const makeChart = async( ctx, d ) => {

    //     let chart = new Chart( ctx, d )

    //     return {
    //         update( u ) {
    //             chart.data.datasets = u.data.datasets
    //             chart.options.scales = u.options.scales
    //             chart.update( )
    //         },
    //         destroy( ) { 
    //             chart.destroy( ) 
    //         }
    //     }
    // }

    let making_report = false
    let new_rep = new Report( )
    const makeReport = async ( ) => {
        making_report = false
        debug(  "new report title: ", new_rep.rep_title )
        await job.newReport( new_rep )
        new_rep = new Report( )
    }

    let new_sec = new Section( )
    const makeSection = ( rep ) => {
        debug(  "new section name: ", new_sec.sec_name )
        rep.addSection( new_sec )
        new_sec = new Section( )
    }

    $: evt_code = OP_CODES.REPORT_EVENT
    $: evt = new Event( )
    $: {  if ( job && evt ) { evt.evt_time = job.selection } }
    const saveEvent = async( ) => {
        /* TODO: IF EMPTY, DON'T SEND */
        evt.evt_code = OP_CODES.REPORT_EVENT
        await job.newEvent( evt )  
        await reloadEvents( evts_sec )
    }

</script>

<canvas width=1832 height=1465 style="display: none;" id="sec_plot"/>

<div class="flx-col container">

    { #if job }
    <div class="flx-row content">

        { #if loaded }

            <div class="flx-col status" id="stat-panel">

                <!-- <div class="map" style="min-height: { getWidth( ) * 0.25 }px; min-width: { getWidth( ) * 0.25 }px;" use:job.makeMap /> -->
                <div class="map" style= "min-height: { mapSize }px; min-width: { mapSize }px;" use:job.makeMap />

                <div class="flx-col stat-det">
                    <div class="flx-col">
                        <HeaderCard bind:hdr />
                    </div>


                    <div class="flx-col rep-select">
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
                                <h3 class="panel-title">Reports</h3>
                            { /if }
                        </div>
                        <div class="flx-col report-list">
                            { #each job.reports as rep, index ( index ) }
                            <ReportBadge bind:rep on:report-selected={ ( e ) => { reportSelected( e.detail ) } } />
                            { /each }
                        </div>
                    </div>
            </div>


            </div>

            <div class="flx-col panel">
        
                <div class="flx-col chart">
                    <LineChart bind:chartdata={ job.cht } />
                </div>
                
                <div class="flx-row cht-btns">
                    <div class="btn fg-pink" on:click={ toggleAutoScale } on:keyup >{ toggleAutScaleText  }</div>
                </div>

                <div class="flx-row action">

                    <!-- <div id="rep" class="flx-col panel-cont" style="
                        border-bottom: solid 0.05em { borderColor };
                        border-right: solid 0.05em { borderColor };
                    "> -->
                    <div class="flx-col panel-cont rep">
                        
                        
                        <ReportCard
                            bind:job bind:rep
                            on:report-selected={ ( e ) => { reportSelected( e.detail ) } }
                            on:section-selected={ ( e ) => { sectionSelected( e.detail ) } }
                            on:generate-pdf={ async( e ) => { 
                                debug(  "job/[slug]/+page.svelte -> on:generate-pdf: ", e.detail )
                                await generatePDF( job, e.detail, hdr, screen ) 
                            } }
                            on:generate-csv={ async( e ) => { 
                                debug(  "job/[slug]/+page.svelte -> on:generate-csv: ", e.detail )
                                await generateCSV( job, e.detail, hdr ) 
                            } }
                        />
                    </div>

                    <div class="flx-row sec">
                        <!-- <div id="evt" class="flx-col panel-cont" style="
                            border-bottom: solid 0.05em { borderColor };
                            border-right: solid 0.05em { borderColor };
                        "> -->
                        <div class="flx-col panel-cont sec-evts">
                            <EventPanelRep bind:new_evt={evt} bind:smp={ job.selected_smp } 
                                bind:evts 
                                bind:sec_name={ selected_title }
                                bind:color={ color_code }
                                on:send-event={ saveEvent }
                                on:event-selected={ ( e ) => { // debug( "event selected: ", e.detail.evt_time ) 
                                    job.selection = e.detail.evt_time
                                    job.chartPointSelect(  )
                                } }
                            />
                        </div>
    
    
                        <!-- <div id="cfg" class="flx-col panel-cont" style="
                            border-bottom: solid 0.05em { borderColor };
                            border-right: solid 0.05em { borderColor };
                        "> -->
                        <div class="flx-col panel-cont sec-cfg">
                            <!-- <br> -->
                            <div class="flx-col">
                                <BarGaugeCardReport bind:cfg bind:smp={ job.selected_smp }/>
                            </div>
                            <!-- <br> -->
                            <div class="flx-col cfg">
                                <ConfigCard bind:cfg />
                            </div>
                        </div>
                    </div>
                </div>
     
            </div>

        { :else } 
            <div class="flx-row loading"><h1>{ loadingMsg }</h1></div>
        { /if }
    
    </div>
    { /if }

</div>

<style>

    .container {
        overflow: hidden;
        height: 100%;
        gap: 1em;
    }

    .content { 
        height: 100%;
        /* gap: 0.75em; */
    }

    .status {
        max-width: 23%;
        min-width: 23%;
        gap: 1em;
    }
    .map {
        border-radius: 0.5em;
    }
    .stat-det {
        overflow: hidden;
        height: 100%;
        gap: 0.5em; 
    }
    .rep-select {
        overflow: hidden;
        height: 100%;
        gap: 0.5em; 
    }
    .new-rep {
        border-bottom: solid 0.05em var(--light_01);
        padding: 0 0.5em;
        padding-top: 0.75em;
        padding-bottom: 0.5em;
        gap: 0.75em;
    }
    .report-list {
        padding-right: 0.5em;
        overflow: auto;
        height: auto;
        gap: 0.75em;
    }

    .panel {
        padding: 0 1em;
        padding-left: 0;
        height: auto;
        gap: 0.5em;
    }

    .loading {
        justify-content: center;
        align-items: center;
        height: 50%;
    }

    .chart { min-height: 34em; }
    
    .cht-btns {
        border-bottom: solid 0.05em var(--light_01);
        justify-content: flex-end;
        align-items: center;
        padding: 0.5em 1.5em;
        min-height: 3em;
    }
    .btn {
        cursor: pointer;
        padding: 0 0.75em;
        border-radius: 0.25em;
        border: solid 0.05em var(--light_03);
    }
    .btn:hover {
        background-color: var(--pink_01);
        border: solid 0.05em var(--pink_05);
    }

    .action {
        overflow: hidden;
        justify-content: space-between;
        height: 100%;
    }

    .panel-cont { 
        border-bottom: solid 0.05em var(--light_007);
        border-right: solid 0.05em var(--light_007);
        border-bottom-right-radius: 0.5em;
        padding: 1em;
        padding-top: 0;
        height: 100%;
        gap: 0.5em; 
    }

    .rep { 
        min-width: 33%; 
        max-width: 33%; 
    }
    .sec { 
        min-width: 66%; 
        max-width: 66%; 
    }
    .sec-cfg {
        height: auto;
    }
    .cfg {
        padding-top: 0.5em;
    }

    /* LAP TOP */
    @media(max-width: 1500px) {
        .content {
            gap: 0.5em;
        }
        .chart { 
            min-height: 32.5em;
        }
    }

    /* TABLET */
    @media(max-width: 1200px) {
        .container { 
            padding-right: 0.5em; 
            height: auto;
        }
        .content {
            flex-direction: column;
            overflow: auto;
        }
        .status {
            flex-direction: row-reverse;
            height: auto;
            max-width: unset;
            min-width: unset;
            padding-right: 0.5em; 
            width: 100%;
        }
        .map {
            min-height: 30em;
            min-width: 30em;
        }
        .rep-select {
            margin-right: 1em; 
        }
        .panel {
            padding-top: 0.5em;
            padding-right: 0.5em;
        }
        .chart { min-height: 35em; }
        .panel-cont { padding-left: 0; }
        .rep { 
            min-width: 50%; 
            max-width: 50%; 
        }
        .sec { 
            flex-direction: column-reverse;
            justify-content: flex-start;
            min-width: 50%; 
            max-width: 50%; 
            gap: 1.5em;
        }
    }

    @media (max-width: 1100px) and (max-height: 550px ) {
        .chart { min-height: 33em; }
    }

    @media (max-width: 850px) {
        .chart { min-height: 33em; }
    }

    /* MOBILE */
    @media(max-width: 450px) {
        .container { padding-right: 0.5em; }
        .content { flex-direction: column; }
        .status {
            flex-direction: column;
            min-height: unset;
            max-height: unset;
            height: 100%;
            padding: 1.5em;
            padding-right: 0.75em;
            padding-top: 0;
        }
        .stat-det { flex-direction: column; }
        .action {
            flex-direction: column;
            padding-left: 1em;
        }
        .rep { 
            min-width: 100%; 
            max-width: 100%; 
        }
        .sec { 
            min-width: 100%; 
            max-width: 100%; 
        }
    }

</style>
