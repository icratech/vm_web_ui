<script>

    import { getContext, onMount } from "svelte"
    import { Chart } from "chart.js/auto" 
    import { PDFDocument, PageSizes, StandardFonts, degrees, rgb } from 'pdf-lib' // npm install pdf-lib
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // 
    import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'

    import { debug } from '../../../lib/des/utils'
    import { AUTH } from '../../../lib/des/api'
    import { FormatDate, FormatTime, FormatTimeCodeDashed } from '../../../lib/common/format'
    import { PDF_RGB_BASE } from "../../../lib/common/pdf/pdf"
    import { RGBA, BASE } from '../../../lib/common/colors'
    import PillButton from '../../../lib/common/button/PillButton.svelte'
    import InputText from '../../../lib/common/input_text/InputText.svelte'
    import LineChart from '../../../lib/common/chart/LineChart.svelte'

	import { getJobs } from '../../../lib/c001v001/job'
    import { CHT_COLORS } from '../../../lib/c001v001/chart_display'
    import { Header, validateLngLat, Config, Event, Sample, Report, Section, SectionDataSet, 
        OP_CODES, MODES, getMode } from '../../../lib/c001v001/models'
    import { NewPDFChartData, PDF_RGB_COLORS } from "../../../lib/c001v001/components/report/report_pdf"
    import HeaderCard from '../../../lib/c001v001/components/header/HeaderCard.svelte'
    import ReportCard from '../../../lib/c001v001/components/report/ReportCard.svelte'
    import ReportTitle from '../../../lib/c001v001/components/report/ReportTitle.svelte'
    import BarGaugeCardReport from '../../../lib/c001v001/components/gauge/BarGaugeCardReport.svelte'
    import ConfigCard from '../../../lib/c001v001/components/config/ConfigCard.svelte'
    import EventPanelRep from '../../../lib/c001v001/components/event/EventPanelRep.svelte'

    import vent_medic_logo from "$lib/images/vent-medic-logo.png"
    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"
    import btn_img_add from "$lib/images/btn-img-add-aqua.svg"
    import btn_img_edit_pink from "$lib/images/btn-img-edit-pink.svg"
    import btn_img_edit_green from "$lib/images/btn-img-edit-green.svg"
    import btn_img_add_pink from "$lib/images/btn-img-add-pink.svg"
    import btn_img_add_green from "$lib/images/btn-img-add-green.svg"
    import btn_img_add_aqua from "$lib/images/btn-img-add-aqua.svg"
    import btn_img_add_orange from "$lib/images/btn-img-add-orange.svg"
    import btn_img_add_yellow from "$lib/images/btn-img-add-yellow.svg"

    export let data
    $: JOBS = getContext(  'jobs' )
    $: JOBS_LOADED = getContext( 'jobs_loaded' )
    $: job = $JOBS.filter( ( j ) => { return j.reg.des_job_name == data.job_name } )[0]

    // /* CALLED IF USER REFRESHES THE PAGE OR NAVIGATED DIRECTLY TO THIS PAGE */
    // onMount( async( ) => { 
    //     if ( !JOBS_LOADED && sessionStorage.getItem( 'des_auth') != 'none' ) { 
    //         AUTH.set( JSON.parse( sessionStorage.getItem( 'des_auth') ) )
    //         await getJobs( )
    //     }
    // } )

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


    $: btn_img_evt_list = btn_img_edit_pink
    $: selected_title = 'Report'
    $: selected_title_cls = 'fg-pink'

    $: hdr = new Header( ) // TODO: ENABLE EDIT HEADER  let new_hdr = new Header( )

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
    $: color_code_border = RGBA(color_code, 0.5)
    $: { // debug( "Selected Section Mode SMP: ", sec.smp ) // debug( "Selected Section Mode CFG: ", sec.cfg )
        if ( sec.cfg.cfg_time > 0 && sec.smp.smp_time > 0  ){

            // let mode = getMode( sec.cfg, sec.smp )
            // debug( "job/[slug]/+page -> mode: ", sec.cfg.cfg_vlv_tgt )
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

    // let map
    // const makeMap = async( ctx ) => {

    //     map = new mapboxgl.Map( {
    //         container: ctx,
    //         style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
    //         center: validateLngLat( hdr.hdr_geo_lng, hdr.hdr_geo_lat ),
    //         zoom :  5.5,
    //         interactive: true,
    //         preserveDrawingBuffer: true
    //     } )
    //     job.s_mark.addTo( map )
    // }

    
    /* PDF FILE -> GENERATION */
    const generatePDF = async( report ) => {

        let pdfDoc = await PDFDocument.create( )
        const FONT = await pdfDoc.embedFont( StandardFonts.TimesRoman )

        /* CREATE TITLE PAGE */
        await pdfWriteTitlePage( pdfDoc, report, hdr, FONT )

        /* REPORT SECTION PAGES */
        let data = NewPDFChartData( job )
        const pdf_canvas = document.getElementById( 'sec_plot' ) 
        pdf_canvas.width = 650
        pdf_canvas.height = 550

        for ( let i = 0; i < report.rep_secs.length; i++ ) {

            let section = report.rep_secs[ i ] 

            /* CREATE PLOT PAGE */
            await pdfWriteSectionPlot( pdfDoc, section, data, pdf_canvas, FONT )

            /* CREATE DATA PAGE */
            await pdfWriteSectionData( pdfDoc, section, FONT )
            
        }

        /* ADD A FOOTER TO EACH PAGE */
        pdfWriteFooters( pdfDoc, report.rep_title, job.reg.des_job_name, FONT )


        /* DOWNLOAD / SAVE REPORT */
        pdfDownload( pdfDoc, report )

    }
    /* PDF FILE -> DOWNLOAD & SAVE */
    const pdfDownload = async( doc, report ) => {

        let pdfBytes = await doc.save( ) 
        let blob = new Blob( [ pdfBytes ], { type: 'text/rtf' } )
        let fileName = `${ report.rep_title }-${ FormatTimeCodeDashed( Date.now( ) ) }.pdf`
        let saveOptions = { description: "PDF", accept: { "tex/plain" : [ ".pdf" ] } }

        await saveBlobToFile( blob, fileName, saveOptions )

    }
    /* PDF REPORT -> TITLE PAGE */
    const pdfWriteTitlePage = async( doc, report, header, font ) => {
        
        /* CREATE PAGE */
        let page = doc.addPage( PDF_PAGE_SIZE )
        let yPos = PDF_PAGE_H - 5 * PDF_H1

        /* CREATE LOGO IMAGE */
        // let logoBytes = await getImageBytes( vent_medic_logo ) 
        let logoBytes = await ( await fetch( vent_medic_logo ) ).arrayBuffer( )
        let logoPNG = await doc.embedPng( logoBytes )
        let logoPNGSize = logoPNG.scale( 0.175 )
        yPos -= ( logoPNGSize.height + 10 )
        page.drawImage( logoPNG, {
            x: pdfCenterImage( logoPNGSize.width ),
            y: yPos,
            width: logoPNGSize.width,
            height: logoPNGSize.height,
        } )

        /* CREATE REPORT TITLE */
        yPos -= PDF_H1 * 5
        page.drawText( report.rep_title, pdfTextOptions_H1( PDF_PAGE_XL, yPos, font ) )
        page.drawLine( pdfHzLineOptions( yPos -= 8 ) )
        yPos -= PDF_H1

        /* CREATE MAP IMAGE -> TODO: ADD MARKER*/
        let mapBytes = await pdfGetImageBytes( job.map.getCanvas( ).toDataURL( 'image/png' ) )
        let mapPNG = await doc.embedPng( mapBytes )
        let mapPNGSize = mapPNG.scale( 0.56 )
        page.drawImage( mapPNG, {
            x: PDF_PAGE_W / 2, 
            y: yPos - mapPNGSize.height - 10 ,
            width: mapPNGSize.width,
            height: mapPNGSize.height,
        } )
        let mrkSize = 7
        page.drawCircle( {
            x: ( PDF_PAGE_W / 2 ) + ( mapPNGSize.width / 2 ) - ( mrkSize / 2 ),
            y: yPos - ( mapPNGSize.height / 2 ) - 10 + ( mrkSize / 2 ),
            size: mrkSize,
            borderWidth: 1.75,
            borderColor: PDF_RGB_BASE.ORANGE,
        } )

        /* CREATE WELL INFORMATION */   
        let rowHeight = PDF_H3 + 5  
        let lableX = PDF_PAGE_XL
        let valueX = lableX + 90
    
        /* CREATE WELL INFORMATION */ 
        yPos -= rowHeight
        page.drawText( `Company:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.AQUA ) )
        page.drawText( header.hdr_well_co, pdfTextOptions_H3( valueX, yPos, font ) )

        yPos -= rowHeight
        page.drawText( `Well Name:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.AQUA ) )
        page.drawText(  header.hdr_well_name, pdfTextOptions_H3( valueX, yPos, font ) )

        yPos -= rowHeight
        page.drawText( `Surface Loc:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.AQUA ) )
        page.drawText( header.hdr_well_sf_loc, pdfTextOptions_H3( valueX, yPos, font ) )

        yPos -= rowHeight
        page.drawText( `Bottom Loc:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.AQUA ) )
        page.drawText( header.hdr_well_bh_loc, pdfTextOptions_H3( valueX, yPos, font ) )

        yPos -= rowHeight
        page.drawText( `License:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.AQUA ) )
        page.drawText( header.hdr_well_lic, pdfTextOptions_H3( valueX, yPos, font ) )

        yPos -= PDF_H3

        yPos -= rowHeight
        page.drawText( `Longitude:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.ORANGE ) )
        page.drawText(  header.hdr_geo_lng.toFixed( 5 ), pdfTextOptions_H3( valueX, yPos, font ) )
        
        yPos -= rowHeight
        page.drawText( `Latitude:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.ORANGE ) )
        page.drawText( header.hdr_geo_lat.toFixed( 5 ), pdfTextOptions_H3( valueX, yPos, font ) )


        yPos -= PDF_H3

        yPos -= rowHeight
        page.drawText( `Job Start:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.AQUA ) )
        page.drawText( FormatDate( header.hdr_job_start ), pdfTextOptions_H3( valueX, yPos, font ) )
        page.drawText( FormatTime( header.hdr_job_start ), pdfTextOptions_H3( valueX + 80, yPos, font ) )
        
        yPos -= rowHeight
        page.drawText( `Job End:`, pdfTextOptions_H3( lableX, yPos, font, PDF_RGB_BASE.AQUA ) )
        page.drawText( FormatDate( header.hdr_job_end ), pdfTextOptions_H3( valueX, yPos, font ) )
        page.drawText( FormatTime( header.hdr_job_end ), pdfTextOptions_H3( valueX + 80, yPos, font ) )


    }
    /* PDF REPORT -> PLOT PAGE */
    const pdfWriteSectionPlot = async( doc, section, data, canv, font ) => {

        /* CREATE PAGE */
        let page = doc.addPage( PDF_PAGE_SIZE )

        /* GET SECTION DETAILS */ 
        data.options.plugins.title.text = section.sec_name
        data.options.scales.x.min = section.sec_start
        data.options.scales.x.max = section.sec_end    

        /* CREATE PAGE HEADER */
        let yPos = PDF_PAGE_H - 3 * PDF_H1
        page.drawText( `${ section.sec_name } Section Plot`, pdfTextOptions_H1( PDF_PAGE_XL, yPos, font ) )
        page.drawLine( pdfHzLineOptions( yPos -= 8 ) )
        
        /* CREATE CHART IMAGE */
        const pdf_chart = await makeChart( canv, data )
        let plotBytes = await pdfGetImageBytes( canv.toDataURL( ) )
        pdf_chart.destroy( )
        
        let plotPNG = await doc.embedPng( plotBytes )
        let plotPNGSize = plotPNG.scale( 0.34 )

        page.drawImage( plotPNG, {
            x: pdfCenterImage( plotPNGSize.height ), // USE HEIGHT BECASUE WE'RE ROTATING (-90)
            y: yPos - PDF_H1,
            rotate: degrees( -90 ),
            width: plotPNGSize.width,
            height: plotPNGSize.height,
        } )
    }
    /* PDF REPORT -> DATA PAGE */
    const pdfWriteSectionData = async( doc, section, font ) => {

        /* CREATE PAGE */
        let page = doc.addPage( PDF_PAGE_SIZE )

        let xPos = PDF_MARGIN
        let yPos = PDF_PAGE_H - 3 * PDF_H1

        /* CRATE PAGE HEADER */
        page.drawText( `${ section.sec_name } Section Data`, pdfTextOptions_H1( PDF_PAGE_XL, yPos, font ) )
        page.drawLine( pdfHzLineOptions( yPos -= 8 ) )
        yPos -= 5

        /* TABLE FORMATTING */
        let cols = 9
        let columnWidths = pdfSectionDataColumnWidths( cols )
        let columnColors = pdfSectionDataColumnColors( )

        let rows = 33
        let rowHeight = 20
        let smps = job.samples.filter( s => s.smp_time >= section.sec_start && s.smp_time <= section.sec_end )
        let gap = Math.floor( smps.length / rows )

        /* INITIAL ROW DATA */
        let dat = pdfSectionDataColumnUnits( )

        /* WRITE TABLE */
        for ( let j = 0; j < rows; j++ ) {

            if ( j == 1 ) { 

                /* SECOND ROW DATA */
                dat = pdfSectionDataColumnHeaders( ) 

            } else if ( j > 1 ) { 

                /* SUBSEQUENT ROW DATA */
                dat = pdfSectionDataRow( smps[ (  j * gap < smps.length -1 ? j * gap : smps.length - 1 ) ] )

            }

            /* SET ROW START POSITION */
            xPos = PDF_MARGIN
            yPos -= rowHeight

            /* WRITE ROW */
            for ( let i = 0; i < cols; i ++ ) {

                /* ALTERNATE ROW SHADING */
                if ( j > 1 && j % 2 != 0 ) { 
                    page.drawRectangle( { 
                        x: xPos, 
                        y: yPos,
                        height: rowHeight, 
                        width: columnWidths[ i ],  
                        color: PDF_RGB_BASE.LIGHTER 
                    } )
                }

                /* WRITE ROW DATA */
                page.drawText( dat[ i ], pdfTextOptions_P( xPos + 8, yPos + 6, font, columnColors[i] ) )

                xPos += columnWidths[ i ]
            }

        }
    }
    const pdfSectionDataColumnUnits = ( ) => { 
        return [ "", "", "%",    "L/min",    "L/min",    "kPa",  "Amp",  "Volt", "Amp"  ] 
    }
    const pdfSectionDataColumnColors = ( ) => {
        return [
            PDF_RGB_BASE.GREY,  // Date
            PDF_RGB_BASE.DARK, // Time
            PDF_RGB_COLORS.CH4, 
            PDF_RGB_COLORS.HI_FLOW,
            PDF_RGB_COLORS.LO_FLOW,
            PDF_RGB_COLORS.PRESS,
            PDF_RGB_COLORS.BAT_AMP,
            PDF_RGB_COLORS.BAT_VOLT,
            PDF_RGB_COLORS.MOT_VOLT
        ]
    }
    const pdfSectionDataColumnHeaders = ( ) => { 
        return [ "Date", "Time", "Methane",  "H-Flow",   "L-Flow",   "Pressure", "Batt A",   "Batt V",   "Motor A"  ] 
    }
    const pdfSectionDataColumnWidths = ( cols ) => {
        let w = ( PDF_PAGE_W - ( PDF_MARGIN * 2 ) ) / cols
        let ws = [ w + 9, w - 9 ]
        for ( let i = 1; i < cols; i++ ) { ws.push( w ) }
        return ws
    }
    const pdfSectionDataRow = ( smp, dec = 5 ) => {
        return [ 
            FormatDate( smp.smp_time ), 
            FormatTime( smp.smp_time ), 
            smp.smp_ch4.toFixed( dec ),
            smp.smp_hi_flow.toFixed( dec ),
            smp.smp_lo_flow.toFixed( dec ),
            smp.smp_press.toFixed( dec ),
            smp.smp_bat_amp.toFixed( dec ),
            smp.smp_bat_volt.toFixed( dec ),
            smp.smp_mot_volt.toFixed( dec ) 
        ]
    }
    /* PDF REPORT -> PAGE FOOTER */
    const pdfWriteFooters = ( doc, title, job_name, font ) => {

        let y = PDF_P * 3
        let pages = doc.getPages( )
        let i = 1
        pages.forEach( p => {

            p.drawText( title, pdfTextOptions_P( PDF_MARGIN, y, font, PDF_RGB_BASE.DARK ) )

            p.drawText( `Page ${ i } of ${ pages.length }`, pdfTextOptions_P( PDF_PAGE_W / 2.2, y, font, PDF_RGB_BASE.DARK ) )

            p.drawText( job_name, pdfTextOptions_P( PDF_PAGE_W - 180, y, font, PDF_RGB_BASE.GREY ) )

            i++
        } )
    }
    /* PDF REPORT -> PAGE FORMATTING */
    const pdfTextOptions_H1 = ( x, y, font, color=PDF_TEXT_COLOR ) => { 
        return { 
            x: x,
            y: y,
            size: PDF_H1,
            font: font,
            color: color,
        } 
    }
    const pdfTextOptions_H2 = ( x, y, font, color=PDF_TEXT_COLOR ) => { 
        return { 
            x: x,
            y: y,
            size: PDF_H2,
            font: font,
            color: color,
        } 
    }
    const pdfTextOptions_H3 = ( x, y, font, color=PDF_TEXT_COLOR ) => { 
        return { 
            x: x,
            y: y,
            size: PDF_H3,
            font: font,
            color: color,
        } 
    }       
    const pdfTextOptions_P = ( x, y, font, color=PDF_TEXT_COLOR ) => { 
        return { 
            x: x,
            y: y,
            size: PDF_P,
            font: font,
            color: color,
        } 
    }
    const pdfHzLineOptions = ( y ) => { 
        return {
            start: { x: PDF_PAGE_XL, y: y },
            end: { x: PDF_PAGE_XR, y: y },
            thickness: 1,
            color: PDF_RGB_BASE.GREY
        } 
    }
    const pdfCenterImage = ( imgW ) => {
        let x = ( PDF_PAGE_W - imgW ) / 2
        return x
    }
    const pdfGetImageBytes = async( img ) => {
        return await ( await fetch( img ) ).arrayBuffer( )
    }
    const PDF_TEXT_COLOR = PDF_RGB_BASE.GREY
    const PDF_MARGIN = 50
    const PDF_PAGE_SIZE = PageSizes.Letter
    const PDF_PAGE_W = PDF_PAGE_SIZE[0]
    const PDF_PAGE_H = PDF_PAGE_SIZE[1]
    const PDF_PAGE_XL = PDF_MARGIN
    const PDF_PAGE_XR = PDF_PAGE_W - PDF_MARGIN
    const PDF_H1 = 23
    const PDF_H2 = 19
    const PDF_H3 = 13
    const PDF_P = 10


    /* CSV FILE -> GENERATION */
    const generateCSV = async( report ) => {

        /* HEADER INFORMATION */
        const rows = [
            [ "JOB ID", job.reg.des_job_name ],
            [ "COMPANY", hdr.hdr_well_co ],
            [ "WELL NAME", hdr.hdr_well_name ],
            [ "SURFACE LOCATION", hdr.hdr_well_sf_loc ],
            [ "BOTTOM LOCATION", hdr.hdr_well_bh_loc ],
            [ "LICENSE", hdr.hdr_well_lic ],
            [ "LONGITUDE", hdr.hdr_geo_lng ],
            [ "LATITUDE", hdr.hdr_geo_lat ],
            [ "JOB START", FormatDate( hdr.hdr_job_start ), FormatTime( hdr.hdr_job_start ) ],
            [ "JOB END", FormatDate( hdr.hdr_job_end ), FormatTime( hdr.hdr_job_end )  ],
            [],
            csvColumnUnits( ),
            csvColumnHeaders( ),
        ]

        /* SAMPLE DATA */
        for ( let i = 0; i < job.samples.length; i++ ) {
            rows.push( csvDataRow( job.samples[ i ], 8 ) )
        }

        let doc = rows.map( e => e.join( "," ) ).join( "\n" )

        csvDownload( doc, report )

    }
    const csvColumnUnits = ( ) => {
        return [ "Millisecond", "Date", "24 Hour", "%",    "L/min",    "L/min",    "kPa",  "Amp",  "Volt", "Amp"  ] 
    }
    const csvColumnHeaders = ( ) => {
        return [ "Unix", "Date", "Time", "Methane",  "H-Flow",   "L-Flow",   "Pressure", "Batt A",   "Batt V",   "Motor A"  ] 
    }
    const csvDataRow = ( smp, dec = 5 ) => {
        return [ 
            smp.smp_time,
            FormatDate( smp.smp_time ), 
            FormatTime( smp.smp_time ), 
            smp.smp_ch4.toFixed( dec ),
            smp.smp_hi_flow.toFixed( dec ),
            smp.smp_lo_flow.toFixed( dec ),
            smp.smp_press.toFixed( dec ),
            smp.smp_bat_amp.toFixed( dec ),
            smp.smp_bat_volt.toFixed( dec ),
            smp.smp_mot_volt.toFixed( dec ) 
        ]
    }
    /* CSV FILE -> DOWNLOAD & SAVE */
    const csvDownload = async( doc, report ) => {

        // let bytes = await doc.save( ) 
        let blob = new Blob( [ doc ], { type: 'data:text/csv; charset=utf-8;' } )
        let fileName = `${ report.rep_title }-${ FormatTimeCodeDashed( Date.now( ) ) }.csv`
        let saveOptions = { description: "CSV", accept: { "tex/plain" : [ ".csv" ] } }

        await saveBlobToFile( blob, fileName, saveOptions )

    }

    
    /* CSV / PDF / IMG FILE -> SAVE */
    const saveBlobToFile = async( blob, fileName, saveOptions ) => {

        if ( window.navigator && window.navigator.msSaveOrOpenBlob ) {

            window.navigator.msSaveOrOpenBlob( blob )

        } else {

            // if ( window.showSaveFilePicker ) {

            //     /* ALLOW USER TO CHOOSE NAME & LOCATION */
            //     let handle = await showSaveFilePicker( {
            //         suggestedName: fileName,
            //         types: [ saveOptions ]
            //     } )

            //     let writable = await handle.createWritable( )
            //     await writable.write( blob )
            //     writable.close( )

            // } else {

                /* SAVE IN DEFAULT DOWNLOADS FOLDER */
                const url = window.URL.createObjectURL( blob )
                let link = document.createElement( 'a' )
                link.href = url
                link.download = fileName
                link.target="_blank"
                link.click( )

                // For Firefox it is necessary to delay revoking the ObjectURL.
                setTimeout( ( ) => { window.URL.revokeObjectURL( url ) }, 250)

            // }
        }
    }

</script>

<canvas style="display: none;" id="sec_plot"/>

<div class="flx-col container">

    { #if job }
    <div class="flx-row content">

        { #if loaded }

            <div class="flx-col status">
                
                    <div class="flx-col map map-cont">
                        <div class="map-container" use:job.makeMap />
                    </div>

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
                            bind:rep 
                            on:report-selected={ ( e ) => { reportSelected( e.detail ) } }
                            on:generate-pdf={ async( e ) => { await generatePDF( e.detail ) } }
                            on:generate-csv={ async( e ) => { await generateCSV( e.detail ) } }
                        />
                        { /each }
                    </div>

            </div>

            <div class="flx-col panel">
        
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
                        <EventPanelRep bind:job bind:new_evt={evt} bind:smp={ job.selected_smp } bind:evts 
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
