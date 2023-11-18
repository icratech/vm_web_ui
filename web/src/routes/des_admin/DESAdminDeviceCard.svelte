<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputNum from "$lib/common/input_num/InputNum.svelte"
    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
    import DESAdminDeviceInfo from "./DESAdminDeviceInfo.svelte"
    import { Device, AUTH } from "../../lib/des_api"

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    // export let reg = new DESRegistration( )

    export let device = new Device( )

</script>

<div class="flx-row container">

    <DESAdminDeviceInfo bind:device />

    <div class="flx-col "> </div>

    <div class="flx-col "> </div>

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

</style>




