<script>

    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputNum from "$lib/common/input_num/InputNum.svelte"
    import { DemoDevice, AUTH } from "../../lib/des_api"

    import { createEventDispatcher } from "svelte"
    let dispatch = createEventDispatcher( )

    // export let reg = new DESRegistration( )

    export let demo_device = new DemoDevice( )
    $: demo = demo_device
    $: simButtonColor = ( demo.sim.run ? 'bg-pink' : 'bg-accent' )

</script>

<div class="flx-row container">

    
    <div class="flx-col btns">
    
        <PillButton on:click={ ( ) => { dispatch( 'go' ) } }/>

        <PillButton 
            cls={ simButtonColor }
            on:click={ ( ) => { ( demo.sim.run ? demo.disconnectSIM( ) : demo.connectSIM( $AUTH ) ) } }
        />

    </div>

    <div class="flx-col card">
                        
        <div class="flx-row card-title">        
            <div class="flx-row seg">
                <h4 class="fg-accent">SN:</h4>
                <h4>{ demo.dev.reg.des_dev_serial }</h4>
            </div>

            <div class="flx-row seg">
                <div class="sml">class</div>
                <div class="fg-accent">{ demo.dev.reg.des_dev_class }</div>
                <div class="sml">version</div>
                <div class="fg-accent">{ demo.dev.reg.des_dev_version }</div>
            </div>
        </div>

        <div class="flx-col card-content">

            <InputNum lbl="How many samples are we simulating?"
                cls={ 'fg-accent'}
                right={true}
                enabled={true}
                is_integer={true}
                bind:num={demo.sim.qty}
            />

            <InputNum lbl="How many milliseconds between samples?"
                cls={ 'fg-accent'}
                right={true}
                enabled={true}
                is_integer={true}
                bind:num={demo.sim.dur}
            />

            <InputNum lbl="How many samples do we want interpolated between each sample?"
                cls={ 'fg-accent'}
                right={true}
                enabled={true}
                is_integer={true}
                bind:num={demo.sim.fillQty}
            />

        </div>

    </div>

    <div class="flx-col card">

        <PillButton 
            cls={ 'bg-red' }
            on:click={ ( ) => { demo.sim.modeVent( ) } }
            />

        <PillButton 
            cls={ 'bg-aqua' }
            on:click={ ( ) => { demo.sim.modeFlow( ) } }
            />

        <PillButton 
            cls={ 'bg-yellow' }
            on:click={ ( ) => { demo.sim.modeBuild( ) } }
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
        width: 3.5em;
        gap:2em;
        padding: 2em 1em;
    }
    .seg {
        width: auto;
        justify-content: flex-end;
        gap: 1em;
    }
</style>




