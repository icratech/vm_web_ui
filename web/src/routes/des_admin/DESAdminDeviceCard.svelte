<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputNum from "$lib/common/input_num/InputNum.svelte"
    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
    import DESAdminDeviceInfo from "./DESAdminDeviceInfo.svelte"
    
    import btn_img_cmd from "$lib/images/btn-img-cmd.svg"

    import { Device, debug } from "../../lib/des_api"

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    export let device = new Device( )

    let exp = false
    const toggle = ( ) => {
        debug("DESAdminDeviceCard -> device: ", device)
        exp = ! exp
    }

</script>

<div class="flx-col container">

    <div class="flx-row">
        <DESAdminDeviceInfo bind:device />
        <div class="flx-col ">
            <PillButton 
                on:click={ toggle }
                cls={ 'bg-purple' }
                hint={ "Whatever" } 
            />
            <div class="flx-row input">
                
                <PillButton 
                    on:click={ device.dev.setDebug }
                    cls={ 'bg-orange' }
                    img={ btn_img_cmd }
                    hint={ "Update Debug Settings" } 
                />
                
                <InputNum
                    enabled={true}
                    is_integer={true}
                    bind:num={device.dev.dbg.mqtt_delay}
                    width=6em
                />

                <div class="flx-row">MQTT Message Delay ( sec )</div>

            </div>
        </div>
        <div class="flx-col "> </div>
    </div>

    { #if exp }
    <div class="flx-row results">

    </div>
    { /if }

</div>

<style>
    
    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        justify-content: space-between;
        border-radius: 0.5em;
        padding: 1em;
    }

    .input {
        align-items: center;
    }

    .results {
        height: 50em;
    }

</style>




