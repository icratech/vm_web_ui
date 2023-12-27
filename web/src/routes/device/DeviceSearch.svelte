<script>

    import { onMount, getContext, createEventDispatcher } from 'svelte'

    import { debug } from '../../lib/des/utils'
    import { DESSearchParam } from '../../lib/des/api'
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'

    import { validateLngLat } from '../../lib/c001v001/models'
 
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // 
    import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    import btn_img_reset from "$lib/images/btn-img-reset-aqua.svg"

    export let search = new DESSearchParam( )

    const DEVICES = getContext(  'devices' )
    const DEVICES_LOADED = getContext(  'devices_loaded' )
    
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
        // debug( "DeviceSearch -> makeMap( )" )

        map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: origin,
            zoom : zoom   
        } )
        map.on( 'zoomend', ( ) => {
            search.getMapBounds( map ) 
            dispatch( 'filter' ) //  debug( "DeviceSearch -> map.on( zoomend ) -> Search region:", search )
        } )
        map.on( 'dragend', ( ) => {
            search.getMapBounds( map ) 
            dispatch( 'filter' ) // debug( "DeviceSearch -> map.on( dragend ) -> Search region:", search )
        } )

        $DEVICES.forEach( d =>{

            d.s_mark.setLngLat( validateLngLat( d.hdr.hdr_geo_lng, d.hdr.hdr_geo_lat ) )
            d.updateMarkerMode( ) 
            d.s_mark.addTo( map )

            d.updateDeviceSearchMap = ( lng, lat ) => { 
                d.s_mark.setLngLat( validateLngLat( lng, lat ) ) 
                d.updateMarkerMode( )
                debug( "updateDeviceSearchMap( ): ", d.s_mark.getOffset( ) )
            }  
            
        } ) 
        
    }

    const dispatch = createEventDispatcher( )
    
</script>

<div class="flx-col container">
    
    <div class="flx-row search">

        <PillButton
            img={ btn_img_reset }
            hint={ 'Reset filters' } 
            on:click={ ( ) => { 
                search = new DESSearchParam( )
                // getDevices( ) 
            } }
        />

        <InputText enabled={ true } bind:txt={ search.token } place="Search text"/>

    </div>

    { #if $DEVICES_LOADED }
    <div class="map-container" use:makeMap></div>
    { /if }

</div>

<style>

    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        height:100%;
        padding: 0;
        gap: 0;
    }

    .search {
        padding: 1em;
        align-items: center;
    }
    

    /* LAP TOP */
    @media(max-width: 1440px) {

    }

    /* TABLET */
    @media(max-width: 1024px) {
    }

    /* MOBILE */
    @media(max-width: 425px) {
        .container {
            padding-right: 0;
            padding-left: 1em;
            background-color: transparent;
            border: none;
            max-width: 100%;
            min-width: 100%;
            width: auto;
        }
        .search { 
            padding-top: 0.5em; 
            padding-right: 0; 
            padding-left: 0; 
        }
    }

</style>