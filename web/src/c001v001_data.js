

/* CHARTJS DATA STRUCTURES ***************************************************************************/
export class LineChartModel {
    constructor( title, color ) {

        this.type = 'line'
        
        this.data = { 
            labels: [ ], 
            datasets: [ ] 
        }
        
        this.options = {
            color: color,
            animation: false, 
            responsive: true, 
            maintainAspectRatio: false,
            parsing: false, 
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    bottom: 10,
                }
            },
            interaction: { 
                mode: "index", 
                intersection: false 
            },
            scales: { 
                x: LineChartXScale 
            },
            plugins: { 
                title: { 
                    text: title, 
                    fontSize: 16,
                    position: "bottom",
                    display: false 
                },
                legend: {
                    position: "top",
                    align: "center",
                    display: false,
                    labels: {
                        textAlign: "center",
                        boxHeight: 20,
                        boxWidth: 20,
                        borderRadius: 10,
                        useBorderRadius: true,
                        padding: 20,
                    },
                },
                decimation: { 
                    algorithm: "lttb",
                    enabled: true 
                },
                zoom: {
                    zoom: {
                        mode: "xy",
                        scaleMode: "xy",
                        wheel: { enabled: true, speed: 0.125, },
                        drag: { enabled: true },
                    },
                    pan: { enabled: false }
                },
        //         // tooltip: { position: "fixed" }
            }
        }
    }

    pushPoint( point, set = [ ], scale, limit, scale_margin ) {

        let x_min = set.pushSample( limit, point )
        let filt = set.data.filter( x => x.x >= x_min )
        let Ys = filt.map( p => p.y )
        let min = Math.min( ...Ys ) // console.log( min )
        let max = Math.max( ...Ys ) // console.log( max )
        if ( max - min > 0 ) {
            scale.min = min - ( ( max - min ) * scale_margin )
            scale.max = max +  ( ( max - min ) * scale_margin )
        }    
        this.options.scales.x.min = x_min
        this.options.scales.x.max = point.x
    }
}

export let LineChartXScale = {
    type: 'time',
    time: {
        // unit: 'day',
        displayFormats: {
            day: "d-MMM HH:mm",
            millisecond: "HH:mm:ss.SSS",
            // day: 'MMM DD',
            hour: 'd-MMM HH:mm',
            minute: 'HH:mm',
            second: 'HH:mm:ss'
        }
    },
    grid: { 
        color: RGBA( BASE.LIGHT, 0.2 ),
        display: true
    },
    position: 'bottom',
    border: {
        display: true,
        color: RGBA( BASE.LIGHT, 0.2 ),
        width: 1,
    },
    title: {
        display: false,
        // align: "end",
        font: {
            size: 15,
        },
        padding: {
            top: 13,
            bottom: 13,
        },
        color: RGBA( BASE.LIGHT, 0.7 ),
        text: "Time",
    },
    ticks: {
        autoSkip: true,
        autoSkipPadding: 50,
        maxRotation: 0,
        color: RGBA( BASE.LIGHT, 0.7 ),
        padding: 15,
    }
}

export class LineChartDataSet {
    data = [ ]
    label = "Unknown"
    yAxisID = "y"
    lineWidth = 1.5
    lineColor = RGBA( BASE.LIGHT, 0.3 )
    markerRadius = 1
    markerColor = RGBA( BASE.LIGHT, 0.7 )
    backgroundColor =  RGBA( BASE.LIGHT, 0.7 )
    constructor( 
        data = [ ],
        label = "Unknown",
        yAxisID = "y",
        lineWidth = 1.5,
        lineColor = RGBA( BASE.LIGHT, 0.3 ),
        markerRadius = 1,
        markerColor = RGBA( BASE.LIGHT, 0.7 )
    ) {
        this.data = data
        this.label = label
        this.hidden = false
        this.xAxisID = "x" // xAxisID
        this.yAxisID = yAxisID
        this.borderWidth = lineWidth
        this.borderColor = lineColor
        this.radius = markerRadius
        this.backgroundColor = markerColor
    }
    
    pushSample( limit, point = { x: 0, y: 0.0 } ) {
        if ( this.data[0].x == 0 )  { this.data.shift( ) }
        let len = this.data.push( point ) 
        
        if ( limit > 0 ) {
            for ( len; len > limit; len-- ) {
                this.data.shift( )
            }
        }
        return this.data[0].x
    }
}
export class XYPoint { 
    constructor( 
        point = { x: 0, y: 0.0 } 
    ) { 
        this.x = point.x, 
        this.y = point.y 
    } 
}

