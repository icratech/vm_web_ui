
import { debug } from '../../../des/utils'
import { FormatDate, FormatTime, FormatTimeCodeDashed } from '../../../common/format'
import { MODES } from '../../models'
import { Chart } from "chart.js/auto" 
import { PDFDocument, PageSizes, StandardFonts, degrees, rgb } from 'pdf-lib' // npm install pdf-lib
import vent_medic_logo from "$lib/images/vent-medic-logo.png"
import { PDF_RGB_BASE } from "../../../common/pdf/pdf"
import { RGBA } from "../../../common/colors"
import { 
    LineChartModel, 
    LineChartXScale, 
    LineChartScale, 
    LineChartDataSet, 
    LineChartXSelectScale 
} from '../../../common/chart/line_chart'

import { CHT_DATASET_INDEX } from '../../chart_display' 

export const PDFBASE = {
    DARK: "40, 40, 40",
    GREY: "99, 99, 99",
    LIGHT: "230, 230, 230",
    RED: "180, 0, 0",
    ORANGE: "168, 81, 0",
    YELLOW: "164, 129, 14",
    GREEN: "38, 133, 0",
    AQUA: "13, 104, 104",
    BLUE: "8, 94, 181",
    PURPLE: "89, 13, 156",
    PINK: "164, 4, 119",
}

export const PDFCOLORS = {
    CH4: PDFBASE.PINK,
    HI_FLOW: PDFBASE.ORANGE,
    LO_FLOW: PDFBASE.YELLOW,
    PRESS: PDFBASE.GREEN,
    BAT_AMP: PDFBASE.BLUE,
    BAT_VOLT: PDFBASE.PURPLE,
    MOT_VOLT: PDFBASE.RED
}

export const PDF_RGB_COLORS = {
    CH4: PDF_RGB_BASE.PINK,
    HI_FLOW: PDF_RGB_BASE.ORANGE,
    LO_FLOW: PDF_RGB_BASE.YELLOW,
    PRESS: PDF_RGB_BASE.GREEN,
    BAT_AMP: PDF_RGB_BASE.BLUE,
    BAT_VOLT: PDF_RGB_BASE.PURPLE,
    MOT_VOLT: PDF_RGB_BASE.RED
}

const CHART_LINE_WIDTH = 5
const CHART_MARKER_RADIUS = 2

