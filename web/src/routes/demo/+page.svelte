<script>
    import { goto } from '$app/navigation'
    import { auth_user } from '../../lib/des_api'
    import DeviceCard from '../device/DeviceCard.svelte'
   
    /* THIS ALSO WORKS */
    // import { page } from '$app/stores'
    // $: device = $page.data.resp.device
    // $: message = $page.data.resp.message
    // $: status = $page.data.resp.status

    /** @type {import('./$types').PageData} */
    export let data
    $: devices = data.resp.devices
    $: message = data.resp.message
    $: status = data.resp.status
    $: { console.log( `./demo: ${ status.toUpperCase() }\t${ message }` ) }
    // $: { console.log( `./demo: auth_user\t${ JSON.stringify( $auth_user, null, 4 ) }` ) }

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

        <input type="hidden" value={ $auth_user.id } name="user_id"/>
    
    </form>

    <div class="flx-col device-list">
        { #each devices as device ( `device_page_${ device.des_dev_id }`  )  }
            <DeviceCard 
                bind:device={ device }
                on:go={ ( ) => { goto( `device/${device.des_dev_serial }` ) } }
            />
        { /each }
    </div>


</dvi>


<style>
    .container {
        height: 100%;
        gap: 1rem;
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