export class LineChartScale {
    constructor( 
        title, 
        weight, 
        min,
        max,
        position,
        color,
        gridColor,
        showGrid,
    ) {
        this.type = "linear"
        this.min = min
        this.max = max
        this.position = position
        this.weight = weight,
        this.display = true
        this.border = {
            display: true,
            color: gridColor,
            width: 1,
        }
        this.title = {
            display: true,
            align: "end",
            font: {
                size: 15,
            },
            padding: {
                top: 13,
                bottom: 3,
            },
            color: color,
            text: title,
        }
        this.ticks = { 
            color: color ,
            callback: function( value ) {
                return value.toFixed( 1 )
            }
        }
        this.grid = { 
            display: showGrid,
            color: gridColor,
        }
    }
}

export const CHART_LINE_WIDTH = 1.5
export const CHART_MARKER_RADIUS = 1

const NewChartDataSets = ( ) => {
    return [

         /* 0 */
        new LineChartDataSet( [ { x: 0, y: 0.0 } ], "Methane", "y_ch4",
            CHART_LINE_WIDTH, RGBA( COLORS.CH4, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.CH4, 0.7 ) 
        ),

         /* 1 */
        new LineChartDataSet( [ { x: 0, y: 0.0 } ], "High Flow", "y_hi_flow", 
            CHART_LINE_WIDTH, RGBA( COLORS.HI_FLOW, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.HI_FLOW, 0.7 ) 
        ),  

         /* 2 */
        new LineChartDataSet( [ { x: 0, y: 0.0 } ], "Low Flow", "y_lo_flow", 
            CHART_LINE_WIDTH,  RGBA( COLORS.LO_FLOW, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.LO_FLOW, 0.7 ) 
        ),

         /* 3 */
        new LineChartDataSet( [ { x: 0, y: 0.0 } ], "Pressure", "y_press", 
            CHART_LINE_WIDTH, RGBA( COLORS.PRESS, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.PRESS, 0.7 ) 
        ),

         /* 4 */
        new LineChartDataSet( [ { x: 0, y: 0.0 } ], "Battery Amps", "y_bat_amp", 
            CHART_LINE_WIDTH, RGBA( COLORS.BAT_AMP, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.BAT_AMP, 0.7 ) 
        ),

         /* 5 */
        new LineChartDataSet( [ { x: 0, y: 0.0 } ], "Battery Volts", "y_bat_volt", 
            CHART_LINE_WIDTH, RGBA( COLORS.BAT_VOLT, 0.3 ),  
            CHART_MARKER_RADIUS, RGBA( COLORS.BAT_VOLT, 0.7 ) 
        ),

         /* 6 */
        new LineChartDataSet( [ { x: 0, y: 0.0 } ], "Motor Volts", "y_mot_volt", 
            CHART_LINE_WIDTH, RGBA( COLORS.MOT_VOLT, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.MOT_VOLT, 0.7 ) 
        )

    ]

}
const NewChartScales = ( ) => {

    return {
        
        x: LineChartXScale,

        y_ch4: new LineChartScale( "Ch4 ( % )", 3, 0, 100, "left", 
            RGBA( COLORS.CH4, 1.0 ), RGBA( COLORS.CH4, 0.3 ), false 
        ),
        
        y_hi_flow: new LineChartScale( "Hi Flow ( L/min )", 2,  2.5, 250, "left", 
            RGBA( COLORS.HI_FLOW, 1.0 ), RGBA( COLORS.HI_FLOW, 0.4 ), false 
        ),
        
        y_lo_flow: new LineChartScale( "Lo Flow ( L/min )", 1, 0.1, 2, "left",
            RGBA( COLORS.LO_FLOW, 1.0 ), RGBA( COLORS.LO_FLOW, 0.2 ), true )
         ,
        
        y_press: new LineChartScale( "Press ( psi )", 0, 0, 1500, "left", 
            RGBA( COLORS.PRESS, 1.0 ), RGBA( COLORS.PRESS, 0.3 ), false 
        ),
        
        y_bat_amp: new LineChartScale( "Bat ( A )", 0, 0, 1.5, "right", 
            RGBA( COLORS.BAT_AMP, 1.0 ), RGBA( COLORS.BAT_AMP, 0.3 ), false 
        ),
        
        y_bat_volt: new LineChartScale( "Bat ( V )", 1, 0, 15, "right", 
            RGBA( COLORS.BAT_VOLT, 1.0 ), RGBA( COLORS.BAT_VOLT, 0.3 ), false 
        ),
        
        y_mot_volt: new LineChartScale( "Mot ( V )", 2, 0, 15, "right", 
            RGBA( COLORS.MOT_VOLT, 1.0 ), RGBA( COLORS.MOT_VOLT, 0.3 ), false 
        )
    }

}
export const NewChartData = ( ) => {
    let cht = new LineChartModel( "", RGBA( BASE.LIGHT, 0.7 ) )
    cht.data.datasets = NewChartDataSets( )
    cht.options.scales = NewChartScales( )
    // Object.assign( config.options.scales, { yCH }, { yHF }, { yLF }, { yP }, { yBC }, { yBV }, { yMV } ) 

    return cht
}

