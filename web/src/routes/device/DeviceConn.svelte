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
            

            if ( evt_type.evt_typ_code < OP_CODES.SYSTEM_EVENT ) {
                switch ( evt_type.evt_typ_code ) {

                    case OP_CODES.DES_REGISTERED:
                        evtColorCode = 'fg-grey_07'
                        break

                    case OP_CODES.JOB_ENDED:
                    case OP_CODES.JOB_STARTED: 
                        evtColorCode = 'fg-accent'

                    case OP_CODES.JOB_OFFLINE_END:
                    case OP_CODES.JOB_OFFLINE_START: 
                        evtColorCode = 'fg-grey'
                        break
        
                    case OP_CODES.GPS_ACQ:
                        evtColorCode = 'fg-pink'
                        break

                    case OP_CODES.DES_REG_REQ:
                    case OP_CODES.JOB_START_REQ:
                    case OP_CODES.JOB_END_REQ:
                        evtColorCode = 'fg-purple'
                        break
                }

            } else if ( evt_type.evt_typ_code >= OP_CODES.SYSTEM_EVENT && evt_type.evt_typ_code < OP_CODES.OPERATOR_EVENT ) {
                evtColorCode = 'fg-red_08'

            } else if ( evt_type.evt_typ_code == OP_CODES.OPERATOR_EVENT ) {
                evtColorCode = 'fg-purple_07'

            } else if ( evt_type.evt_typ_code == OP_CODES.REPORT_EVENT ) {
                evtColorCode = 'fg-blue_08'

            }

        }
    }

    $: des_ping_sec = 0
    $: dev_ping_sec = 0
    const countDown = ( ) => {

        let now = Date.now()

        dev_ping_sec = PING_LIMIT /1000 - Math.floor( ( now - device.ping.time ) / 1000 )

        if ( dev_ping_sec < 0 ) { 
            dev_ping_sec = 0 
            device.ping.ok = false

        } else {
            device.ping.ok = true
        }
        
        des_ping_sec = DES_PING_LIMIT /1000 - Math.floor( ( now - device.des_ping.time ) / 1000 )

        if ( des_ping_sec < 0 ) { des_ping_sec = 0  }
    }
    setInterval(countDown, 1000)


</script>


<div class="flx-col container">

    <div class="flx-row field">
        <div class="flx-row field-name">State</div>
        <div class="vert-line"/>
        <div class="flx-row field-val-row">
            <div class="flx-row field-text-l { evtColorCode }">{ ( evt_type ? evt_type.evt_typ_name : 'UNKNOWN EVT CODE' )  }</div>
            <!-- <div class="flx-row  field-value timeout-value">( { device.sta.sta_logging } )</div> -->
            <div class="flx-row field-text-r"><DateTimeDisplay date={ device.sta.sta_time }/></div>
        </div>
    </div>

    <div class="flx-row field">
        <div class="flx-row field-name">Pings</div>
        <div class="vert-line"/>
        
        <div class="flx-row fw">

            <div class="flx-row fw-sub-l">
                <div class="flx-row field-sub">Device</div> 
                <div class="flx-row field-value-l timeout-value" style="color:{ ( device.ping.ok ? 'var(--green_a)' : 'var(--red)' ) };">
                    { dev_ping_sec }
                </div>
            </div>

            <div class="flx-row fw-sub-r">
                <div class="flx-row field-sub">Server</div>
                <div class="flx-row field-value-r timeout-value" style="color:{ ( device.des_ping.ok ? 'var(--aqua_a)' : 'var(--red)' ) };">
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

    .field-val-row {
        justify-content: flex-start;
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
        justify-content: flex-end;
        gap: 0.75em;
    }
    /* .date { color: var(--orange_a); } */

    .field-value-l { 
        /* color: var( --orange_a); */
        justify-content: flex-start;
        align-items: center; 
        width: auto;
    }
    .field-value-r { 
        /* color: var( --orange_a); */
        justify-content: flex-end;
        align-items: center; 
        width: auto;
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