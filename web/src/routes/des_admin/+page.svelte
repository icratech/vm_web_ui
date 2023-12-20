
<script>

    import { getContext, onMount } from 'svelte'
    import { goto } from '$app/navigation'

    import { debug, debugging } from '../../lib/des/utils'
    import { AUTH } from '../../lib/des/auth'
    import { 
        getDevices, 
        DemoDevice, 
        DEMO_DEVICES, 
        registerDevice, 
    } from '../../lib/des_api'

    import DESAdminDeviceCard from './DESAdminDeviceCard.svelte'
    import PillButton from '../../lib/common/button/PillButton.svelte'
    import InputText from '../../lib/common/input_text/InputText.svelte'

    $: DEVICES = getContext( 'devices' )
    $: DEVICES_LOADED = getContext( 'devices_loaded' )

    onMount( async( ) => { 

        if ( !$DEVICES_LOADED && sessionStorage.getItem( 'des_auth') != 'none' ) { 
            AUTH.set( JSON.parse( sessionStorage.getItem( 'des_auth') ) )
            await getDevices( )
        }

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
    const callRegisterDevice = async( ) => { 
        await registerDevice( serial )
        serial = null
    }

    $: showDevices = true
    $: showDatabases = false
    const clearShow = ( ) => {
        showDevices = false
        showDatabases = false
    }

    const callGetDevices = ( ) => { 
        clearShow( )
        showDevices = true
    }


    const getDatabases = ( ) => { 
        clearShow( )
        showDatabases = true
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
                    <PillButton cls='bg-accent' on:click={ callRegisterDevice } hint={ null } />
                    <div class="flx-col input-container">
                        <InputText 
                            enabled ={ debugging }
                            bind:txt={ serial }
                            place="Enter a serial # and click the circle over there." 
                            /> 
                    </div>
                </div>
            </div>

            <br>

            <div class="flx-col">
                <div class="flx-row"><h3>DEVICES</h3></div>

                <div class="flx-row">
                    <PillButton cls='bg-accent' on:click={ callGetDevices } hint={ null } />
                    <div class="flx-row op-lbl">Show Device List</div>
                </div>
            </div>


            <br>

            <div class="flx-col">
                <div class="flx-row"><h3>DATABASES</h3></div>

                <div class="flx-row">
                    <PillButton cls='bg-accent' on:click={ getDatabases } hint={ null } />
                    <div class="flx-row op-lbl">Show Database List</div>
                </div>
            </div>

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


</style>