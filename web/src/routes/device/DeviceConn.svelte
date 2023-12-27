<script>

    import { getContext } from "svelte"

    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"

    import { OP_CODES } from "../../lib/c001v001/models"
	import { Device, PING_LIMIT, DES_PING_LIMIT } from "../../lib/c001v001/device"

    export let device = new Device( )

    $: EVT_TYPES = getContext( 'evt_types' )
    $: evt_type = $EVT_TYPES.filter( t  => { return t.evt_typ_code == device.sta.sta_logging } )[0]
   
    $: evtColorCode = 'fg-accent'
    $: {
        if ( evt_type ) {
            switch ( evt_type.evt_typ_code )
            {
                case OP_CODES.DES_REG_REQ:
                case OP_CODES.JOB_START_REQ:
                case OP_CODES.JOB_END_REQ:
                    evtColorCode = 'fg-purple'
                    break

                case OP_CODES.JOB_STARTED: 
                    evtColorCode = 'fg-green_08'
                    break

                case OP_CODES.DES_REGISTERED:
                case OP_CODES.JOB_ENDED:
                    evtColorCode = 'fg-grey_05'
                    break

                case OP_CODES.JOB_OFFLINE_START: 
                case OP_CODES.JOB_OFFLINE_END:
                    evtColorCode = 'fg-yellow'
                    break
                    
                case OP_CODES.GPS_ACQ:
                    evtColorCode = 'fg-pink'
                    break
            }
        }
    }

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
        <div class="flx-row field-name">State</div>
        <div class="vert-line"/>
        <div class="flx-row field-text-l { evtColorCode }">{ ( evt_type ? evt_type.evt_typ_name : 'UNKNOWN EVT CODE' )  }</div>
        <div class="flx-row  field-value timeout-value">( { device.sta.sta_logging } )</div>
        <div class="flx-row field-text-r"><DateTimeDisplay date={ device.sta.sta_time }/></div>
    </div>

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
        <div class="flx-row field-name">Pings</div>
        <div class="vert-line"/>
        
        <div class="flx-row fw">
            <div class="flx-row fw-sub-l">
                <div class="flx-row field-sub">Device</div> 
                <div class="flx-row field-value timeout-value" style="color:{ ( device.ping.ok ? 'var(--green_a)' : 'var(--red)' ) };">
                    { dev_ping_sec }
                </div>
            </div>

            <div class="flx-row fw-sub-r">
                <div class="flx-row field-sub">Server</div>
                <div class="flx-row field-value timeout-value" style="color:{ ( device.des_ping.ok ? 'var(--aqua_a)' : 'var(--red)' ) };">
                    { des_ping_sec }
                </div>
            </div>

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
        color: var( --grey_07);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
    }

    .field-sub {
        color: var( --grey_07);
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
        /* color: var( --orange_a); */
        justify-content: flex-start;
        align-items: center; 
        max-width: 3.75em;
        min-width: 3.75em;
    }

    .field-text-l { 
        justify-content: flex-start;
        align-items: center; 
    }

    .field-text-r { 
        justify-content: flex-end;
        align-items: center; 
    }

</style>