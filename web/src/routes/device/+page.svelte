
<script>

    import { onMount } from 'svelte'

    import { goto } from '$app/navigation'
    import { DEVICES, Device, Job } from '../../lib/des_api'
    import DeviceSearch from './DeviceSearch.svelte'
    import DeviceCard from './DeviceCard.svelte'

    /* THIS ALSO WORKS */
    // import { page } from '$app/stores'
    // $: device = $page.data.resp.device
    // $: message = $page.data.resp.message
    // $: status = $page.data.resp.status

    export let data 
 
    onMount( ( ) => {

        if ( $DEVICES[ 0 ] ) {

            data.devices.forEach( dev => {

                if ( $DEVICES.filter( d => { return d.reg.des_dev_serial == dev.reg.des_dev_serial } ) == undefined ) {
                    let device  = new Device (
                        new Job(
                            dev.job.admins,
                            dev.job.configs,
                            dev.job.events,
                            dev.job.samples,
                            dev.job.xypoints,
                            dev.job.reg 
                        ),
                        dev.reg
                    )
                    $DEVICES = [ device, ...$DEVICES ]
                }
            } ) 

        } else {
            let devices = [ ]
            data.devices.forEach( ( dev ) => { 
                devices.push( new Device (
                    new Job(
                        dev.job.admins,
                        dev.job.configs,
                        dev.job.events,
                        dev.job.samples,
                        dev.job.xypoints,
                        dev.job.reg 
                    ),
                    dev.reg
                ) )
            } )
            $DEVICES = [ ...devices ]
        }

    } )

</script>

<dvi class="flx-col container">

    <div class="flx-row content">

        <DeviceSearch />
        
        <div class="flx-col device-list">
            { #each $DEVICES as device  }
                <DeviceCard 
                    bind:dev={ device }
                    on:go={ ( ) => { goto( `device/${device.reg.des_dev_serial }` ) } }
                />
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
        overflow-y: auto;
    }

    .device-list {
        width: 100%;
        overflow-y: auto;
        padding: 0 1em;
        gap: 1.5em;
    }

</style>