<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputNum from "$lib/common/input_num/InputNum.svelte"
    import DateTimeDisplay from "../../lib/common/date_time/DateTimeDisplay.svelte"
    import DESAdminDeviceInfo from "./DESAdminDeviceInfo.svelte"
    import { Device, AUTH } from "../../lib/des_api"

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    export let device = new Device( )

    let exp = false
    const toggle = ( ) => {
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

    .results {
        height: 50em;
    }

</style>




