<script>

    import { createEventDispatcher } from 'svelte'
    import { debug } from '../../des/utils'
    import { LineChartDataSet, LineChartScale } from "./line_chart"
    import PillButton from '../button/PillButton.svelte';

    export let dataset = new LineChartDataSet( )
    export let scale = new LineChartScale( )

    debug( "LineChartChan: ", scale )

    const showHide = ( ) => { 
        dataset.show = !dataset.show
        scale.display = !scale.display
        dispatch('update')
    }

	const dispatch = createEventDispatcher()

</script>

<div class="flx-col">

    <div class="flx-row title" style={`color: ${ dataset.backgroundColor };`}>
        
        <div class="flx-row">{ scale.title.text }</div>

        <PillButton 
            on:click={ showHide }
            hint="Show"
        />

        <PillButton 
            hint="Auto Scale"
        />

    </div>

</div>

<style>
    .title {
        height: 2.5em;
    }
</style>