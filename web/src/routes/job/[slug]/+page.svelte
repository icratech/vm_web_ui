<script>

    import { Chart } from "chart.js/auto"
    import { FormatDate, FormatTime, FormatTimeCodeDashed } from '../../../lib/common/format'
    import { PDFDocument, PDFImage, StandardFonts, rgb } from 'pdf-lib'
    import vent_medic_logo from "$lib/images/vent-medic-logo.svg"
    import vent_medic_nested from "$lib/images/vent-medic-report-cover.png"
    // import fs from 'fs'
    // import { printReportPDF } from '../../../lib/server/report'
     
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
	import { Config, Header, OP_CODES, Event, Report, Section, SectionDataSet, debug, Sample, validateLngLat, COLORS, MODES, getMode  } from "../../../lib/des_api"
    
    export let data
    import { getContext } from 'svelte'
	import { callback } from 'chart.js/helpers';
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

    let canvas
    $: chtPrintData = job.cht
    let chtCanvas
    const makeChart = async( ctx, d ) => {

        let chart = new Chart( ctx, d )

        return {
            update( u ) {
                chart.data.datasets = u.data.datasets
                chart.options.scales = u.options.scales
                chart.update( )
            },
            destroy( ) { 
                chart.destroy( ) 
            }
        }
    }

    $: loaded = false
    onMount( async( ) => {

        await job.getJobData( )
        hdr = job.headers.pop( )
        
        if ( job.reports.length > 0 ) {  // debug( "Selecting Report: ", job.reports[0].rep_title ) 
            reportSelected( job.reports[0] ) 
        }
        debug("Header:", hdr)
        
        canvas = document.getElementById( 'sec_plot' ) 
        canvas.width = 495
        canvas.height = 700
        chtPrintData = job.cht
        chtCanvas = makeChart( canvas, chtPrintData )

        loaded = true
    } )

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
        debug(  "new section name: ", new_sec.sce_name )
        rep.addSection( new_sec )
        new_sec = new Section( )
    }

    $: evt_code = OP_CODES.REPORT_EVENT
    $: evt = new Event( )
    $: {  evt.evt_time = job.selection } 

    const makeMap = ( ctx ) => {

    let map = new mapboxgl.Map( {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: validateLngLat( hdr.hdr_geo_lng, hdr.hdr_geo_lat ),
            zoom :  5.5,
            interactive: false
        } )
        job.s_mark.addTo( map )
    }

    const getImageBytes = async( img ) => {
        return await ( await fetch( img ) ).arrayBuffer( )
    }

    const centerImage = ( pgW, imgW ) => {
        let wDiff = pgW - imgW
        return wDiff / 2
    }
    const getTextWidth = ( text, font ) => {
        // re-use canvas object for better performance
        const canvas = getTextWidth.canvas || ( getTextWidth.canvas = document.createElement( "canvas" ) );
        const context = canvas.getContext( "2d") ;
        context.font = font;
        const metrics = context.measureText( text );
        return metrics.width;
    }

    const pdfWriteSectionPlot = async( doc, page, sec, yStart ) => {

        let recY = yStart - 30
        let start = sec.sec_start
        let end = sec.sec_end 
        // job.printChartImage( sec.sec_start, sec.sec_end )
        let imgFileName = `${ Date.now( ) }-plot.png`
        // let imgBytes = [ ]
        // const done = async( ) => { 
        //     // let link = document.createElement( 'a' )
        //     // link.href = canvas.toDataURL( )
        //     // link.download = imgFileName
        //     // link.click( )
        //     // imgBytes = await fetch( link.href ).then( res => res.arrayBuffer( ) )

            
        //     let img = document.createElement( 'img' )
        //     img.src = canvas.toDataURL( )
        //     // debug( "img src: ", img.src )
        //     // img.rotate="90"
        //     // imgBytes = await fetch( img.src ).then( res => res.arrayBuffer( ) )
        //     let imgBytes = await getImageBytes( vent_medic_nested )
        //     debug( "imgBytes: ", imgBytes )

        //     let pngImage = await doc.embedPng( imgBytes )
        //     debug( "pngImage: ", pngImage )
        //     let imgScale = pngImage.scale( 0.175 )
            
        //     page.drawImage( pngImage, {
        //         x: centerImage( page.getWidth(), imgScale.width ), 
        //         y: 150,
        //         width: imgScale.width, 
        //         height: imgScale.height,
        //     } )
        // }
        // chtPrintData = job.cht
        // chtPrintData.options.scales.x.min = start
        // chtPrintData.options.scales.x.max = end
        // chtPrintData.options.onAnimationComplete = done
        // chtCanvas = makeChart( canvas, chtPrintData )
        // chtPrintData = chtPrintData
        // chtCanvas = await makeChart( canvas, chtPrintData )

        // let link = document.createElement( 'a' )
        // link.href = canvas.toDataURL( )
        // link.download = imgFileName
        // link.click( )
        // imgBytes = await fetch( link.href ).then( res => res.arrayBuffer( ) )
        // let img = document.createElement( 'img' )
        // img.src = canvas.toDataURL( )
        let imgBytes = await getImageBytes( vent_medic_nested )
        debug( "imgBytes: ", imgBytes )

        let pngImage = await doc.embedPng( imgBytes )
        debug( "pngImage: ", pngImage )
        let imgScale = pngImage.scale( 0.175 )
        
        await page.drawImage( pngImage, {
            x: centerImage( page.getWidth(), imgScale.width ), 
            y: 150,
            width: imgScale.width, 
            height: imgScale.height,
        } )
    }

    const pdfWriteSectionData = ( page, sec, font, yStart ) => {

        let smps = job.samples.filter( s => s.smp_time >= sec.sec_start && s.smp_time <= sec.sec_end )
        // debug( "section samples: ", smps )

        let cols = 9
        let rows = 35

        let recW = ( page.getWidth( ) - 100 ) / cols
        let recH = 20
        let recX = 50
        let recY = yStart - 30
        let colHdrs = [
            "Date",
            "Time",
            "Methane",
            "H-Flow",
            "L-Flow",
            "Pressure",
            "Batt A",
            "Batt V",
            "Motor A"
        ]
        let colUnits = [
            "",
            "",
            "%",
            "L/min",
            "L/min",
            "kPa",
            "Amp",
            "Volt",
            "Amp"
        ]

        let gap = Math.floor( smps.length / rows )
        for ( let j = 0; j < rows; j++ ) {
            let y = recY - ( j * recH )
            let dat = colUnits
            if ( j == 1 ) {
                dat = colHdrs
            } else if ( j > 1 ) {
                let row = j * gap
                if ( row > smps.length -1 ) { row = smps.length - 1 }
                let s = smps[ row ] 
                dat = [ 
                    FormatDate( s.smp_time ), 
                    FormatTime( s.smp_time ), 
                    s.smp_ch4.toFixed( 3 ),
                    s.smp_hi_flow.toFixed( 3 ),
                    s.smp_lo_flow.toFixed( 3 ),
                    s.smp_press.toFixed( 3 ),
                    s.smp_bat_amp.toFixed( 3 ),
                    s.smp_bat_volt.toFixed( 3 ),
                    s.smp_mot_volt.toFixed( 3 ) 
                ]
            }
            for ( let i = 0; i < cols; i ++ ) {
                let c = 0.58 + ( i * .05 )
                let x = recX + ( i * recW )
                page.drawRectangle( {
                    height: recH,
                    width: recW,
                    x: x,
                    y: y,
                    color: rgb( 1, 1,1 )
                } )
                page.drawText( dat[ i ], {
                    x: x,
                    y: y + 3,
                    size: 10,
                    font: font,
                    color: rgb( .2, .2, .2 ),
                } )
            }
        }
    }

    const pdfWriteFooters = ( doc, title, job_name, font ) => {
        let size = 10
        let y = size * 2
        let pages = doc.getPages( )
        let i = 1
        pages.forEach( p => {
            p.drawText( `${ title }`, { 
                x: 50, 
                y: y, size: size, font: font, color: rgb( .2, .2, .2 ),
            } )
            p.drawText( `Page ${ i } of ${ pages.length }`, { 
                x: 265, 
                y: y, size: size, font: font, color: rgb( .2, .2, .2 ),
            } )
            p.drawText( `${ job_name }`, { 
                x: p.getSize( ).width - 180, 
                y: y, size: size, font: font, color: rgb( .5, .5, .5 ),
            } )
            i++
        } )
    }

    const printReportPDF = async( r ) => {
        let pdfDoc = await PDFDocument.create( )
        let timesRomanFont = await pdfDoc.embedFont( StandardFonts.TimesRoman )
        let page = pdfDoc.addPage( )
        let height = page.getSize( ).height
        let fontSize = 30
        page.drawText( r.rep_title, { 
            x: centerImage( page.getWidth( ), getTextWidth( r.rep_title , timesRomanFont ) ),
            y: height - 4 * fontSize,
            size: fontSize,
            font: timesRomanFont,
            color: rgb( .2, .2, .2 ),
        } ) 

        debug( "pdf -> page.getTrimBox( ): ", page.getTrimBox( ) )

        let imgBytes = await getImageBytes( vent_medic_nested ) // debug( "Main imgBytes: ", imgBytes )
        let imgVMNestedPng = await pdfDoc.embedPng( imgBytes )
        let dimVMNestedPNG = imgVMNestedPng.scale( 0.175 )

        page.drawImage( imgVMNestedPng, {
            x: centerImage( page.getWidth(), dimVMNestedPNG.width ),
            y: 5 * fontSize,
            width: dimVMNestedPNG.width,
            height: dimVMNestedPNG.height,
        } )

        r.rep_secs.forEach( ( s ) => {
            let fontSize = 23

            let plotPage = pdfDoc.addPage( )
            let plotPgH = plotPage.getSize( ).height
            let plotTitleY = height - 3 * fontSize
            plotPage.drawText( `${ s.sec_name } Section Plot`, { 
                x: 50,
                y: plotTitleY,
                size: fontSize,
                font: timesRomanFont,
                color: rgb( .2, .2, .2 ),
            } )
            // await pdfWriteSectionPlot( pdfDoc, plotPage, s, plotTitleY )
            let plotBytes = getImageBytes( canvas.toDataURL( ) )
            debug( "plotBytes: ", plotBytes )
            // let plotPNG = pdfDoc.embedPng( plotBytes )
            // let dimPlotPNG = plotPNG.scale( 0.175 )

            // plotPage.drawImage( plotPNG, {
            //     x: centerImage( page.getWidth(), dimPlotPNG.width ),
            //     y: 3 * fontSize,
            //     width: dimPlotPNG.width,
            //     height: dimPlotPNG.height,
            // } )
            plotPage.drawImage( imgVMNestedPng, {
                x: centerImage( page.getWidth(), dimVMNestedPNG.width ),
                y: 5 * fontSize,
                width: dimVMNestedPNG.width,
                height: dimVMNestedPNG.height,
            } )

            let dataPage = pdfDoc.addPage( )
            let dataPgH = dataPage.getSize( ).height
            let dataTitleY = height - 3 * fontSize
            dataPage.drawText( `${ s.sec_name } Section Data`, { 
                x: 50,
                y: dataTitleY,
                size: fontSize,
                font: timesRomanFont,
                color: rgb( .2, .2, .2 ),
            } )
            pdfWriteSectionData( dataPage, s, timesRomanFont, dataTitleY )
        } )

        pdfWriteFooters( pdfDoc, r.rep_title, job.reg.des_job_name, timesRomanFont )

        let pdfBytes = await pdfDoc.save( ) // debug( "PDF file size: ", pdfBytes.length )

        let doc = new Blob( [ pdfBytes ], { type: 'text/rtf' } )

        if ( window.navigator && window.navigator.msSaveOrOpenBlob ) {
            window.navigator.msSaveOrOpenBlob( doc )
        } else {
            const objUrl = window.URL.createObjectURL( doc )

            let link = document.createElement( 'a' )
            link.href = objUrl
            link.download = `${ r.rep_title }-${ FormatTimeCodeDashed( Date.now( ) ) }.pdf`
            link.target="_blank"
            link.click( )

            // For Firefox it is necessary to delay revoking the ObjectURL.
            setTimeout( ( ) => { window.URL.revokeObjectURL( objUrl ) }, 250)
        }
    }

    $: uri = ""

</script>
<canvas style="display: none;" id="sec_plot"/>
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

            { #if loaded }
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
                    bind:rep 
                    on:report-selected={ ( e ) => { reportSelected( e.detail ) } }
                    on:print-pdf={ async( e ) => { await printReportPDF( e.detail ) } }
                />
                { /each }
            </div>
            { /if }

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
