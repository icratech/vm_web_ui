<script>

    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'
    import { DEVICES, DEVICES_LOADED, DESSearchParam, search_devices, get_devices /*GeoJSONFeatureCollection, GeoJSONFeature, GeoJSONGeometry */} from "../../lib/des_api";
 
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    let search = new DESSearchParam( )

    let origin = [ -113.811, 52.269 ]
    let map
    const makeMap = ( ctx ) => {
        console.log( "DeviceSearch -> makeMap( )" )

        map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: origin,
            zoom : 1.5   
        } )

        map.on('zoomend', ( ) => {
            // map.getBounds() returns LngLatBounds object 
            // https://docs.mapbox.com/mapbox-gl-js/api/geography/#lnglatbounds
            let b = map.getBounds( )
            search.lng_max = b._ne.lng
            search.lat_max = b._ne.lat
            search.lng_min = b._sw.lng
            search.lat_min = b._sw.lat
            console.log( "DeviceSearch -> map.on( zoomend ) -> Search region:", search )

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

    $: filter = true
    $: filterButtonText = ( filter ? "^" : "v" )

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
        
        <PillButton
            cls={ 'bg-purple' }
            hint={ 'More filters' } 
            on:click={ ( ) => { search_devices( search ) } }
        />


    </div>

    <!-- <div class="flx-row filters">
        FILTERS
    </div> -->

    <!-- { #if $DEVICES_LOADED } -->
    <div class="map-container" use:makeMap></div>
    <!-- { /if } -->

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

    /* .filters {
        height: 35em;
        padding: 0.5rem;
        border-radius: 0.5em;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    } */
</style>