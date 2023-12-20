<script>

    import { debug } from '../../des/utils'
    import { FormatDateTime, FormatTimeCode } from '$lib/common/format'

    import { Chart } from "chart.js/auto"
    import { getRelativePosition } from 'chart.js/helpers'


    /* TODO : REPLACE WITH luxon ...*/
    import 'chartjs-adapter-moment'// npm install moment chartjs-adapter-moment
    
    // import annotationPlugin from 'chartjs-plugin-annotation' // npm install chartjs-plugin-annotation
    import zoomPlugin from 'chartjs-plugin-zoom' // npm install chartjs-plugin-zoom
    // Chart.register( zoomPlugin, annotationPlugin )
    Chart.register( zoomPlugin )
    // const ToolTip = Chart.registry.getPlugin('tooltip')

    const makeConfig = ( data ) => { return data }

    // export let current = 0
    export let chartdata
    const makeChart = ( ctx, d ) => {

        let chart = new Chart( ctx, makeConfig( d ) )
        
        ctx.addEventListener( 'mousedown', ( e ) => { 
            switch(e.button) {
                case 0: // left
                
                    // debug( "ctx.addEventListener( 'mousedown', ( e ) ) -> chart: ", chart )
                    // const canvasPosition = getRelativePosition( e, chart )
                    // current = chart.scales.x.getValueForPixel( Math.floor( canvasPosition.x ) )
                    // debug( "left click: ",  FormatDateTime( current ) )

                    break
                case 1: // wheel
                    debug( "wheel click" )
                    var url = ctx.toDataURL( )
                    let link = document.createElement( 'a' )
                    link.href = url
                    link.download = `Component-${ Date.now( ) }-plot.png`
                    link.click( )
                    break
                case 2: // right
                    chart.resetZoom( )
                    break
            }
        } )
        
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

</script>

<div class="flx-row container">
    <canvas 
        class="chart" 
        use:makeChart={ chartdata } 
        oncontextmenu="event.preventDefault( );"
    />
</div>

<style>

    .container {
        border-radius: 0.5em;
        position: relative;
        height: 100%;
        width: 100%;
    }

    /* MOBILE */
    @media(max-width: 425px) { 
        .container {
            padding: 0;
        }
    }
</style>