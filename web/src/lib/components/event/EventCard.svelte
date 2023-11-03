
<script>

    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte"
    import UserBadge from "../user/UserBadge.svelte"

    import { Event } from "../../des_api"
    
    export let event = new Event( )
    let charLimit = 230
    $: message = ( 
        event.evt_msg.length > charLimit 
        ? event.evt_msg.slice( 0, charLimit ) + "..." 
        : event.evt_msg 
    )
    $: evt_type = (JSON.parse( sessionStorage.event_types )).filter( t => t.evt_typ_code == event.evt_code )[0]
    $: evtColorCode = 'fg-accent'
    $: {
        if ( evt_type.evt_typ_code < 999 ) {
            evtColorCode = 'fg-orange'
        } else if ( evt_type.evt_typ_code > 999 && evt_type.evt_typ_code < 2000 ) {
            evtColorCode = 'fg-red'
        } else {
            evtColorCode = 'fg-accent'
        }
    }

</script>

<div class="flx-col container">
  
    <div class="flx-col title-bar">
        <div class={ evtColorCode }>{ evt_type.evt_typ_name }</div>
        { #if  event.evt_title !== "" }
            <div class="flx-row title">{ event.evt_title }</div>
        { /if }
    </div>

    <div class="flx-row msg">
        <div class="sml">{ message }</div>
    </div>
        
    <div class="flx-row src">
        <DateTimeDisplay date={ event.evt_time } />
        <UserBadge uid={ event.evt_user_id } />
    </div>


</div>

<style>
    .container {
        justify-content: space-between;
        padding: 0;
        height: 100%;
        gap: 0;
    }
    .title-bar { gap: 0.5em; }
    .title { 
        padding-bottom: 0.5em;
        justify-content: center;
        font-style: oblique;
        padding-left: 1em;
    }
    .msg { 
        background-color: var(--light_002);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        padding: 0.5em;
        height: 100%; 
    }
    .src { 
        align-items: center; 
        padding-top: 0.5em;
    }
</style>