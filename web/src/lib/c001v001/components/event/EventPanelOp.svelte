<script>
    
    import { onMount, getContext } from "svelte"

    import { AUTH, RoleCheck } from '../../../des/api'
    import { Event, OP_CODES } from '../../models'
	import { Device } from "../../device"
    
    import PillButton from "../../../common/button/PillButton.svelte"
    import EventBuilderOp from "./EventBuilderOp.svelte"
    import EventCard from "./EventCard.svelte"

    import btn_img_edit from "$lib/images/btn-img-edit-aqua.svg"
    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"
    
    const role = new RoleCheck( )
    export let device = new Device( )
    onMount( async( ) => { await reloadEvents( ) } )

    $: EVT_TYPES = getContext( 'evt_types' )
    $: evt_type = $EVT_TYPES.filter( t  => { return t.evt_typ_code == OP_CODES.OPERATOR_EVENT } )[0]

    $: new_evt = new Event( )
    $: edit = false
    $: editButtonImg = ( edit ? btn_img_cancel : btn_img_edit )
    $: editButtonHint = ( edit ? "Cancel" : "New Event" )
    $: editButtonFunc = ( ) => { edit = !edit }
    $: title = ( edit ? "New Event" : "Event List" )

    const reloadEvents = async( ) => {
        device.job_evts = [ ]
        await device.qryActiveJobEvents( )
        new_evt = new Event( )
        edit = false
    }
        
    const sendEvent = async( ) => { 
        /* TODO: IF EMPTY, DON'T SEND */
        new_evt.evt_code = evt_type.evt_typ_code
        await device.newEvent( new_evt )  
        await reloadEvents( )
    }

</script>

<div class="flx-col container">

    <div class="flx-row panel-title-bar">
        { #if device.isActive( ) && role.isOperator( $AUTH.user.role ) }
        <div class="flx-row panel-title-btns">
            <PillButton
                img={ editButtonImg }
                on:click={editButtonFunc }
                hint={ editButtonHint }
            />
            { #if edit }
            <PillButton
                img={ btn_img_confirm }
                on:click={ sendEvent }
                hint={ "Confirm" }
            />
            { /if }
        </div>
        { /if }
        <h3 class="panel-title">{ title }</h3>
    </div>

    { #if edit }
    <div class="flx-col">
        <EventBuilderOp bind:evt={new_evt} bind:evt_type/>
    </div>
    { :else }
    <div class="flx-col evts">
        { #each device.job_evts as evt, index ( index ) }
            <EventCard bind:evt />
        { /each }
    </div>
    { /if }

</div>

<style>

    .container {
        padding-right: 0.5em;
        height: 100%;
        gap: 1rem;
    }
    .panel-title-bar {
        border-bottom: solid 0.05em var(--light_01);
        justify-content: space-between;
        padding-top: 0;
        padding-right: 0.5em;
        width: 100%;
        height: 2.75em;
    }
    .panel-title-btns {
        flex-direction: row;
        width: auto;
        gap: 1rem;
    }
    .panel-title {
        align-items: flex-end;
        width: 100%;
        height: 2.75em;
    }

    .evts {
        overflow-y: auto;
        padding-right: 0.5em;
        gap: 1.5rem;
    }

</style>