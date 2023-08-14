
<script>

    import { onMount } from 'svelte'

    import { goto } from '$app/navigation'
    import { Job, Device, DEVICES } from '../../lib/des_api'
    import DeviceSearch from './DeviceSearch.svelte'
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
 
    let ready = false
    let devs = [ ]
    onMount( ( ) => {

        devices.forEach( ( dev ) => { 
            console.log( dev.reg.des_dev_id )
            devs.push( new Device( 
                new Job(
                    dev.job.admins,
                    dev.job.configs,
                    dev.job.events,
                    dev.job.samples,
                    dev.job
                ),
                dev.reg
             ) ) 
        
        } )
    
        console.log( `Start $DEVICES.length: ${ $DEVICES.length }` )
        let existing_devs = false
        if ( $DEVICES[ 0 ] ) { 

            existing_devs = false

            devs.forEach( dev => { 
                
                let stored = $DEVICES.filter( sd => sd.reg.des_dev_serial == dev.reg.des_dev_serial )[ 0 ]
                if ( stored == undefined ) {
                    console.log( `NEW DEVICE -> dev.reg.des_reg_serial: ${ dev.reg.des_dev_serial }` )
                    $DEVICES = [ dev, ...$DEVICES ] 
                } else {
                    console.log( `Loop DEVICES.forEach( ) -> stored.reg.des_reg_serial: ${ stored.reg.des_dev_serial }` )
                }

             } )

        } else {
            
            devs.forEach( dev => console.log( `/device/+page make Devices -> dev.reg.des_dev_id: ${ dev.reg.des_dev_id }` ) )

            $DEVICES = [ ...devs ]
        
        }
        
        console.log( `Start $DEVICES.length: ${ $DEVICES.length }` )

        ready = true
    } )

</script>

<dvi class="flx-col container">

    <!-- <div class="flx-row page-title">
        <h3>DEVICES PAGE</h3>
        <p>STATUS: { status }</p>
        <p>MESSAGE: { message }</p>
    </div> -->

    <div class="flx-row content">

        { #if ready }
        <DeviceSearch />
        
        <div class="flx-col device-list">
            { #each $DEVICES as device  }
                <DeviceCard 
                    bind:dev={ device }
                    on:go={ ( ) => { goto( `device/${device.reg.des_dev_serial }` ) } }
                />
            { /each }
        </div>
        { /if }

    </div>

</dvi>  

<style>

    .container {
        height: 100%;
        gap: 1rem;
        overflow-y: hidden;
    }

    .content {
        overflow-y: auto;
    }

    .device-list {
        width: 100%;
        overflow-y: auto;
        padding: 0 1em;
        gap: 1.5em;
    }

</style>