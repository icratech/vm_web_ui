
<script>

    import { goto } from '$app/navigation'
    import DeviceCard from './DeviceCard.svelte'

    /* THIS ALSO WORKS */
    // import { page } from '$app/stores'
    // $: device = $page.data.resp.device
    // $: message = $page.data.resp.message
    // $: status = $page.data.resp.status

    export let data
    $: devices = data.resp.devices
    $: message = data.resp.message
    $: status = data.resp.status
    $: { console.log( `./device: ${ status.toUpperCase() }\t${ message }` ) }
    $: { console.log( `./devices: ${ JSON.stringify( devices, null, 4 ) }\n` ) }
    
</script>

<dvi class="flx-col container">

    <h1>DEVICES PAGE</h1>
    <p>STATUS: { status }</p>
    <p>MESSAGE: { message }</p>

    <div class="flx-col device-list">
        { #each devices as device ( `device_page_${ device.des_dev_id }`  )  }
            <DeviceCard 
                bind:device={ device }
                on:go={ ( ) => { goto( `device/${device.des_dev_serial }` ) } }
            />
        { /each }
    </div>

</dvi>  

<style>

    .container {
        height: 100%;
        gap: 1rem;
    }

    .device-list {
        width: 100%;
        overflow-y: auto;
        padding: 1em;
    }

</style>