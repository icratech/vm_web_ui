<script>

    import { goto } from '$app/navigation'
    
    import PillButton from "$lib/common/button/PillButton.svelte"
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import HeaderCard from '../../lib/components/header/HeaderCard.svelte'
    import EventCard from "../../lib/components/event/EventCard.svelte"
    
    import btn_img_gauge from "$lib/images/btn-img-gauge.svg"
    import btn_img_watch from "$lib/images/btn-img-view.svg"
    
    import { AUTH, COLORS, Device, Sample } from "../../lib/des_api"
    import { RGBA, BASE } from "../../lib/common/colors"
    
    export let device = new Device( )

    $: evt = device.evt  
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: active = ( hdr.hdr_job_start != 0 )

    $: socketButtonColor = ( device.socket ? 'bg-orange' : 'bg-accent' )
    $: socketButtonText = ( device.socket ? 'Disconnect' : 'Watch Job' )
    $: highlight = ( device.highlight ? 'highlight' : '' ) 


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


</script>

<div class="flx-row container { highlight } ">


    <div class="flx-col gauge">

        <div class="flx-row card-title title">

            <div class="flx-row btns">
    
                <PillButton 
                    on:click={ ( ) => { goto( `device/${device.reg.des_dev_serial }` ) } }
                    cls={ 'bg-accent' }
                    img={ btn_img_gauge }
                    hint={ 'Device Controls' } 
                />
                 
                <PillButton 
                    cls={ socketButtonColor }
                    on:click={ ( ) => { ( device.socket ? device.disconnectWS( ) : device.connectWS( $AUTH ) ) } }
                    img={ btn_img_watch }
                    hint={ socketButtonText } 
                />
        
            </div>
    
            <h4 class="mode" style="background-color: { color_code };">{ lbl }</h4>
        
            <div class="flx-row ser">
                <h4 class="fg-accent">SN:</h4>
                <h4>{ device.reg.des_dev_serial }</h4>
            </div>  
    
        </div>
            { #if active }
                <BarGaugeCard bind:hdr bind:cfg bind:smp/>     
            { /if }

    </div>

    { #if active }
        <!-- <div class="vert-line"/> -->
        <HeaderCard bind:hdr />

        <!-- <div class="vert-line"/> -->
        <div class="evt">
            <EventCard bind:event={evt} title="Last event" />
        </div>
    { /if }

</div>

<style>
    
    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        justify-content: space-between;
        border-radius: 0.5em;
        padding: 1em;
    }
    .highlight { background-color: var(--light_009); }
    .title { padding-left: 0; align-items: center;  }
    .btns { width: auto; gap:1em; }
    .mode { 
        color: var(--dark); 
        padding: 0 1em; 
        border-radius: 1em; 
        font-size: 1.3em; 
        font-weight: 400;
    }
    .ser { gap: 1em; }

    /* LAP TOP */
    @media(max-width: 1440px) {
        .evt { display: none; }
    }

    /* TABLET */
    @media(max-width: 1024px) {
        .container {
            flex-direction: column;
            padding: 0.5em;
            gap: 0.5em;
        }
    }

    /* MOBILE */
    @media(max-width: 425px) {

    }

</style>