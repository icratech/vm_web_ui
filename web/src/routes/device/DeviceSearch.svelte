<script>

    import { onMount, getContext, createEventDispatcher } from 'svelte'

    import { debug } from '../../lib/des/utils'
    import { DESSearchParam } from '../../lib/des/api'
    import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../../lib/des/app'
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'

    import { validateLngLat } from '../../lib/c001v001/models'
 
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // 
    import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = MAPBOX_TOKEN
    
    import btn_img_reset from "$lib/images/btn-img-reset-aqua.svg"

    export let search = new DESSearchParam( )

    const DEVICES = getContext(  'devices' )
    const DEVICES_LOADED = getContext(  'devices_loaded' )
    
    $: zoom = 2.3
    let center = [ -100, 60 ]
    onMount( ( ) => { checkOrigin( ) } )

    $: mapStyle = ""
    const checkOrigin = ( ) => {
        if ( window.innerWidth <= 550 ) {
            mapStyle = `min-height: ${ window.innerWidth - ( 2.5 * 11 ) }px; min-width: ${ window.innerWidth - ( 2.5 * 11 ) }px;`
            zoom = 1.0
        } else if ( window.innerHeight <= 550 ) {
            zoom = 1.0
        } else if ( window.innerWidth <= 1100 && window.innerHeight >= 800 ) {
            zoom = 2.8
        } else {
            zoom = 2.3
        } // debug( "DeviceSearch.svelte -> checkOrigin( ): ", { center: center, zoom: zoom } )
    }

    let map
    const makeMap = ( ctx ) => {

        checkOrigin( )

        map = new mapboxgl.Map(  {
            container: ctx,
            style: MAPBOX_STYLE, 
            center: center,
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
            d.updateDeviceSearchMap( )
        } ) 
        
    }
    const resetSearch = ( ) => {
        checkOrigin( )
        search = new DESSearchParam( )
        map.easeTo( { center: center, zoom: zoom, duration: 1000 } ) 
    }
    const dispatch = createEventDispatcher( )
    

</script>

<div class="flx-col container">
    
    <div class="flx-row search">

        <PillButton
            img={ btn_img_reset }
            hint={ 'Reset filters' } 
            on:click={ resetSearch }
        />

        <InputText enabled={ true } bind:txt={ search.token } place="Search text"/>

    </div>

    { #if $DEVICES_LOADED }
    <div class="map-container" style={ mapStyle } use:makeMap></div>
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
    @media(max-width: 1100px) {
    }

    /* MOBILE */
    @media(max-width: 450px) {
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