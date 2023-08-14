import { writable } from 'svelte/store'

export const DEVICES = writable( [ ])

export const DEMO_DEVICES = writable( [ ] )

export const AUTH = writable( { } )
export const USERS = writable( [ ] )
export const EVENT_TYPES = writable( [ ] )


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
        this.token = ""
        this.logged_in = false
    }
    setToken = ( token ) => {
        this.token = token
    }
}

const local = false
export const SERVER = ( local ? "://127.0.0.1:8007" : "://des.leehayford.com" )
export const HTTP_SERVER = ( local ? `http${ SERVER }` : `https${ SERVER }` )
export const WS_SERVER = ( local ? `ws${ SERVER }` : `wss${ SERVER }` )

export const API_URL_USER_LIST =  `${ HTTP_SERVER }/user`
export const get_users = async( ) => {

    let req = new Request( API_URL_USER_LIST, { method: 'GET' } )
    let res = await fetch( req )
    let json = await res.json( ) 
    console.log( `${ API_URL_USER_LIST }: ${ JSON.stringify( json, null, 4 ) }\n` )
    return json.data.users
}

export const API_URL_C001_V001_JOB_EVENT_TYPE_LIST =  `${ HTTP_SERVER }/api/001/001/job/event/list`
export const get_event_types = async( ) => {
    
    let req = new Request( API_URL_C001_V001_JOB_EVENT_TYPE_LIST, { method: 'GET' } )
    let res = await fetch( req )
    let json = await res.json( ) // console.log( `${ API_URL_C001_V001_JOB_EVENT_TYPE_LIST }: ${ JSON.stringify( json, null, 4 ) }\n` )

    return json.data.event_types
}

export const API_URL_C001_V001_DEVICE_REGISTER =  `${ HTTP_SERVER }/api/001/001/device/register`
export const API_URL_C001_V001_DEVICE_LIST =  `${ HTTP_SERVER }/api/001/001/device/list`
export const API_URL_C001_V001_DEVICE_USER_WS =  `${ WS_SERVER }/api/001/001/device/ws`
export const API_URL_GET_RUN_DEMO_SIM = `${ WS_SERVER }/api/001/001/demo/sim` 

// export const API_URL_REGISTER_DEVICE =  `${ SERVER }/api/device/register`
export const API_URL_GET_DEVICES = `${ HTTP_SERVER }/api/device/list`
export const API_URL_GET_DEVICE_BY_SN = `${ HTTP_SERVER }/api/device/serial` 

