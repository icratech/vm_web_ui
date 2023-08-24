<script>

    import { onMount } from 'svelte'
    import { DEVICES, Device, AUTH, Sample, Config, Event, newJob } from "../../lib/des_api"
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import HeaderPanel from '../../lib/components/header/HeaderPanel.svelte'
    import EventCard from "../../lib/components/event/EventCard.svelte"
    import ConfigCard from "../../lib/components/config/ConfigCard.svelte"
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl
    import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    export let device = new Device( )
    $: event = device.job.events[0]  
    $: config = device.job.configs[0]

    $: header = device.job.headers[0]

    $: available = header.hdr_job_start == 0
    $: newJobButtonColor = 'bg-orange'
    $: newJobButtonText = 'Start'

    $: active = ( header.hdr_job_start > 0 && header.hdr_job_end == 0 )
    $: socketButtonColor = ( device.socket ? 'bg-pink' : 'bg-accent' ) 

    $: smp = ( device.job.samples ? device.job.samples[device.job.samples.length - 1] : new Sample( ) )

    
    const makeMap = ( ctx ) => {

        let map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/clklqsnmp006t01q22cb3h18x',
            center: device.job.geo.geometry.coordinates,
            zoom : 5.5
        } )
        
        const el = document.createElement('div')
        el.className = 'marker'
        new mapboxgl.Marker( el ).setLngLat( device.job.geo.geometry.coordinates ).addTo( map )

    }

</script>


<div class="flx-col container">

    <div class="flx-row title">     
                
        { #if available }
        <PillButton 
            cls={ newJobButtonColor }
            on:click={ ( ) => { newJob( device ) } }
        >{ newJobButtonText }</PillButton>
        { /if }

        { #if active }
        <PillButton 
            cls={ socketButtonColor }
            on:click={ ( ) => {  
                ( device.socket ? device.disconnectWS( ) : device.connectWS( $AUTH ) ) 
                console.log( "device.socket: ", device.socket )
            } }
        >Live</PillButton>
        { /if }

        <div class="flx-row">
            <h3 class="fg-accent">SN:</h3>
            <h3>{ device.reg.des_dev_serial }</h3>
        </div>  
        <div class="flx-col cv">
            <div class="flx-row" style="justify-content: flex-end;">
                <div class="sml">class</div>
                <div class="fg-accent">{ device.reg.des_dev_class }</div>
            </div>
            <div class="flx-row" style="justify-content: flex-end;">
                <div class="sml">version</div>
                <div class="fg-accent">{ device.reg.des_dev_version }</div>
            </div>
        </div>
    </div>

    <!-- <div class="flx-row"> -->

        <div class="flx-row tabs">

            <PillButton
                cls={ 'bg-purple_a' }
            >?</PillButton>
    
            <PillButton
                cls={ 'bg-blue' }
            >?</PillButton>
    
            <PillButton
                cls={ 'bg-aqua_a' }
            >?</PillButton>
    
            <PillButton
                cls={ 'bg-green' }
            >?</PillButton>
    
            <PillButton
                cls={ 'bg-yellow' }
            >?</PillButton>
    
            <PillButton
                cls={ 'bg-orange' }
            >?</PillButton>
    
            <PillButton
                cls={ 'bg-red' }
            >?</PillButton>
    
        </div>
    
        <div class="flx-col cards">

            <!-- <div class="flx-col card">
                <BarGaugeCard bind:smp={ smp }/>
            </div> -->
    
            <HeaderPanel bind:header={ header } />
            <!-- <ConfigCard bind:config={config} /> -->
        
            <!-- <EventCard bind:event={event} title="Last event" /> -->
    
        </div>
    
    <!-- </div> -->

    <div class="map-container" use:makeMap></div>

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

    .title {
        justify-content: space-between;
        padding: 0;
        width: 18em;
    }
    .cv {
        width: auto;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 0em;
    }

    .tabs {
        /* justify-content: flex-end; */
        align-items: center;
        width: 2.5em;
        padding: 0;
    }

</style>