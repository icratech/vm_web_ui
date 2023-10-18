<script>

    import { onMount } from 'svelte';

    import { createEventDispatcher } from 'svelte';

    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'
    import { DEVICES, DEVICES_LOADED, DESSearchParam, get_devices /*GeoJSONFeatureCollection, GeoJSONFeature, GeoJSONGeometry */} from "../../lib/des_api";
 
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    export let search = new DESSearchParam( )
    const dispatch = createEventDispatcher( )

    $: zoom = 2.3
    $: origin = [ -110, 65 ]
    onMount( ( ) => {
        if (window.matchMedia( "( max-width: 425px )" ) ) {
            origin = [ -110, 75 ]
            zoom = 1.5
        }
    } )

    let map
    const makeMap = ( ctx ) => {
        // console.log( "DeviceSearch -> makeMap( )" )

        map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: origin,
            zoom : zoom   
        } )
        map.on( 'zoomend', ( ) => {
            search.getMapBounds( map ) 
            dispatch( 'filter' ) //  console.log( "DeviceSearch -> map.on( zoomend ) -> Search region:", search )
        } )
        map.on( 'dragend', ( ) => {
            search.getMapBounds( map ) 
            dispatch( 'filter' ) // console.log( "DeviceSearch -> map.on( dragend ) -> Search region:", search )
        } )

        $DEVICES.forEach( d =>{
            d.s_mark.setLngLat( [ d.hdr.hdr_geo_lng, d.hdr.hdr_geo_lat ] )
            d.updateMarkerMode( ) 
            d.s_mark.addTo( map )
            d.updateDeviceSearchMap = ( lng, lat ) => { 
                d.s_mark.setLngLat( [ lng, lat ] ) 
                d.updateMarkerMode( )
                console.log( "updateDeviceSearchMap( ): ", d.s_mark.getOffset( ) )
            }  
        } ) 
        
    }

</script>

<div class="flx-col search-panel">

    <div class="flx-row search">

        <PillButton
            cls={ 'bg-grey' }
            hint={ 'Reset filters' } 
            on:click={ ( ) => { 
                search = new DESSearchParam( )
                get_devices( ) 
            } }
        />

        <InputText enabled={ true } bind:txt={ search.token } place="Search text"/>

    </div>

    { #if $DEVICES_LOADED }
    <div class="map-container" use:makeMap></div>
    { /if }

</div>

<style>

    .search-panel {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        padding: 1em;
        height:100%;
    }

    .search {
        padding: 0.25em;
        align-items: center;
    }

    /* TABLET */
    @media(max-width: 1024px) {

    }

    /* MOBILE */
    @media(max-width: 425px) {
        .search-panel {
            padding-right: 0;
            background-color: transparent;
            border: none;
            max-width: 100%;
            min-width: 100%;
            width: auto;
        }

    }

</style>