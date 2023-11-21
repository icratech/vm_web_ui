<script>

    import PillButton from "../../lib/common/button/PillButton.svelte"
    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
    import DeviceMode from "../device/DeviceMode.svelte"

    
    import { DemoDevice, OP_CODES, Sample, debug, PING_LIMIT, DES_PING_LIMIT } from "../../lib/des_api"

    import btn_img_cmd from "$lib/images/btn-img-cmd.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm.svg"
    import btn_img_reset from "$lib/images/btn-img-reset.svg"
    
    export let device = new DemoDevice( )
    $: cfg = device.dev.cfg
    $: hdr = device.dev.hdr
    $: sta = device.dev.sta
    $: smp = ( device.dev.smp ? device.dev.smp : new Sample( ) )

    $: des_ping_sec = 0
    
    $: dev_ping_sec = 0
    const countDown = ( ) => {
        let now = Date.now()
        dev_ping_sec = PING_LIMIT /1000 - Math.floor( ( now - device.dev.ping.time ) / 1000 )
        if ( dev_ping_sec < 0 ) { 
            dev_ping_sec = 0 
            device.dev.ping.ok = false
        } else {
            device.dev.ping.ok = true
        }
        // console.log(`now: ${ now } - ${  device.dev.ping.time } = ${ now -  device.dev.ping.time } `)
        
        des_ping_sec = DES_PING_LIMIT /1000 - Math.floor( ( now - device.dev.des_ping.time ) / 1000 )
        if ( des_ping_sec < 0 ) { des_ping_sec = 0  }
    }
    setInterval(countDown, 1000)


    $: DESDevConnColor = 'bg-accent'
    $: DESDevConnHint = 'DES Client OK'
    $: DESDevConnImage = btn_img_confirm 
    $: DESDevConnFucn = ( ) => { }
    $: {
        if ( !device.dev.des_ping.ok ) { 
            DESDevConnColor = 'bg-yellow' 
            DESDevConnHint = 'DES Connecting...'
            DESDevConnImage = btn_img_cmd
            DESDevConnFucn = ( ) => { }
        } else if ( !device.dev.ping.ok ) { 
            DESDevConnColor = 'bg-grey' 
            DESDevConnHint = 'Reset DES Client'
            DESDevConnImage = btn_img_reset
            DESDevConnFucn = ( ) => { 
                device.dev.des_ping.time = 0
                device.dev.des_ping.ok = false
                device.dev.connectDESClient
            }
        } else { 
            DESDevConnColor = 'bg-accent' 
            DESDevConnHint = 'DES Client OK'
            DESDevConnImage = btn_img_confirm
            DESDevConnFucn = ( ) => { }
        }
    }

</script>



<div class="flx-col container">

    <div class="flx-col layout">

        <div class="flx-row title-bar">   

            
            <div class="flx-row btns">

                <PillButton 
                    on:click={ DESDevConnFucn }
                    cls={ DESDevConnColor }
                    img={ DESDevConnImage }
                    hint={ DESDevConnHint } 
                />

                <PillButton 
                    cls={ 'bg-accent' }
                    hint={ "Jobs" } 
                />

                <PillButton 
                    cls={ 'bg-accent' }
                    hint={ "Logs" } 
                />

                <DeviceMode bind:device={ device.dev } />

            </div> 

            <div class="flx-row ser-cont">
                <div class="flx-row fg-accent ser-lbl">Serial #</div>
                <div class="vert-line"/>
                <div class="flx-row ser">{ device.dev.reg.des_dev_serial }</div>
            </div>  

        </div>

    </div>

    <div class="flx-col" style="gap: 0;">
        
        <div class="flx-row field">
            <div class="flx-row field-name">Modem FW</div>
            <div class="vert-line"/>
            <div class="flx-row field-value">{ device.dev.sta.sta_mod_fw }</div>
        </div>

        <div class="flx-row field">
            <div class="flx-row field-name">Logger FW</div>
            <div class="vert-line"/>
            <div class="flx-row field-value">{ device.dev.sta.sta_log_fw }</div>
        </div>

        <div class="flx-row field">
            <div class="flx-row field-name">Device Ping</div>
            <div class="vert-line"/>
            <div class="flx-row"><DateTimeDisplay date={ device.dev.ping.time }/></div>
            
            <div class="flx-row field-name" style="color:{ ( device.dev.ping.ok ? 'var(--green)' : 'var(--grey_03)' ) };" >
                { ( device.dev.ping.ok ? 'Connected' : 'Timeout' ) }
                <div class="flx-row field-value timeout-value" style="color:{ ( device.dev.ping.ok ? 'var(--light_a)' : 'var(--red)' ) };">
                    { dev_ping_sec }</div>
            </div>
        </div>

        <div class="flx-row field">
            <div class="flx-row field-name">DES Ping</div>
            <div class="vert-line"/>
            <div class="flx-row"><DateTimeDisplay date={ device.dev.des_ping.time }/></div>
            
            <div class="flx-row field-name" style="color:{ ( device.dev.des_ping.ok ? 'var(--accent_aa)' : 'var(--grey_03)' ) };" >
                { ( device.dev.des_ping.ok ? 'Connected' : 'Timeout' ) }
                <div class="flx-row field-value timeout-value" style="color:{ ( device.dev.des_ping.ok ? 'var(--light_a)' : 'var(--red)' ) };">
                    { des_ping_sec }</div>
            </div>
        </div>

    </div>



</div>

<style>
    
    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        height:100%;
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
        padding-bottom: 0.5em;
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
        justify-content: flex-start; 
        gap: 1em;
    }

    .field { 
        height: 2em; 
        gap: 0;         
    }
    .timeout-value {
        min-width: 2em; 
        max-width: 2em;
    }

    .field-name {
        color: var( --grey_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
    }

    /* .date { color: var(--orange_a); } */

    .field-value { 
        color: var( --orange_a);
        align-items: center; 
    }

</style>