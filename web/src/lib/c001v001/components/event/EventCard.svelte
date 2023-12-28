
<script>

    import { getContext } from 'svelte'
    
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
    $: {
        if ( evt_type ) {

            if ( evt_type.evt_typ_code < OP_CODES.SYSTEM_EVENT ) {
                
                switch ( evt_type.evt_typ_code ) {

                    case OP_CODES.DES_REGISTERED:
                        evtColorCode = 'fg-grey_07'
                        evtEmailColor = 'fg-grey_07'
                        bgColor = 'var(--light_004)'
                        break

                    case OP_CODES.JOB_ENDED:
                    case OP_CODES.JOB_STARTED:
                        evtColorCode = 'fg-accent'
                        evtEmailColor = 'grey_07'
                        bgColor = 'var(--light_004)'               
                        break

                    case OP_CODES.JOB_OFFLINE_END:
                    case OP_CODES.JOB_OFFLINE_START:
                        evtColorCode = 'fg-grey'
                        evtEmailColor = 'fg-orange'
                        bgColor = 'var(--yellow_02)'
                        break

                    case OP_CODES.GPS_ACQ:
                        evtColorCode = 'fg-pink'
                        evtEmailColor = 'fg-pink'
                        bgColor = 'var(--light_004)'       
                        break

                }
            } else if ( evt_type.evt_typ_code >= OP_CODES.SYSTEM_EVENT && evt_type.evt_typ_code < OP_CODES.OPERATOR_EVENT ) {
                evtColorCode = 'fg-red_08'
                evtEmailColor = 'fg-red_08'
                bgColor = 'var(--red_015)'  
            } else if ( evt_type.evt_typ_code == OP_CODES.OPERATOR_EVENT ) {
                evtColorCode = 'fg-purple_07'
                evtEmailColor = 'fg-purple_07'
                bgColor = ''
            } else if ( evt_type.evt_typ_code == OP_CODES.REPORT_EVENT ) {
                evtColorCode = 'fg-blue_08'
                evtEmailColor = 'fg-blue_08'
                bgColor = ''
            }
        }
    }

</script>

<div class="flx-col container" style="background-color: { bgColor };">
  
    <div class="flx-row title-bar">
        { #if evt_type }
            { #if evt_type.evt_typ_code > 999 && evt.evt_title !== "" }
                <div class="flx-row title { evtColorCode }">{ evt.evt_title }</div>
            { :else }
                <div class="flx-row { evtColorCode } evt-type">{ evt_type.evt_typ_name }</div>
            { /if }
        { /if }
        
        <DateTimeDisplay date={ evt.evt_time }  cls={ evtColorCode }/>
    </div>

    <div class="flx-row msg">
        <div>{ message }</div>
    </div>
      
    { #if user }
    <div class="flx-row src">
        <UserBadge bind:user cls={ evtEmailColor }/>
    </div>
    { /if }


</div>

<style>
    .container {
        
        border-bottom: solid 0.05em var(--light_01);
        /* border-right: solid 0.05em var(--light_01); */
        /* border-radius: 0.5em; */
        justify-content: space-between;
        padding: 0.5em;
        /* max-height: 9em;
        min-height: 9em;
        height: 9em; */
        gap: 0;
    }
    .title-bar { 
        padding: 0 0.5em;
        padding-bottom: 0.5em;
        align-items: flex-end;
        gap: 0.5em; 
    }
    .title { 
        justify-content: flex-start;
        font-style: oblique;
    }
    .msg { 
        padding: 0.5em 1.5em;
        height: 100%; 
    }
    .src { 
        align-items: center; 
        padding:  0.5em 1.5em;
    }
</style>