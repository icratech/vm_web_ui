
<script>

    import { getContext } from 'svelte'
    
    import { RGBA, BASE } from "../../../common/colors"
    import DateTimeDisplay from '../../../common/date_time/DateTimeDisplay.svelte'
    import UserBadge from "../../../des/components/UserBadge.svelte"

    import { Event, OP_CODES } from '../../models'

    export let evt = new Event( )

    $: USERS = getContext( 'users' )
    $: user = $USERS.filter( u  => { return u.id == evt.evt_user_id } )[0]


    $: EVT_TYPES = getContext( 'evt_types' )
    $: evt_type = $EVT_TYPES.filter( t  => { return t.evt_typ_code == evt.evt_code } )[0]
    
    let charLimit = 512
    $: message = ( 
        evt.evt_msg.length > charLimit 
        ? evt.evt_msg.slice( 0, charLimit ) + "..." 
        : evt.evt_msg 
    )
    $: evtColorCode = 'fg-accent'
    $: bgColor = ''//'var(--light_002)'
    $: evtEmailColor = 'fg-orange'
    $: colorCode = BASE.LIGHT
    $: lineColor = RGBA( colorCode, 0.3 )
    $: borderColor = RGBA( colorCode, 0.25 )
    $: {
        if ( evt_type ) {

            if ( evt_type.evt_typ_code < OP_CODES.SYSTEM_EVENT ) {
                
                switch ( evt_type.evt_typ_code ) {

                    case OP_CODES.DES_REGISTERED:
                        colorCode = BASE.GREY
                        evtColorCode = 'fg-grey_07'
                        evtEmailColor = 'fg-grey_07'
                        bgColor = 'var(--light_004)'
                        break

                    case OP_CODES.JOB_END_REQ:
                    case OP_CODES.JOB_START_REQ:
                        colorCode = BASE.YELLOW
                        evtColorCode = 'fg-grey_07'
                        evtEmailColor = 'fg-yellow'
                        bgColor = 'var(--yellow_02)'
                        break

                    case OP_CODES.JOB_ENDED:
                    case OP_CODES.JOB_STARTED:
                        colorCode = BASE.AQUA
                        evtColorCode = 'fg-accent'
                        evtEmailColor = 'fg-accent'
                        bgColor = 'var(--light_004)'               
                        break

                    case OP_CODES.JOB_OFFLINE_END:
                    case OP_CODES.JOB_OFFLINE_START:
                        colorCode = BASE.ORANGE
                        evtColorCode = 'fg-grey'
                        evtEmailColor = 'fg-orange'
                        bgColor = 'var(--yellow_02)'
                        break

                    case OP_CODES.GPS_ACQ:
                        colorCode = BASE.PINK
                        evtColorCode = 'fg-pink'
                        evtEmailColor = 'fg-pink'
                        bgColor = 'var(--light_004)'       
                        break

                }
            } else if ( evt_type.evt_typ_code >= OP_CODES.SYSTEM_EVENT && evt_type.evt_typ_code < OP_CODES.OPERATOR_EVENT ) {
                colorCode = BASE.RED
                evtColorCode = 'fg-red_08'
                evtEmailColor = 'fg-red_08'
                bgColor = 'var(--red_015)'  
            } else if ( evt_type.evt_typ_code == OP_CODES.OPERATOR_EVENT ) {
                colorCode = BASE.PURPLE
                evtColorCode = 'fg-purple_08'
                evtEmailColor = 'fg-purple_08'
                bgColor = ''
            } else if ( evt_type.evt_typ_code == OP_CODES.REPORT_EVENT ) {
                colorCode = BASE.BLUE
                evtColorCode = 'fg-blue_08'
                evtEmailColor = 'fg-blue_08'
                bgColor = ''
            }
        }
    }

</script>

<!-- background-color: { bgColor }; -->
<div class="flx-col container" style=" border-right: solid 0.05em { borderColor };">
  
    <div class="flx-row title-bar" style="border-bottom: solid 0.05em { lineColor };">
        { #if evt_type }
            { #if evt_type.evt_typ_code > 999 }
                <div class="flx-row title { evtColorCode }">{ evt.evt_title }</div>
            { :else }
                <div class="flx-row { evtColorCode } evt-type">{ evt_type.evt_typ_name }</div>
            { /if }
        { /if }
        
        <DateTimeDisplay date={ evt.evt_time }  cls={ evtColorCode }/>
    </div>

    <div class="flx-row msg">
        <div class="msg-txt">{ message }</div>
    </div>
      
    { #if user }
    <div class="flx-row src">
        <UserBadge bind:user cls={ evtEmailColor }/>
    </div>
    { /if }


</div>

<style>
    .container {
        justify-content: space-between;
        padding: 0.5em;
        gap: 0;
    }
    .title-bar { 
        padding: 0 0.5em;
        padding-bottom: 0.25em;
        margin-bottom: 0.5em;
        align-items: flex-end;
        gap: 0.5em; 
    }
    .title { 
        justify-content: flex-start;
        font-style: oblique;
    }
    .msg { 
        padding: 0 1.5em;
        height: 100%; 
    }
    .msg-txt { 
        color: var(--grey_08);
    }
    .src { 
        align-items: center; 
        padding:  0;
    }
</style>