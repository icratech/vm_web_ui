
<script>

    import { getContext } from 'svelte'
    
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte"
    import UserBadge from "../user/UserBadge.svelte"

    import { Event, OP_CODES } from "../../des_api"
    
    export let event = new Event( )

    $: USERS = getContext( 'users' )
    $: user = $USERS.filter( u  => { return u.id == event.evt_user_id } )[0]


    $: EVT_TYPES = getContext( 'evt_types' )
    $: evt_type = $EVT_TYPES.filter( t  => { return t.evt_typ_code == event.evt_code } )[0]
    
    let charLimit = 512
    $: message = ( 
        event.evt_msg.length > charLimit 
        ? event.evt_msg.slice( 0, charLimit ) + "..." 
        : event.evt_msg 
    )
    $: evtColorCode = 'fg-accent'
    $: bgColor = ''//'var(--light_002)'
    $: evtEmailColor = 'fg-orange'
    $: {
        if ( evt_type.evt_typ_code < OP_CODES.SYSTEM_EVENT ) {
            evtColorCode = 'fg-green_a'
            evtEmailColor = 'fg-green_a'
            // bgColor = 'var(--green_02)'
        } else if ( evt_type.evt_typ_code >= OP_CODES.SYSTEM_EVENT && evt_type.evt_typ_code < OP_CODES.OPERATOR_EVENT ) {
            evtColorCode = 'fg-red'
            evtEmailColor = 'fg-red'
            // bgColor = 'var(--red_02)'
        } else if ( evt_type.evt_typ_code == OP_CODES.OPERATOR_EVENT ) {
            evtColorCode = 'fg-accent'
            evtEmailColor = 'fg-accent'
            // bgColor = 'var(--aqua_01)'
        } else if ( evt_type.evt_typ_code == OP_CODES.REPORT_EVENT ) {
            evtColorCode = 'fg-blue'
            evtEmailColor = 'fg-blue'
            // bgColor = 'var(--blue_01)'
        }
    }

</script>

<div class="flx-col container" style="background-color: { bgColor };">
  
    <div class="flx-row title-bar">
        { #if evt_type.evt_typ_code > 999 && event.evt_title !== "" }
            <div class="flx-row title { evtColorCode }">{ event.evt_title }</div>
        { :else }
            <div class="flx-row { evtColorCode } evt-type">{ evt_type.evt_typ_name }</div>
        { /if }
        
        <DateTimeDisplay date={ event.evt_time }  cls={ evtColorCode }/>
    </div>

    <div class="flx-row msg">
        <div>{ message }</div>
    </div>
      
    { #if user }
    <div class="flx-row src">
        <UserBadge user={ user } cls={ evtEmailColor }/>
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