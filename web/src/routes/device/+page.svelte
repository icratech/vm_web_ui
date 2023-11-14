
<script>

    import { onMount } from 'svelte'

    import { 
        AUTH, 
        DEVICES, 
        DEVICES_LOADED, 
        DESSearchParam, 
        get_devices, 
        connect_devices, 
        updateDevicesStore,
        debug 
    } from '../../lib/des_api'
    import DeviceSearch from './DeviceSearch.svelte'
    import DeviceCard from './DeviceCard.svelte'

    export let data
    $: debug( "/device/+page.svelte -> data ", data )
    onMount( async( ) => { 
        // debug( "/device/+page.svelte -> onMount( ) -> $DEVICES_LOADED: ", $DEVICES_LOADED )
        debug( "/device/+page.svelte -> onMount( ) -> $AUTH: ", $AUTH )
        if( !$DEVICES_LOADED ) {  get_devices( ) }
        connect_devices( ) 
    } )

    $: search = new DESSearchParam( )

    const checkBounds = ( d ) => { 
        return ( 
            d.reg.des_job_lng >= search.lng_min &&  d.reg.des_job_lng <= search.lng_max && 
            d.reg.des_job_lat >= search.lat_min &&  d.reg.des_job_lat <= search.lat_max 
        )
    }
    const checkTextFilter = ( d, s ) => {
        return (
            d.reg.des_dev_serial.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            d.hdr.hdr_well_co.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            d.hdr.hdr_well_name.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            d.hdr.hdr_well_sf_loc.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            d.hdr.hdr_well_bh_loc.toUpperCase( ).includes( s.token.toUpperCase( ) ) ||
            d.hdr.hdr_well_lic.toUpperCase( ).includes( s.token.toUpperCase( ) )
        )
    }

</script>

<dvi class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col search">
            <DeviceSearch bind:search on:filter={ ( ) => { updateDevicesStore( ) } } />
        </div>
        
        <div class="flx-col device-list">
            { #each $DEVICES.filter( d => {  return  checkBounds( d ) && checkTextFilter( d, search ) } ) as device ( device.reg.des_job_name ) }
                <DeviceCard bind:device={ device } />
            { /each }
        </div>

    </div>

</dvi>  

<style>

    .container {
        overflow-y: hidden;
        height: 100%;
        gap: 1rem;
    }

    .content { height: 100%; }

    .search {
        max-width: 25%;
        min-width: 25%;
        width: auto;
        padding: 0;
    }

    .device-list {
        overflow-y: auto;
        padding: 0 1em;
    }

    /* LAP TOP */
    @media(max-width: 1440px) {
        .content { padding-left: 0; }
        .search {
            max-width: 33%;
            min-width: 33%;
        }
        .device-list { padding-left: 0; }
    }

    /* TABLET */
    @media(max-width: 1024px) {

        .content { padding-right: 1em; }
        .search {
            max-width: 45%;
            min-width: 45%;
            padding-right: 0.5em; 
        }
        
        .device-list { 
            padding: 0 0.5em; 
            overflow-x: hidden;
        }
    }

    /* MOBILE */
    @media(max-width: 425px) {

        .content { 
            flex-direction: column; 
            padding-right: 0.5em; 
        }
        .search { 
            max-height: 28em;
            min-height: 28em;
            max-width: 100%;
            min-width: 100%;
        }
    }
</style>