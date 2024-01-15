
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

    <!-- <div class="flx-row field">
        <div class="flx-row title"></div>
        <div class="vert-line vl"/>
        <div class="flx-row value">{ ( evt_type ? evt_type.evt_typ_name : 'UNKNOWN EVT CODE' ) }</div> 
    </div> -->

    <!-- <div class="flx-row field">
        <div class="flx-row title">Title</div>
        <div class="vert-line"/>
        <InputText enabled={ true } bind:txt={ evt.evt_title } place="Optional Title" />
    </div> -->
    
    <div class="flx-row value">{ ( evt_type ? evt_type.evt_typ_name : 'UNKNOWN EVT CODE' ) }</div>

    <InputText enabled={ true } bind:txt={ evt.evt_title } place="Optional Title" />
    
    <div class="flx-row in">
        <InputTextArea enabled={ true } bind:txt={ evt.evt_msg } remMinHeight=14.5 place="Message" />
    </div>
    
    <div class="flx-row foot">

        <div class="flx-row count" style={ msg_limit_style }>
            { #if msg_limit }
                Maximum Characters: { evt.MaxMsg }
            { :else }
                Characters remaining: { evt.MaxMsg - evt.evt_msg.length } 
            { /if }
        </div>

    </div>

</div>

<style>

    .container {
        gap: 0.5em;
    }  
    /* .field { 
        height: 2em; 
        gap: 0;         
    }
    .title {
        color: var( --accent_a);
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.75em;
        max-width: 6em;
        min-width: 6em;
    }
    .vl {
        margin-bottom: -0.5em;
    } */
    .value { 
        align-items: center; 
    }

    .in {
        gap: 1em;
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