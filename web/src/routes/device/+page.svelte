
<script>

    import { onMount } from 'svelte'

    import { DEVICES, DEVICES_LOADED, DESSearchParam, get_devices, updateDevicesStore } from '../../lib/des_api'
    import DeviceSearch from './DeviceSearch.svelte'
    import DeviceCard from './DeviceCard.svelte'

    export let data
    $: console.log( "/device/+page.svelte -> data ", data )
    onMount( async( ) => { 
        // console.log( "/device/+page.svelte -> onMount( ) -> $DEVICES_LOADED: ", $DEVICES_LOADED )
        if( !$DEVICES_LOADED ) { await get_devices( ) }
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

        <DeviceSearch bind:search on:filter={ ( ) => { updateDevicesStore( ) } } />
        
        <div class="flx-col device-list">
            { #each $DEVICES.filter( d => {  
                return  checkBounds( d ) && checkTextFilter( d, search )
            } ) as device ( device.reg.des_job_name ) }

            <DeviceCard bind:device={ device } />

            { /each }
        </div>

    </div>

</dvi>  

<style>

    .container {
        height: 100%;
        gap: 1rem;
        overflow-y: hidden;
    }

    .content {
        height: 100%;
        overflow-y: auto;
    }

    .device-list {
        width: 100%;
        overflow-y: auto;
        padding: 0 1em;
        gap: 1.5em;
    }

</style>