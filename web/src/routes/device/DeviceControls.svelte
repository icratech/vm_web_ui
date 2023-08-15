<script>

    import { onMount } from 'svelte'
    import { DEVICES, Device, AUTH, Sample, Config, Event } from "../../lib/des_api"
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import EventCard from "../../lib/components/event/EventCard.svelte"
    import ConfigCard from "../../lib/components/config/ConfigCard.svelte"
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl
    import 'mapbox-gl/dist/mapbox-gl.css'

    let lat = 52.2690 
    let lng = -113.8115
    let zoom = 5
    let map
    onMount( ( ) => { 
        map = new mapboxgl.Map( {
            container: "map",
            style: 'mapbox://styles/leehayford/clklqsnmp006t01q22cb3h18x',
            center: [ lng, lat ],
            zoom : zoom
        } )

        // dev = $DEVICES.filter( d => { return d.reg.des_dev_serial == devices_serial } )[0]

    } )
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    export let device = new Device( )
    // $: device = dev
    $: event = device.job.events[0]  
    $: config = device.job.configs[0]
    $: active = ( config.cfg_job_end == 0 )
    let socketButtonColor = ( device.socket ? 'bg-pink' : 'bg-green' ) 
    $: smp = ( device.job.samples ? device.job.samples[device.job.samples.length - 1] : new Sample( ) )
    
    // $: {
    //     console.log( "smp.smp_time: ", smp.smp_time )
    //  }
    // let event = new Event( )
    // let config = new Config( )
    // let active = true
    // let smp = new Sample( )

    // $: event = ( device.job.events ? device.job.events[0] : new Event( ) ) 
    // $: config = ( device.job.configs ? device.job.configs[0] : new Config( ) )
    // $: active = ( config ? config.cfg_job_end == 0 : false )
    // $: smp = ( device.job.samples ? device.job.samples[device.job.samples.length - 1] : new Sample( ) )
    // $: socketButtonColor = ( device.socket ? 'bg-pink' : 'bg-green' )
    // // $: { console.log( `DeviceControls config: ${ JSON.stringify( config, null, 4 ) }\n` ) }
    // // $: { console.log( `./device/[slug]/DeviceControls: ${ JSON.stringify( device, null, 4 ) }\n` ) }
</script>


<div class="flx-col container">

    <div class="flx-row tabs">
        
        { #if active }
        <PillButton 
            cls={ socketButtonColor }
            on:click={ ( ) => {  
                ( device.socket ? device.disconnectWS( ) : device.connectWS( $AUTH ) ) 
                console.log( "device.socket: ", device.socket )
            } }
        />
        { /if }

        <PillButton
            cls={ 'bg-purple_a' }
        >?</PillButton>

        <PillButton
            cls={ 'bg-aqua_a' }
        >?</PillButton>

        <PillButton
            cls={ 'bg-orange_a' }
        >?</PillButton>

    </div>

    <div class="flx-col cards">

        <BarGaugeCard bind:smp={ smp }/>

        <!-- <ConfigCard bind:config={config} /> -->
    
        <EventCard bind:event={event} title="Last event" />

    </div>

    <div class="map-container" id="map"></div>

</div>

<style>

    .container {
        border-top: solid 0.05em var(--grey_aa);
        border-right: solid 0.05em var(--grey_aa);
        background-color: var(--light_aa);
        border-radius: 0.5em;
        padding: 1em;
        max-width: 38em;
        min-width: 38em;
        height:100%;
        overflow: hidden;
    }

    .tabs {
        padding: 0.25em;
        align-items: center;
    }

    /* .cards {
        height: 60%;
        background-color: var(--dark);
        padding: 0.5rem;
        border-radius: 0.5em;
        border-bottom: solid 0.05em var(--grey_aa);
        border-left: solid 0.05em var(--grey_aa);
    } */

    .map-container {
        height: 100%;
        border-top: solid 0.05em var(--dark_a);
        border-right: solid 0.05em var(--dark_a);
        background-color: var(--aqua_a);
        border-radius: 0.5em;
        position: relative;
    }

</style>