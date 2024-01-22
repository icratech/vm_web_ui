<script>
    
    import { onMount, getContext, createEventDispatcher } from 'svelte'

    import { debug } from '../../lib/des/utils'
    import { DESSearchParam } from '../../lib/des/api'
    import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../../lib/des/app'
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'

    import { getJobs } from "../../lib/c001v001/job"
    import { validateLngLat } from '../../lib/c001v001/models'

    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // 
    import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = MAPBOX_TOKEN
    
    import btn_img_reset from "$lib/images/btn-img-reset-aqua.svg"

    export let search = new DESSearchParam( )

    const JOBS = getContext( 'jobs' )
    const JOBS_LOADED = getContext( 'jobs_loaded' )

    $: zoom = 2.3
    let center = [ -100, 60 ]
    onMount( ( ) => { checkOrigin( ) } )

    $: mapStyle = ""
    const checkOrigin = ( ) => {
        if ( window.innerWidth <= 550 ) {
            // mapStyle = `min-height: ${ window.innerWidth - ( 2.5 * 11 ) }px; min-width: ${ window.innerWidth - ( 2.5 * 11 ) }px;`
            zoom = 1.0
        } else if ( window.innerHeight <= 550 ) {
            zoom = 1.0
        } else if ( window.innerWidth <= 1100 && window.innerHeight >= 800 ) {
            zoom = 2.8
        } else {
            zoom = 2.3
        } // debug( "JobSearch.svelte -> checkOrigin( ): ", { center: center, zoom: zoom } )
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
            dispatch( 'filter' ) //  debug( "JobSearch -> map.on( zoomend ) -> Search region:", search )
        } )
        map.on( 'dragend', ( ) => {
            search.getMapBounds( map ) 
            dispatch( 'filter' ) // debug( "JobSearch -> map.on( dragend ) -> Search region:", search )
        } )

        $JOBS.forEach( j =>{ 
            j.s_mark.setLngLat( validateLngLat( j.reg.des_job_lng, j.reg.des_job_lat ) )
            j.s_mark.addTo( map ) 
        } ) 
        
    }
    const resetSearch = ( ) => {
        getJobs( )
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

    { #if $JOBS_LOADED }
    <!-- <div class="map-container map" style={ mapStyle } use:makeMap></div> -->
    <div class="map-container map" use:makeMap></div>
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
    
    .map { height: 100%; }

    /* LAP TOP */
    @media(max-width: 1440px) {  }

    /* TABLET */
    @media(max-width: 1100px) {  }

    /* MOBILE */
    @media(max-width: 550px) {
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
        .map { height: 30em; }
    }

</style>