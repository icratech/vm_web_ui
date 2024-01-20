
import { BASE, RGBA } from "../colors"
import { FormatDateTime } from "../format"
import { debug } from '../../des/utils'


export const CHART_LINE_WIDTH = 1.5
export const CHART_MARKER_RADIUS = 0.5

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

const defaultZoomHandler = ( e ) => {
    debug( "default zoom handler...\n", e.chart )

    let dats = e.chart.config._config.data.datasets
    debug( "default zoom handler... datasets\n", dats )

    let xs = ( dats[0].data.map( v => { return v.x } ) ).filter( x => {
        return ( 
            x > Math.round( e.chart.scales["x"]._userMin ) &&
            x < Math.round( e.chart.scales["x"]._userMax )
        )  
    } )

    let xmin = xs[0]
    let xmax = xs[xs.length-1]

    debug( "default zoom min x unix:  ", xmin )
    debug( "default zoom min x time:  ", FormatDateTime( xmin ) )
    debug( "default zoom max x unix:  ", xmax )
    debug( "default zoom max x time:  ", FormatDateTime( xmax ) )

    dats.forEach( ds => { 
        let vStart = ds.data.filter( v => { return v.x == xmin } )[0]
        let vEnd = ds.data.filter( v => { return v.x == xmax } )[0]
        debug( `${ ds.label }:  ${ vStart.y } -> ${ vEnd.y }` )
    } )

}
export class LineChartModel {
    constructor( 
        title, 
        color,
        // zoomHandler =  defaultZoomHandler,
        fontSize = 16
        ) {

        this.type = 'line' //'scatter'
        
        this.data = { 
            labels: [ ], 
            datasets: [ 
                new LineChartDataSet( [ ], "Selection", "y", true, 
                    CHART_LINE_WIDTH, RGBA( BASE.AQUA, 0.3 ),  
                    CHART_LINE_WIDTH, RGBA( BASE.AQUA, 0.7 ) ) 
            ] 
        }
        
        this.options = {
            color: color,
            animation: false, 
            responsive: true, 
            maintainAspectRatio: false,
            parsing: false, 
            layout: {
                padding: {
                    left: Math.ceil( fontSize / 3 ),
                    right: Math.ceil( fontSize / 3 ),
                    bottom: Math.ceil( fontSize / 3 ),
                }
            },
            interaction: { 
                // mode: "time", 
                // intersection: false, 
                intersect: false, 
                mode: 'nearest',
                axis: 'x',
                // includeInvisible: false, 
            },
            events: [ 'click' ],
            scales: { x: LineChartXScale },
            plugins: { 
                chartAreaBorder: { 
                    borderColor: RGBA( BASE.LIGHT, 0.1 ), 
                    borderWidth: 1, 
                },
                title: { 
                    text: title, 
                    font: { size: fontSize },
                    position: "bottom",
                    display: false 
                },
                legend: {
                    position: "top",
                    align: "center",
                    display: false,
                    labels: {
                        textAlign: "center",
                        boxHeight: Math.ceil( fontSize * 1.25 ),
                        boxWidth: Math.ceil( fontSize * 1.25 ),
                        borderRadius: Math.ceil( fontSize * 1.25 ),
                        useBorderRadius: true,
                        padding: Math.ceil( fontSize * 3 / 2 ),
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
                        wheel: { enabled: true, speed: 0.1, },
                        drag: { enabled: true },
                        // onZoomComplete: zoomHandler
                    },
                    pan: { enabled: false }
                },
                // annotation: {
                //     annotations: { 
                //         // x: LineChartXSelected
                //     }
                // },
                tooltip: { 
                    // position: "fixed",
                    enabled: false 
                }
            }
        }

        this.plugins = [ chartAreaBorder ]
        
        this.auto = false
    }

    pushPoint( set = [ ], point, lim, margin, auto = this.auto ) {
        // debug( "chart.pushPoint( )" )
        set.data.push( point ) 

        let limited = this.limitDataset( set.data, lim )
        set.data = limited.data

        this.options.scales.x.min = limited.start
        this.options.scales.x.max = point.x
  
        this.autoScale( set, limited.start, margin, auto )
    }

    limitDataset( arrXY, lim ) {
        let len = arrXY.length
        let data = [ ]
        let start = 0
        if ( len > 0 ) {
            data = ( len > lim ? arrXY.slice( len - lim, ) : arrXY )
            start = data[0].x 
        }
        return { data, start }
    }

    arrYFromPoints( arrXY, start ) {
        return arrXY.reduce( ( ys, xy ) => { 
            if ( xy.x >= start ) ys.push( xy.y )
            return ys
        }, [ ] ) 
    }

    autoScale( set, start, margin, auto = this.auto ) {

        let scale = this.getDatasetScale( set )

        let arrY = this.arrYFromPoints( set.data, start )

        if ( auto ) {
            let min = Math.min( ...arrY ) // debug( min )
            let max = Math.max( ...arrY ) // debug( max )
            let span = max - min // debug( span )
            if ( span > 0 ) {
                scale.min = min - ( span * margin )
                scale.max = max +  ( span * margin )
            } 
        }

    }

    getDatasetScale( set ) { return this.options.scales[ set.yAxisID ] }

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

}
export class LineChartScale {
    constructor( 
        title, 
        weight, 
        min,
        max,
        position,
        color = RGBA( BASE.LIGHT, 0.7 ),
        gridColor,
        showGrid,
        display = true,
        labelSize = 12,
        tickSize = 10
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
            width:  1, // Math.ceil( tickSize/10 ),
        }
        this.title = {
            display: true,
            align: "end",
            font: { size: labelSize },
            padding: { top: Math.ceil( labelSize/2 ), bottom: Math.ceil( labelSize/2 ) },
            color: color,
            text: title,
        }
        this.ticks = { 
            font: { size: tickSize },
            color: color,
            padding: 1, // Math.ceil( tickSize/10 ),
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
    constructor( tickSize = 10 ) {
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
            tickLength: tickSize,
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
            font: { size: tickSize },
            autoSkip: true,
            autoSkipPadding: Math.ceil( tickSize * 10 ),
            maxRotation: 0,
            color: RGBA( BASE.LIGHT, 0.7 ),
            padding: Math.ceil( tickSize * 1.5 ),
        }
    }
}

/* CHART SECECTION CURSOR */
export class LineChartXSelectScale {
    constructor( ) {
        this.type = 'linear'
        this.adjustScaleRange= false
        this.min = 0
        this.max = 0
        this.display = false
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


