
<script>

    import { onMount } from "svelte"
    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte"
    import UserBadge from "../user/UserBadge.svelte"

    import { Event, EventType } from "../../des_api"
    
    export let event = new Event( )
    let charLimit = 230
    $: message = ( 
        event.evt_msg.length > charLimit 
        ? event.evt_msg.slice( 0, charLimit ) + "..." 
        : event.evt_msg 
    )

    let evt_type = new EventType( )
    onMount( async( ) => { 
        evt_type = JSON.parse( sessionStorage.event_types ).filter( 
            t => t.evt_typ_code == event.evt_code )[0]
    } )

</script>

<div class="flx-col container">
  
    <div class="flx-row">
        <div class="fg-green_a">{ evt_type.evt_typ_name }</div>
    </div>

    <div class="flx-row mid">
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
        width: 100%;
        height: 100%;
        gap: 0;
    }
    .src { align-items: center; }
</style>