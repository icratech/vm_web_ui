<script>
    
    import { createEventDispatcher } from "svelte"

    import { debugging } from '../../lib/des/app'
    import { debug } from '../../lib/des/utils'

    import { Sample, OP_CODES } from '../../lib/c001v001/models'
    import { Device } from '../../lib/c001v001/device'

    import { DemoDevice } from "../../lib/des_api"

    import PillButton from "../../lib/common/button/PillButton.svelte"
    import DeviceMode from "../device/DeviceMode.svelte"
    import DeviceConn from "../device/DeviceConn.svelte"

    import btn_img_cmd from "$lib/images/btn-img-cmd-yellow.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-aqua.svg"
    import btn_img_reset from "$lib/images/btn-img-reset-grey.svg"
    import btn_img_start from "$lib/images/btn-img-start-green.svg"
    import btn_img_stop from "$lib/images/btn-img-stop-red.svg"
    
    export let device = new Device( )
    $: cfg = device.cfg
    $: hdr = device.hdr
    $: sta = device.sta
    $: smp = ( device.smp ? device.smp : new Sample( ) )

    $: DESDevConnColor = 'bg-accent'
    $: DESDevConnHint = 'DES Client OK'
    $: DESDevConnImage = btn_img_confirm 
    const DESDevConnFucn = ( ) => { 
            device.des_ping.time = 0
            device.des_ping.ok = false
            device.refreshDESClient( )
        }
    $: {
        if ( !device.des_ping.ok ) { 
            DESDevConnColor = 'bg-yellow' 
            DESDevConnHint = 'DES Connecting...'
            DESDevConnImage = btn_img_cmd
        } else if ( !device.ping.ok ) { 
            DESDevConnColor = 'bg-grey' 
            DESDevConnHint = 'Reset DES Client'
            DESDevConnImage = btn_img_reset
        } else { 
            DESDevConnColor = 'bg-accent' 
            DESDevConnHint = 'DES Client OK'
            DESDevConnImage = btn_img_confirm
        }
    }

    $: highlight = ( device.highlight ? 'highlight' : '' ) 
    let dispatch = createEventDispatcher( )

</script>



<div class="flx-col container { highlight }"
    on:keydown on:click={ ( ) => { dispatch( "device-selected", device ) } } 
>

    <div class="flx-col layout">

        <div class="flx-row title-bar">   

            <div class="flx-row ser-cont">
                <div class="flx-row fg-accent ser-lbl">Serial #</div>
                <div class="vert-line"/>
                <div class="flx-row ser">{ device.reg.des_dev_serial }</div>
            </div>

            <DeviceMode bind:device={ device } />

            <div class="flx-row btns">

                <PillButton 
                    on:click={ DESDevConnFucn }
                    img={ DESDevConnImage }
                    hint={ DESDevConnHint } 
                />

                { #if debugging }
                <PillButton 
                    on:click={ device.startJob }
                    img={ btn_img_start }
                    hint={ "Start Job" } 
                />
                <PillButton 
                    on:click={ device.endJob }
                    img={ btn_img_stop }
                    hint={ "End Job" } 
                />
                { /if }

            </div>   

        </div>

    </div>

    <DeviceConn bind:device={ device } />

</div>

<style>
    
    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        /* height:100%; */
        padding: 1em;
        gap: 0.5em;
    }
    .layout {  
        padding: 0; 
        padding-right: 0.5em;
        gap: 0.5em; 
    }
    .title-bar {
        justify-content: space-between;
        align-items: center;
        /* padding-bottom: 0.5em; */
    }
    
    .ser-cont { 
        justify-content: flex-start;
        width: 15em; 
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
        gap: 1em;
    }

</style>