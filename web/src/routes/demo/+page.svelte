<script>
    import { invalidateAll, goto } from '$app/navigation'
    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputText from "$lib/common/input_text/InputText.svelte"
    import DeviceCard from '../device/DeviceCard.svelte'
    
    import { API_URL_REGISTER_DEVICE, DESRegistration } from "../../lib/des_api";
    import { auth_user, demo_app } from '../../lib/des_api'
   
    /* THIS ALSO WORKS */
    // import { page } from '$app/stores'
    // $: device = $page.data.resp.device
    // $: message = $page.data.resp.message
    // $: status = $page.data.resp.status

    export let data
    $: devices = data.resp.devices
    $: message = data.resp.message
    $: status = data.resp.status
    $: { console.log( `./demo: ${ status.toUpperCase() }\t${ message }` ) }
    
    let serial
    const RegisterDevice = async(  ) => {

        let des_reg = new DESRegistration( )
        des_reg.des_dev_serial = serial
        des_reg.des_dev_reg_user_id = $auth_user.id
        des_reg.des_dev_reg_app = demo_app
        // console.log("demo+page.svelte -> RegisterDevice -> REQUEST des_reg:\n", des_reg )

        let res = await fetch(  API_URL_REGISTER_DEVICE, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ $auth_user.token }` 
            },
            body: JSON.stringify( des_reg )
        } )
        let txt = await res.text( )

        des_reg = await JSON.parse( txt )
        console.log("DemoDevicePage -> RegisterDevice -> RESPONSE des_reg:\n", des_reg )

        invalidateAll( )
    }


</script>

<dvi class="flx-col container">

    <h1>DEMO PAGE</h1>
    <p>STATUS: { status }</p>
    <p>MESSAGE: { message }</p>

    <div class="flx-row new-device">

        <PillButton
            on:click={ RegisterDevice }
        />
        
        <InputText 
            bind:txt={ serial }
            place={ "NEXTSERIAL" }
            enabled={ true }
            lbl={ "Enter a serial # and click the circle over there." }
        />
    
    </div>

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

</style>