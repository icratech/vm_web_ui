<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import { AUTH, COLORS, Device, Sample } from "../../lib/des_api"
    import { RGBA, BASE } from "../../lib/common/colors"
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import HeaderCard from '../../lib/components/header/HeaderCard.svelte'
    import EventCard from "../../lib/components/event/EventCard.svelte"
    import btn_img_gauge from "$lib/images/btn-img-gauge.svg"
    import btn_img_watch from "$lib/images/btn-img-view.svg"

    import { goto } from '$app/navigation'

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

    <div class="flx-col btns">

        <PillButton 
            on:click={ ( ) => { goto( `device/${device.reg.des_dev_serial }` ) } }
            cls={ 'bg-accent' }
            img={ btn_img_gauge }
            hint={ 'Device Controls' } 
        />
         
        { #if active }       
            <PillButton 
                cls={ socketButtonColor }
                on:click={ ( ) => { ( device.socket ? device.disconnectWS( ) : device.connectWS( $AUTH ) ) } }
                img={ btn_img_watch }
                hint={ socketButtonText } 
            />
        { /if }

    </div>

    <div class="flx-col gauge">

            <div class="flx-row card-title title">     

                <h4 class="mode" style="background-color: { color_code };">{ lbl }</h4>
    
                <div class="flx-row seg sn">
                    <h4 class="fg-accent">SN:</h4>
                    <h4>{ device.reg.des_dev_serial }</h4>
                </div>  

            </div>

            { #if active }
                <BarGaugeCard bind:hdr bind:cfg bind:smp/>     
            { /if }

    </div>

    { #if active }
        <HeaderCard bind:hdr />
        <EventCard bind:event={evt} title="Last event" />
    { /if }

</div>

<style>
    
    .container {
        justify-content: space-between;
        border-radius: 0.5em;
        padding: 1em;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
    .highlight {
        background-color: var(--light_009);
    }
    .btns {
        width: 2.25em;
        gap:1em;
        padding: 0;
    }
    
    .gauge {
        gap: 1em;
    }

    .title { justify-content: flex-start;  }

    .mode { 
        color: var(--dark); 
        padding: 0 1em; 
        border-radius: 1em; 
        font-size: 1.3em; 
        font-weight: 400;
    }

    .seg {
        width: auto;
        /* justify-content: flex-end; */
        gap: 1em;
    }

    .evt {
        height: 100%;
    }
</style>