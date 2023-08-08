<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    export let device = {
        des_dev_serial: "",
        des_dev_version: "",
        des_dev_class: "",
    }

</script>

<div class="flx-row container">

    <PillButton on:click={ ( ) => { dispatch( 'go' ) } }/>

<div class="flx-row device-reg-hdr">
                        
        <div class="device-ser">
            <h4>SN: { device.des_dev_serial }</h4>
        </div>
        <div class="flx-col device-reg-cv">
            <p>Class: { device.des_dev_class }</p>
            <p>Version: { device.des_dev_version }</p>
        </div>

    </div>
</div>

<style>
    
    .container{
        padding: 1em;
        background-color: var(--light_aa);
        border-radius: 0.5em;
        gap: 1em;
    }

     /* HEADER - DEVICE STATE - COL */
     /* .device-state {
        width: 35%;
    } */
    /* HEADER - DEVICE REG - COL */
    .device-reg-hdr {
        height: 3em;
    }
    .device-ser {
        width: 70%;
    }
    .device-reg-cv {
        width: 30%;
        align-items: flex-end;
        gap: 0;
    }

</style>