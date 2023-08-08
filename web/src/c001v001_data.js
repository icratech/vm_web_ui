
export const device_class = "001"
export const device_version= "001"
export const demo_app = `C${ device_class }V${ device_version }_demo_app v0.0.0`
export const client_app = `C${ device_class }V${ device_version }_client_app v0.0.0`

import { writable } from 'svelte/store'

const REQUEST_GET_DEVICES = new Request(  'http://127.0.0.1:8003/001/001/devices', { method: 'GET' } )

export const DEVICES = writable( [ ] )

export const getDevices = async( ) => { 

    let res = await fetch( REQUEST_GET_DEVICES )
    let txt = await res.text( )
    let regs = await JSON.parse( txt )

    let existing = false
    if ( regs != null ) {

        let devices
        const unsub = DEVICES.subscribe( v => devices = v )

        if ( devices[0] ) { existing = true } // there are some already

        let new_devices = [ ]
        regs.forEach( reg => {

            let stored = devices.filter( sd => sd.reg.des_dev_serial == reg.des_dev_serial )[ 0 ]

            if ( stored == undefined ) {

                console.log( `NEW DEVICE` )
                let dev = new Device( )
                dev.reg = reg 
                new_devices = [ ...new_devices, dev ]

            } else { 

                // devices.filter( sd => sd.reg.des_dev_serial == reg.des_dev_serial )[ 0 ].reg = reg
                devices.find( d => d.reg.des_dev_serial ===  reg.des_dev_serial ).reg = reg
            }
        } )
        unsub( )

        if ( existing ) {

            DEVICES.update( ( ) => { return [ ...devices, ...new_devices ] } ) // add new devices to the store

        } else {

            DEVICES.update( ( ) => { return [ ...new_devices ] } ) // store the devices

        }
    }

}
export const getDeviceBySerial = async( serial ) =>{
    let devices
    const unsub = DEVICES.subscribe( v => devices = v )
    let device =  devices.find( d => d.reg.des_dev_serial ===  serial )
    unsub( )
    // console.log( JSON.stringify( device, null, 4 ) )
    return device
}


/* COLOR STUFF ******************************************************************************************/
let dark = "40, 40, 40"
let grey = "175, 175, 175"
let light = "230, 230, 230"
let red = "220, 25, 60"
let orange = "245, 120, 0"
let yellow = "230, 180, 20"
let green = "60, 210, 0" 
let aqua = "50, 230, 230"
let blue = "10, 120, 230"
let purple = "160, 70, 240"
let pink = "250, 70, 200 "

export const RGBA = ( rgb, a ) => { return `rgba( ${ rgb }, ${ a } )`  }

export const BASE = {
    DARK: dark,
    GREY: grey,
    LIGHT: light,
    RED: red,
    ORANGE: orange,
    YELLOW: yellow,
    GREEN: green,
    AQUA: aqua,
    BLUE: blue,
    PURPLE: purple,
    PINK: pink,
}

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


/* JOB DATA STRUCTURES ********************************************************************************/

