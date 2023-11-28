
<script>

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    import btn_img_cancel from "$lib/images/btn-img-cancel-red.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm-green.svg"

    import InputText from "$lib/common/input_text/InputText.svelte"
    import InputTextArea from "$lib/common/input_text_area/InputTextArea.svelte"
    import PillButton from "$lib/common/button/PillButton.svelte"

    import { Event, Device } from "../../des_api";

    export let device = new Device( )
    $: evt = new Event( )
    $: event_type = (JSON.parse( sessionStorage.event_types )).filter( t => { return t.evt_typ_code == 2000 } )[0]
        
    const sendEvent = async( ) => { 
        evt.evt_code = event_type.evt_typ_code
        device.job_evts = [ ]
        await device.newEvent( evt )  
        clearEvent( )
        // dispatch( 'complete' )
    }

    const clearEvent = ( ) => {
        evt = new Event( )
        // evt.evt_msg = `One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections. The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked. "What's happened to me?" he thought. It was`
        dispatch( 'complete' )
    }

    $: msg_limit = evt.evt_msg.length >= evt.MaxMsg
    $: msg_limit_style = ( msg_limit ? "color: var(--red);" : "color: var(--grey_03);"  )
    
    // $: title_limit = evt.evt_title.length >= evt.MaxTitle
    // $: title_limit_style = ( title_limit ? "color: var(--red);" : "color: var(--grey_03);"  )

    $: { 
        evt.evt_title = evt.evt_title.slice( 0, evt.MaxTitle )
        evt.evt_msg = evt.evt_msg.slice( 0, evt.MaxMsg )  
    }

</script>

<div class="flx-col container">

    <div class="flx-col card-content">

        <div class="flx-row in">
            <p class="lbl">Type:</p>
            <div class="flx-row">{ event_type.evt_typ_name }</div> 
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