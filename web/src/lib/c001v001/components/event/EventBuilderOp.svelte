
<script>

    import InputText from "../../../common/input_text/InputText.svelte"
    import InputTextArea from "../../../common/input_text_area/InputTextArea.svelte"

    import { Event, EventType } from '../../models'

    export let evt = new Event( )
    export let evt_type = new EventType( )

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
        </div>
        
        <div class="flx-row in">
            <InputTextArea enabled={ true } bind:txt={ evt.evt_msg } remMinHeight=14.5 place="Message" />
        </div>
        
        <div class="flx-row foot">

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

</style>