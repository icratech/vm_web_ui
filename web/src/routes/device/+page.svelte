
<script>

    import { onMount } from 'svelte'

    import { goto } from '$app/navigation'
    import { DEVICES, Device, Job } from '../../lib/des_api'
    import DeviceSearch from './DeviceSearch.svelte'
    import DeviceCard from './DeviceCard.svelte'

    export let data 
    onMount( ( ) => {
        data.devices.forEach( dev => {
            if ( $DEVICES.filter( d => { return d.reg.des_dev_serial == dev.reg.des_dev_serial } )[0] == undefined ) {
                // console.log( "New $DEVICE: ", dev.reg.des_dev_serial )
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
                console.log( "Devices Load ", device )
                $DEVICES = [ ...$DEVICES, device ]
            }
        } ) 
        $DEVICES.sort( ( a, b ) => b.reg.des_dev_id - a.reg.des_dev_id )
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