<script>

    import { createEventDispatcher } from "svelte"

    import { debugging } from '../../lib/des/app'
    import { debug } from '../../lib/des/utils'

    import { Device } from "../../lib/c001v001/device"
    
    import { DemoDevice } from "../../lib/des_api"

    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputNum from "$lib/common/input_num/InputNum.svelte"
    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
    import DESAdminDeviceInfo from "./DESAdminDeviceInfo.svelte"
    
    import btn_img_cmd from "$lib/images/btn-img-cmd-orange.svg"
    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"
    import btn_img_start_grey from "$lib/images/btn-img-start-grey.svg"

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

        { #if debugging }
        <div class="flx-col input "></div>
        <div class="flx-col"></div>
        <!-- <div class="flx-col ">
            <PillButton 
                on:click={ device.dev.simOfflineStart( ) }
                img={ btn_img_start_grey }
                hint={ "Simulate Offline Job Start" } 
            />
            <div class="flx-row input">
                <PillButton 
                    on:click={ device.dev.setDebug }
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

            <div class="flx-row input">
                <PillButton 
                    on:click={ device.dev.testMsgLimit }
                    img={ btn_img_cmd_purple }
                    hint={ "1.5 kB MQTT Test Message" } 
                />
                <div class="flx-row">1484 bytes to:
                    <span class="fg-orange">001/001/{ device.dev.sta.sta_serial }/cmd/msg_limit</span>
                </div>
            </div>
        </div>
        <div class="flx-col "> 
            <PillButton 
                on:click={ ( ) => { } }
                img={ btn_img_start_grey }
                hint={ "Simulate Device Disconnect" } 
            />
        </div> -->
        { :else }
            <div class="flx-col"></div>
            <div class="flx-col"></div>
        { /if }

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




