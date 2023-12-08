<script>

    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher( )

    import { Device, OP_CODES, Sample, validateMeasuredValue, debug } from "../../lib/des_api"

    import DeviceMode from "./DeviceMode.svelte"
    import HeaderCard from '../../lib/components/header/HeaderCard.svelte'
    import DeviceConn from './DeviceConn.svelte'
    import ConfigCard from '../../lib/components/config/ConfigCard.svelte'
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import btn_img_default from "$lib/images/btn-img-default.svg"

    import btn_img_start from "$lib/images/btn-img-start.svg"
    import btn_img_start_green from "$lib/images/btn-img-start-green.svg"
    import btn_img_start_grey from "$lib/images/btn-img-start-grey.svg"

    // import btn_img_cmd from "$lib/images/btn-img-cmd.svg"
    import btn_img_cmd_pink from "$lib/images/btn-img-cmd-pink.svg"
    import btn_img_cmd_orange from "$lib/images/btn-img-cmd-orange.svg"
    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"

    import btn_img_stop from "$lib/images/btn-img-stop.svg"
    import btn_img_stop_red from "$lib/images/btn-img-stop-red.svg"
    import btn_img_stop_grey from "$lib/images/btn-img-stop-grey.svg"

    import btn_img_watch from "$lib/images/btn-img-view.svg"
    import btn_img_watch_aqua from "$lib/images/btn-img-view-aqua.svg"
    import btn_img_watch_orange from "$lib/images/btn-img-view-orange.svg"
    import btn_img_watch_pink from "$lib/images/btn-img-view-pink.svg"
    
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    export let device = new Device( )
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: sta = device.sta
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    // $: cmdButtonColor = 'bg-accent'
    $: cmdButtonHint = 'Not Set'
    $: cmdButtonIcon = btn_img_default
    $: cmdButtonFunc = ( ) => {
        debug( "device.sta.sta_logging: ", sta.sta_logging, OP_CODES.JOB_ENDED )
    } 

    $: { switch ( sta.sta_logging ) {

            case OP_CODES.DES_REG_REQ: 
            case OP_CODES.DES_REGISTERED: 
            case OP_CODES.JOB_ENDED: 
                cmdButtonHint = 'Start Job'
                cmdButtonIcon = btn_img_start_green
                cmdButtonFunc = ( ) => { dispatch( 'start' ) }
                smp = new Sample( )
                break 

            case OP_CODES.JOB_STARTED: 
                cmdButtonHint = 'End Job'
                cmdButtonIcon = btn_img_stop_red
                cmdButtonFunc = ( ) => { dispatch( 'end' ) }
                break 
            
            case OP_CODES.JOB_START_REQ:
                cmdButtonHint = 'Job Start Pending' 
                cmdButtonIcon = btn_img_cmd_purple
                cmdButtonFunc = ( ) => { device.setState( ) }
                break

            case OP_CODES.JOB_END_REQ:
                cmdButtonHint = 'Job End Pending' 
                cmdButtonIcon = btn_img_cmd_purple
                cmdButtonFunc = ( ) => { device.setState( ) }
                break

            case OP_CODES.GPS_ACQ:
                cmdButtonHint = 'Acquiring GPS' 
                cmdButtonIcon = btn_img_cmd_pink
                cmdButtonFunc = ( ) => { }
                break
        }
    }

    $: socketButtonImage = ( device.socket ? btn_img_watch_orange : btn_img_watch_aqua )
    $: socketButtonText = ( device.socket ? 'Disconnect' : 'Watch Job' )
    $: socketButtonFunc =  ( ) => { ( device.socket ? device.disconnectWS( ) : device.connectWS( ) ) }
    
    const makeMap = ( ctx ) => {

        let map = new mapboxgl.Map(  {
            container: ctx,
            style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
            center: [ validateMeasuredValue( hdr.hdr_geo_lng ), validateMeasuredValue( hdr.hdr_geo_lat ) ],
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

                { #if device.ping.ok }
                <PillButton 
                    on:click={ cmdButtonFunc }
                    bind:img={ cmdButtonIcon }
                    bind:hint={ cmdButtonHint }
                />
                { /if }
                
                <PillButton 
                    on:click={ socketButtonFunc }
                    img={ socketButtonImage }
                    hint={ socketButtonText } 
                />

            </div> 

        </div>  

        <div class="flx-col gauge">
            <BarGaugeCard bind:cfg bind:smp/>
        </div>

    </div>

    <br>
    
    <div class="flx-col map">
        <div class="map-container" use:makeMap />
    </div>

    <div></div>
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
        gap: 1em; 
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