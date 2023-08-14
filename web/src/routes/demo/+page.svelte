<script>

    import { onMount } from 'svelte'

    import { goto } from '$app/navigation'
    import { DemoDevice, DEMO_DEVICES } from '../../lib/des_api'
    import DemoDeviceCard from './DemoDeviceCard.svelte'

    /* THIS ALSO WORKS */
    // import { page } from '$app/stores'
    // $: device = $page.data.resp.device
    // $: message = $page.data.resp.message
    // $: status = $page.data.resp.status

    export let data
    $: devices = data.resp.devices
    $: message = data.resp.message
    $: status = data.resp.status

    let ready = false
    let demos = [ ]
    onMount( ( ) => {
            
        devices.forEach( dev => demos.push( new DemoDevice( dev ) ) )

        console.log( `Start $DEMO_DEVICES.length: ${ $DEMO_DEVICES.length }` )
        let existing_demos = false
        if ( $DEMO_DEVICES[ 0 ] ) { 

            existing_demos = true 

            demos.forEach( demo => {

                let stored = $DEMO_DEVICES.filter( sd => sd.dev.reg.des_dev_serial == demo.dev.reg.des_dev_serial )[ 0 ]
                if ( stored == undefined ) {
                    console.log( `NEW DEMO -> demo.dev.reg.des_reg_serial: ${ demo.dev.reg.des_dev_serial }` )
                    $DEMO_DEVICES = [ demo, ...$DEMO_DEVICES ] 
                } else {
                    console.log( `Loop DEMOS.forEach( ) -> stored.dev.reg.des_reg_serial: ${ stored.dev.reg.des_dev_serial }` )
                }

            } )
        
        } else {

            demos.forEach( demo => console.log( `/demo/+page make DemoDevices -> demo.dev.reg.des_dev_id: ${ demo.dev.reg.des_dev_id }` ) )
        
            $DEMO_DEVICES = [ ...demos ]

        }

        console.log( `End $DEMO_DEVICES.length: ${ $DEMO_DEVICES.length }` )

        ready = true
    } )

    /** @type {import('./$types').ActionData} */
    export let form

</script>

<dvi class="flx-col container">

    <h1>DEMO PAGE</h1>
    <p>STATUS: { status }</p>
    <p>MESSAGE: { message }</p>

    <form method="POST" action="?/registerDevice" class="flx-row new-device">

        <button class='pill-btn bg-accent'>
            DO
        </button>

        <div class="flx-col input-container">
            <label class="lbl">
                Enter a serial # and click the circle over there.
                <input name="serial"
                    type="text" 
                    value={ form?.serial ?? '' } 
                />
            </label>
        </div>
    
    </form>

    { #if ready }
    <div class="flx-col device-list">
        { #each $DEMO_DEVICES as demo ( `demo_page_${ demo.dev.reg.des_dev_id }` ) }
            <DemoDeviceCard 
                bind:demo_device={ demo }
                on:go={ ( ) => { goto( `device/${ demo.dev.reg.des_dev_serial }` ) } }
            />
        { /each }
    </div>
    { /if }

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
        background-color: var(--dark);
        padding: 0.25rem 0.5rem;
        border-radius: 0.2rem;
		border: 0.1rem solid var(--light_a);
        width: 100%;
    }

    input:disabled {
        color: var(--grey);
		border: 0.1rem solid transparent;
    }


</style>