/* 
WEB CLIENT -> HTTP -> DES -> MQTT -> DEVICE  
  - Device updates its administration settings
  - Device returns new administration settings
WEB CLIENT <- HTTP <- DES <- MQTT <- DEVICE  
*/
export class Admin {
    constructor( 
        adm_id = 0, // Set by DES upon database write

        adm_time = 0,
        adm_addr = "",
        adm_user_id = 0,
        adm_app =client_app,
    
        adm_def_host = "",
        adm_def_port = 0,
        adm_op_host = "",
        adm_op_port = 0,
    
        adm_class = device_class,
        adm_version = device_version,
        adm_serial = "",
    
        adm_bat_hi_amp = 2.5, // Amps
        adm_bat_lo_volt = 10.5, // Volts
    
        adm_mot_hi_amp = 1.9, // Amps
    
        // adm_tilt_tgt = 90.0, // °
        // adm_tilt_mgn = 3.0, // °
        // adm_azim_tgt = 180.0, // °
        // adm_azim_mgn = 3.0, // °
    
        adm_hfs_flow = 200.0, // L/min
        adm_hfs_flow_min =150.0, // L/min
        adm_hfs_flow_max = 250.0, // L/min
        adm_hfs_press =160.0, // psia
        adm_hfs_press_min = 23.0, // psia
        adm_hfs_press_max = 200.0, // psia
        adm_hfs_diff = 65.0, // psi
        adm_hfs_diff_min = 10.0, // psi
        adm_hfs_diff_max = 75.0, // psi
    
        adm_lfs_flow = 1.85, // L/min
        adm_lfs_flow_min = 0.5, // L/min
        adm_lfs_flow_max = 2.0, // L/min
        adm_lfs_press = 60.0, // psia
        adm_lfs_press_min = 20.0, // psia
        adm_lfs_press_max = 80.0, // psia
        adm_lfs_diff = 9.0, // psi
        adm_lfs_diff_min = 2.0, // psi
        adm_lfs_diff_max = 10.0, // psi
     ) {
        this.adm_id = adm_id, // Set by DES upon database write

        this.adm_time = adm_time,
        this.adm_addr = adm_addr,
        this.adm_user_id = adm_user_id,
        this.adm_app = adm_app,
    
        this.adm_def_host = adm_def_host,
        this.adm_def_port = adm_def_port,
        this.adm_op_host = adm_op_host,
        this.adm_op_port = adm_op_port,
    
        this.adm_class = adm_class,
        this.adm_version = adm_version,
        this.adm_serial = adm_serial,
    
        this.adm_bat_hi_amp = adm_bat_hi_amp, // Amps
        this.adm_bat_lo_volt = adm_bat_lo_volt, // Volts
    
        this.adm_mot_hi_amp = adm_mot_hi_amp, // Amps
    
        // this.adm_tilt_tgt = adm_tilt_tgt, // °
        // this.adm_tilt_mgn = adm_tilt_mgn, // °
        // this.adm_azim_tgt = adm_azim_tgt, // °
        // this.adm_azim_mgn = adm_azim_mgn, // °
    
        this.adm_hfs_flow = adm_hfs_flow, // L/min
        this.adm_hfs_flow_min =adm_hfs_flow_min, // L/min
        this.adm_hfs_flow_max = adm_hfs_flow_max, // L/min
        this.adm_hfs_press = adm_hfs_press, // psia
        this.adm_hfs_press_min = adm_hfs_press_min, // psia
        this.adm_hfs_press_max = adm_hfs_press_max, // psia
        this.adm_hfs_diff = adm_hfs_diff, // psi
        this.adm_hfs_diff_min = adm_hfs_diff_min, // psi
        this.adm_hfs_diff_max = adm_hfs_diff_max, // psi
    
        this.adm_lfs_flow = adm_lfs_flow, // L/min
        this.adm_lfs_flow_min = adm_lfs_flow_min, // L/min
        this.adm_lfs_flow_max = adm_lfs_flow_max, // L/min
        this.adm_lfs_press = adm_lfs_press, // psia
        this.adm_lfs_press_min = adm_lfs_press_min, // psia
        this.adm_lfs_press_max = adm_lfs_press_max, // psia
        this.adm_lfs_diff = adm_lfs_diff, // psi
        this.adm_lfs_diff_min = adm_lfs_diff_min, // psi
        this.adm_lfs_diff_max = adm_lfs_diff_max // psi
    }
}

/* 
WEB CLIENT -> HTTP -> DES ( LOG ) -> MQTT -> DEVICE  
  - Device updates its configuration settings
  - Device returns new configuration settings
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
*/
export class Config {
    constructor( 
        cfg_id = 0, // Set by DES upon database write

        cfg_time = 0, 
        cfg_addr = "",  
        cfg_user_id = 0,
        cfg_app = "",
    
        cfg_job_name = "",
        cfg_job_start = 0,
        cfg_job_end = 0, 
        cfg_scvd = 596.8, // m
        cfg_scvd_mult = 10.5, // kPa / m
        cfg_ssp_rate = 1.95, // kPa / hour
        cfg_ssp_dur = 6.0, // hour
        cfg_hi_scvf = 201.4, //  L/min ( 290 m3/day )
        cfg_flow_tog = 1.75, //  L/min 
    
        cfg_vlv_tgt = 2, // vent
        cfg_vlv_pos = 2, // vent
    
        cfg_op_sample = 1000, // milliseconds
        cfg_op_log = 10000, // milliseconds
        cfg_op_trans = 60000, // milliseconds
        
        cfg_diag_sample = 10000, // milliseconds
        cfg_diag_log = 100000, // milliseconds
        cfg_diag_trans = 600000, // milliseconds
     ) {
        this.cfg_id = cfg_id // Set by DES upon database write
    
        this.cfg_time = cfg_time
        this.cfg_addr = cfg_addr
        this.cfg_user_id = cfg_user_id
        this.cfg_app = cfg_app
    
        this.cfg_job_name = cfg_job_name
        this.cfg_job_start = cfg_job_start
        this.cfg_job_end = cfg_job_end 
        this.cfg_scvd = cfg_scvd // m
        this.cfg_scvd_mult = cfg_scvd_mult // kPa / m
        this.cfg_ssp_rate = cfg_ssp_rate // kPa / hour
        this.cfg_ssp_dur = cfg_ssp_dur // hour
        this.cfg_hi_scvf = cfg_hi_scvf //  L/min ( 290 m3/day )
        this.cfg_flow_tog = cfg_flow_tog //  L/min 
    
        this.cfg_vlv_tgt = cfg_vlv_tgt // vent
        this.cfg_vlv_pos = cfg_vlv_pos // vent
    
        this.cfg_op_sample = cfg_op_sample // milliseconds
        this.cfg_op_log = cfg_op_log // milliseconds
        this.cfg_op_trans = cfg_op_trans // milliseconds
        
        this.cfg_diag_sample = cfg_diag_sample // milliseconds
        this.cfg_diag_log = cfg_diag_log // milliseconds
        this.cfg_diag_trans = cfg_diag_trans // milliseconds
    }
}

