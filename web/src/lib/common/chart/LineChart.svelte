<script>
    import { Chart } from "chart.js/auto"
    
    /* TODO : REPLACE WITH luxon ...*/
    import 'chartjs-adapter-moment'// npm install moment chartjs-adapter-moment
    
    // import annotationPlugin from 'chartjs-plugin-annotation' // npm install chartjs-plugin-annotation
    import zoomPlugin from 'chartjs-plugin-zoom' // npm install chartjs-plugin-zoom
    // Chart.register( zoomPlugin, annotationPlugin )
    Chart.register( zoomPlugin )
    const ToolTip = Chart.registry.getPlugin('tooltip')

    const makeConfig = ( data ) => { return data }

    $: current = 0
    let xOffset = Date.now()
    export let chartdata
    const makeChart = ( ctx, d ) => {

        let chart = new Chart( ctx, makeConfig( d ) )
        // xOffset = chart.config.data.datasets[0].data[0].x

        ToolTip.positioners.fixed = function() {
            let thing = { x: 0, y: 0 }
            try {
                thing = { 
                    x: this._chart.chartArea.left,
                    y: this._chart.chartArea.bottom - ToolTip.height
                }
            } catch {  /* Do nothing */  }
            return thing;
        }
        let start
        for(let i = 0; i < chart.data.datasets.length; i++) {
            start = chart.data.datasets[i].data[0].x 
            if (start < xOffset) {
                xOffset = start
            }
        }
        chart.options.plugins.tooltip.callbacks.title = (chart) => { 
            current = new Date(chart[0].label).valueOf() 
            return current;
        }

        ctx.addEventListener( 'mousedown', ( e ) => { 
            switch(e.button) {
                case 0: // left
                    console.log( "left click: ", current )
                    break
                case 1: // wheel
                    console.log( "wheel click" )
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