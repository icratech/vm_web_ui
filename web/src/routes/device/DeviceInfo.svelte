<script>

    // import { onMount } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher( )

    import { Device, OP_CODES, Sample } from "../../lib/des_api"

    import DeviceMode from "./DeviceMode.svelte"
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import HeaderCard from '../../lib/components/header/HeaderCard.svelte'
    // import HeaderCardMobile from '../../lib/components/header/HeaderCardMobile.svelte'
    
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import btn_img_default from "$lib/images/btn-img-default.svg"
    import btn_img_start from "$lib/images/btn-img-start.svg"
    import btn_img_cmd from "$lib/images/btn-img-cmd.svg"
    import btn_img_stop from "$lib/images/btn-img-stop.svg"
    import btn_img_watch from "$lib/images/btn-img-view.svg"
    
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    export let device = new Device( )
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: sta = device.sta
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: cmdButtonColor = 'bg-accent'
    $: cmdButtonHint = 'Not Set'
    $: cmdButtonIcon = btn_img_default
    $: cmdButtonFunc = ( ) => {
        console.log( "device.sta.sta_logging: ", sta.sta_logging, OP_CODES.JOB_ENDED )
    } 

    $: { switch ( sta.sta_logging ) {

            case OP_CODES.JOB_ENDED: 
                cmdButtonColor = 'bg-green'
                cmdButtonHint = 'Start Job'
                cmdButtonIcon = btn_img_start
                cmdButtonFunc = ( ) => { dispatch( 'start' ) }
                break 

            case OP_CODES.JOB_STARTED: 
                cmdButtonColor = 'bg-red'
                cmdButtonHint = 'End Job'
                cmdButtonIcon = btn_img_stop
                cmdButtonFunc = ( ) => { device.endJob( ) }
                break 
            
            case OP_CODES.JOB_START_REQ:
                cmdButtonColor = 'bg-orange' 
                cmdButtonHint = 'Cancel Start Job' 
                cmdButtonIcon = btn_img_cmd
                cmdButtonFunc = ( ) => { device.cancelStartJob( ) }
                break

            case OP_CODES.JOB_END_REQ: 
                cmdButtonColor = 'bg-pink' 
                cmdButtonHint = 'Cancel End Job' 
                cmdButtonIcon = btn_img_cmd
                // cmdButtonFunc = ( ) => { /* cnacel end */ }
                cmdButtonFunc = ( ) => { device.cancelStartJob( ) }
                break

        }
    }

    $: socketButtonColor = ( device.socket ? 'bg-orange' : 'bg-accent' )
    $: socketButtonText = ( device.socket ? 'Disconnect' : 'Watch Job' )
    // $: socketButtonFunc =  async( ) => { ( device.socket ? await device.disconnectWS( ) : await device.connectWS( ) ) }
    $: socketButtonFunc =  ( ) => { ( device.socket ? device.disconnectWS( ) : device.connectWS( ) ) }
    
    const makeMap = ( ctx ) => {

        let map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: [ hdr.hdr_geo_lng, hdr.hdr_geo_lat ],
            zoom : ( sta.sta_logging == OP_CODES.JOB_STARTED ? 5.5 : 1 ),
            interactive: true
        } )

        device.mark.addTo( map )
        device.updateDevicePageMap = ( act, lng, lat ) => { 
            device.mark.setLngLat( [ lng, lat ] )
            map.easeTo( { center: [ lng, lat ], zoom: ( act ? 5.5 : 1 ), duration: 2500 } ) 
        }
    }

</script>


<div class="flx-col container">

    <div class="flx-col layout">

        <div class="flx-row title-bar">     

            <div class="flx-row ser-cont">
                <div class="flx-row fg-accent ser-lbl">Serial #</div>
                <div class="vert-line"/>
                <div class="flx-row ser">{ device.reg.des_dev_serial }</div>
            </div>  

            <DeviceMode bind:device />

            <div class="flx-row btns">

                <PillButton 
                    bind:cls={ cmdButtonColor }
                    on:click={ cmdButtonFunc }
                    bind:img={ cmdButtonIcon }
                    bind:hint={ cmdButtonHint }
                />

                <PillButton 
                    cls={ socketButtonColor }
                    on:click={ socketButtonFunc }
                    img={ btn_img_watch }
                    hint={ socketButtonText } 
                />

            </div> 

        </div>
                    
        <div class="flx-col status">

            <HeaderCard bind:hdr />

            <BarGaugeCard bind:cfg bind:smp/>

        </div>

    </div>
    <br>
    <div class="flx-col map">
        <div class="map-container" use:makeMap />
    </div>

</div>

<style>

    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        height:100%;
        padding: 0;
        gap: 0.5em;
    }
    .layout {  
        padding: 0; 
        padding-right: 0.5em;
        gap: 0; 
    }
    .title-bar {
        justify-content: space-between;
        align-items: center;
        padding: 0;
        padding-top: 0.5em;
        padding-bottom: 1em;
    }
    
    .ser-cont { 
        width: auto;
        height: 2em; 
        gap: 0;         
    }
    .ser-lbl { 
        font-size: 1.25em;  
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.6em;
        max-width: 4.8em;
        min-width: 4.8em;
    }
    .ser { 
        font-size: 1.25em;  
        align-items: center; 
        width: auto;
    }

    .btns { 
        justify-content: flex-end; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }

    .map {
        border-radius: 0.5em;
        min-height: 15em;
        height: 100%;
    }

    /* LAP TOP */
    @media(max-width: 1440px) {

    }

    /* TABLET */
    @media(max-width: 1024px) {
        .container { 
            background-color: transparent;
            flex-direction: row; 
            border: none;
        }
        .layout { 
            padding-top: 0; 
            padding-right: 0; 
        }
        .title-bar {padding-bottom: 0.75em; }
    }
    
    /* MOBILE */
    @media(max-width: 425px) {
        .container { 
            flex-direction: column; 
            padding-top: 0;
            padding-right: 0.5em;
            padding-left: 1em;
            background-color: transparent;
            border: none;
            max-width: 100%;
            min-width: 100%;
            width: auto;
        }
        .layout {  padding: 0;  }
        .map { max-height: 13em;  }

    }

</style>