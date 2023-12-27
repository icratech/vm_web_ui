<script>

    import { createEventDispatcher } from 'svelte'

    import PillButton from "../../../common/button/PillButton.svelte"
    
	import { Job } from '../../job'
    import { Event } from '../../models'
    
    import EventBuilderRep from "./EventBuilderRep.svelte"
    import EventCard from "./EventCard.svelte"

    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_add_pink from "$lib/images/btn-img-add-pink.svg"
    
    const dispatch = createEventDispatcher( )

    // onMount( async( ) => { await job.getJobEvents( ) } )
    export let job = new Job( )
    export let cur_evt = new Event( )
    export let evt_code = 2001

    import { RGBA, BASE } from '$lib/common/colors'
    export let  color_code = BASE.LIGHT
    export let  color_code_fg = 'fg-pink'
    export let  color_code_border = RGBA(color_code, 0.5)
    export let btn_img_add_evt = btn_img_add_pink

    export let evts = [ ]
    export let rep_title = "Report"
    export let title = "Event List"
    $: show_evt_list = true
    $: title = ( show_evt_list ? title : "Create Event" )
    $: eventButtonHint = ( show_evt_list ? "New Event" : "Events" )

    const reloadEvents = ( ) => {
        // show_evt_list = true
        // evt_list = [ ]
        // job.getJobEvents( )
        show_evt_list = !show_evt_list
    }

    let edit = false
    const toggleEdit = ( ) => {
        edit = !edit
        dispatch( "edit" )
    }

</script>

<div class="flx-col container" style="border: solid 0.1em { color_code_border };">

    <div class="flx-row" style="border-bottom: solid 0.1em { color_code_border };">

        <div class="flx-col btns"> 

            { #if edit }
            <PillButton 
                on:click={ toggleEdit }
                img={ btn_img_cancel }
                hint={ 'Cancel' }
            />
            { :else }
            <PillButton 
                on:click={ toggleEdit }
                img={ btn_img_add_evt }
                hint={ 'Add Section' }
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

    { #if show_evt_list }

    <div class="flx-col evts">
        { #each evts as evt ( evt.evt_time ) }
            <EventCard bind:evt />
        { /each }
    </div>

    { :else }

    <div class="flx-col">
        
        <EventBuilderRep 
            bind:job
            bind:evt={ cur_evt }
            bind:evt_code
            on:complete={ reloadEvents }
        />
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