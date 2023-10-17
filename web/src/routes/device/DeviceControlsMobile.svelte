
<script>
    
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher( )


    import { AUTH, COLORS, Device, Sample } from "../../lib/des_api"
    import { RGBA, BASE } from "../../lib/common/colors"

    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import HeaderCardMobile from '../../lib/components/header/HeaderCardMobile.svelte'
    
    import PillButton from "$lib/common/button/PillButton.svelte"
    import btn_img_start from "$lib/images/btn-img-start.svg"
    import btn_img_config from "$lib/images/btn-img-config.svg"
    import btn_img_stop from "$lib/images/btn-img-stop.svg"
    import btn_img_watch from "$lib/images/btn-img-view.svg"
    
    import mapboxgl from 'mapbox-gl' // npm install mapbox-gl  // npm install @types/mapbox-gl // import 'mapbox-gl/dist/mapbox-gl.css'
    mapboxgl.accessToken = 'pk.eyJ1IjoibGVlaGF5Zm9yZCIsImEiOiJjbGtsb3YwNmsxNm11M2VrZWN5bnYwd2FkIn0.q1_Wv8oCDo0Pa6P2W3P7Iw'
    
    export let device = new Device( )
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: available = hdr.hdr_job_start == 0
    $: pending = hdr.hdr_job_end != 0
    $: jobStartColor = ( pending ? 'bg-orange' : 'bg-green' )
    $: jobStartIcon = ( pending ? btn_img_config : btn_img_start ) 
    $: jobStartFunc = ( ) => { ( pending ? device.endJob( ) : dispatch( 'start' ) ) }

    $: active = ( hdr.hdr_job_start != 0 )
    $: socketButtonColor = ( device.socket ? 'bg-orange' : 'bg-accent' )

    let color_code = RGBA(BASE.LIGHT, 0.6)
    let lbl = 'OFF'
    $: {

        if ( hdr.hdr_job_start == 0 ) { color_code = RGBA(BASE.LIGHT, 0.2)  }
        else {
            switch ( cfg.cfg_vlv_tgt ) {

                case 0: 
                    lbl = 'BUILD'
                    color_code = RGBA(COLORS.PRESS, 0.7)
                    break

                case 2: 
                    lbl = 'VENT'
                    color_code = RGBA(BASE.AQUA, 0.8)
                    break

                case 4: // HI FLOW
                case 6: // LO FLOW
                    lbl = 'FLOW'
                    if ( smp.smp_lo_flow > cfg.cfg_flow_tog ) {
                        color_code = RGBA(COLORS.HI_FLOW, 0.8)
                    } else {
                        color_code = RGBA(COLORS.LO_FLOW, 0.8)
                    }
                    break

                default:
                    lbl = 'OFF'
                    color_code = RGBA(BASE.LIGHT, 0.6)
            }
        }
    }  

    const makeMap = ( ctx ) => {

    let map = new mapboxgl.Map(  {
        container: ctx,
        style: 'mapbox://styles/leehayford/cln378bf7005f01rcbu3yc5n9', 
        center: [ hdr.hdr_geo_lng, hdr.hdr_geo_lat ],
        zoom : ( active ? 5.5 : 2.5 ),
        interactive: true
    } )

    device.mark.addTo( map )
        device.updateDevicePageMap = ( act, lng, lat ) => { 
            map.easeTo( { center: [ lng, lat ], zoom: ( act ? 5.5 : 2.5 ), duration: 3500 } ) 
            device.mark.setLngLat( [ lng, lat ] )
        }
    }

</script>

<div class="flx-col container">

    <div class="flx-row title">     

        <div class="flx-row ser">
            <div class="fg-accent ser">SN:</div>
            <div class="ser">{ device.reg.des_dev_serial }</div>
        </div>  

        <h4 class="mode" style="background-color: { color_code };">{ lbl }</h4>

        <div class="flx-row btns">

            { #if available || pending }
            <PillButton 
                cls={ jobStartColor }
                on:click={ jobStartFunc }
                img={ jobStartIcon }
                hint={ null }
            />
            { /if }
        
            { #if active }
            <PillButton 
                cls={ 'bg-red' }
                on:click={ ( ) => { device.endJob( $AUTH ) } }
                img={ btn_img_stop }
                hint={ null } 
            />
            { /if }  
            <PillButton 
                cls={ socketButtonColor }
                on:click={ ( ) => { ( device.socket ? device.disconnectWS( ) : device.connectWS( $AUTH ) ) } }
                img={ btn_img_watch }
                hint={ null } 
            />

        </div> 

    </div>

                    
    <div class="flx-col">

        <BarGaugeCard bind:hdr bind:cfg bind:smp/>

        <HeaderCardMobile bind:hdr />

    </div>
    
    <div class="map-container" use:makeMap ></div>

</div>

<style>

    .container {
        border-radius: 0.5em;
        padding: 1em;
        height:100%;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }

    .title {
        justify-content: space-between;
        align-items: center;
    }
    .ser { 
        font-size: 1.2em;
        gap: 0.5em;
    }
    
    .mode { 
        color: var(--dark); 
        padding: 0 1em; 
        border-radius: 1em; 
        font-size: 1.3em; 
        font-weight: 400;
    }

    .btns {
        align-items: center;
        justify-content: flex-end;
    }

</style>