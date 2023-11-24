<script>
    
    import { onMount } from "svelte"

    import PillButton from "../../common/button/PillButton.svelte"
    import EventBuilderOp from "./EventBuilderOp.svelte"
    import EventCard from "./EventCard.svelte"
	import { Device, OP_CODES } from "../../des_api"

    import btn_img_edit from "$lib/images/btn-img-edit.svg"
    
    onMount( async( ) => { await device.getActiveJobEvents( ) } )
    export let device = new Device( )

    $: show_evt_list = true
    $: title = ( show_evt_list ? "Event List" : "Create Event" )
    $: eventButtonHint = ( show_evt_list ? "New Event" : "Events" )

    const reloadEvents = ( ) => {
        device.getActiveJobEvents( )
        show_evt_list = !show_evt_list
    }

</script>

<div class="flx-col container">

    <div class="flx-row panel-title-bar">
        <div class="flx-row panel-title-btns">

            { #if device.sta.sta_logging > OP_CODES.JOB_START_REQ }
            <PillButton
                cls={ 'bg-accent' }
                img={ btn_img_edit }
                on:click={ ( ) => { show_evt_list = !show_evt_list } }
                hint={ eventButtonHint }
            />
            { /if }

        </div>
        <h3 class="panel-title">{ title }</h3>
    </div>

    { #if show_evt_list }

    <div class="flx-col evts">
        { #each device.job_evts as evt ( evt.evt_time ) }
            <EventCard bind:event={ evt } />
        { /each }
    </div>

    { :else }

    <div class="flx-col">
        <EventBuilderOp bind:device on:complete={ reloadEvents }/>
    </div>

    { /if }

</div>

<style>

    .container {
        height: 100%;
        gap: 1rem;
    }

    .panel-title-bar {
        justify-content: space-between;
        /* padding-left: 1em; */
        padding-top: 0;
        padding-right: 0.5em;
        width: 100%;
    }
    .panel-title-btns {
        flex-direction: row;
        width: auto;
    }
    .panel-title {
        align-items: flex-end;
        width: 100%;
    }

    .evts {
        overflow-y: auto;
        padding-right: 0.5em;
    }

</style>