<script>

    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'
    import { DEVICES, DEVICE_MAP_MARKERS, DEVICES_LOADED } from "../../lib/des_api";

    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl
    import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'

   let map
    const makeMap = ( ctx ) => {
        map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/clklqsnmp006t01q22cb3h18x',
            center: [ -113.811, 52.269 ],
            zoom : 2
        } )
        console.log( "DeviceSearch -> makeMap( ) -> DEVIECS: ", $DEVICES )
        console.log( "DeviceSearch -> makeMap( ) -> $DEVICE_MAP_MARKERS: ", $DEVICE_MAP_MARKERS )
        $DEVICE_MAP_MARKERS.forEach( m => m.addTo( map )) 

    }

    $: filter = true
    $: filterButtonText = ( filter ? "^" : "v" )



</script>

<div class="flx-col search-panel">

    <div class="flx-row search">

        <PillButton
            cls={ 'bg-purple' }
            hint={ 'More filters' } 
        />

        <InputText 
            enabled={ true }
        />
        <PillButton
            cls={ 'bg-grey' }
            hint={ 'Reset filters' } 
        />

    </div>

    <div class="flx-row filters">
        FILTERS
    </div>

    { #if $DEVICES_LOADED }
    <div class="map-container" use:makeMap></div>
    { /if }

</div>

<style>

    .search-panel {
        border-radius: 0.5em;
        padding: 1em;
        max-width: 38em;
        min-width: 38em;
        height:100%;
        /* overflow-y: hidden; */
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }

    .search {
        padding: 0.25em;
        align-items: center;
    }

    .filters {
        height: 35em;
        padding: 0.5rem;
        border-radius: 0.5em;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
</style>