export class Device {
    constructor( 
        sim = false, /* DEMO! - NOT FOR PRODUCTION */
        sse = false,
        admin = new Admin( ),
        config = new Config( ),
        event = new Event( ),
        sample = new Sample( ),
        diag_sample = new DiagSample( ), // NOT IMPLEMENTED
        reg = new DESRegistration( )
    ) {
        this.sim = sim,  /* DEMO! - NOT FOR PRODUCTION */
        this.sse = sse,
        this.admin = admin,
        this.config = config,
        this.event = event,
        this.sample = sample,
        this.diag_sample = diag_sample, // NOT IMPLEMENTED
        this.reg = reg

        this.cht = NewChartData( )
        this.cht_ch4 = this.cht.data.datasets[0]
        this.cht_hi_flow = this.cht.data.datasets[1]
        this.cht_lo_flow = this.cht.data.datasets[2]
        this.cht_press = this.cht.data.datasets[3]
        this.cht_bat_amp = this.cht.data.datasets[4]
        this.cht_bat_volt = this.cht.data.datasets[5]
        this.cht_mot_volt = this.cht.data.datasets[6]
        this.cht_point_limit = 50
        this.cht_scale_margin = 0.1
    }

    update( ) {
        let devices
        const unsub = DEVICES.subscribe( ( v ) => { devices = v } )
        unsub( )
        DEVICES.update( ( ) => { return [ ...devices ] } )
    }


