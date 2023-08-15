<script>

    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'

    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl
    import 'mapbox-gl/dist/mapbox-gl.css'

    import { onMount } from 'svelte'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'

    let lat = 52.2690 
    let lng = -113.8115
    let zoom = 5
    let map
    onMount( ( ) => { 
        map = new mapboxgl.Map( {
            container: "map",
            style: 'mapbox://styles/leehayford/clklqsnmp006t01q22cb3h18x',
            center: [ lng, lat ],
            zoom : zoom
        } )
    } )

    $: filter = true
    $: filterButtonText = ( filter ? "^" : "v" )

</script>

<div class="flx-col container">

    <div class="flx-row search">

        <PillButton
            cls={ 'bg-purple_a' }
        >?</PillButton>

        <InputText 
            enabled={ true }
        />
        <PillButton
            cls={ 'bg-aqua_a' }
        >{ filterButtonText }</PillButton>

    </div>

    <div class="flx-row filters">
        FILTERS
    </div>

    <div class="map-container" id="map"></div>

</div>

<style>

    .container {
        border-top: solid 0.05em var(--grey_aa);
        border-right: solid 0.05em var(--grey_aa);
        background-color: var(--light_aa);
        border-radius: 0.5em;
        padding: 1em;
        max-width: 38em;
        min-width: 38em;
        height:100%;
        overflow: hidden;
    }

    .search {
        padding: 0.25em;
        align-items: center;
    }

    .map-container {
        height: 65%;
        border-top: solid 0.05em var(--dark_a);
        border-right: solid 0.05em var(--dark_a);
        background-color: var(--aqua_a);
        border-radius: 0.5em;
        position: relative;
    }

    .filters {
        height: 35%;
        background-color: var(--dark);
        padding: 0.5rem;
        border-radius: 0.5em;
        border-bottom: solid 0.05em var(--grey_aa);
        border-left: solid 0.05em var(--grey_aa);
    }

</style>