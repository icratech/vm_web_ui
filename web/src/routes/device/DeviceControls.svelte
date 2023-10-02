<script>

    import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher( )


    import { DEVICES, Device, AUTH, Sample, Config, Event } from "../../lib/des_api"
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import HeaderCard from '../../lib/components/header/HeaderCard.svelte'
    import EventCard from "../../lib/components/event/EventCard.svelte"
    import ConfigCard from "../../lib/components/config/ConfigCard.svelte"
    
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import btn_img_start from "$lib/images/btn-img-start.svg"
    import btn_img_config from "$lib/images/btn-img-config.svg"
    import btn_img_stop from "$lib/images/btn-img-stop.svg"
    import btn_img_watch from "$lib/images/btn-img-view.svg"
    
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl
    // import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    export let device = new Device( )
    $: evt = device.evt 
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: available = hdr.hdr_job_start == 0
    $: pending = hdr.hdr_job_end != 0
    $: jobStartColor = ( pending ? 'bg-orange' : 'bg-green' )
    $: jobStartText = ( pending ? 'Pending Command' : 'Start Job' )
    $: jobStartIcon = btn_img_config 
    $: jobStartFunc = ( ) => { ( pending ? device.endJob( ) : dispatch( 'start' ) ) }

    $: active = ( hdr.hdr_job_start > 0 && hdr.hdr_job_end == 0 )
    $: socketButtonColor = ( device.socket ? 'bg-yellow' : 'bg-green' )
    $: socketButtonText = ( device.socket ? 'Disconnect' : 'Watch Job' )

    const makeMap = ( ctx ) => {

        let map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: [ hdr.hdr_geo_lng, hdr.hdr_geo_lat ],
            zoom : ( active ? 5.5 : 1 ),
            interactive: true
        } )

        device.mark.addTo( map )
        device.updateDevicePageMap = ( act, lng, lat ) => { 
            map.easeTo( { center: [ lng, lat ], zoom: ( act ? 5.5 : 1 ), duration: 3500 } ) 
            device.mark.setLngLat( [ lng, lat ] )
        }
    }

</script>


<div class="flx-col container">

    <div class="flx-row title">     

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

        <div class="flx-row btns">

            { #if available || pending }
            <PillButton 
                cls={ jobStartColor }
                on:click={ jobStartFunc }
                img={ jobStartIcon }
                hint={ jobStartText }
            />
            { /if }
        
            { #if active }
            <PillButton 
                cls={ 'bg-red' }
                on:click={ ( ) => { device.endJob( $AUTH ) } }
                img={ btn_img_stop }
                hint={ 'End Job' } 
            />
            { /if }  
            <PillButton 
                cls={ socketButtonColor }
                on:click={ ( ) => { ( device.socket ? device.disconnectWS( ) : device.connectWS( $AUTH ) ) } }
                img={ btn_img_watch }
                hint={ socketButtonText } 
            />

        </div> 

    </div>
                
    <div class="flx-col cards">

        <BarGaugeCard bind:smp bind:cfg />

        <div class="flx-col card">
            <HeaderCard bind:header={hdr} />
        </div>

    </div>
    
    <div class="map-container" use:makeMap ></div>

</div>

<style>

    .container {
        border-radius: 0.5em;
        padding: 1em;
        max-width: 38em;
        min-width: 38em;
        height:100%;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }

    .title {
        justify-content: space-between;
    }
    .cv {
        width: auto;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 0em;
    }

    .btns {
        
        align-items: center;
        justify-content: flex-end;
    }

</style>