export const load_get_devices = async( serverLoadEvent ) => {

    let req = new Request( API_URL_C001_V001_DEVICE_LIST, { 
        method: 'GET',
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
    // console.log( `./devices: ${ JSON.stringify( resp.devices, null, 4 ) }\n` )
    resp.devices.sort( ( a, b ) => b.reg.des_dev_id - a.reg.des_dev_id )
    return { resp }
}

export const load_get_device_by_serial = async( serverLoadEvent ) => {

    let reg = new DESRegistration( )
    reg.des_dev_serial = serverLoadEvent.params.slug

    let req = new Request( API_URL_GET_DEVICE_BY_SN, { 
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${ serverLoadEvent.cookies.get("des_token") }`, 
        },
        body:  JSON.stringify( reg )
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

// export const API_URL_REGISTER_JOB =  `${ SERVER }/api/job/register`
export const API_URL_GET_JOBS =  `${ HTTP_SERVER }/api/job/list`
export const API_URL_GET_JOB_BY_NAME = `${ HTTP_SERVER }/api/job/name` 

export const load_get_jobs = async( serverLoadEvent ) => {

    let req = new Request( API_URL_GET_JOBS, { 
        method: 'GET',
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
        jobs: [],
    } 
    if ( resp.status == "success") { 
        resp.jobs = json.data.jobs 
    }
   
    return { resp }
}

export const load_get_job_by_name = async( serverLoadEvent ) => {

    let reg = new DESRegistration( )
    reg.des_job_name = serverLoadEvent.params.slug

    let req = new Request( API_URL_GET_JOB_BY_NAME, { 
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization":  `Bearer ${ serverLoadEvent.cookies.get("des_token") }`, 
        },
        body:  JSON.stringify( reg )
    } )

    const { fetch } = serverLoadEvent
    let res = await fetch( req )
    let json = await res.json( )

    let resp = {
        status: json.status,
        message: json.message,
        job: { },
    } 
    if ( resp.status == "success") { 
        resp.job = json.data.job 
    }
   
    return { resp }
}



export const device_class = "001"
export const device_version= "001"
export const demo_app = `C${ device_class }V${ device_version }_demo_app v0.0.0`
export const client_app = `C${ device_class }V${ device_version }_client_app v0.0.0`

export class User {
    constructor(
        id = "",
        name = "",
        email = "",
        role = "",
        provider = "",
        photo = "",
        created_at = 1691762552703,
        updated_at = 1691762552703
    ) {
        this.id  = id
        this.name = name
        this.email = email
        this.role = role,
        this.provider = provider
        this.photo = photo
        this.created_at = created_at
        this.updated_at = updated_at
    }
}
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

export class Device {
    constructor( 
        job = new Job( ),
        reg = new DESRegistration( ), 
    ) { 
        this.job = job
        this.reg = reg 
        this.socket = false
        this.sample = new Sample( )
    }
    
    update( ) {
        let devices
        const unsub = DEVICES.subscribe( ( v ) => { devices = v } )
        unsub( )
        DEVICES.update( ( ) => { return [ ...devices ] } )
    }

    /* WS CONNECTION */
    disconnectWS( ) { }
    connectWS( user ) {
        let reg = encodeURIComponent(JSON.stringify( this.reg ) )
        let url = `${ API_URL_C001_V001_DEVICE_USER_WS }?access_token=${ user.token }&des_reg=${ reg }`
        const ws = new WebSocket( url )
        ws.onopen = ( e ) => { console.log( "class Device -> WebSocket OPEN" )  }
        ws.onerror = ( e ) => { 
            ws.close( )
            this.socket = true
            console.log( `class Device -> ${ this.reg.des_dev_serial } -> WebSocket ERROR\n${ JSON.stringify( e )  }\n` ) 
            this.update( ) 
        }
        ws.onmessage = ( e ) => {

            let msg = JSON.parse( JSON.parse( e.data ) )
            // console.log( msg )
            switch ( msg.type ) {

                case "sample":
                    if ( this.job.samples ) {
                        this.job.samples.push( msg.data )
                    } else {
                        this.job.samples = [ msg.data ]
                    }
                    this.sample = msg.data
                    // console.log( `msg.data.sample:\n${ msg.data }` )
                    // this.updateChartData()
                    break

                case "event":
                    this.event = msg.data
                    break
    
                case "config":
                    this.config = msg.data
                    break
            
                case "admin":
                    this.admin = msg.data
                    break
            
                default: 
                    console.log( `Type unknown:\n${ e.data }\n` )
                    break
            }
            
            // console.log( `class Device -> ${ this.reg.des_dev_serial } ONMESSAGE:\n`, msg.data )
            this.update( )
        } 
        this.socket = true
        
        this.disconnectWS =  ( ) => {
            ws.send( "close" )
            ws.close( ) 
            this.socket = false
            console.log( `class Device -> ${ this.reg.des_dev_serial } -> WebSocket CLOSED` ) 
            this.update( )
        }

        this.update( )
    }

}

/* JOB DATA STRUCTURES ********************************************************************************/

export class Job {
    constructor(
        admins = [ ],
        configs = [ ],
        events = [ ],
        samples = [ ],
        xypoints = [ ],
        reg = new DESRegistration( ),
    ) {
        this.admins = admins
        this.configs = configs
        this.events = events
        this.samples = samples
        this.xypoints = xypoints
        this.reg = reg
    }
}

/* 
WEB CLIENT -> HTTP -> DES -> MQTT -> DEVICE  
  - Device updates its administration settings
  - Device returns new administration settings
WEB CLIENT <- HTTP <- DES <- MQTT <- DEVICE  
*/
export class Admin {
    constructor( 
        adm_id = 0, // Set by DES upon database write

        adm_time = 0,
        adm_addr = "",
        adm_user_id = "",
        adm_app =client_app,
    
        adm_def_host = "",
        adm_def_port = 0,
        adm_op_host = "",
        adm_op_port = 0,
    
        adm_class = device_class,
        adm_version = device_version,
        adm_serial = "",
    
        adm_bat_hi_amp = 2.5, // Amps
        adm_bat_lo_volt = 10.5, // Volts
    
        adm_mot_hi_amp = 1.9, // Amps
    
        // adm_tilt_tgt = 90.0, // °
        // adm_tilt_mgn = 3.0, // °
        // adm_azim_tgt = 180.0, // °
        // adm_azim_mgn = 3.0, // °
    
        adm_hfs_flow = 200.0, // L/min
        adm_hfs_flow_min =150.0, // L/min
        adm_hfs_flow_max = 250.0, // L/min
        adm_hfs_press =160.0, // psia
        adm_hfs_press_min = 23.0, // psia
        adm_hfs_press_max = 200.0, // psia
        adm_hfs_diff = 65.0, // psi
        adm_hfs_diff_min = 10.0, // psi
        adm_hfs_diff_max = 75.0, // psi
    
        adm_lfs_flow = 1.85, // L/min
        adm_lfs_flow_min = 0.5, // L/min
        adm_lfs_flow_max = 2.0, // L/min
        adm_lfs_press = 60.0, // psia
        adm_lfs_press_min = 20.0, // psia
        adm_lfs_press_max = 80.0, // psia
        adm_lfs_diff = 9.0, // psi
        adm_lfs_diff_min = 2.0, // psi
        adm_lfs_diff_max = 10.0, // psi
     ) {
        this.adm_id = adm_id, // Set by DES upon database write

        this.adm_time = adm_time,
        this.adm_addr = adm_addr,
        this.adm_user_id = adm_user_id,
        this.adm_app = adm_app,
    
        this.adm_def_host = adm_def_host,
        this.adm_def_port = adm_def_port,
        this.adm_op_host = adm_op_host,
        this.adm_op_port = adm_op_port,
    
        this.adm_class = adm_class,
        this.adm_version = adm_version,
        this.adm_serial = adm_serial,
    
        this.adm_bat_hi_amp = adm_bat_hi_amp, // Amps
        this.adm_bat_lo_volt = adm_bat_lo_volt, // Volts
    
        this.adm_mot_hi_amp = adm_mot_hi_amp, // Amps
    
        // this.adm_tilt_tgt = adm_tilt_tgt, // °
        // this.adm_tilt_mgn = adm_tilt_mgn, // °
        // this.adm_azim_tgt = adm_azim_tgt, // °
        // this.adm_azim_mgn = adm_azim_mgn, // °
    
        this.adm_hfs_flow = adm_hfs_flow, // L/min
        this.adm_hfs_flow_min =adm_hfs_flow_min, // L/min
        this.adm_hfs_flow_max = adm_hfs_flow_max, // L/min
        this.adm_hfs_press = adm_hfs_press, // psia
        this.adm_hfs_press_min = adm_hfs_press_min, // psia
        this.adm_hfs_press_max = adm_hfs_press_max, // psia
        this.adm_hfs_diff = adm_hfs_diff, // psi
        this.adm_hfs_diff_min = adm_hfs_diff_min, // psi
        this.adm_hfs_diff_max = adm_hfs_diff_max, // psi
    
        this.adm_lfs_flow = adm_lfs_flow, // L/min
        this.adm_lfs_flow_min = adm_lfs_flow_min, // L/min
        this.adm_lfs_flow_max = adm_lfs_flow_max, // L/min
        this.adm_lfs_press = adm_lfs_press, // psia
        this.adm_lfs_press_min = adm_lfs_press_min, // psia
        this.adm_lfs_press_max = adm_lfs_press_max, // psia
        this.adm_lfs_diff = adm_lfs_diff, // psi
        this.adm_lfs_diff_min = adm_lfs_diff_min, // psi
        this.adm_lfs_diff_max = adm_lfs_diff_max // psi
    }
}

/* 
WEB CLIENT -> HTTP -> DES ( LOG ) -> MQTT -> DEVICE  
  - Device updates its configuration settings
  - Device returns new configuration settings
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
*/
export class Config {
    constructor( 
        cfg_id = 0, // Set by DES upon database write

        cfg_time = 0, 
        cfg_addr = "",  
        cfg_user_id = "",
        cfg_app = "",
    
        cfg_job_name = "",
        cfg_job_start = 0,
        cfg_job_end = 0, 
        cfg_scvd = 596.8, // m
        cfg_scvd_mult = 10.5, // kPa / m
        cfg_ssp_rate = 1.95, // kPa / hour
        cfg_ssp_dur = 6.0, // hour
        cfg_hi_scvf = 201.4, //  L/min ( 290 m3/day )
        cfg_flow_tog = 1.75, //  L/min 
    
        cfg_vlv_tgt = 2, // vent
        cfg_vlv_pos = 2, // vent
    
        cfg_op_sample = 1000, // milliseconds
        cfg_op_log = 10000, // milliseconds
        cfg_op_trans = 60000, // milliseconds
        
        cfg_diag_sample = 10000, // milliseconds
        cfg_diag_log = 100000, // milliseconds
        cfg_diag_trans = 600000, // milliseconds
     ) {
        this.cfg_id = cfg_id // Set by DES upon database write
    
        this.cfg_time = cfg_time
        this.cfg_addr = cfg_addr
        this.cfg_user_id = cfg_user_id
        this.cfg_app = cfg_app
    
        this.cfg_job_name = cfg_job_name
        this.cfg_job_start = cfg_job_start
        this.cfg_job_end = cfg_job_end 
        this.cfg_scvd = cfg_scvd // m
        this.cfg_scvd_mult = cfg_scvd_mult // kPa / m
        this.cfg_ssp_rate = cfg_ssp_rate // kPa / hour
        this.cfg_ssp_dur = cfg_ssp_dur // hour
        this.cfg_hi_scvf = cfg_hi_scvf //  L/min ( 290 m3/day )
        this.cfg_flow_tog = cfg_flow_tog //  L/min 
    
        this.cfg_vlv_tgt = cfg_vlv_tgt // vent
        this.cfg_vlv_pos = cfg_vlv_pos // vent
    
        this.cfg_op_sample = cfg_op_sample // milliseconds
        this.cfg_op_log = cfg_op_log // milliseconds
        this.cfg_op_trans = cfg_op_trans // milliseconds
        
        this.cfg_diag_sample = cfg_diag_sample // milliseconds
        this.cfg_diag_log = cfg_diag_log // milliseconds
        this.cfg_diag_trans = cfg_diag_trans // milliseconds
    }
}

/* 
WEB CLIENT -> HTTP -> DES ( JOB DB WRITE ) -> MQTT -> DEVICE  
  - Device loggs event to as is memory ( no reponse )
  
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has encountered an alarm / logged an event
*/
export class Event {
    constructor( 
        evt_id = 0, // Set by DES upon database write
        evt_time = 0,
        evt_addr = "",
        evt_user_id = "",
        evt_app = "",
        evt_type_id = 0,
        evt_title = "",
        evt_msg = "" 
    ) {
        this.evt_id = evt_id // Set by DES upon database write
        this.evt_time = evt_time
        this.evt_addr = evt_addr
        this.evt_user_id = evt_user_id
        this.evt_app = evt_app
        this.evt_type_id = evt_type_id
        this.evt_title = evt_title
        this.evt_msg = evt_msg
    }
}
export class EventType {
    constructor(
        evt_type_id = 0,
        evt_type_code = 0,
        evt_typ_name = "",
        evt_typ_desc = "",
    ) {
        this.evt_type_id = evt_type_id
        this.evt_type_code = evt_type_code
        this.evt_typ_name = evt_typ_name
        this.evt_typ_desc = evt_typ_desc
    }
}
/* 
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has transmitted a sample
*/
export class Sample {
    constructor ( 
        smp_id = 0,
        smp_time = 0,
        smp_ch4 = 100.0,
        smp_hi_flow = 250.0,
        smp_lo_flow = 2.0,
        smp_press = 1500.0,
        smp_bat_amp = 0.35,
        smp_bat_volt = 12.5,
        smp_mot_volt = 12.0,
        smp_vlv_tgt = 2,
        smp_vlv_pos = 2,
        smp_job_name =""
    ) { 
        this.smp_id = smp_id
        this.smp_time = smp_time
        this.smp_ch4 = smp_ch4
        this.smp_hi_flow = smp_hi_flow
        this.smp_lo_flow = smp_lo_flow
        this.smp_press = smp_press
        this.smp_bat_amp = smp_bat_amp
        this.smp_bat_volt = smp_bat_volt
        this.smp_mot_volt = smp_mot_volt
        this.smp_vlv_tgt = smp_vlv_tgt
        this.smp_vlv_pos = smp_vlv_pos
        this.smp_job_name =smp_job_name
    }
}

/* 
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has transmitted a diagnostic sample
*/
export class DiagSample { /* NOT IMPLEMENTED */
    /* NOT IMPLEMENTED */
}


/* 
DEMO! - NOT FOR PRODUCTION 
*/
export class DemoDevice {
    constructor( 
        dev = new Device( ), 
        sim = new Sim( ),
    ) { 
        this.dev = dev
        this.sim = sim
    }

    update( ) {
        let demos
        const unsub = DEMO_DEVICES.subscribe( ( v ) => { demos = v } )
        unsub( )
        DEMO_DEVICES.update( ( ) => { return [ ...demos ] } )
    }

   disconnectSIM( ) { /* DEMO! - NOT FOR PRODUCTION */ } 
   connectSIM( user ) { /* DEMO! - NOT FOR PRODUCTION */

        let sim_js = encodeURIComponent(JSON.stringify( this.sim ) )
        let reg_js = encodeURIComponent(JSON.stringify( this.dev.reg ) ) 
        let url = `${ API_URL_GET_RUN_DEMO_SIM }?access_token=${ user.token }&sim=${ sim_js }&des_reg=${ reg_js }`

        console.log( `connectSIM( ) ->  this.dev: ${ JSON.stringify( this.dev.reg.des_dev_serial, null, 4 ) }`  )
        let ws = new WebSocket( url )

        ws.onopen = ( e ) => { console.log( "class DemoDevice -> WebSocket OPEN" )  }
        ws.onerror = ( e ) => {
            ws.close( )
            this.sim.run = false
            console.log( `class DemoDevice -> ${ this.dev.reg.des_dev_serial } ONERROR:\n`, JSON.stringify( e ) )
            this.update( )
        }
        ws.onmessage = ( msg ) => {
        
            let data =  JSON.parse( JSON.parse( msg.data ) )
            console.log( `class DemoDevice: ${ this.dev.reg.des_dev_serial } ONMESSAGE:\n`, data )
            this.update( )
        } 
        this.sim.run = true
       
        this.disconnectSIM = ( ) => { 
                ws.send( "close" )
                ws.close( ) 
                this.sim.run = false
                console.log( `class DemoDevice -> ${ this.dev.reg.des_dev_serial } -> WebSocket CLOSED: -> sim ${ this.sim.run }\n` )
                this.update( )
        }
        this.update( )
   }
}

export class Sim {
    constructor(
	    qty = 10,
	    dur = 2000,
	    fillQty = 1,
        run = false,
    ) {
        this.qty = qty
        this.dur = dur
        this.fillQty = fillQty
        this.run = run
    }
}
