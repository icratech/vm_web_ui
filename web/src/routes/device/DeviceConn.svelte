<script>

    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
	import { Device, PING_LIMIT, DES_PING_LIMIT } from "../../lib/des_api";

    export let device = new Device( )
    $: des_ping_sec = 0
    $: dev_ping_sec = 0
    $: sec = 0
    const countDown = ( ) => {
        let now = Date.now()
        sec = PING_LIMIT /1000 - Math.floor( ( now - device.ping.time ) / 1000 )
        if ( sec < 0 ) { sec = 0 }
        // console.log(`now: ${ now } - ${  device.ping.time } = ${ now -  device.ping.time } `)
        dev_ping_sec = PING_LIMIT /1000 - Math.floor( ( now - device.ping.time ) / 1000 )
        if ( dev_ping_sec < 0 ) { 
            dev_ping_sec = 0 
            device.ping.ok = false
        } else {
            device.ping.ok = true
        }
        // console.log(`now: ${ now } - ${  device.dev.ping.time } = ${ now -  device.dev.ping.time } `)
        
        des_ping_sec = DES_PING_LIMIT /1000 - Math.floor( ( now - device.des_ping.time ) / 1000 )
        if ( des_ping_sec < 0 ) { des_ping_sec = 0  }
    }
    setInterval(countDown, 1000)

</script>


<div class="flx-col container">
        
    <div class="flx-row field">
        <div class="flx-row field-name">Firmware</div>
        <div class="vert-line"/>

        <div class="flx-row fw">
            <div class="flx-row fw-sub-l">
                <div class="flx-row field-sub">Logger</div>
                <div class="flx-row field-value">{ device.sta.sta_log_fw }</div>
            </div>

            <div class="flx-row fw-sub-r">
                <div class="flx-row field-sub">Modem</div>
                <div class="flx-row field-value">{ device.sta.sta_mod_fw }</div>
            </div>
        </div>

    </div>

    <div class="flx-row field">
        <div class="flx-row field-name">Device Conn</div>
        <div class="vert-line"/>
        <div class="flx-row"><DateTimeDisplay date={ device.ping.time }/></div>
        
        <div class="flx-row field-name" style="color:{ ( device.ping.ok ? 'var(--green)' : 'var(--grey_03)' ) };" >
            { ( device.ping.ok ? 'Connected' : 'Timeout' ) }
            <div class="flx-row field-value timeout-value" style="color:{ ( device.ping.ok ? 'var(--light_a)' : 'var(--red)' ) };">
                { dev_ping_sec }</div>
        </div>
    </div>

    <div class="flx-row field">
        <div class="flx-row field-name">DES Conn</div>
        <div class="vert-line"/>
        <div class="flx-row"><DateTimeDisplay date={ device.des_ping.time }/></div>
        
        <div class="flx-row field-name" style="color:{ ( device.des_ping.ok ? 'var(--accent_aa)' : 'var(--grey_03)' ) };" >
            { ( device.des_ping.ok ? 'Connected' : 'Timeout' ) }
            <div class="flx-row field-value timeout-value" style="color:{ ( device.des_ping.ok ? 'var(--light_a)' : 'var(--red)' ) };">
                { des_ping_sec }</div>
        </div>
    </div>

</div>

<style>
    

    .container {
        gap: 0;
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
        font-size: 0.9em;
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6.75em;
        min-width: 6.75em;
    }

    .field-sub {
        justify-content: flex-end;
        align-items: center;
        max-width: 3.75em;
        min-width: 3.75em;
        padding: 0 0.5em;
    }
    
    .fw {
        justify-content: flex-start;
        padding-right: 0.8em;
    }
    .fw-sub-l {
        justify-content: flex-start;
        gap: 0.75em;
    }
    .fw-sub-r {
        justify-content: flex-start;
        gap: 0.75em;
    }
    /* .date { color: var(--orange_a); } */

    .field-value { 
        color: var( --orange_a);
        justify-content: flex-start;
        align-items: center; 
        max-width: 3.75em;
        min-width: 3.75em;
    }


</style>