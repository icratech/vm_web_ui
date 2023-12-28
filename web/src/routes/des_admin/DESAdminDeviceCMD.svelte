<script>

    import { debug } from '../../lib/des/utils'

    import { DemoDevice } from "../../lib/des_api"
    import PillButton from "../../lib/common/button/PillButton.svelte"
    
    import btn_img_cmd_red from "$lib/images/btn-img-cmd-red.svg"
    import btn_img_cmd_orange from "$lib/images/btn-img-cmd-orange.svg"
    import btn_img_cmd_yellow from "$lib/images/btn-img-cmd-yellow.svg"
    import btn_img_cmd_green from "$lib/images/btn-img-cmd-green.svg"
    import btn_img_cmd_aqua from "$lib/images/btn-img-cmd-aqua.svg"
    import btn_img_cmd_blue from "$lib/images/btn-img-cmd-blue.svg"
    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"
    import btn_img_cmd_pink from "$lib/images/btn-img-cmd-pink.svg"

    import btn_img_disconnect_red from "$lib/images/btn-img-disconnect-red.svg"
    import btn_img_connect_green from "$lib/images/btn-img-connect-green.svg"
    import btn_img_reset_aqua from "$lib/images/btn-img-reset-aqua.svg"

    export let device = new DemoDevice( )


</script>


<div class="flx-row container">

    <div class="flx-col btns">
        <PillButton 
            img={ btn_img_disconnect_red }
            hint="Disconnect DES"
        />
        <PillButton 
            img={ btn_img_connect_green }
            hint="Connect DES"
        />
        <PillButton 
            img={ btn_img_reset_aqua }
            hint="Reset DES"
        />
        <PillButton 
            img={ btn_img_cmd_pink }
        />
    </div>

    <div class="flx-col btns">
        <PillButton 
            img={ btn_img_cmd_red }
            on:click={ device.dev.setAdmin }
            hint="Admin"
        />
        <PillButton 
            img={ btn_img_cmd_orange }
            on:click={ device.dev.setState }
            hint="State"
        />
        <PillButton 
            img={ btn_img_cmd_yellow }
            on:click={ device.dev.setHeader }
            hint="Header"
        />
        <PillButton 
            img={ btn_img_cmd_green }
            on:click={ device.dev.setConfig }
            hint="Config"
        />
    </div>

    <div class="flx-col btns">
        <PillButton 
            img={ btn_img_cmd_aqua }
        />
        <PillButton 
            img={ btn_img_cmd_blue }
        />
        <PillButton 
            img={ btn_img_cmd_purple }
        />
        <PillButton 
            img={ btn_img_cmd_pink }
        />
    </div>

</div>

<style>
        
    .container {
        /* background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01); */
        border-radius: 0.5em;
        height:100%;
        padding: 1em;
        gap: 0.5em;
    }
    
    .btns { 
        /* justify-content: flex-end;  */
        width: 7em;
        gap: 1em;
    }

</style>