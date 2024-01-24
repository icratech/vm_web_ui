<script>

    import { onMount, getContext, createEventDispatcher } from 'svelte'
    
    import { RGBA, BASE } from '../../../common/colors'
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
    export let new_evt = new Event( )
    export let smp = new Sample( )
    $: { new_evt.evt_time = smp.smp_time }
    // onMount( async( ) => { await reloadEvents( ) } )

    $: EVT_TYPES = getContext( 'evt_types' )
    $: evt_type = $EVT_TYPES.filter( t  => { return t.evt_typ_code == OP_CODES.REPORT_EVENT } )[0]

    export let color = BASE.PINK
    $: textColor = RGBA(color, 0.7)
    $: lineColor = RGBA(color, 0.35)
    // export let color_code_fg = 'fg-pink'
    // export let color_code_border = RGBA(color, 0.45)
    // export let btn_img_add_evt = btn_img_add_pink

    export let sec_name = "Section"

    export let evts = [ ]
    $: edit = false
    // $: editButtonImg = ( edit ? btn_img_cancel : btn_img_add_evt )
    // $: editButtonHint = ( edit ? "Cancel" : "New Event" )
    $: editButtonFunc = ( ) => { edit = !edit }
    // $: title = ( edit ? "Event List" : "Create Event" )

    const reloadEvents = async( ) => {
        // evts = [ ]
        // await job.getJobEvents( )
        new_evt = new Event( )
        edit = false
    }

    const sendEvent = async( ) => {
        /* TODO: IF EMPTY, DON'T SEND */
        // new_evt.evt_code = evt_type.evt_typ_code
        // await job.newEvent( new_evt )  
        // await reloadEvents( )
        dispatch( 'send-event' )
        edit = false
    }

    const cancelEvent = ( ) => {
        new_evt = new Event( )
        edit = false
    }

</script>

<!-- <div class="flx-col container" style="border: solid 0.1em { color_code_border };"> -->
<!-- <div class="flx-col container" style="color: { textColor }; border-left: solid 0.05em { lineColor };"> -->
<div class="flx-col container" style="color: { textColor };">

    <div class="flx-row">
        <!-- <div class="flx-row btns"> 
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
        </div> -->

        <div class="flx-col title-block" style="
        background-color: { RGBA(color, 0.07) };
            ">

            <div class="flx-row title" style="color: { textColor }; border-bottom: solid 0.05em { lineColor };">
                <span>Section:</span>
                { sec_name }
            </div>

            <div class="flx-row sub-title">
                
                <div class="flx-row btns"> 
                    { #if role.isOperator( $AUTH.user.role ) }
                    <div class="flx-row btn val" style="color: { textColor };"
                        on:click={ editButtonFunc } on:keydown
                    >+</div>
                    { /if }
                </div>

                <div class="flx-row evt-count">
                    <div class="lbl">Events:</div>
                    <div class="val" style="color: { textColor };">{ evts.length }</div>
                </div> 
                    <!-- <div class="vert-line"></div>
                    <div class="flx-row title { color_code_fg }">{ title }</div>
                </div> -->
                <!-- <div class="flx-row rep-title">{ rep_title }</div> -->
            </div>
        </div>
    </div>

    { #if edit }
    <div class="flx-col evt-build">
        <div class="flx-row sub-title">
            { #if role.isOperator( $AUTH.user.role ) }
            <div class="flx-row btns"> 
                <div class="flx-row btn fg-red_08" on:click={ cancelEvent } on:keyup>CANCEL</div>
                <div class="flx-row btn fg-green_08" on:click={ sendEvent } on:keyup>SAVE</div>
            </div>
            <div class="flx-row"></div>
            { /if }
        </div>
        <div class="flx-col evts">
            <EventBuilderRep bind:evt={new_evt} bind:evt_type/>
        </div>
    </div>
    { :else }
    <div class="flx-col evts">
        { #each evts as evt, index ( index ) }
            <EventCard bind:evt on:event-selected />
        { /each }
    </div>
    { /if }

</div>

<style>

    .container {
        height: 100%;
        /* padding: 0.5em; */
        gap: 1rem;
    }

    /* .panel-title-bar {
        justify-content: space-between;
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
    } */


    .title-block {
        padding: 0.5em;
        /* border-radius: 0.5em; */
        gap: 0.35em;
    }
    .title {
        color: var(--light_05);
        font-size: 1.2em;
        padding: 0.5em;
        padding-top: 0;
    }
    .sub-title{
        justify-content: space-between;
        padding: 0;
    }
    .btns { 
        align-items: flex-start; 
        padding-left: 0.5em;
        width: auto;
        gap: 0.75em;
    }
    .btn {
        cursor: pointer;
        padding: 0 0.25em;
        border-radius: 0.25em;
        border: solid 0.05em transparent;
    }
    .btn:hover {
        border: solid 0.05em var(--light_03);
    }

    .evt-build {
        overflow: hidden;
        gap: 0.5em;
    }
    .evts {
        overflow-y: auto;
        padding-right: 0.5em;
        gap: 0.75em;
    }
    .evt-count {
        justify-content: flex-end;
        padding-right: 0.5em;
        gap: 0.5em;
    }
    .lbl {
        color: var(--light_a);
    }
    .val {
        font-size: 1.1em;
    }


</style>