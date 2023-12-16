
<script>

    import { createEventDispatcher, getContext } from "svelte"
    let dispatch = createEventDispatcher( )

    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"

    import InputText from "$lib/common/input_text/InputText.svelte"
    import InputTextArea from "$lib/common/input_text_area/InputTextArea.svelte"
    import PillButton from "$lib/common/button/PillButton.svelte"

    import { OP_CODES, Event, Device } from "../../des_api";

    export let device = new Device( )
    $: evt = new Event( )

    $: EVT_TYPES = getContext( 'evt_types' )
    $: evt_type = $EVT_TYPES.filter( t  => { return t.evt_typ_code == OP_CODES.OPERATOR_EVENT } )[0]
        
    const sendEvent = async( ) => { 
        evt.evt_code = evt_type.evt_typ_code
        device.job_evts = [ ]
        await device.newEvent( evt )  
        clearEvent( )
    }

    const clearEvent = ( ) => {
        evt = new Event( )
        dispatch( 'complete' )
    }

    $: msg_limit = evt.evt_msg.length >= evt.MaxMsg
    $: msg_limit_style = ( msg_limit ? "color: var(--red);" : "color: var(--grey_03);"  )

    $: { 
        evt.evt_title = evt.evt_title.slice( 0, evt.MaxTitle )
        evt.evt_msg = evt.evt_msg.slice( 0, evt.MaxMsg )  
    }

</script>

<div class="flx-col container">

    <div class="flx-col card-content">

        <div class="flx-row in">
            <p class="lbl">Type:</p>
            <div class="flx-row">{ ( evt_type ? evt_type.evt_typ_name : 'UNKNOWN EVT CODE' ) }</div> 
        </div>
        
        <div class="flx-row in">
            <p class="lbl">Title:</p>
            <InputText enabled={ true } bind:txt={ evt.evt_title } place="Optional Title" />
            <!-- <p class="count" style={ title_limit_style }>{ evt.MaxTitle - evt.evt_title.length }</p> -->
        </div>
        
        <div class="flx-row in">
            <InputTextArea enabled={ true } bind:txt={ evt.evt_msg } remMinHeight=14.5 place="Message" />
        </div>
        
        <div class="flx-row foot">

            <div class="flx-row btns">
                
                <PillButton 
                    img={ btn_img_cancel }
                    on:click={ clearEvent }
                    hint={ 'Cancel' } 
                />

                <PillButton 
                    on:click={ sendEvent }
                    img={ btn_img_confirm }
                    hint={ 'Send Event' } 
                />

            </div>

            <div class="flx-row count" style={ msg_limit_style }>
                { #if msg_limit }
                    Maximum Characters: { evt.MaxMsg }
                { :else }
                    { evt.MaxMsg - evt.evt_msg.length } 
                { /if }
            </div>

        </div>
     
    </div>

</div>

<style>

    .in {
        gap: 1em;
    }
    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        font-size: 1rem;
        width: 3em;
    }

    .foot {
        justify-content: space-between;
        padding-top: 0.5em;
    }

    .count { 
        justify-content: flex-end;
        margin-top: -0.5em;
        font-size: 1.1em;
        font-style: oblique;
        font-weight: 500;
    }

    .btns {
        justify-content: flex-start;
    }

</style>