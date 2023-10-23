<script>

    import { goto } from '$app/navigation'
    
    import DeviceMode from "./DeviceMode.svelte"
    import PillButton from "$lib/common/button/PillButton.svelte"
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import HeaderCard from '../../lib/components/header/HeaderCard.svelte'
    import EventCard from "../../lib/components/event/EventCard.svelte"
    
    import btn_img_gauge from "$lib/images/btn-img-gauge.svg"
    import btn_img_watch from "$lib/images/btn-img-view.svg"
    
    import { AUTH, Device, Sample } from "../../lib/des_api"
    
    export let device = new Device( )

    $: evt = device.evt  
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: active = ( hdr.hdr_job_start != 0 )

    $: socketButtonColor = ( device.socket ? 'bg-orange' : 'bg-accent' )
    $: socketButtonText = ( device.socket ? 'Disconnect' : 'Watch Job' )
    $: highlight = ( device.highlight ? 'highlight' : '' ) 

</script>

<div class="flx-row container { highlight } ">


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
    
        </div>

        { #if active }
            <BarGaugeCard bind:cfg bind:smp/>     
        { /if }

    </div>

    { #if active }

        <div class="flx-row hdr">
            <div class="vert-line sep"/>
            <HeaderCard bind:hdr />
            
        </div>
        
        <div class="flx-row evt">
            <div class="vert-line sep"/>
            <EventCard bind:event={evt} />
        </div>

    { :else }
        <div class="off"></div>    
        <div class="evt off"></div>   
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

    .layout {  
        padding: 0; 
        padding-right: 0.5em;
        gap: 0; 
    }
    .title-bar {
        justify-content: space-between;
        align-items: center;
        padding: 0.5em 0;
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

    .off { width: 100%; }

    /* LAP TOP */
    @media(max-width: 1440px) {
        .evt { display: none; }
        /* .off { width: 50%; } */
    }

    /* TABLET */
    @media(max-width: 1024px) {
        .container {
            flex-direction: column;
            padding: 0.5em;
            gap: 0.5em;
        }
        .layout { 
            padding-top: 0; 
            padding-right: 0; 
            width: 100%;
        }
        .sep { display: none; }
        .off { display: none; }
    }

    /* MOBILE */
    @media(max-width: 425px) {
    }

</style>