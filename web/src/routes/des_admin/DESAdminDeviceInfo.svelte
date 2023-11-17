<script>

    import PillButton from "../../lib/common/button/PillButton.svelte"
    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
    import DeviceMode from "../device/DeviceMode.svelte"

    
    import { DemoDevice, OP_CODES, Sample, debug, PING_LIMIT } from "../../lib/des_api"

    import btn_img_cmd from "$lib/images/btn-img-cmd.svg"
    
    export let device = new DemoDevice( )
    $: cfg = device.dev.cfg
    $: hdr = device.dev.hdr
    $: sta = device.dev.sta
    $: smp = ( device.dev.smp ? device.dev.smp : new Sample( ) )

    $: sec = 0
    const countDown = ( ) => {
        let now = Date.now()
        sec = PING_LIMIT /1000 - Math.floor( ( now - device.dev.ping.time ) / 1000 )
        if ( sec < 0 ) { sec = 0 }
        // console.log(`now: ${ now } - ${  device.dev.ping.time } = ${ now -  device.dev.ping.time } `)
    }
    setInterval(countDown, 1000)

</script>



<div class="flx-col container">

    <div class="flx-col layout">

        <div class="flx-row title-bar">   

            <div class="flx-row ser-cont">
                <div class="flx-row fg-accent ser-lbl">Serial #</div>
                <div class="vert-line"/>
                <div class="flx-row ser">{ device.dev.reg.des_dev_serial }</div>
            </div>  

            <DeviceMode bind:device={ device.dev } />
            
            <div class="flx-row btns">
                <PillButton 
                    cls={ 'bg-pink' }
                    hint={ "Jobs" } 
                />
                <PillButton 
                    cls={ 'bg-purple' }
                    hint={ "Logs" } 
                />
                <PillButton 
                    cls={ 'bg-aqua' }
                    hint={ "?" } 
                />

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
            <div class="flx-row field-name" 
                style="color:{ ( device.dev.ping.ok ? 'var(--green)' : 'var(--grey_03)' ) };"
            >{ ( device.dev.ping.ok ? 'Connected' : 'Timeout' ) }</div>
            <div class="vert-line"/>
            <div class="flx-row field-value" style="color:{ ( device.dev.ping.ok ? 'var(--light_a)' : 'var(--red)' ) };">{ sec }</div>
        </div>

        <div class="flx-row field">
            <div class="flx-row field-name">Last Ping</div>
            <div class="vert-line"/>
            <div class="flx-row"><DateTimeDisplay date={ device.dev.ping.time }/></div>
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
        padding: 0;
        padding-top: 0.5em;
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

    .field { 
        height: 2em; 
        gap: 0;         
    }

    .field-name {
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
    }

    /* .date { color: var(--orange_a); } */

    .field-value { 
        /* color: var( --orange_a); */
        align-items: center; 
    }

    .btns { 
        justify-content: flex-end; 
        align-items: center; 
        width: auto;
        gap: 1em;
    }

</style>