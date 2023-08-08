<script>
    import PillButton from "$lib/common/button/PillButton.svelte"
    import InputText from "$lib/common/input_text/InputText.svelte"
    
    import { API_URL_REGISTER_DEVICE, DESRegistration } from "../../lib/des_api";
    
    import { AuthorizedUser, auth_user, demo_app } from '../../lib/des_api'
    
    let serial
    const RegisterDevice = async(  ) => {
        let url =  API_URL_REGISTER_DEVICE
        let des_reg = new DESRegistration( )
        des_reg.des_dev_serial = serial
        des_reg.des_dev_reg_user_id = $auth_user.id
        des_reg.des_dev_reg_app = demo_app
        console.log("demo+page.svelte -> RegisterDevice -> REQUEST des_reg:\n", des_reg )
        let res = await fetch( url, { 
            method: "POST",
            headers: { "Content-Type": "application/json", } ,
            body: JSON.stringify( des_reg )
        } )
        let txt = await res.text( )
        console.log( txt )
        des_reg = await JSON.parse( txt )

        console.log("DemoDevicePage -> RegisterDevice -> RESPONSE des_reg:\n", des_reg )

        GetDevices( )
    }
</script>

<div class="flx-row new-device">

    <PillButton
        on:click={ RegisterDevice }
    />
    
    <InputText 
        bind:txt={ serial }
        place={ "NEXTSERIAL" }
        enabled={ true }
        lbl={ "Enter a serial # and click 'New'" }
    />

</div>

<style>
    .new-device {
        height: 11em;
    }
</style>