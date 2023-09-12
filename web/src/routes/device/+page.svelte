
<script>

    import { onMount } from 'svelte'

    import { DEVICES, DEVICES_LOADED, get_devices } from '../../lib/des_api'
    import DeviceSearch from './DeviceSearch.svelte'
    import DeviceCard from './DeviceCard.svelte'

    export let data
    $: console.log( "/device/+page.svelte -> data ", data )
    onMount( async( ) => { 
        // console.log( "/device/+page.svelte -> onMount( ) -> $DEVICES_LOADED: ", $DEVICES_LOADED )
        if( !$DEVICES_LOADED ) { await get_devices( ) }
    } )

</script>

<dvi class="flx-col container">

    <div class="flx-row content">

        <DeviceSearch />
        
        <div class="flx-col device-list">
            { #each $DEVICES as device  }
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