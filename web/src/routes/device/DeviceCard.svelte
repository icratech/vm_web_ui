<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import { Device, AUTH, Sample } from "../../lib/des_api"
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

    $: active = ( hdr.hdr_job_start > 0 && hdr.hdr_job_end == 0 )

    
    $: socketButtonColor = ( device.socket ? 'bg-yellow' : 'bg-green' )
    $: socketButtonText = ( device.socket ? 'Disconnect' : 'Watch Job' )
    $: highlight = ( device.highlight ? 'highlight' : '' ) 

</script>

<div class="flx-row container { highlight } ">

    <div class="flx-col btns">

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

    <div class="flx-col card">

            <div class="flx-row card-title">        
                <div class="flx-row seg">
                    <h4 class="fg-accent">SN:</h4>
                    <h4>{ device.reg.des_dev_serial }</h4>
                </div>  
                <div class="flx-row seg">
                    <div class="sml">class</div>
                    <div class="fg-accent">{ device.reg.des_dev_class }</div>
                    <div class="sml">version</div>
                    <div class="fg-accent">{ device.reg.des_dev_version }</div>
                </div>

            </div>
            
            <BarGaugeCard bind:smp bind:cfg/>
            
    </div>
    <div class="flx-col card">
        <HeaderCard bind:header={hdr} />
    </div>
    <!-- <ConfigCard bind:config /> -->
    
    <EventCard bind:event={evt} title="Last event" />

</div>

<style>
    
    .container {
        justify-content: space-between;
        border-radius: 0.5em;
        padding: 0 1.5em;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
    .highlight {
        background-color: var(--light_009);
    }
    .btns {
        width: 2.5em;
        gap:2em;
        padding: 1em 0;
    }
    .seg {
        width: auto;
        justify-content: flex-end;
        gap: 1em;
    }

</style>