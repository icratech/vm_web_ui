
<script>

    import btn_img_cancel from "$lib/images/btn-img-cancel.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm.svg"

    import InputText from "$lib/common/input_text/InputText.svelte"
    import InputTextArea from "../../common/input_text_area/InputTextArea.svelte"
    import PillButton from "$lib/common/button/PillButton.svelte"

    import { EVENT_TYPES, Event, Device } from "../../des_api";

    export let device = new Device( )
    $: evt = new Event( )
    $: event_type = $EVENT_TYPES.filter( t => { return t.evt_typ_code == 2000 } )[0]

    const sendEvent = ( ) => { 
        device.createEvent( evt )  
        clearEvent( )
    }

    const clearEvent = ( ) => {
        evt = new Event( )
        evt.evt_code = event_type.evt_typ_code
    }

    $: msg_limit = false
    let max = 512
    $: {
        if ( evt.evt_msg.length > max ) {
            evt.evt_msg = evt.evt_msg.slice(0, max)
            msg_limit = true
        }
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
        </div>
        
        <div class="flx-row in">
            <InputTextArea enabled={ true } bind:txt={ evt.evt_msg } remMinHeight=14.5 place="Message" />
        </div>
        
        <div class="flx-row foot">
            
            <div class="flx-row count">
                { evt.evt_msg.length } / { max }
            </div>

            <div class="flx-row btns">
                
                <PillButton 
                    cls={ 'bg-red' }
                    img={ btn_img_cancel }
                    on:click={ clearEvent }
                    hint={ 'Cancel' } 
                />

                <PillButton 
                    on:click={ sendEvent }
                    cls={ 'bg-green' }
                    img={ btn_img_confirm }
                    hint={ 'Send Event' } 
                />

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

    .btns {
        justify-content: flex-end;
    }

</style>