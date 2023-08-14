<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import { Device, AUTH, Sample } from "../../lib/des_api"
    import BarGaugeCard from "../../lib/components/gauge/BarGaugeCard.svelte"
    import EventCard from "../../lib/components/event/EventCard.svelte"
    import ConfigCard from "../../lib/components/config/ConfigCard.svelte"

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    export let dev = new Device( )
    $: device = dev
    $: event = device.job.events[0]  
    $: config = device.job.configs[0]
    $: active = ( config.cfg_job_end == 0 )
    $: socketButtonColor = ( device.socket ? 'bg-pink' : 'bg-green' )
    $: smp = ( device.job.samples ? device.job.samples[device.job.samples.length - 1] : new Sample( ) )
    // $: { console.log( `smp: ${ JSON.stringify( smp, null, 4 ) }` ) }

</script>

<div class="flx-row container">

    <div class="flx-col btns">

        <PillButton 
            on:click={ ( ) => { dispatch( 'go' ) } }
            cls={ 'bg-purple_a' }
        >PAGE</PillButton>

        { #if active }
        <!-- <PillButton 
            cls={ sseButtonColor }
            on:click={ ( ) => { ( device.sse ? device.disconnectSSE( ) : device.connectSSE( ) ) } }
        /> -->
        <PillButton 
            cls={ socketButtonColor }
            on:click={ ( ) => {  ( device.socket ? device.disconnectWS( ) : device.connectWS( $AUTH ) ) } }
        />
        { /if }

    </div>

    <div class="flx-col card">

            <div class="flx-row card-title">        
                <div class="flx-row seg">
                    <h4 class="g">SN:</h4>
                    <h4>{ device.reg.des_dev_serial }</h4>
                </div>  
                <div class="flx-row seg">
                    <div class="sml">class</div>
                    <div class="g">{ device.reg.des_dev_class }</div>
                    <div class="sml">version</div>
                    <div class="g">{ device.reg.des_dev_version }</div>
                </div>

            </div>
            
            <!-- <BarGaugeCard bind:smp={ device.sample }/> -->
            <BarGaugeCard bind:smp={ smp }/>
            
    </div>

    <ConfigCard bind:config={config} />
    
    <EventCard bind:event={event} title="Last event" />

</div>

<style>
    
    .container{
        justify-content: space-between;
        background-color: var(--light_aa);
        border-radius: 0.5em;
        /* border-top-left-radius: 2em;
        border-bottom-left-radius: 2em; */
        padding: 0 1em;
        gap: 1em;
        border-top: solid 0.05em var(--grey_aa);
        border-right: solid 0.05em var(--grey_aa);
    }
    .btns {
        width: 2.5em;
        gap:2em;
        padding: 2em 1em;
    }
    .seg {
        width: auto;
        justify-content: flex-end;
        gap: 1em;
    }
    .g { color: var(--green_a); }

</style>