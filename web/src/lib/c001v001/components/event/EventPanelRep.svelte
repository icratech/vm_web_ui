<script>

    import { onMount, getContext, createEventDispatcher } from 'svelte'
    
    import { RGBA, BASE } from '$lib/common/colors'
    import { AUTH, RoleCheck } from '../../../des/api'
    import { Event, Sample, OP_CODES } from '../../models'
	import { Job } from '../../job'
    
    import PillButton from "../../../common/button/PillButton.svelte"
    import EventBuilderRep from "./EventBuilderRep.svelte"
    import EventCard from "./EventCard.svelte"

    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_add_pink from "$lib/images/btn-img-add-pink.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"
    
    const dispatch = createEventDispatcher( )

    const role = new RoleCheck( )
    export let job = new Job( )
    export let new_evt = new Event( )
    export let smp = new Sample( )
    $: { new_evt.evt_time = smp.smp_time }
    // onMount( async( ) => { await reloadEvents( ) } )

    $: EVT_TYPES = getContext( 'evt_types' )
    $: evt_type = $EVT_TYPES.filter( t  => { return t.evt_typ_code == OP_CODES.REPORT_EVENT } )[0]

    export let  color_code = BASE.LIGHT
    export let  color_code_fg = 'fg-pink'
    export let  color_code_border = RGBA(color_code, 0.5)
    export let btn_img_add_evt = btn_img_add_pink

    export let evts = [ ]
    export let rep_title = "Report"
    $: edit = false
    $: editButtonImg = ( edit ? btn_img_cancel : btn_img_add_evt )
    $: editButtonHint = ( edit ? "Cancel" : "New Event" )
    $: editButtonFunc = ( ) => { edit = !edit }
    $: title = ( edit ? "Event List" : "Create Event" )

    const reloadEvents = async( ) => {
        evts = [ ]
        await job.getJobEvents( )
        new_evt = new Event( )
        edit = false
    }

    const sendEvent = async( ) => {
        /* TODO: IF EMPTY, DON'T SEND */
        new_evt.evt_code = evt_type.evt_typ_code
        await job.newEvent( new_evt )  
        await reloadEvents( )
    }

</script>

<div class="flx-col container" style="border: solid 0.1em { color_code_border };">

    <div class="flx-row" style="border-bottom: solid 0.1em { color_code_border };">

        <div class="flx-row btns"> 

            { #if role.isOperator( $AUTH.user.role ) }
            <PillButton
                img={ editButtonImg }
                on:click={editButtonFunc }
                hint={ editButtonHint }
            />
            { /if }

            { #if edit }
                <PillButton
                    img={ btn_img_confirm }
                    on:click={ sendEvent }
                    hint={ "Confirm" }
                />
            { /if }


        </div>

        <div class="flx-col title-block">
            <div class="flx-row">
                <div class="flx-row title">Events</div>
                <div class="flx-row val { color_code_fg }">{ evts.length }</div> 
                <div class="vert-line"></div>
                <div class="flx-row title { color_code_fg }">{ title }</div>
            </div>
            <div class="flx-row subtitle">
                <div class="flx-row rep-title">{ rep_title }</div>
            </div>
        </div>
    </div>

    { #if edit }
    <div class="flx-col">
        <EventBuilderRep bind:evt={new_evt} bind:evt_type/>
    </div>
    { :else }
    <div class="flx-col evts">
        { #each evts as evt, index ( index ) }
            <EventCard bind:evt />
        { /each }
    </div>
    { /if }

</div>

<style>

    .container {
        height: 100%;
        border-radius: 0.5em;
        padding: 0.5em;
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


    .title-block {
        padding-bottom: 0.5em;
        gap: 0.35em;
    }

    .title {
        font-size: 1.4em;
        font-style: oblique;
        width:auto;
    }
    .subtitle{
        justify-content: space-between;
        padding: 0;
    }
    .evt-count {
        width:auto;
    }
    .rep-title {
        color: var(--light_a);
        font-size: 1.2em;
        font-style: oblique;
        width: auto;
    }
    .evts {
        overflow-y: auto;
        padding-right: 0.5em;
        gap: 0.75em;
    }
    .lbl {
        color: var(--light_a);
    }
    .val {
        /* align-items: flex-end; */
        margin-left: -1.25em;
        font-size: 0.9em;
        padding: 0;
        width: auto;
    }

    .btns { 
        align-items: flex-start; 
        width: auto;
        gap: 0.5em;
    }

</style>