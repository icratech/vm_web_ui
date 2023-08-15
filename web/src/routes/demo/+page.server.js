
import { load_get_devices, demo_app } from "../../lib/des_api"

export const load = load_get_devices

import { API_URL_C001_V001_DEVICE_REGISTER, DESRegistration } from "../../lib/des_api"

/** @type {import('./$types').Actions} */
export const actions = {

    registerDevice: async( { cookies, request } ) => {

        const data = await request.formData( )
        const serial = data.get( 'serial' ) // console.log( `FORM ACTION: registerDevice -> serial:\n${ serial }\n` )

        const user = await JSON.parse( cookies.get( 'des_user' ) )
        console.log( `FORM ACTION: registerDevice -> user:\n${ JSON.stringify( user, null, 4 ) }\n` )

        let reg = new DESRegistration( )
        reg.des_dev_serial = serial
        reg.des_dev_reg_user_id = user.id
        reg.des_dev_reg_app = demo_app
        console.log("FORM ACTION: registerDevice -> REQUEST reg:\n", reg )

        let req = new Request( API_URL_C001_V001_DEVICE_REGISTER, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ user.token }` 
            },
            body: JSON.stringify( reg )
        } )
        let res = await fetch( req )
        reg = await res.json( )
        console.log("FORM ACTION: registerDevice ->  RESPONSE reg:\n", reg )
    }

}
