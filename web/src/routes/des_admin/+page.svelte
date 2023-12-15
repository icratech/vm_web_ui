
<script>

    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import { goto } from '$app/navigation'
    import { 
        DEVICES, 
        DEVICES_LOADED, 
        get_devices, 
        DemoDevice, 
        DEMO_DEVICES, 
        register_device,
        debug 
    } from '../../lib/des_api'
    import DESAdminDeviceCard from './DESAdminDeviceCard.svelte'
    import DESAdminDeviceInfo from './DESAdminDeviceInfo.svelte'
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'

    onMount( async( ) => { 
        
        // debug( "/demo/+page.svelte -> onMount( ) -> $DEVICES_LOADED: ", $DEVICES_LOADED )
        if( !$DEVICES_LOADED ) { await get_devices( ) }

        // debug( "/demo/+page.svelte -> onMount( ) -> $DEVICES: ", $DEVICES )
        $DEVICES.forEach( dev =>{
            if ( $DEMO_DEVICES.filter( sd => { return sd.dev.reg.des_dev_serial == dev.reg.des_dev_serial } )[0] == undefined ) {
                debug( `New $DEMO_DEVICE: `, dev.reg.des_dev_serial )
                let demo = new DemoDevice( dev )
                $DEMO_DEVICES = [ ...$DEMO_DEVICES, demo ]
            }  
        } )
    } )

    let serial
    const registerDevice = async( ) => { 
        await register_device( serial )
        serial = null
    }

    $: showDevices = true
    $: showDatabases = false
    const clearShow = ( ) => {
        showDevices = false
        showDatabases = false
    }

</script>

<dvi class="flx-col container">

    <div class="flx-row content">

        <div class="flx-col status">
            <h1>DES ADMINISTRATION PAGE</h1>

            <br>

            <div class="flx-col">
                <div class="flx-row"><h3>ADD A DEVICE</h3></div>

                <div class="flx-row">
                    <PillButton cls='bg-accent' on:click={ registerDevice } hint={ null } />
                    <div class="flx-col input-container">
                        <label class="lbl">Enter a serial # and click the circle over there.
                            <input name="serial" type="text" bind:value={ serial } />
                        </label>
                    </div>
                </div>
            </div>

            <br>

            <div class="flx-col">
                <div class="flx-row"><h3>DEVICES</h3></div>

                <div class="flx-row">
                    <PillButton cls='bg-accent' on:click={ registerDevice } hint={ null } />
                    <div class="flx-row op-lbl">Show Device List</div>
                </div>
            </div>


            <br>

            <div class="flx-col">
                <div class="flx-row"><h3>DATABASES</h3></div>

                <div class="flx-row">
                    <PillButton cls='bg-accent' on:click={ registerDevice } hint={ null } />
                    <div class="flx-row op-lbl">Show Database List</div>
                </div>
            </div>


            <!-- <div class="flx-col device-list">
                { #each $DEMO_DEVICES as device ( `demo_page_${ device.dev.reg.des_dev_id }` ) }
                    <DESAdminDeviceInfo
                        bind:device={ device }
                        on:go={ ( ) => { goto( `device/${ device.dev.reg.des_dev_serial }` ) } }
                    />
                { /each }
            </div> -->

        </div>

        <div class="flx-col panel">

            { #if showDevices }
            <div class="flx-col device-list">
                { #each $DEMO_DEVICES as device ( `demo_page_${ device.dev.reg.des_dev_id }` ) }
                    <DESAdminDeviceCard
                        bind:device={ device }
                        on:go={ ( ) => { goto( `device/${ device.dev.reg.des_dev_serial }` ) } }
                    />
                { /each }
            </div>
            { :else if showDatabases }
                <div class="flx-col"><h3>DATABASES</h3></div>
            { /if }


        </div>


    </div>

</dvi>


<style>
    .container {
        overflow: hidden;
        height: 100%;
        gap: 1rem;
    }
    
    .content { 
        height: 100%;
    }
    
    .status {
        max-width: 25%;
        min-width: 25%;
        width: 25%;
        height: 100%;
        padding-right: 0.5em;
    }
    .op-lbl {
        align-items: center;
    }

    .panel {
        padding: 0 1em;
        padding-left: 0;
        height: auto;
    }

    .device-list {
        overflow-x: visible;
        overflow-y: auto;
        padding: 1em;
        width: 100%;
        height: 100%;
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
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
        border-radius: 0.5rem;
        padding: 0.5rem;
        width: 100%;
    }

    input:disabled {
        color: var(--grey);
		border: 0.1rem solid transparent;
    }


</style>