/* 
WEB CLIENT -> HTTP -> DES ( JOB DB WRITE ) -> MQTT -> DEVICE  
  - Device loggs event to as is memory ( no reponse )
  
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has encountered an alarm / logged an event
*/
export class Event {
    constructor( 
        evt_id = 0, // Set by DES upon database write
        evt_time = 0,
        evt_addr = "",
        evt_user_id = 0,
        evt_app = "",
        evt_type_id = 0,
        evt_title = "",
        evt_msg = "" 
    ) {
        this.evt_id = evt_id // Set by DES upon database write
        this.evt_time = evt_time
        this.evt_addr = evt_addr
        this.evt_user_id = evt_user_id
        this.evt_app = evt_app
        this.evt_type_id = evt_type_id
        this.evt_title = evt_title
        this.evt_msg = evt_msg
    }
}

/* 
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has transmitted a sample
*/
export class Sample {
    constructor ( 
        smp_id = 0,
        smp_time = 0,
        smp_ch4 = 100.0,
        smp_hi_flow = 250.0,
        smp_lo_flow = 2.0,
        smp_press = 1500.0,
        smp_bat_amp = 0.35,
        smp_bat_volt = 12.5,
        smp_mot_volt = 12.0,
        smp_vlv_tgt = 2,
        smp_vlv_pos = 2,
        smp_job_name =""
    ) { 
        this.smp_id = smp_id
        this.smp_time = smp_time
        this.smp_ch4 = smp_ch4
        this.smp_hi_flow = smp_hi_flow
        this.smp_lo_flow = smp_lo_flow
        this.smp_press = smp_press
        this.smp_bat_amp = smp_bat_amp
        this.smp_bat_volt = smp_bat_volt
        this.smp_mot_volt = smp_mot_volt
        this.smp_vlv_tgt = smp_vlv_tgt
        this.smp_vlv_pos = smp_vlv_pos
        this.smp_job_name =smp_job_name
    }
}

/* 
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has transmitted a diagnostic sample
*/
export class DiagSample { /* NOT IMPLEMENTED */
    /* NOT IMPLEMENTED */
}

/* 
HTTP DEVICE DATA STRUCTURE 
*/
export class DESRegistration {
    constructor( 
        /* DESDevice */
        des_dev_id = 0,

        des_dev_reg_time = 0,
        des_dev_reg_addr = "",
        des_dev_reg_user_id = 0,
        des_dev_reg_app = client_app,

        des_dev_serial = "",
        des_dev_version = device_class,
        des_dev_class = device_version,

        /* DESJob */
        des_job_id = 0,

        des_job_reg_time = 0,
        des_job_reg_addr = "",
        des_job_reg_user_id = 0,
        des_job_reg_app = "",

        des_job_name = "",
        des_job_start = 0,
        des_job_end = 0,
        des_job_dev_id = 0
     ) {
        /* DESDevice */
        this.des_dev_id = des_dev_id,

        this.des_dev_reg_time = des_dev_reg_time,
        this.des_dev_reg_addr = des_dev_reg_addr,
        this.des_dev_reg_user_id = des_dev_reg_user_id,
        this.des_dev_reg_app = des_dev_reg_app,

        this.des_dev_serial = des_dev_serial,
        this.des_dev_version = des_dev_version,
        this.des_dev_class = des_dev_class,

        /* DESJob */
        this.des_job_id = des_job_id,

        this.des_job_reg_time = des_job_reg_time,
        this.des_job_reg_addr = des_job_reg_addr,
        this.des_job_reg_user_id = des_job_reg_user_id,
        this.des_job_reg_app = des_job_reg_app,

        this.des_job_name = des_job_name,
        this.des_job_start = des_job_start,
        this.des_job_end = des_job_end,
        this.des_job_dev_id = des_job_dev_id
    }

}

