<script>

    import { createEventDispatcher } from "svelte"

    import { Sample } from '../../lib/c001v001/models'
    import { Device } from "../../lib/c001v001/device"
    import BarGaugeCard from "../../lib/c001v001/components/gauge/BarGaugeCard.svelte"
    import HeaderCard from '../../lib/c001v001/components/header/HeaderCard.svelte'
    import EventCard from "../../lib/c001v001/components/event/EventCard.svelte"
    
    import DeviceMode from "./DeviceMode.svelte"
    import DeviceConn from "./DeviceConn.svelte"
    
    export let device = new Device( )

    $: evt = device.evt  
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: active = ( hdr.hdr_job_start != 0 )

    $: highlight = ( device.highlight ? 'highlight' : '' ) 

    let dispatch = createEventDispatcher( )

</script>

<div class="flx-row container { highlight }"
    on:keydown on:click={ ( ) => { dispatch( "device-selected", device ) } } >

    <div class="flx-col stat">
        <div class="flx-row title-bar">
            <div class="flx-row ser-cont">
                <div class="flx-row fg-accent ser-lbl">Serial #</div>
                <div class="vert-line"/>
                <div class="flx-row ser">{ device.reg.des_dev_serial }</div>
            </div>  
            <DeviceMode bind:device />
        </div>

        { #if active }
        <DeviceConn bind:device />
        <BarGaugeCard bind:cfg bind:smp/> 
        { :else }
        <div class="flx-col w1440">
            <DeviceConn bind:device />
        </div>
        { /if }

    </div>

    { #if active }
    <div class="flx-row sec">
        <div class="vert-line sep"/>
        <div class="flx-col">
            <HeaderCard bind:hdr />
            <div class="flx-col w1440"><EventCard bind:evt={evt} /></div>
        </div>
    </div>
    { :else }
    <div class="flx-row sec wFull">
        <div class="vert-line sep"/>
        <div class="flx-col">
            <DeviceConn bind:device />
        </div>
    </div>
    <div class="flx-row sec w1440">
        <div class="vert-line sep"/>
        <div class="flx-col">
            <EventCard bind:evt={evt} />
        </div>
    </div>
    { /if }
    

    <div class="flx-row sec wFull">
        <div class="vert-line sep"/>
        <div class="flx-col">
            <EventCard bind:evt={evt} />
        </div>
    </div>

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
    .container:hover { background-color: var(--light_007); }
    .highlight { background-color: var(--light_007); }

    .stat {  
        padding: 0; 
        gap: 0.5em; 
    }
    .sec {
        gap: 0.5em;
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

    .wFull { display: flex; }
    .w1440 { display: none }


    /* LAP TOP */
    @media(max-width: 1440px) {
        .wFull { display: none; }
        .w1440 { display: flex; }
    }

    /* TABLET */
    @media(max-width: 1100px) {
        .container {
            flex-direction: column;
            padding: 0.5em;
        }
        .stat { padding-right: 0; }
        .wFull { display: flex; }
        .w1440 { display: none; }
        .sep { display: none; }
    }

    /* SHITE TABLET */
    /* @media(max-width: 768px) {
        .container { flex-direction: row; }
        .stat { padding-right: 0.5em; }
        .wFull { display: none; }
        .w1440 { display: flex; }
    } */

    /* MOBILE */
    @media(max-width: 450px) {
        .container { flex-direction: column; }
        .wFull { display: none; }
        .w1440 { display: flex; }
    }

</style>