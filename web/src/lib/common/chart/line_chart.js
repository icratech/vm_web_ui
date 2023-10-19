
import { BASE, RGBA } from "../colors"


export const CHART_LINE_WIDTH = 2.5
export const CHART_MARKER_RADIUS = 1

const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const {ctx, chartArea: {left, top, width, height}} = chart
      ctx.save()
      ctx.strokeStyle = options.borderColor
      ctx.lineWidth = options.borderWidth
      ctx.setLineDash(options.borderDash || [])
      ctx.lineDashOffset = options.borderDashOffset
      ctx.strokeRect(left, top, width, height)
      ctx.restore()
    }
}

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
                    left: 5,
                    right: 5,
                    bottom: 5,
                }
            },
            interaction: { 
                mode: "time", 
                intersection: false 
            },
            scales: { 
                x: LineChartXScale 
            },
            plugins: { 
                chartAreaBorder: { borderColor: RGBA( BASE.LIGHT, 0.1 ), borderWidth: 1 },
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
                        padding: 10,
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
                        wheel: { enabled: true, speed: 0.05, },
                        drag: { enabled: true },
                    },
                    pan: { enabled: false }
                },
        //         // tooltip: { position: "fixed" }
            }
        }

        this.plugins = [ chartAreaBorder ]
    }

    pushPoint( point, set = [ ], scale, limit, scale_margin ) {

        let len = set.data.push( point ) 
        for ( len; len > limit; len-- ) {
            set.data.shift( )
        }
        let x_min = set.data[0].x
        // let x_min = set.pushSample( limit, point )
        // let filt = set.data.filter( x => x.x >= x_min )
        // let Ys = filt.map( p => p.y )
        // let min = Math.min( ...Ys ) // console.log( min )
        // let max = Math.max( ...Ys ) // console.log( max )
        // if ( max - min > 0 ) {
        //     scale.min = min - ( ( max - min ) * scale_margin )
        //     scale.max = max +  ( ( max - min ) * scale_margin )
        // }    
        this.options.scales.x.min = x_min
        this.options.scales.x.max = point.x
    }
}
export class LineChartDataSet {
    constructor( 
        data = [ ],
        label = "Unknown",
        yAxisID = "y",
        show = true,
        lineWidth = CHART_LINE_WIDTH,
        lineColor = RGBA( BASE.LIGHT, 0.3 ),
        markerRadius = CHART_MARKER_RADIUS,
        markerColor = RGBA( BASE.LIGHT, 0.7 ),
    ) {
        this.data = data
        this.label = label
        this.xAxisID = "x" // xAxisID
        this.yAxisID = yAxisID
        this.hidden = !show
        this.borderWidth = lineWidth
        this.borderColor = lineColor
        this.radius = markerRadius
        this.backgroundColor = markerColor
    }
    
    // pushSample( limit, point = { x: 0, y: 0.0 } ) {
    //     let len = this.data.push( point ) 

    //     // if ( limit > 0 ) {
    //         for ( len; len > limit; len-- ) {
    //             this.data.shift( )
    //         }
    //     // }
    //     return this.data[0].x
    // }
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
        display = true,
    ) {
        this.type = "linear"
        this.min = min
        this.max = max
        this.position = position
        this.weight = weight
        this.display = display
        this.border = {
            display: false,
            color: gridColor,
            width: 1,
        }
        this.title = {
            display: true,
            align: "end",
            font: { size: 14 },
            padding: { top: 10 },
            color: color,
            text: title,
        }
        this.ticks = { 
            // count: 5,
            color: color,
            padding: 5,
            callback: function( value ) {
                return value.toFixed( 1 )
            }
        }
        this.grid = { 
            display: showGrid,
            color: gridColor,

            drawTicks: false,
        }
        // this.border = {
        //     display: true,
        //     color: RGBA( BASE.LIGHT, 0.2 ),
        //     width: 1,
        // }
    }
}

export class LineChartXScale {
    constructor( ) {
        this.type = 'time'
        this.time = {
            displayFormats: {
                day: "MMM-d HH:mm",
                hour: 'MMM-d HH:mm',
                minute: 'HH:mm:ss',
                second: 'HH:mm:ss',
                millisecond: "HH:mm:ss.SSS",
            }
        }
        this.grid = { 
            tickLength: 10,
            drawTicks: false,
            color: RGBA( BASE.LIGHT, 0.1 ),
            display: true
        }
        this.position = 'bottom'
        // this.title = {
        //     display: true,
        //     font: { size: 15 },
        //     padding: { top: 13, bottom: 13 },
        //     color: RGBA( BASE.LIGHT, 0.7 ),
        //     text: "Time",
        // }
        this.ticks = {
            autoSkip: true,
            autoSkipPadding: 50,
            maxRotation: 0,
            color: RGBA( BASE.LIGHT, 0.7 ),
            padding: 15,
        }
    }
}
// export let LineChartXScale = {
//     type: 'time',
//     time: {
//         displayFormats: {
//             day: "MMM-d HH:mm",
//             hour: 'MMM-d HH:mm',
//             minute: 'HH:mm:ss',
//             second: 'HH:mm:ss',
//             millisecond: "HH:mm:ss.SSS",
//         }
//     },
//     grid: { 
//         tickLength: 10,
//         drawTicks: false,
//         color: RGBA( BASE.LIGHT, 0.1 ),
//         display: true
//     },
//     position: 'bottom',
//     // title: {
//     //     display: true,
//     //     font: { size: 15 },
//     //     padding: { top: 13, bottom: 13 },
//     //     color: RGBA( BASE.LIGHT, 0.7 ),
//     //     text: "Time",
//     // },
//     ticks: {
//         autoSkip: true,
//         autoSkipPadding: 50,
//         maxRotation: 0,
//         color: RGBA( BASE.LIGHT, 0.7 ),
//         padding: 15,
//     }
// }

export class XYPoint { 
    constructor( 
        point = { x: 0, y: 0.0 } 
    ) { 
        this.x = point.x, 
        this.y = point.y 
    } 
}