/* 
LOCAL DEVICE DATA STRUCTURE 
*/


export const MODE_BUILD_CSS = 'fg-yellow'
export const MODE_VENT_CSS = 'fg-red'
export const MODE_HIGH_FLOW_CSS = 'fg-blue'
export const MODE_LOW_FLOW_CSS = 'fg-aqua'
export const MODE = [
   'BUILD', // 0
   'BUILD <-> VENT', // 1
   'VENT', // 2
   'VENT <-> HI FLOW', // 3
   'HI FLOW', // 4
   'HI FLOW <-> LO FLOW', // 5
   'LO FLOW', // 6
   'MANUAL >-<' // 7
]

export const COLORS = {
    CH4: BASE.PINK,
    HI_FLOW: BASE.BLUE,
    LO_FLOW: BASE.AQUA,
    PRESS: BASE.YELLOW,
    BAT_AMP: BASE.RED,
    BAT_VOLT: BASE.ORANGE,
    MOT_VOLT: BASE.PURPLE
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

    /* SSE CONNECTION */
    disconnectSSE( ) {  }
    connectSSE( ) {   

        let evs = new EventSource(  `./001/001/live_job?des_reg=${ encodeURIComponent(JSON.stringify( this.reg ) ) }` ) 
        
        evs.onmessage = ( msg ) => {

            let data = JSON.parse( msg.data )
            switch ( data.type ) {

                case "sample":
                    this.sample = data.data
                    this.updateChartData()
                    break

                case "event":
                    this.event = data.data
                    break
    
                case "config":
                    this.config = data.data
                    break
            
                case "admin":
                    this.admin = data.data
                    break
            
                default: 
                    console.log( `Type unknown:\n${ JSON.stringify( data, null, 4 ) }\n` )
                    break
            }
            
            // console.log( `class Device -> ${ this.reg.des_dev_serial } ONMESSAGE:\n`, msg.data )
            this.update( )
        } 

        evs.onerror = ( msg ) => {
            evs.close( )
            this.sse = false
            console.log( `class DeviceControls -> ${ this.reg.des_dev_serial } ONERROR:\n`, msg )
            this.update( )
        }
        
        this.sse = true
        console.log( `class Device -> ${ this.reg.des_dev_serial } -> CONNECTED: -> sse ${ this.sse }\n` )
        
        this.disconnectSSE =  ( ) => {
            evs.close( ) 
            this.sse = false
            console.log( `class Device -> ${ this.reg.des_dev_serial } -> DISCONNECTED: -> sse ${ this.sse }\n` )
            this.update( )
        }
        this.update( )
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

   /* DEMO! - NOT FOR PRODUCTION */
    disconnectSIM( ) { /* DEMO! - NOT FOR PRODUCTION */ } 
    connectSIM( settings) { /* DEMO! - NOT FOR PRODUCTION */

        let sim_settings = encodeURIComponent(JSON.stringify( settings ) )
        let des_reg = encodeURIComponent(JSON.stringify( this.reg ) ) 
        let url = `./001/001/demo_device/run_sim?sim=${ sim_settings }&des_reg=${ des_reg }`
        let evs = new EventSource( url )

        evs.onmessage = ( msg ) => {
            console.log( `class Device DEMO -> ${ this.reg.des_dev_serial } ONMESSAGE:\n`, msg.data )
            this.update( )
        } 

        evs.onerror = ( msg ) => {
            evs.close( )
            this.sse = false
            console.log( `class Device DEMO -> ${ this.reg.des_dev_serial } ONERROR:\n`, msg.data )
            this.update( )
        }

        this.sim = true
        console.log( `class Device DEMO -> ${ this.reg.des_dev_serial } CONNECTED: -> sim ${ this.sim } \n` )
        
        this.disconnectSIM = ( ) => { 
            
            evs.close( ) 
            this.sim = false
            console.log( `class Device DEMO -> ${ this.reg.des_dev_serial } -> DISCONNECTED: -> sim ${ this.sim }\n` )
            this.update( )
        }
        this.update( )
    }
}

/* DEMO! - NOT FOR PRODUCTION */
export class SimSettings {
    qty = 5000
    dur = 50
    fill_qty = 1
    constructor( qty = 5000, dur = 50, fill_qty = 1 ) {
        this.qty = qty,
        this.dur = dur,
        this.fill_qty = fill_qty
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
