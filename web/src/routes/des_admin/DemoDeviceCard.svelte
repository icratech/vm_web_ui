<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputNum from "$lib/common/input_num/InputNum.svelte"
    import { Device, AUTH } from "../../lib/des_api"

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    // export let reg = new DESRegistration( )

    export let device = new Device( )

</script>

<div class="flx-row container">

    <div class="flx-col card">
                        
        <div class="flx-row card-title">        
            <div class="flx-row seg">
                <h4 class="fg-accent">SN:</h4>
                <h4>{ device.dev.reg.des_dev_serial }</h4>
            </div>

            <div class="flx-row seg">
                <div class="sml">class</div>
                <div class="fg-accent">{ device.dev.reg.des_dev_class }</div>
                <div class="sml">version</div>
                <div class="fg-accent">{ device.dev.reg.des_dev_version }</div>
            </div>
        </div>

    </div>

    <div class="flx-row btns">
        <PillButton 
            cls={ 'bg-pink' }
            hint={ null } 
        />
        <PillButton 
            cls={ 'bg-purple' }
            hint={ null } 
        />
        <PillButton 
            cls={ 'bg-aqua' }
            hint={ null } 
        />

    </div>


</div>

<style>
    
    
    .container{
        justify-content: space-between;
        border-radius: 0.5em;
        /* border-top-left-radius: 2em;
        border-bottom-left-radius: 2em; */
        padding: 0 1em;
        gap: 1em;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
    .btns {
        gap:2em;
    }
    .seg {
        width: auto;
        justify-content: flex-end;
        gap: 1em;
    }
</style>




