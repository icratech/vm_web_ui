
<script>

    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import { goto } from '$app/navigation'
    import { DEVICES, DEVICES_LOADED, get_devices, DemoDevice, DEMO_DEVICES, register_device } from '../../lib/des_api'
    import DemoDeviceCard from './DemoDeviceCard.svelte'
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'

    onMount( async( ) => { 
        
        // console.log( "/demo/+page.svelte -> onMount( ) -> $DEVICES_LOADED: ", $DEVICES_LOADED )
        if( !$DEVICES_LOADED ) { await get_devices( ) }

        // console.log( "/demo/+page.svelte -> onMount( ) -> $DEVICES: ", $DEVICES )
        $DEVICES.forEach( dev =>{
            if ( $DEMO_DEVICES.filter( sd => { return sd.dev.reg.des_dev_serial == dev.reg.des_dev_serial } )[0] == undefined ) {
                console.log( `New $DEMO_DEVICE: ${ dev.reg.des_dev_serial }` )
                let demo = new DemoDevice( dev )
                $DEMO_DEVICES = [ ...$DEMO_DEVICES, demo ]
            }  
        } )
    } )

    let serial

</script>

<dvi class="flx-col container">

    <h1>DES ADMINISTRATION PAGE</h1>

    <div class="flx-row new-device">

        <PillButton 
            cls='bg-accent'
            on:click={ async( ) => { await register_device( serial ) } }
            hint={ null } 
        />

        <div class="flx-col input-container">
            <label class="lbl">
                Enter a serial # and click the circle over there.
                <input name="serial"
                    type="text" 
                    bind:value={ serial } 
                />
            </label>
        </div>
    
    </div>

    <div class="flx-col device-list">
        { #each $DEMO_DEVICES as demo ( `demo_page_${ demo.dev.reg.des_dev_id }` ) }
            <DemoDeviceCard 
                bind:device={ demo }
                on:go={ ( ) => { goto( `device/${ demo.dev.reg.des_dev_serial }` ) } }
            />
        { /each }
    </div>

</dvi>


<style>
    .container {
        height: 100%;
        gap: 1rem;
        overflow: hidden;
    }
    .new-device {
        padding: 1em;
        align-items: center;
    }
    .device-list {
        width: 100%;
        overflow-y: auto;
        padding: 1em;
    }

    .input-container {
        gap: 0.25rem;
    }

    .lbl {
        font-size: 0.9rem;
    }

    input {
        color: var(--light);
        background-color: var(--aqua_01);
        padding: 0.5rem;
        border-radius: 0.5rem;
        /* border-top: solid 0.05em var(--dark); */
        border-right: solid 0.05em var(--light_01);
        border-bottom: solid 0.05em var(--light_01);
        /* border-left: solid 0.05em var(--dark); */
        width: 100%;
    }

    input:disabled {
        color: var(--grey);
		border: 0.1rem solid transparent;
    }


</style>