    /* CHART DATA */
    updateChartData( ) {

        // if ( this.cht_ch4.data.length > this.cht_point_limit ) {
        //     this.cht.options.scales.x.min = this.cht_ch4.data[  this.cht_ch4.data.length - this.cht_point_limit ].x
        // // } else {
        // //     this.cht.options.scales.x.min = this.sample.smp_time
        // }

        this.cht.pushPoint( 
            { x: this.sample.smp_time, y: this.sample.smp_ch4 },
            this.cht_ch4, this.cht.options.scales.y_ch4,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.cht.pushPoint( 
            { x: this.sample.smp_time, y: this.sample.smp_hi_flow },
            this.cht_hi_flow, this.cht.options.scales.y_hi_flow,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.cht.pushPoint( 
            { x: this.sample.smp_time, y: this.sample.smp_lo_flow },
            this.cht_lo_flow, this.cht.options.scales.y_lo_flow,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.cht.pushPoint( 
            { x: this.sample.smp_time, y: this.sample.smp_press },
            this.cht_press, this.cht.options.scales.y_press,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.cht.pushPoint( 
            { x: this.sample.smp_time, y: this.sample.smp_bat_amp },
            this.cht_bat_amp, this.cht.options.scales.y_bat_amp,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.cht.pushPoint( 
            { x: this.sample.smp_time, y: this.sample.smp_bat_volt },
            this.cht_bat_volt, this.cht.options.scales.y_bat_volt,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.cht.pushPoint( 
            { x: this.sample.smp_time, y: this.sample.smp_mot_volt },
            this.cht_mot_volt, this.cht.options.scales.y_mot_volt,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        // // this.update( )
    }

}


export class XYSampleData { 
    constructor(
        xy_smp = {
            ch4: [ new XYPoint( ) ],
            hi_flow: [ new XYPoint( ) ],
            lo_flow: [ new XYPoint( ) ],
            press: [ new XYPoint( ) ],
            bat_amp: [ new XYPoint( ) ],
            bat_volt: [ new XYPoint( ) ],
            mot_volt: [ new XYPoint( ) ],
            vlv_tgt: [ new XYPoint( ) ],
            vlv_pos: [ new XYPoint( ) ],
        }
    ) {
        this.ch4 = xy_smp.ch4
        this.hi_flow = xy_smp.hi_flow
        this.lo_flow = xy_smp.lo_flow
        this.press = xy_smp.press
        this.bat_amp = xy_smp.bat_amp
        this.bat_volt = xy_smp.bat_volt
        this.mot_volt = xy_smp.mot_volt
        this.vlv_tgt = xy_smp.vlv_tgt
        this.vlv_pos = xy_smp.vlv_pos
    }
 }

//  import Chart from "chart.js/auto"
export class JobData {
    constructor( data = {
        admins: [ new Admin( ) ],
        configs: [ new Config( ) ],
        events: [ new Event( ) ],
        samples: [ new Sample( ) ],
        xy_smp: new XYSampleData( ),
        des_reg: new DESRegistration( )
    } ) {
        this.admins = data.admins
        this.configs = data.configs
        this.events = data.events
        this.samples = data.samples
        this.xy_smp = data.xy_smp
        this.reg = data.des_reg

        this.cht = NewChartData( )
        this.cht_ch4 = this.cht.data.datasets[0]
        this.cht_ch4.data = this.xy_smp.ch4

        this.cht_hi_flow = this.cht.data.datasets[1]
        this.cht_hi_flow.data = this.xy_smp.hi_flow
        
        this.cht_lo_flow = this.cht.data.datasets[2]
        this.cht_lo_flow.data = this.xy_smp.lo_flow
        
        this.cht_press = this.cht.data.datasets[3]
        this.cht_press.data = this.xy_smp.press
        
        this.cht_bat_amp = this.cht.data.datasets[4]
        this.cht_bat_amp.data = this.xy_smp.bat_amp
        
        this.cht_bat_volt = this.cht.data.datasets[5]
        this.cht_bat_volt.data = this.xy_smp.bat_volt
        
        this.cht_mot_volt = this.cht.data.datasets[6]
        this.cht_mot_volt.data = this.xy_smp.mot_volt

        this.cht_x_min = this.cht_ch4.data[0].x
        this.cht_x_max = this.cht_ch4.data[ this.cht_ch4.data.length - 1 ].x

        this.draw_chart = true
    }    

    async getJobData( ) {

        let start = Date.now( )
        let url ='./001/001/job_data'
        let res = await fetch( url, {
            method: 'POST',
            headers: { "Content-Type": "application/json", } ,
            body: JSON.stringify( this.reg )
        } )
        let get = Date.now( )

        let job_data = await JSON.parse( await res.text(  ) ) 
        this.reg = job_data.des_reg
        this.admins = job_data.admins
        this.configs = job_data.configs
        this.events = job_data.events
        this.samples = job_data.samples
        this.xy_smp = new XYSampleData( job_data.xy_smp )
        this.cht_ch4.data = this.xy_smp.ch4
        this.cht_hi_flow.data = this.xy_smp.hi_flow
        this.cht_lo_flow.data = this.xy_smp.lo_flow
        this.cht_press.data = this.xy_smp.press
        this.cht_bat_amp.data = this.xy_smp.bat_amp
        this.cht_bat_volt.data = this.xy_smp.bat_volt
        this.cht_mot_volt.data = this.xy_smp.mot_volt

        this.cht_x_min = this.cht_ch4.data[0].x
        this.cht_x_max = this.cht_ch4.data[ this.cht_ch4.data.length - 1 ].x

        let parse = Date.now( )

        console.log( `JobData -> getJobData( ) -> job_data\n
        admins: ${ this.admins.length }\n
        configs: ${ this.configs.length }\n
        events: ${ this.events.length }\n
        samples: ${ this.samples.length }: ${ JSON.stringify( this.samples[ 0 ], null, 4 ) }\n
        xy_smp:
        \tch4: ${ this.xy_smp.ch4.length }: ${ JSON.stringify( this.xy_smp.ch4[ 0 ] ) }\n
        \thi_flow: ${ this.xy_smp.hi_flow.length }: ${ JSON.stringify( this.xy_smp.hi_flow[ 0 ] ) }\n
        \tlo_flow: ${ this.xy_smp.lo_flow.length }: ${ JSON.stringify( this.xy_smp.lo_flow[ 0 ] ) }\n
        \tpress: ${ this.xy_smp.press.length }: ${ JSON.stringify( this.xy_smp.press[ 0 ] ) }\n
        \tbat_amp: ${ this.xy_smp.bat_amp.length }: ${ JSON.stringify( this.xy_smp.bat_amp[ 0 ] ) }\n
        \tbat_volt: ${ this.xy_smp.bat_volt.length }: ${ JSON.stringify( this.xy_smp.bat_volt[ 0 ] ) }\n
        \tmot_volt: ${ this.xy_smp.mot_volt.length }: ${ JSON.stringify( this.xy_smp.mot_volt[ 0 ] ) }\n
        \tvlv_tgt: ${ this.xy_smp.vlv_tgt.length }: ${ JSON.stringify( this.xy_smp.vlv_tgt[ 0 ] ) }\n
        \tvlv_pos: ${ this.xy_smp.vlv_pos.length }: ${ JSON.stringify( this.xy_smp.vlv_pos[ 0 ] ) }\n
        ` )

        console.log( `Fetch took ${ get - start } milliseconds... \n` )
        console.log( `Parse took ${ parse - get } milliseconds... \n` )
        console.log( `Total took ${ Date.now( ) - start } milliseconds... \n` )

        this.draw_chart = true
        return this
    } 

}
