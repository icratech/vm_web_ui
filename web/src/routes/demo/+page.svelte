
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

    onMount( ( ) => {
            
        let demos = [ ]
        data.devices.forEach( dev => demos.push( new DemoDevice( dev ) ) )

        if ( $DEMO_DEVICES[ 0 ] ) { 
            demos.forEach( demo => {
                if ( $DEMO_DEVICES.filter( sd => { return sd.dev.reg.des_dev_serial == demo.dev.reg.des_dev_serial } ) == undefined ) {
                    $DEMO_DEVICES = [ demo, ...$DEMO_DEVICES ] 
                }
            } )
        
        } else {
            $DEMO_DEVICES = [ ...demos ]
        }
        console.log( `End $DEMO_DEVICES.length: ${ $DEMO_DEVICES.length }` )
    } )

    // /** @type {import('./$types').ActionData} */
    export let form

</script>

<dvi class="flx-col container">

    <h1>DEMO PAGE</h1>

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

    <div class="flx-col device-list">
        { #each $DEMO_DEVICES as demo ( `demo_page_${ demo.dev.reg.des_dev_id }` ) }
            <DemoDeviceCard 
                bind:demo_device={ demo }
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