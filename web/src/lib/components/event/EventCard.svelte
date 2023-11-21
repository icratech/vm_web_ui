
<script>

    import DateTimeDisplay from "../../common/date_time/DateTimeDisplay.svelte"
    import UserBadge from "../user/UserBadge.svelte"

    import { Event } from "../../des_api"

    import evt_img_comment from "$lib/images/bg-img-blue.svg"
    import evt_img_op from "$lib/images/bg-img-green.svg"
    import evt_img_alarm from "$lib/images/bg-img-red.svg"
    
    let bg_img = evt_img_comment

    export let event = new Event( )
    let charLimit = 230
    $: message = ( 
        event.evt_msg.length > charLimit 
        ? event.evt_msg.slice( 0, charLimit ) + "..." 
        : event.evt_msg 
    )
    $: evt_type = (JSON.parse( sessionStorage.event_types )).filter( t => t.evt_typ_code == event.evt_code )[0]
    $: evtColorCode = 'fg-accent'
    $: bgColor = 'var(--aqua_003)'
    $: {
        if ( evt_type.evt_typ_code < 999 ) {
            evtColorCode = 'fg-green_a'
            bgColor = 'var(--green_01)'
            bg_img = evt_img_op
        } else if ( evt_type.evt_typ_code > 999 && evt_type.evt_typ_code < 2000 ) {
            evtColorCode = 'fg-red_a'
            bgColor = 'var(--red_02)'
        } else {
            evtColorCode = 'fg-accent'
            bgColor = 'var(--aqua_003)'
        }
    }

</script>

<!-- <div class="flx-col container" style="background-image: url( { bg_img } );"> -->

<div class="flx-col container" style="background-color: { bgColor };">
  
    <div class="flx-row title-bar">
        { #if evt_type.evt_typ_code > 999 && event.evt_title !== "" }
            <div class="flx-row title">{ event.evt_title }</div>
        { :else }
            <div class="flx-row { evtColorCode } evt-type">{ evt_type.evt_typ_name }</div>
        { /if }
        
        <DateTimeDisplay date={ event.evt_time } />
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
        
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em;
        /* -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover; */
        justify-content: space-between;
        padding: 0.5em;
        max-height: 9em;
        min-height: 9em;
        height: 9em;
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
        /* padding-left: 1em; */
    }
    /* .evt-type{
        justify-content: flex-end;
    } */
    .msg { 
        /* background-color: var(--light_002); */
        /* border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5em; */
        
        /* justify-content: center;
        align-items: center; */
        padding: 1em 1.5em;
        height: 100%; 
    }
    .src { 
        align-items: center; 
        padding:  0.5em 1.5em;
        /* padding-top: 0.5em; */
    }
</style>