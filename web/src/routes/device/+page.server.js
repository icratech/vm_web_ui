
import { API_URL_DEVICES } from "../../lib/des_api"
const REQUEST_GET_DEVICES = new Request( API_URL_DEVICES, { 
    method: 'GET',
    credentials: "include" 
} )

export const load = async( serverLoadEvent ) => {

    let token = serverLoadEvent.cookies.get("des_token")
    // console.log( token )
    REQUEST_GET_DEVICES.headers.set( "Authorization", `Bearer ${ token }` )
 

    const { fetch } = serverLoadEvent
    let res = await fetch( REQUEST_GET_DEVICES )
    let json = await res.json( )
    // console.log( JSON.stringify( json, null, 4 ) )
    // return { devices: json.data.devices  }
    return { json }
}
