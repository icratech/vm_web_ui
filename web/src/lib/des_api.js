import { writable } from 'svelte/store'

export const auth_user = writable( { } )

export class AuthorizedUser {
    constructor(
        id = "",
        name = "",
        email = "",
        role = "",
        provider = "",
        created_at = Date.now( ),
        updated_at = Date.now( )
    ) {
        this.id = id,
        this.name = name
        this.email = email
        this.role = role
        this.provider = provider
        this.created_at = created_at
        this.updated_at = updated_at
    }
    setToken = ( token ) => {
        this.token = token
    }
}

const local = true
export const SERVER = ( local ? "http://127.0.0.1:8007" : "https://des.leehayford.com" )


export const API_URL_REGISTER_DEVICE =  `${ SERVER }/api/device/register`
export const API_URL_GET_DEVICES = `${ SERVER }/api/device/list`


export const load_get_devices = async( serverLoadEvent ) => {

    let req = new Request( API_URL_GET_DEVICES, { 
        method: 'GET',
        credentials: "include",
        headers: {
            "Authorization":  `Bearer ${ serverLoadEvent.cookies.get("des_token") }`, 
        },
    } )

    const { fetch } = serverLoadEvent
    let res = await fetch( req )
    let json = await res.json( )

    let resp = {
        status: json.status,
        message: json.message,
        devices: [],
    } 
    if ( resp.status == "success") { 
        resp.devices = json.data.devices 
    }
   
    return { resp }
}

export const load_get_device_by_serial = async( serverLoadEvent ) => {

    let req = new Request( `${ SERVER }/api/device/serial`, { 
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${ serverLoadEvent.cookies.get("des_token") }`, 
        },
        body:  JSON.stringify( { serial: serverLoadEvent.params.slug } )
    } )

    const { fetch } = serverLoadEvent
    let res = await fetch( req )
    let json = await res.json( )

    let resp = {
        status: json.status,
        message: json.message,
        device: { },
    } 
    if ( resp.status == "success") { 
        resp.device = json.data.device 
    }
   
    return { resp }
}

export const API_URL_REGISTER_JOB =  `${ SERVER }/api/job/register`
export const API_URL_JOBS =  `${ SERVER }/api/job/list`



export const device_class = "001"
export const device_version= "001"
export const demo_app = `C${ device_class }V${ device_version }_demo_app v0.0.0`
export const client_app = `C${ device_class }V${ device_version }_client_app v0.0.0`
/* 
HTTP DEVICE DATA STRUCTURE 
*/
export class DESRegistration {
    constructor( 
        /* DESDevice */
        des_dev_id = 0,

        des_dev_reg_time = 0,
        des_dev_reg_addr = "",
        des_dev_reg_user_id = "",
        des_dev_reg_app = client_app,

        des_dev_serial = "",
        des_dev_version = device_class,
        des_dev_class = device_version,

        /* DESJob */
        des_job_id = 0,

        des_job_reg_time = 0,
        des_job_reg_addr = "",
        des_job_reg_user_id = "",
        des_job_reg_app = "",

        des_job_name = "",
        des_job_start = 0,
        des_job_end = 0,
        des_job_dev_id = 0
     ) {
        /* DESDevice */
        this.des_dev_id = des_dev_id,

        this.des_dev_reg_time = des_dev_reg_time,
        this.des_dev_reg_addr = des_dev_reg_addr,
        this.des_dev_reg_user_id = des_dev_reg_user_id,
        this.des_dev_reg_app = des_dev_reg_app,

        this.des_dev_serial = des_dev_serial,
        this.des_dev_version = des_dev_version,
        this.des_dev_class = des_dev_class,

        /* DESJob */
        this.des_job_id = des_job_id,

        this.des_job_reg_time = des_job_reg_time,
        this.des_job_reg_addr = des_job_reg_addr,
        this.des_job_reg_user_id = des_job_reg_user_id,
        this.des_job_reg_app = des_job_reg_app,

        this.des_job_name = des_job_name,
        this.des_job_start = des_job_start,
        this.des_job_end = des_job_end,
        this.des_job_dev_id = des_job_dev_id
    }

}
