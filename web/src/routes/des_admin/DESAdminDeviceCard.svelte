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
    import DesAdminDeviceCMD from "./DESAdminDeviceCMD.svelte"
    
    import btn_img_cmd from "$lib/images/btn-img-cmd-orange.svg"
    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"
    import btn_img_start_grey from "$lib/images/btn-img-start-grey.svg"


    export let device = new Device( )

    let exp = false
    const toggle = ( ) => {
        debug("DESAdminDeviceCard -> device: ", device)
        exp = ! exp
    }


    $: highlight = ( device.highlight ? 'highlight' : '' ) 

    let dispatch = createEventDispatcher( )

</script>

<!-- <div class="flx-row container { highlight }"
    on:keydown on:click={ ( ) => { dispatch( "device-selected", device ) } } 
> -->
<div class="flx-row container { highlight }">

    <div class="flx-row">
        <DESAdminDeviceInfo bind:device />

        { #if debugging }
        <DesAdminDeviceCMD bind:device />
        <div class="flx-col"></div>
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
    .container:hover { background-color: var(--light_003); }
    .highlight { background-color: var(--light_003); }

    .results {
        height: 50em;
    }

</style>




