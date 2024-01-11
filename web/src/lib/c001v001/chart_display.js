

import { BASE, RGBA } from '../common/colors'
import { 
    LineChartModel, 
    LineChartXScale, 
    LineChartScale, 
    LineChartDataSet, 
    LineChartXSelectScale, 
    CHART_LINE_WIDTH, 
    CHART_MARKER_RADIUS
} from '../common/chart/line_chart'


export const CHT_COLORS = {
    CH4: BASE.PINK,
    HI_FLOW: BASE.ORANGE,
    LO_FLOW: BASE.YELLOW,
    PRESS: BASE.GREEN,
    BAT_AMP: BASE.BLUE,
    BAT_VOLT: BASE.PURPLE,
    MOT_VOLT: BASE.RED
}

export const CHT_DATASET_INDEX = {
    SELECT: 0,
    CH4: 1,
    HI_FLOW: 2,
    LO_FLOW: 3,
    PRESS: 4,
    BAT_AMP: 5,
    BAT_VOLT: 6,
    MOT_VOLT: 7
}

export const CHT_DEFALTS = {
    LIMIT: 100,
    AUTO: true,
    MARGIN: 0.2,
}

const newChartDataSets = ( datasets = [ ] ) => {
    // return [

         /* 1 */
        datasets.push( new LineChartDataSet( [ ], "Methane", "y_ch4", true,
            CHART_LINE_WIDTH, RGBA( CHT_COLORS.CH4, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( CHT_COLORS.CH4, 0.7 ) 
        ) )

         /* 2 */
         datasets.push( new LineChartDataSet( [ ], "High Flow", "y_hi_flow", true, 
            CHART_LINE_WIDTH, RGBA( CHT_COLORS.HI_FLOW, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( CHT_COLORS.HI_FLOW, 0.7 ) 
        ) )

         /* 3 */
         datasets.push( new LineChartDataSet( [ ], "Low Flow", "y_lo_flow", true,
            CHART_LINE_WIDTH,  RGBA( CHT_COLORS.LO_FLOW, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( CHT_COLORS.LO_FLOW, 0.7 ) 
        ) )

         /* 4 */
         datasets.push( new LineChartDataSet( [ ], "Pressure", "y_press", true,
            CHART_LINE_WIDTH, RGBA( CHT_COLORS.PRESS, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( CHT_COLORS.PRESS, 0.7 ) 
        ) )

         /* 5 */
         datasets.push( new LineChartDataSet( [ ], "Battery Amps", "y_bat_amp", false, 
            CHART_LINE_WIDTH, RGBA( CHT_COLORS.BAT_AMP, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( CHT_COLORS.BAT_AMP, 0.7 ) 
        ) )

         /* 6 */
         datasets.push( new LineChartDataSet( [ ], "Battery Volts", "y_bat_volt", false,
            CHART_LINE_WIDTH, RGBA( CHT_COLORS.BAT_VOLT, 0.3 ),  
            CHART_MARKER_RADIUS, RGBA( CHT_COLORS.BAT_VOLT, 0.7 ) 
        ) ) 

         /* 7 */
         datasets.push( new LineChartDataSet( [ ], "Motor Volts", "y_mot_volt", false,
            CHART_LINE_WIDTH, RGBA( CHT_COLORS.MOT_VOLT, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( CHT_COLORS.MOT_VOLT, 0.7 ) 
        ) )

    // ]

    return datasets
}
export const newChartScales = ( ) => {

    return {
        
        x: new LineChartXScale( ),

        y: new LineChartXSelectScale( ),
        
        y_ch4: new LineChartScale( "Ch4 ( % )", 3, -5, 100, "left", 
            RGBA( CHT_COLORS.CH4, 0.9 ), RGBA( BASE.LIGHT, 0.1 ), false,
            true 
        ),
        
        y_hi_flow: new LineChartScale( "Flow ( L/min )", 1.75, -5.0, 250, "left", 
            RGBA( CHT_COLORS.HI_FLOW, 0.9 ), RGBA( BASE.LIGHT, 0.1 ), false,
            true 
        ),
        
        y_lo_flow: new LineChartScale( "Flow ( L/min )", 1, -0.1, 2.5, "left",
            RGBA( CHT_COLORS.LO_FLOW, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), false,
            false 
        ),
        
        y_press: new LineChartScale( "Press ( kPa )", 0, 0, 7000, "right", 
            RGBA( CHT_COLORS.PRESS, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), true,
            true 
        ),
        
        y_bat_amp: new LineChartScale( "Bat ( A )", 0, 0, 1.5, "right", 
            RGBA( CHT_COLORS.BAT_AMP, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), false, 
            false  
        ),
        
        y_bat_volt: new LineChartScale( "Bat ( V )", 1, 0, 15, "right", 
            RGBA( CHT_COLORS.BAT_VOLT, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), false, 
            false 
        ),
        
        y_mot_volt: new LineChartScale( "Mot ( V )", 2, 0, 15, "right", 
            RGBA( CHT_COLORS.MOT_VOLT, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), false, 
            false  
        )

    }

}
export const newChartData = ( ) => {
    let cht = new LineChartModel( "", RGBA( BASE.LIGHT, 0.7 ) )
    cht.options.scales = newChartScales( )
    cht.data.datasets = newChartDataSets( cht.data.datasets )
    return cht
}


