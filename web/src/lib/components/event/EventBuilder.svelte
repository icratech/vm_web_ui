
<script>

    import btn_img_cancel from "$lib/images/btn-img-cancel.svg"
    import btn_img_confirm from "$lib/images/btn-img-confirm.svg"

    import Select from "$lib/common/select/Select.svelte"
    import InputText from "$lib/common/input_text/InputText.svelte"
    import InputTextArea from "../../common/input_text_area/InputTextArea.svelte"
    import PillButton from "$lib/common/button/PillButton.svelte"

    import { Event, Device } from "../../des_api";

    $: event_types = ( JSON.parse( sessionStorage.getItem( "event_types" ) ) ).filter( t =>{ return t.evt_typ_code >= 2000 } )

    export let device = new Device( )
    let evt = new Event( )

    const sendEvent = ( ) => { 
        device.createEvent( evt )  
        clearEvent( )
    }

    const clearEvent = ( ) => {
        evt = new Event( )
    }

</script>

<div class="flx-col container">

    <div class="flx-col card-content">

        <div class="flx-row in">
            <p class="lbl">Type:</p>
            <Select 
                clr="fg-accent"
                bind:list={ event_types }
                bind:selection={ evt.evt_code }
                displayField="evt_typ_name"
                idField="evt_typ_code"
                enabled={ true }
            />
        </div>
        
        <div class="flx-row in">
            <p class="lbl">Title:</p>
            <InputText enabled={ true } bind:txt={ evt.evt_title } place="Optional Title" />
        </div>
        
        <div class="flx-row in">
            <p class="lbl_ta">Message:</p>
            <InputTextArea enabled={ true } bind:txt={ evt.evt_msg } remMinHeight=13 place="Message" />
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

<style>

    .in {
        gap: 0.5em;
    }
    .lbl {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: var( --accent_a);
        font-size: 1rem;
        width: 5em;
    }
    .lbl_ta {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-start;
        color: var( --accent_a);
        font-size: 1rem;
        width: 5em;
    }

    .btns {
        justify-content: flex-end;
        padding-top: 1em;
    }
</style>