export const NewPDFChartScales = ( labelSize = 23, tickSize = 20 ) => {

    let scales = {
        
        x: new LineChartXScale( tickSize ),

        y: new LineChartXSelectScale( null, null, null, null, null, null, null, false, false, labelSize, tickSize ),
        
        y_ch4: new LineChartScale( "Ch4 ( % )", 3, -5, 100, "left", 
            RGBA( PDFCOLORS.CH4, 1.0 ), RGBA( PDFBASE.DARK, 0.5 ), false, true,
            labelSize, tickSize
        ),
        
        y_hi_flow: new LineChartScale( "Flow ( L/min )", 1.75, -5.0, 250, "left", 
            RGBA( PDFCOLORS.HI_FLOW, 1.0 ), RGBA( PDFBASE.DARK, 0.5 ), false, true,
            labelSize, tickSize
        ),
        
        y_lo_flow: new LineChartScale( "Lo Flow ( L/min )", 1, -0.1, 2.5, "left",
            RGBA( PDFCOLORS.LO_FLOW, 1.0 ), RGBA( PDFBASE.DARK, 0.5 ), false,  false,
            labelSize, tickSize
        ),
        
        y_press: new LineChartScale( "Press ( kPaA )", 0, 0, 7000, "right", 
            RGBA( PDFCOLORS.PRESS, 1.0 ), RGBA( PDFBASE.DARK, 0.5 ), true, true, 
            labelSize, tickSize
        ),
        
        y_bat_amp: new LineChartScale( "Bat ( A )", 0, 0, 1.5, "right", 
            RGBA( PDFCOLORS.BAT_AMP, 1.0 ), RGBA( PDFBASE.DARK, 0.5 ), false, false,  
            labelSize, tickSize
        ),
        
        y_bat_volt: new LineChartScale( "Bat ( V )", 1, 0, 15, "right", 
            RGBA( PDFCOLORS.BAT_VOLT, 1.0 ), RGBA( PDFBASE.DARK, 0.5 ), false, false,
            labelSize, tickSize
        ),
        
        y_mot_volt: new LineChartScale( "Mot ( V )", 2, 0, 15, "right", 
            RGBA( PDFCOLORS.MOT_VOLT, 1.0 ), RGBA( PDFBASE.DARK, 0.5 ), false, false, 
            labelSize, tickSize
        )

    }
    scales.x.grid.color = RGBA( PDFBASE.DARK, 0.5 )
    scales.x.ticks.color = RGBA( PDFBASE.DARK, 0.5 )

    return scales
}
export const NewPDFChartDataSets = ( datasets = [ ], tickSize = 20 ) => {
    // return [

         /* 1 */
        datasets.push( new LineChartDataSet( [ ], "Methane", "y_ch4", true,
            tickSize/4, RGBA( PDFCOLORS.CH4, 0.7 ), 
            tickSize/10, RGBA( PDFCOLORS.CH4, 0.7 ) 
        ) )

         /* 2 */
         datasets.push( new LineChartDataSet( [ ], "High Flow", "y_hi_flow", true, 
         tickSize/4, RGBA( PDFCOLORS.HI_FLOW, 0.7 ), 
         tickSize/10, RGBA( PDFCOLORS.HI_FLOW, 0.7 ) 
        ) )

         /* 3 */
         datasets.push( new LineChartDataSet( [ ], "Low Flow", "y_lo_flow", false,
         tickSize/4,  RGBA( PDFCOLORS.LO_FLOW, 0.7 ), 
         tickSize/10, RGBA( PDFCOLORS.LO_FLOW, 0.7 ) 
        ) )

         /* 4 */
         datasets.push( new LineChartDataSet( [ ], "Pressure", "y_press", true,
         tickSize/4, RGBA( PDFCOLORS.PRESS, 0.7 ), 
         tickSize/10, RGBA( PDFCOLORS.PRESS, 0.7 ) 
        ) )

         /* 5 */
         datasets.push( new LineChartDataSet( [ ], "Battery Amps", "y_bat_amp", false, 
         tickSize/4, RGBA( PDFCOLORS.BAT_AMP, 0.7 ), 
         tickSize/10, RGBA( PDFCOLORS.BAT_AMP, 0.7 ) 
        ) )

         /* 6 */
         datasets.push( new LineChartDataSet( [ ], "Battery Volts", "y_bat_volt", true,
         tickSize/4, RGBA( PDFCOLORS.BAT_VOLT, 0.7 ),  
         tickSize/10, RGBA( PDFCOLORS.BAT_VOLT, 0.7 ) 
        ) ) 

         /* 7 */
         datasets.push( new LineChartDataSet( [ ], "Motor Volts", "y_mot_volt", true,
         tickSize/4, RGBA( PDFCOLORS.MOT_VOLT, 0.7 ), 
         tickSize/10, RGBA( PDFCOLORS.MOT_VOLT, 0.7 ) 
        ) )

    // ]

    return datasets
}
export const NewPDFChartData = ( job, titleSize = 33, labelSize = 23, tickSize = 19 ) => {
    let cht = new LineChartModel( "", RGBA( PDFBASE.LIGHT, 1 ), titleSize )

    cht.options.scales = NewPDFChartScales( labelSize, tickSize )
    
    cht.options.maintainAspectRatio = true
    cht.options.layout.padding = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
    
    cht.options.plugins.title.position = 'top'
    cht.options.plugins.title.font.size = titleSize
    cht.options.plugins.title.display = true
    cht.data.datasets = NewPDFChartDataSets( cht.data.datasets, tickSize )

    cht.data.datasets[CHT_DATASET_INDEX.CH4].data = [ ...job.cht.data.datasets[CHT_DATASET_INDEX.CH4].data ]
    cht.data.datasets[CHT_DATASET_INDEX.HI_FLOW].data = [ ...job.cht.data.datasets[CHT_DATASET_INDEX.HI_FLOW].data ]
    cht.data.datasets[CHT_DATASET_INDEX.LO_FLOW].data = [ ...job.cht.data.datasets[CHT_DATASET_INDEX.LO_FLOW].data ]
    cht.data.datasets[CHT_DATASET_INDEX.PRESS].data = [ ...job.cht.data.datasets[CHT_DATASET_INDEX.PRESS].data ]
    cht.data.datasets[CHT_DATASET_INDEX.BAT_AMP].data = [ ...job.cht.data.datasets[CHT_DATASET_INDEX.BAT_AMP].data ]
    cht.data.datasets[CHT_DATASET_INDEX.BAT_VOLT].data = [ ...job.cht.data.datasets[CHT_DATASET_INDEX.BAT_VOLT].data ]
    cht.data.datasets[CHT_DATASET_INDEX.MOT_VOLT].data = [ ...job.cht.data.datasets[CHT_DATASET_INDEX.MOT_VOLT].data ]

    return cht
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

const adjustForScreen = ( screen ) => {
    let titleSize = 33
    let labelSize = 23
    let tickSize = 19
    debug( "screen: ", screen )

    // let rat = ( screen.w >= screen.h ? screen.r : screen.r * ( screen.h / screen.w ) )
    let rat = 1 //
    if ( screen.h < 400 ) rat = 2.5
    else if ( screen.w < 550 ) rat = Math.floor( screen.r * 1.75 )
    else if ( screen.w < 900 && screen.h > screen.w ) rat = 2.35
    else if ( screen.w < 1100 || screen.h < 450 ) rat = 2
    else if ( screen.w < 1500 ) rat = 1.35
    titleSize = Math.floor( titleSize / rat )
    labelSize = Math.floor( labelSize / rat )
    tickSize = Math.floor( tickSize / rat )
    
    debug( "titleSize: ", titleSize ) 
    debug( "lableSize: ", labelSize ) 
    debug( "tickSize: ", tickSize )
    return { titleSize, labelSize, tickSize }
}

/* PDF FILE -> GENERATION */
export const generatePDF = async( job, report, hdr, screen ) => {
    // debug(  "report_pdf.js -> generatePDF( ): ", report )

    let pdfDoc = await PDFDocument.create( )
    const FONT = await pdfDoc.embedFont( StandardFonts.TimesRoman )

    /* CREATE TITLE PAGE */
    await pdfWriteTitlePage( job, pdfDoc, report, hdr, FONT )

    /* REPORT SECTION PAGES */ 
    let adj = adjustForScreen( screen )
    debug( "titleSize: ", adj.titleSize ) 
    debug( "lableSize: ", adj.labelSize ) 
    debug( "tickSize: ", adj.tickSize )
    let data = NewPDFChartData( job, adj.titleSize, adj.labelSize, adj.tickSize )
    const pdf_canvas = document.getElementById( 'sec_plot' ) 

    for ( let i = 0; i < report.rep_secs.length; i++ ) {

        let section = report.rep_secs[ i ] 

        /* CREATE PLOT PAGE */
        await pdfWriteSectionPlot( pdfDoc, section, data, pdf_canvas, FONT, screen )

        /* CREATE DATA PAGE */
        await pdfWriteSectionData( job, pdfDoc, section, FONT )
    }

    /* ADD A FOOTER TO EACH PAGE */
    pdfWriteFooters( pdfDoc, report.rep_title, job.reg.des_job_name, FONT )

    /* DOWNLOAD / SAVE REPORT */
    pdfDownload( pdfDoc, report )
}
/* PDF FILE -> DOWNLOAD & SAVE */
const pdfDownload = async( doc, report ) => {

    let pdfBytes = await doc.save( ) 
    let blob = new Blob( [ pdfBytes ], { type: "application/pdf" } )
    let fileName = `${ report.rep_title }-${ FormatTimeCodeDashed( Date.now( ) ) }.pdf`

    await saveBlobToFile( blob, fileName )

}
/* PDF REPORT -> TITLE PAGE */
const pdfWriteTitlePage = async( job, doc, report, header, font ) => {
    
    /* CREATE PAGE */
    let page = doc.addPage( PDF_PAGE_SIZE )
    let yPos = PDF_PAGE_H - 5 * PDF_H1

    /* CREATE LOGO IMAGE */
    let logoBytes = await ( await fetch( vent_medic_logo ) ).arrayBuffer( )
    let logoPNG = await doc.embedPng( logoBytes )
    let ls = logoPNG.size( ) // debug( `PNG Size: `, ls )
    let logoPNGSize = logoPNG.scale( 320/ls.width ) // debug( `PNG Size: `, logoPNGSize )
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
    let s = mapPNG.size( ) // debug( `PNG Size: `, s )
    let mapPNGSize = mapPNG.scale( 180/s.height ) // debug( `PNG Size: `, mapPNGSize )
    page.drawImage( mapPNG, {
        x: PDF_PAGE_W / 2 + PDF_MARGIN, // PDF_PAGE_W / 2 - ( PDF_PAGE_W / 2 - s.width ), 
        y: yPos - mapPNGSize.height - 10 ,
        width: mapPNGSize.width,
        height: mapPNGSize.height,
    } )
    let mrkSize = 7
    page.drawCircle( {
        x: ( PDF_PAGE_W / 2 ) + ( mapPNGSize.width / 2 ) - ( mrkSize / 2 ) + PDF_MARGIN,
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
const pdfWriteSectionPlot = async( doc, section, data, canv, font, screen ) => {

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
    let plotBytes = await pdfGetImageBytes( canv.toDataURL( 'image/png', 1 ) )
    pdf_chart.destroy( )
    
    let plotPNG = await doc.embedPng( plotBytes )
    let size = plotPNG.size( ) 
    debug( `PNG Size: `, size )

    let scl = 625 / size.width
    debug( `PNG Scale: `, scl )
    let plotPNGSize = plotPNG.scale( scl )  

    debug( `PNG Scaled Size: `, plotPNGSize )

    page.drawImage( plotPNG, {
        x: pdfCenterImage( plotPNGSize.height ), // USE HEIGHT BECASUE WE'RE ROTATING (-90)
        y: yPos - PDF_H1,
        rotate: degrees( -90 ),
        width: plotPNGSize.width,
        height: plotPNGSize.height,
    } )
}
/* PDF REPORT -> DATA PAGE */
const pdfWriteSectionData = async( job, doc, section, font ) => {

    /* CREATE PAGE */
    let page = doc.addPage( PDF_PAGE_SIZE )

    let xPos = PDF_MARGIN
    let yPos = PDF_PAGE_H - 3 * PDF_H1

    /* CRATE PAGE HEADER */
    page.drawText( `${ section.sec_name } Section Data`, pdfTextOptions_H1( PDF_PAGE_XL, yPos, font ) )
    page.drawLine( pdfHzLineOptions( yPos -= 8 ) )
    yPos -= 5

    let smps = job.samples.filter( s => s.smp_time >= section.sec_start && s.smp_time <= section.sec_end )

    /* TABLE FORMATTING */
    let cols = 8
    let columnWidths = pdfSectionDataColumnWidths( cols )
    let columnColors = pdfSectionDataColumnColors( )

    let rowHeight = 20
    let rows = ( smps.length >= 33 ? 33 :smps.length )
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
            if ( job.samples.length <= rows )
                dat = pdfSectionDataRow( smps[ j ] )
            else
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
    return [ 
        "", 
        "", 
        "%",    
        "L/min",    
        "L/min",    
        "kPaA",  
        // "Amp",  
        "Volt", 
        "Volt"  
    ] 
}
const pdfSectionDataColumnColors = ( ) => {
    return [
        PDF_RGB_BASE.GREY,  // Date
        PDF_RGB_BASE.DARK, // Time
        PDF_RGB_COLORS.CH4, 
        PDF_RGB_COLORS.HI_FLOW,
        PDF_RGB_COLORS.LO_FLOW,
        PDF_RGB_COLORS.PRESS,
        // PDF_RGB_COLORS.BAT_AMP,
        PDF_RGB_COLORS.BAT_VOLT,
        PDF_RGB_COLORS.MOT_VOLT
    ]
}
const pdfSectionDataColumnHeaders = ( ) => { 
    return [ 
        "Date", 
        "Time", 
        "Methane",  
        "H-Flow",   
        "L-Flow",   
        "Pressure", 
        // "Batt A",   
        "Battery",   
        "Motor"  
    ] 
}
const pdfSectionDataColumnWidths = ( cols ) => {
    let w = ( PDF_PAGE_W - ( PDF_MARGIN * 2 ) ) / cols
    let ws = [ w + 9, w - 9 ]
    for ( let i = 1; i < cols; i++ ) { ws.push( w ) }
    return ws
}
const pdfSectionDataRow = ( smp, dec = 5 ) => {
    // return [ 
    //     FormatDate( smp.smp_time ), 
    //     FormatTime( smp.smp_time ), 
    //     smp.smp_ch4.toFixed( dec ),
    //     smp.smp_hi_flow.toFixed( dec ),
    //     smp.smp_lo_flow.toFixed( dec ),
    //     smp.smp_press.toFixed( dec ),
    //     // smp.smp_bat_amp.toFixed( dec ),
    //     smp.smp_bat_volt.toFixed( dec ),
    //     smp.smp_mot_volt.toFixed( dec ) 
    // ]
    return [ 
        FormatDate( smp.smp_time ), 
        FormatTime( smp.smp_time ), 
        ( smp.smp_vlv_pos == MODES.HI_FLOW || smp.smp_vlv_pos == MODES.LO_FLOW ? smp.smp_ch4.toFixed( dec ) :  Number( 0 ).toFixed( dec ) ),
        ( smp.smp_vlv_pos == MODES.HI_FLOW ? smp.smp_hi_flow.toFixed( dec ) :  Number( 0 ).toFixed( dec ) ),
        ( smp.smp_vlv_pos == MODES.LO_FLOW ? smp.smp_lo_flow.toFixed( dec ) :  Number( 0 ).toFixed( dec ) ),
        smp.smp_press.toFixed( dec ),
        // smp.smp_bat_amp.toFixed( dec ),
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
export const generateCSV = async( job, report, hdr ) => {
    debug(  "report_pdf.js -> generateCSV( ): ", report )

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
    return [ 
        "Millisecond", 
        "Date", 
        "24 Hour", 
        "%",    
        "L/min",    
        "L/min",    
        "kPaA",  
        // "Amp",  
        "Volt", 
        "Volt"  
    ] 
}
const csvColumnHeaders = ( ) => {
    return [ 
        "Unix", 
        "Date", 
        "Time", 
        "Methane",  
        "H-Flow",   
        "L-Flow",   
        "Pressure", 
        // "Batt A",   
        "Battery",   
        "Motor"  
    ] 
}
const csvDataRow = ( smp, dec = 5 ) => {
    // return [ 
    //     smp.smp_time,
    //     FormatDate( smp.smp_time ), 
    //     FormatTime( smp.smp_time ), 
    //     smp.smp_ch4.toFixed( dec ),
    //     smp.smp_hi_flow.toFixed( dec ),
    //     smp.smp_lo_flow.toFixed( dec ),
    //     smp.smp_press.toFixed( dec ),
    //     // smp.smp_bat_amp.toFixed( dec ),
    //     smp.smp_bat_volt.toFixed( dec ),
    //     smp.smp_mot_volt.toFixed( dec ) 
    // ]
    return [ 
        smp.smp_time,
        FormatDate( smp.smp_time ), 
        FormatTime( smp.smp_time ), 
        ( smp.smp_vlv_pos == MODES.HI_FLOW || smp.smp_vlv_pos == MODES.LO_FLOW ? smp.smp_ch4.toFixed( dec ) :  Number( 0 ).toFixed( dec ) ),
        ( smp.smp_vlv_pos == MODES.HI_FLOW ? smp.smp_hi_flow.toFixed( dec ) :  Number( 0 ).toFixed( dec ) ),
        ( smp.smp_vlv_pos == MODES.LO_FLOW ? smp.smp_lo_flow.toFixed( dec ) :  Number( 0 ).toFixed( dec ) ),
        smp.smp_press.toFixed( dec ),
        // smp.smp_bat_amp.toFixed( dec ),
        smp.smp_bat_volt.toFixed( dec ),
        smp.smp_mot_volt.toFixed( dec ) 
    ]
}
/* CSV FILE -> DOWNLOAD & SAVE */
const csvDownload = async( doc, report ) => {

    // let bytes = await doc.save( ) 
    let blob = new Blob( [ doc ], { type: 'data:text/csv; charset=utf-8;' } )
    let fileName = `${ report.rep_title }-${ FormatTimeCodeDashed( Date.now( ) ) }.csv`
    let saveOptions = { description: "CSV", accept: { "text/plain" : [ ".csv" ] } }

    await saveBlobToFile( blob, fileName, saveOptions )
}
/* CSV / PDF / IMG FILE -> SAVE */
const saveBlobToFile = async( blob, fileName ) => {

    if ( window.navigator && window.navigator.msSaveOrOpenBlob ) {

        window.navigator.msSaveOrOpenBlob( blob )

    } else {

        /* SAVE IN DEFAULT DOWNLOADS FOLDER */
        const url = window.URL.createObjectURL( blob )
        let link = document.createElement( 'a' )
        link.href = url
        link.download = fileName
        link.target="_blank"
        link.click( )

        // For Firefox it is necessary to delay revoking the ObjectURL.
        setTimeout( ( ) => { window.URL.revokeObjectURL( url ) }, 250)
    }
}
