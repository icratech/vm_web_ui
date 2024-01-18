
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
