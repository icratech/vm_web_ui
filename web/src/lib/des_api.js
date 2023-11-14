import { writable, get } from 'svelte/store'
import { goto } from '$app/navigation'
import mapboxgl from 'mapbox-gl'
import { BASE, RGBA } from './common/colors'
import { FormatDateTime } from "./common/format"
import { getRelativePosition } from 'chart.js/helpers'

export const openModals = ( initial ) => {
    const isOpen = writable( initial )
    const { set, update } = isOpen
    return {
        isOpen,
        open: ( ) => set( true ),
        close: ( ) => set( false ),
        toggle: ( ) => update( ( n ) => !n ),
    }
}
export const waitMilli = ( ms ) => new Promise( ( res ) => setTimeout( res, ms ) )

export const AUTH = writable( { } )

export const DEVICES = writable( [ ] )
export const DEVICES_LOADED = writable( false )
export const updateDevicesStore = async( ) => { DEVICES.update( ( ) => { return [ ...get(DEVICES) ] } ) }

export const DEMO_DEVICES = writable( [ ] )

export const JOBS = writable( [ ] )
export const JOBS_LOADED = writable( false )
export const updateJobsStore = ( ) => { JOBS.update( ( ) => { return [ ...get(JOBS) ] } ) }

export const device_class = "001"
export const device_version= "001"
export const client_app = `C${ device_class }V${ device_version }_client_app v0.0.0`

/* TODO : REPLACE WITH ENV VARIABLES FOR PRODUCTION */
const local = true
export const SERVER = ( local ? "://127.0.0.1:8007" : "://des1.data2desk.com" )
export const HTTP_SERVER = ( local ? `http${ SERVER }` : `https${ SERVER }` )
export const WS_SERVER = ( local ? `ws${ SERVER }` : `wss${ SERVER }` ) 

export const debugging = true
export const debug = ( msg, obj ) => {
    if ( debugging ) console.log( msg, obj )
}

/* DES API ROUTES *************************************************************************************/

export const API_URL_USE_SIGNUP =  `${ HTTP_SERVER }/api/user/signup`
export const sign_up_user = async( usu ) => {

    let req = new Request(API_URL_USE_SIGNUP, { 
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify( usu ) 
    } )
    let res = await fetch( req )
    let auth = await res.json( )
    debug(`"\ndes_api.js -> sign_up_user( ) ->  RESPONSE -> \n${ JSON.stringify( auth, null, 4 ) }`)

    if ( auth.status === "success" ) { 
        await login( usu.email, usu.password )
    } else {
        debug( "\n SIGN-UP FAILED: \n", auth.message )
    }
}

export const API_URL_USER_LIST =  `${ HTTP_SERVER }/api/user/list`
export const get_user_list = async( ) => {
    debug( `des_api.js -> get_user_list( )` )

    let req = new Request( API_URL_USER_LIST, { method: 'GET' } )
    let res = await fetch( req )
    let json = await res.json( )
    
    // debug( `des_api.js -> get_users( ): users\n${ JSON.stringify( json.data.users, null, 4 ) }` )
    sessionStorage.setItem( "users", JSON.stringify( json.data.users ) ) 

    return json.data.users
}

export const API_URL_USER_LOGIN = `${ HTTP_SERVER }/api/user/login`
export const login = async( email, password ) => {

    let req = new Request(API_URL_USER_LOGIN, { 
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify( { email, password } ) 
    } )
    let res = await fetch( req )
    let auth = await res.json( )
    debug(`"\nAppHeader: login -> RESPONSE -> auth\n${ JSON.stringify( auth, null, 4 ) }`)

    if ( auth.status === "success" ) { 
        debug(`\nAppHeader: login -> SUCCESS:\n${ auth.token }\n` )
        sessionStorage.setItem( 'des_token', auth.token, { path: '/' } )
        /* TODO: ADD / TEST REFRESH */
    } else {
        debug( "\n AUTH FAILED: \n", auth.message )
    }
    await get_user( auth.token )

    if ( get(AUTH).role == 'admin' && !get(DEVICES_LOADED) ) { await get_devices( )  }
    if ( get(AUTH).role == 'admin' && !get(JOBS_LOADED) ) { await get_jobs( )  }
}

export const API_URL_USER_LOGOUT = `${ HTTP_SERVER }/api/user/logout`
export const logout = async( ) => {

    /* DISCONNECT ALL DEVICE WS ON LOGOUT */
    get( DEVICES ).forEach( async( dev ) => { await dev.disconnectWS( ) } )

    let au = get( AUTH )

    let req = new Request( API_URL_USER_LOGOUT, { 
        method: "GET",
        headers: { 'Authorization': `Bearer ${ au.token }` }, 
        credentials: "include"   
    } )
    let res = await fetch( req )
    let logout_res = await res.json( ) 
    debug( `des_api.js -> logout( ) -> RESPONSE -> logout_res:\n${ JSON.stringify( logout_res, null, 4 ) }` )

    sessionStorage.setItem( 'des_token', 'none', { path: '/' } )
    AUTH.set( new User( ) ) 

    debug(`"\ndes_api.js -> logout( ) -> LOGGED OUT! -> $AUTH\n${ JSON.stringify( get(AUTH) ) }`)
}

export const API_URL_USER_ME = `${ HTTP_SERVER }/api/user/me`
export const get_user = async( token ) => {

    // let token = sessionStorage.getItem( 'des_token' )

    let user_res = await fetch( API_URL_USER_ME, { 
            method: "GET",
            headers: { 'Authorization': `Bearer ${ token }`}      
        } 
    )
    let usr = await user_res.json() 

    if ( usr.status == "success" ) {

        AUTH.set( new User(
            usr.data.user.id, 
            usr.data.user.name, 
            usr.data.user.email, 
            usr.data.user.role,
            usr.data.user.provider, 
            usr.data.user.created_at, 
            usr.data.user.updated_at,
            token,
            true
        ) ) // debug("\ndes_api.js -> get_user( ) -> AUTHENTICATION SUCCESS!\n" )
    } 
    else {

        AUTH.set( new User( ) )
        sessionStorage.setItem( 'des_token', 'none', { path: '/' } )
        // debug("\ndes_api.js -> get_user( ) -> AUTHENTICATION FAILED!\n" ) 
    }
    
    debug("\ndes_api.js -> get_user( ) -> AUTH: \n", get( AUTH ) )
}

/* DEVICE API ROUTES **********************************************************************************/
export const API_URL_C001_V001_DEVICE_REGISTER =  `${ HTTP_SERVER }/api/001/001/device/register`
export const API_URL_C001_V001_DEVICE_START =  `${ HTTP_SERVER }/api/001/001/device/start`
export const API_URL_C001_V001_DEVICE_CANCEL_START =  `${ HTTP_SERVER }/api/001/001/device/cancel_start`
export const API_URL_C001_V001_DEVICE_END =  `${ HTTP_SERVER }/api/001/001/device/end`
export const API_URL_C001_V001_DEVICE_ADM =  `${ HTTP_SERVER }/api/001/001/device/admin`
export const API_URL_C001_V001_DEVICE_STA =  `${ HTTP_SERVER }/api/001/001/device/state`
export const API_URL_C001_V001_DEVICE_HDR =  `${ HTTP_SERVER }/api/001/001/device/header`
export const API_URL_C001_V001_DEVICE_CFG =  `${ HTTP_SERVER }/api/001/001/device/config`
export const API_URL_C001_V001_DEVICE_EVT =  `${ HTTP_SERVER }/api/001/001/device/event`
export const API_URL_C001_V001_DEVICE_LIST =  `${ HTTP_SERVER }/api/001/001/device/list`
export const API_URL_C001_V001_DEVICE_USER_WS =  `${ WS_SERVER }/api/001/001/device/ws`

export const register_device = async( serial ) => {

    let au = get( AUTH )
    let reg = new DESRegistration( )

    reg.des_dev_serial = serial
    reg.des_dev_reg_user_id = au.id
    reg.des_dev_reg_app = client_app
    debug("des_api.js -> register_device( ) -> REQUEST reg:\n", reg )

    let req = new Request( API_URL_C001_V001_DEVICE_REGISTER, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ au.token }` 
        },
        body: JSON.stringify( reg )
    } )
    let res = await fetch( req )
    reg = await res.json( )
    debug("des_api.js -> register_device( ) ->  RESPONSE reg:\n", reg )
    
    if ( reg.status === "success" ) { 
        debug("REGISTER DEVICE Request -> SUCCESS:\n", reg.des_dev_serial )
    }

    await get_devices( )
}

export const get_devices = async( ) => {

    let au = get( AUTH )
    debug("\ndes_api.js -> get_devices( ) -> AUTH: \n", au )

    DEVICES_LOADED.set( false )
    let req = new Request( API_URL_C001_V001_DEVICE_LIST, { 
        method: 'GET',
        headers: {
            "Authorization":  `Bearer ${ au.token }`, 
        },
    } )

    let res = await fetch( req )
    let json = await res.json( )

    if ( json.status == "success") { 

        let store = get( DEVICES )
        let devs = json.data.devices 
        // debug( "get_devices( ) -> response:\n", devs )
        
        devs.forEach( dev => {
            if( store.filter( s => { return s.reg.des_dev_serial == dev.reg.des_dev_serial } )[0] == undefined ) {
                let device = new Device(
                    dev.adm,
                    dev.sta,
                    dev.hdr,
                    dev.cfg,
                    dev.evt,
                    dev.smp,
                    dev.reg
                )
                DEVICES.update( sdevs => { return [ ...sdevs, device ] } )
            }        
        } )
        await connect_devices( )

        get( DEVICES ).sort( ( a, b ) => b.reg.des_job_reg_time - a.reg.des_job_reg_time )
        DEVICES_LOADED.set( true )
        debug( "des_api.js -> get_devices( ) -> DEVICES: ", get( DEVICES ) )
    } else {
        debug( "des_api.js -> get_devices( ) -> NO DEVICES." )
    }

}

export const connect_devices = async( ) => { 
    get( DEVICES ).forEach( async( d ) => { if ( !d.socket ) { await d.connectWS( ) } } )
}

/* JOB API ROUTES *************************************************************************************/

export const API_URL_C001_V001_JOB_EVENT_TYPE_LIST =  `${ HTTP_SERVER }/api/001/001/job/event/list`
export const API_URL_C001_V001_JOB_LIST = `${ HTTP_SERVER }/api/001/001/job/list`
export const API_URL_C001_V001_JOB_DATA = `${ HTTP_SERVER }/api/001/001/job/data`
export const API_URL_C001_V001_JOB_NEW_REPORT =  `${ HTTP_SERVER }/api/001/001/job/new_report`
export const API_URL_C001_V001_JOB_NEW_HDR = `${ HTTP_SERVER }/api/001/001/job/new_header`
export const API_URL_C001_V001_JOB_NEW_EVT = `${ HTTP_SERVER }/api/001/001/job/new_event`

export const get_event_types = async( ) => {
    debug( `des_api.js -> get_event_types( )` )
    let req = new Request( API_URL_C001_V001_JOB_EVENT_TYPE_LIST, { method: 'GET' } )
    let res = await fetch( req )
    let json = await res.json( )
    
    // debug( `des_api.js -> get_event_types( ): event_types\n${ JSON.stringify( json.data.event_types, null, 4 ) }` )
    sessionStorage.setItem( "event_types", JSON.stringify( json.data.event_types ) ) 

    return json.data.event_types
}

export const get_jobs = async( ) => { 

    let au = get( AUTH )

    JOBS_LOADED.set( false )
    let req = new Request( API_URL_C001_V001_JOB_LIST, { 
        method: 'GET',
        headers: {
            "Authorization":  `Bearer ${ au.token }`, 
        },
    } )

    let res = await fetch( req )
    let json = await res.json( )

    if ( json.status == "success") { 

        let store = get( JOBS )
        let jobs = json.data.jobs
        // debug( "get_jobs( ) -> response:\n", jobs )

        jobs.forEach( j => {
            if ( store.filter( s =>{ return s.reg.des_job_name == j.reg.des_job_name } )[0] == undefined ) {
                let job = new Job(
                    j.admins,
                    j.states,
                    j.headers,
                    j.configs,
                    j.events,
                    j.samples,
                    j.xypoints,
                    j.reports,
                    j.reg,
                )
                JOBS.update( sjobs => { return [ ...sjobs, job ] } )
            }
        } )

        get( JOBS ).sort( ( a, b ) => b.reg.des_job_reg_time - a.reg.des_job_reg_time )
        JOBS_LOADED.set( true )
        debug( "des_api.js -> get_jobs( ) -> JOBS: ", get( JOBS ) )
    } else {
        debug( "des_api.js -> get_jobs( ) -> NO JOBS." )
    }
}

/* NOT IMPLEMENTED */
export const API_URL_C001_V001_JOB_SEARCH =  `${ HTTP_SERVER }/api/001/001/job/search`
export const search_jobs = async( params ) => {

    debug("search_jobs( ) -> params: ", params )
    let au = get( AUTH )

    DEVICES_LOADED.set( false )
    DEVICES.update( d => { return [ ] } )
    let req = new Request( API_URL_C001_V001_JOB_SEARCH, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${ au.token }` 
        },
        body: JSON.stringify( params )
    } )
    let res = await fetch( req )
    let json = await res.json( )

    if ( json.status == "success") { 
        debug( "search_jobs( ) -> response:\n", json.data.jobs )
    } 
}


/* DES DATA STRUCTURES  *****************************************************************************/
export class User {
    constructor(
        id = "",
        name = "",
        email = "",
        role = "",
        provider = "",
        created_at = 0,
        updated_at = 0,
        token = "none",
        logged_in = false
    ) {
        this.id  = id
        this.name = name
        this.email = email
        this.role = role,
        this.provider = provider
        this.created_at = created_at
        this.updated_at = updated_at
        this.token = token
        this.logged_in = logged_in
    }
}

export class UserSignUp {
    constructor(
        name = "",
        email = "",
        password = "",
        password_confirm = "",
    ) {
        this.name = name
        this.email = email
        this.password = password
        this.password_confirm = password_confirm
    }
}

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
        des_job_lng = -180,
        des_job_lat = 90,
        des_job_dev_id = 0,

        /* DESJobSearch */
        des_job_search_id = 0,
        des_job_token = "",
        des_job_json = "",
        des_job_key = 0

    ) {
        /* DESDevice */
        this.des_dev_id = des_dev_id

        this.des_dev_reg_time = des_dev_reg_time
        this.des_dev_reg_addr = des_dev_reg_addr
        this.des_dev_reg_user_id = des_dev_reg_user_id
        this.des_dev_reg_app = des_dev_reg_app

        this.des_dev_serial = des_dev_serial
        this.des_dev_version = des_dev_version
        this.des_dev_class = des_dev_class

        /* DESJob */
        this.des_job_id = des_job_id

        this.des_job_reg_time = des_job_reg_time
        this.des_job_reg_addr = des_job_reg_addr
        this.des_job_reg_user_id = des_job_reg_user_id
        this.des_job_reg_app = des_job_reg_app

        this.des_job_name = des_job_name
        this.des_job_start = des_job_start
        this.des_job_end = des_job_end
        this.des_job_lng = des_job_lng
        this.des_job_lat = des_job_lat
        this.des_job_dev_id = des_job_dev_id

        /* DESJobSearch */
        this.des_job_search_id = des_job_search_id

        this.des_job_token = des_job_token
        this.des_job_json = des_job_json
        this.des_job_key = des_job_key
    }

}

export class DESSearchParam {
    constructor(
        token = "",
        lng_min = -180.0,
        lng_max = 180.0,
        lat_min = -90.0,
        lat_max = 90.0
    ) {
        this.token = token
        this.lng_min = lng_min
        this.lng_max = lng_max
        this.lat_min = lat_min
        this.lat_max = lat_max
    }
    getMapBounds( map ) { 
        // map.getBounds() returns LngLatBounds object 
        // https://docs.mapbox.com/mapbox-gl-js/api/geography/#lnglatbounds
        let b = map.getBounds( )
            this.lng_max = b._ne.lng
            this.lat_max = b._ne.lat
            this.lng_min = b._sw.lng
            this.lat_min = b._sw.lat
    }
}

/* DEVICE DATA STRUCTURE  *****************************************************************************/
export class Device {
    constructor( 
        adm = new Admin( ),
        sta = new State(),
        hdr = new Header( ),
        cfg = new Config( ),
        evt = new Event( ),
        smp = new Sample( ),
        reg = new DESRegistration( ), 
    ) { 
        this.adm = adm
        this.sta = sta
        this.hdr = hdr
        this.cfg = cfg
        this.evt = evt
        this.smp = smp
        this.reg = reg 

        /* WEB SOCKET CONNECTION STATUS */
        this.socket = false
        
        /* DEVICE SEARCH PAGE MAP MARKER HOVER EFFECT */
        this.highlight = false

        /* MAP DATA ( LIVE ) *****************************************************************/
        /** https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker */
        /* DEVICE PAGE MAP MARKER */
        this.mark_el = document.createElement('div')
        this.mark = new mapboxgl.Marker( 
            this.mark_el, { anchor: 'bottom-right' } ).setLngLat( [ this.hdr.hdr_geo_lng, this.hdr.hdr_geo_lat  ] ) 

        /* DEVICE SEARCH PAGE MAP MARKER */
        this.s_mark_el = document.createElement('div')
        this.s_mark_el.addEventListener('click', ( ) => { goto( '/device/' + this.reg.des_dev_serial ); this.highlight = false } )
        this.s_mark_el.addEventListener('mouseover', ( ) => { this.highlight = true; updateDevicesStore( ) } )
        this.s_mark_el.addEventListener('mouseleave', ( ) => { this.highlight = false; updateDevicesStore( ) } )
        this.s_mark = new mapboxgl.Marker( 
            this.s_mark_el, { anchor: 'bottom-right' } ).setLngLat( [ this.hdr.hdr_geo_lng, this.hdr.hdr_geo_lat  ] )

        this.resetChart( )
    }
    
    // /* TODO: ? MOVE THIS OUTSIDE OF THE DEVICE CLASS ? */
    // update( ) { DEVICES.update( ( ) => { return [ ...get(DEVICES) ] } ) }

    /* MAP METHODS ( LIVE ) **************************************************************/
    updateDeviceSearchMap( ) { }
    updateDevicePageMap( ) { }
    updateMarkerMode = ( ) => {
        // debug( this.reg.des_dev_serial + " updateMarkerMode( ) -> this..cfg.cfg_vlv_tgt: " + this.cfg.cfg_vlv_tgt ) 
        switch ( getMode( this.cfg, this.smp ) ) {

            case MODES.BUILD: 
                this.mark_el.className = 'marker build'; 
                this.s_mark_el.className = 'marker build'; 
                break;

            case MODES.VENT: 
                this.mark_el.className = 'marker vent'; 
                this.s_mark_el.className = 'marker vent'; 
                break

            case MODES.HI_FLOW: 
                this.mark_el.className = 'marker hi_flow'; 
                this.s_mark_el.className = 'marker hi_flow';
                break

            case MODES.LO_FLOW: 
                this.mark_el.className = 'marker lo_flow'; 
                this.s_mark_el.className = 'marker lo_flow'; 
                break
        }
    }

    /* CHART METHODS ( LIVE ) ************************************************************/
    updateChartData( ) {

        this.pushPoint( 
            { x: this.smp.smp_time, y: this.smp.smp_ch4 },
            this.cht_ch4, this.cht.options.scales.y_ch4,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.pushPoint( 
            { x: this.smp.smp_time, y: this.smp.smp_hi_flow },
            this.cht_hi_flow, this.cht.options.scales.y_hi_flow,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.pushPoint(
            { x: this.smp.smp_time, y: this.smp.smp_lo_flow },
            this.cht_lo_flow, this.cht.options.scales.y_lo_flow,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.pushPoint(
            { x: this.smp.smp_time, y: this.smp.smp_press },
            this.cht_press, this.cht.options.scales.y_press,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.pushPoint(
            { x: this.smp.smp_time, y: this.smp.smp_bat_amp },
            this.cht_bat_amp, this.cht.options.scales.y_bat_amp,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.pushPoint(
            { x: this.smp.smp_time, y: this.smp.smp_bat_volt },
            this.cht_bat_volt, this.cht.options.scales.y_bat_volt,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
        this.pushPoint(
            { x: this.smp.smp_time, y: this.smp.smp_mot_volt },
            this.cht_mot_volt, this.cht.options.scales.y_mot_volt,
            this.cht_point_limit,
            this.cht_scale_margin
        )
        
    }
    pushPoint( point, set = [ ], scale, limit, scale_margin ) {

        let len = set.data.push( point ) 
        for ( len; len > limit; len-- ) {
            set.data.shift( )
        }
        let x_min = set.data[0].x
        // let x_min = set.pushSample( limit, point )
        // let filt = set.data.filter( x => x.x >= x_min )
        // let Ys = filt.map( p => p.y )
        // let min = Math.min( ...Ys ) // debug( min )
        // let max = Math.max( ...Ys ) // debug( max )
        // if ( max - min > 0 ) {
        //     scale.min = min - ( ( max - min ) * scale_margin )
        //     scale.max = max +  ( ( max - min ) * scale_margin )
        // }    
        this.cht.options.scales.x.min = x_min
        this.cht.options.scales.x.max = point.x
    }
    resetChart( ) {
        /* CHART DATA ( LIVE ) **************************************************************/
        this.cht = NewChartData( )
        this.cht_select = this.cht.data.datasets[CHT_DATASET_INDEX_SELECT]
        this.cht_ch4 = this.cht.data.datasets[CHT_DATASET_INDEX_CH4]
        this.cht_hi_flow = this.cht.data.datasets[CHT_DATASET_INDEX_HI_FLOW]
        this.cht_lo_flow = this.cht.data.datasets[CHT_DATASET_INDEX_LO_FLOW]
        this.cht_press = this.cht.data.datasets[CHT_DATASET_INDEX__PRESS]
        this.cht_bat_amp = this.cht.data.datasets[CHT_DATASET_INDEX_BAT_AMP]
        this.cht_bat_volt = this.cht.data.datasets[CHT_DATASET_INDEX_BAT_VOLT]
        this.cht_mot_volt = this.cht.data.datasets[CHT_DATASET_INDEX_MOT_VOLT]
        this.cht_point_limit = 200
        this.cht_scale_margin = 0.2
    }

    /* WEBSOCKET METHODS **************************************************************/
    disconnectWS = async( ) => { }
    connectWS = async( ) => {

        let au = get( AUTH )
        // debug( `class Device -> ${ this.reg.des_dev_serial } -> connectWS( ) -> AUTH\n${ JSON.stringify( au )  }\n` )

        let reg = encodeURIComponent(JSON.stringify( this.reg ) )
        let url = `${ API_URL_C001_V001_DEVICE_USER_WS }?access_token=${ au.token }&des_reg=${ reg }`
        const ws = new WebSocket( url )
        ws.onopen = ( e ) => {  
            this.socket = true
            updateDevicesStore( )
            // debug( `class Device -> ${ this.reg.des_dev_serial } -> WebSocket OPEN` ) 
        }
        ws.onerror = ( e ) => { 
            ws.close( )
            this.socket = false
            updateDevicesStore( )
            // debug( `class Device -> ${ this.reg.des_dev_serial } -> ws.onerror ERROR\n${ JSON.stringify( e )  }\n` ) 
        }
        ws.onmessage = ( e ) => {

            let msg = JSON.parse( JSON.parse( e.data ) )
            switch ( msg.type ) {
            
                case "admin":
                    this.adm = msg.data
                    debug("new admin received from device: " + this.adm )
                    break

                case "state":
                    this.sta = msg.data
                    debug("new state received from device: " + this.sta)
                    this.reg.des_job_name = this.sta.sta_job_name
                    break
    
                case "header":
                    this.hdr = msg.data
                    debug("new header received from device: " + this.hdr)
                    this.reg.des_job_start = this.hdr.hdr_job_start
                    this.reg.des_job_end = this.hdr.hdr_job_end
                    this.reg.des_job_lng = this.hdr.hdr_geo_lng
                    this.reg.des_job_lat = this.hdr.hdr_geo_lat
                    this.updateDeviceSearchMap( this.hdr.hdr_geo_lng, this.hdr.hdr_geo_lat )
                    this.updateDevicePageMap( ( this.hdr.hdr_job_start > 0 && this.hdr.hdr_job_end == 0 ), this.hdr.hdr_geo_lng, this.hdr.hdr_geo_lat )
                    break

                case "config":
                    this.cfg = msg.data
                    this.updateMarkerMode( )
                    debug("new config received from device: " + this.cfg)
                    break
                
                case "event":
                    this.evt = msg.data
                    debug("new event received from device: " + this.evt)
                    break
    
                case "sample":
                    this.smp = msg.data
                    this.updateMarkerMode( )
      
                    if ( this.smp.smp_lo_flow < this.cfg.cfg_flow_tog ) {
                        this.cht.options.scales.y_lo_flow.display = true
                        this.cht_lo_flow.hidden = false

                        this.cht.options.scales.y_hi_flow.display = false
                        this.cht_hi_flow.hidden = true

                    } else {
                        this.cht.options.scales.y_lo_flow.display = false
                        this.cht_lo_flow.hidden = true

                        this.cht.options.scales.y_hi_flow.display = true
                        this.cht_hi_flow.hidden = false

                    }
                    // debug( `sample -> ${ this.reg.des_dev_serial }:\n` )
                    this.updateChartData( )
                    break

                case "live": break

                case "auth":
                    let auth = msg.data
                    if ( auth.status === "fail" && this.socket ) { this.disconnectWS( ) }
                    debug( auth.message ) 
                    break

                default: 
                    debug( `Type unknown:\n${ e.data }\n` )
                    break
            }
            
            // debug( `class Device -> ${ this.reg.des_dev_serial } ONMESSAGE:\n`, msg.data )
            updateDevicesStore( )
        } 
        this.disconnectWS =  async( ) => {
            ws.send( "close" )
            ws.close( ) 
            debug( `class Device -> ${ this.reg.des_dev_serial } -> WebSocket CLOSED` ) 
            this.socket = false
            this.highlight = false
            updateDevicesStore( )
        }
        await waitMilli(1000)
    }

    /* HTTP METHODS **********************************************************************/
    startJob = async( ) => {
        debug( "Start new job for device: ", this.reg.des_dev_serial ) 

        let au = get( AUTH )

        if ( !this.socket ) { await this.connectWS( ) }

        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            adm: this.adm,
            sta: this.sta,
            hdr: this.hdr,
            cfg: this.cfg,
            reg: this.reg
        }

        debug( "Send START JOB Request:\n", dev ) 
        let req = new Request( API_URL_C001_V001_DEVICE_START, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( dev )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug("des_api.js -> device.startJob( ) ->  RESPONSE reg:\n", reg )

        if ( reg.status === "success" ) { 
            debug("Start Job Request -> SUCCESS:\n", this.reg.des_dev_serial )
        }
    }
    cancelStartJob = async( ) => { 
        debug( "Cancel Start job request for device: ", this.reg.des_dev_serial ) 

        let au = get( AUTH )

        if ( !this.socket ) { await this.connectWS( ) }
      
        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app

        let dev = { reg: this.reg }

        debug( "Send CANCEL START JOB Request:\n", dev ) 
        let req = new Request( API_URL_C001_V001_DEVICE_CANCEL_START, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( dev )
        } )
        let res_raw = await fetch( req )
        let res = await res_raw.json( )
        debug("des_api.js -> device.cancelStartJob( ) ->  RESPONSE res:\n", res )

        if ( res.status === "success" ) { 
            debug("Cancel Start Job Request -> SUCCESS:\n", this.reg.des_dev_serial )
            this.sta = res.data.device.sta
        }
    }
    endJob = async( ) => {
        debug( "End current job for device: ", this.reg.des_dev_serial ) 

        let au = get( AUTH )

        if ( !this.socket ) { await this.connectWS( ) }

        this.hdr.hdr_job_end = -1
        this.reg.des_job_reg_app = client_app
        this.reg.des_job_reg_user_id = au.id
        let dev = {
            reg: this.reg
        }

        debug( "Send END JOB Request:\n", dev )  
        let req = new Request( API_URL_C001_V001_DEVICE_END, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( dev )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug(`des_api.js -> device.endJob( ${ this.reg.des_job_name } ) ->  RESPONSE reg:\n`, reg )
        
        if ( reg.status === "success" ) { 
            debug("End Job Request -> SUCCESS:\n", this.reg.des_dev_serial )
            this.smp = new Sample( )
            this.resetChart( )
        }
    }
    setAdmin = async( ) => {
        debug( "Set Admin for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.adm.adm_user_id = au.id
        this.adm.adm_app = client_app

        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            adm: this.adm,
            reg: this.reg
        }
        debug( "Send SET ADMIN Request:\n", dev ) 
        
        let req = new Request( API_URL_C001_V001_DEVICE_ADM, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( dev )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug("des_api.js -> device.setAdmin( ) ->  RESPONSE reg:\n", reg )

        if ( reg.status === "success" ) { 
            debug("SET ADMIN Request -> SUCCESS:\n", this.reg.des_dev_serial )
        }
    }
    setState = async( ) => {
        debug( "Set State for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.sta.sta_user_id = au.id
        this.sta.sta_app = client_app

        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            sta: this.sta,
            reg: this.reg
        }
        debug( "Send DEVICE SET STATE Request:\n", dev ) 
        
        let req = new Request( API_URL_C001_V001_DEVICE_STA, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( dev )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug("des_api.js -> device.setState( ) ->  RESPONSE reg:\n", reg )

        if ( reg.status === "success" ) { 
            debug("DEVICE SET STATE Request -> SUCCESS:\n", this.reg.des_dev_serial )
        }
    }
    setHeader = async( ) => {
        debug( "Set Header for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.hdr.hdr_user_id = au.id
        this.hdr.hdr_app = client_app

        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            hdr: this.hdr,
            reg: this.reg
        }
        debug( "Send DEVICE SET HEADER Request:\n", dev ) 
        
        let req = new Request( API_URL_C001_V001_DEVICE_HDR, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( dev )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug("des_api.js -> device.setHeader( ) ->  RESPONSE reg:\n", reg )

        if ( reg.status === "success" ) { 
            debug("DEVICE SET HEADER Request -> SUCCESS:\n", this.reg.des_dev_serial )
        }
    }
    setConfig = async( ) => { 
        debug( "Set Config for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.cfg.cfg_user_id = au.id
        this.cfg.cfg_app = client_app

        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app
        
        let dev = {
            cfg: this.cfg,
            reg: this.reg
        }
        debug( "Send SET CONFIG Request:\n", dev ) 
        
        let req = new Request( API_URL_C001_V001_DEVICE_CFG, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( dev )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug("des_api.js -> device.setConfig( ) ->  RESPONSE reg:\n", reg )

        if ( reg.status === "success" ) { 
            debug("SET CONFIG Request -> SUCCESS:\n", this.reg.des_dev_serial )
        }
    }
    setMode = ( mode ) => {
        this.cfg.cfg_vlv_tgt = mode
        this.cfg.cfg_vlv_pos = mode
        this.setConfig()
    }
    newEvent = async( evt ) => {
        debug( "Create Event for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        evt.evt_user_id = au.id
        evt.evt_app = client_app

        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            evt: evt,
            reg: this.reg
        }
        debug( "Send DEVICE CREATE EVENT Request:\n", dev ) 
        
        let req = new Request( API_URL_C001_V001_DEVICE_EVT, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( dev )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug("des_api.js -> device.createEvent( ) ->  RESPONSE reg:\n", reg )

        if ( reg.status === "success" ) { 
            debug("DEVICE CREATE EVENT Request -> SUCCESS:\n", this.reg.des_dev_serial )
        }
    }
}

/* OPERATION CODES ( Event.EvtCode 0 : 999 ) *******************************************************/
export const OP_CODES = {
    DES_REG_REQ: 0,    // USER REQUEST -> CHANGE DEVICE'S OPERATIONAL DATA EXCHANGE SERVER
    DES_REGISTERED: 1, // DEVICE RESPONSE -> SENT TO NEW DATA EXCHANGE SERVER
    JOB_ENDED: 2,      // DEVICE RESPONSE -> JOB ENDED
    JOB_START_REQ: 3,  // USER REQUEST -> START JOB
    JOB_STARTED: 4,    // DEVICE RESPONSE -> JOB STARTED
    JOB_END_REQ: 5    // USER REQUEST -> END JOB
}

/* MODE ( VALVE POSITIONS ) *************************************************************************/
export const MODES = {
    BUILD: 0,
    VENT: 2,
    HI_FLOW: 4,
    LO_FLOW: 6
}
export const getMode = ( cfg, smp ) => {

    switch ( cfg.cfg_vlv_tgt ) {

        case MODES.BUILD: return MODES.BUILD

        case MODES.VENT: return MODES.VENT

        case MODES.HI_FLOW: 
        case MODES.LO_FLOW:
            return ( smp.smp_lo_flow > cfg.cfg_flow_tog ? MODES.HI_FLOW : MODES.LO_FLOW ) 
    }

}

/* JOB DATA STRUCTURES ********************************************************************************/
export class Job {
    constructor(
        admins = [ ],
        states = [ ],
        headers = [ ],
        configs = [ ],
        events = [ ],
        samples = [ ],
        xypoints = [ ],
        reports = [],
        reg = new DESRegistration( ),
    ) {
        this.admins = admins
        this.states = states
        this.headers = headers
        this.configs = configs
        this.events = events
        this.samples = samples
        this.xypoints = xypoints
        this.reports = reports
        this.reports = []
        this.reg = reg
        
        this.highlight = false
        this.selection = 0
        /* JOB SEARCH PAGE MAP MARKER */
        this.s_mark_el = document.createElement('div')
        this.s_mark_el.className = 'marker job'; 
        this.s_mark_el.addEventListener('click', ( ) => { 
            goto( '/job/' + this.reg.des_job_name ) 
            this.highlight = false
        } )
        this.s_mark_el.addEventListener('mouseover', ( ) => { 
            this.highlight = true 
            updateJobsStore( )
        } )
        this.s_mark_el.addEventListener('mouseleave', ( ) => { 
            this.highlight = false 
            updateJobsStore( )
        } )
        this.s_mark = new mapboxgl.Marker( 
            this.s_mark_el, { anchor: 'bottom-right' } 
            ).setLngLat( [ this.reg.des_job_lng, this.reg.des_job_lat  ] )

        this.resetChart( )
    }
    
    getJobData = async( ) => {

        debug( "job.getJobData( ) -> reg: ", this.reg )
        let au = get( AUTH )
    
        let req = new Request( API_URL_C001_V001_JOB_DATA, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ au.token }`
            },
            body: JSON.stringify( this.reg )
        } )
        let res = await fetch( req )
        let json = await res.json( )

        if ( json.status == "success" ) {
            let j = JSON.parse( JSON.stringify( json.data.job ) )
            this.admins = j.admins
            this.states = j.states
            this.headers = j.headers
            this.configs = j.configs
            this.events = j.events
            this.samples = j.samples
            await this.updateChartData( j.xypoints )
            this.reports = j.reports
            return true
        } 
    }

    /* CHART DATA */
    updateChartData = async( xyp ) => {
        
        debug(  "job.updateChartData( ) -> samples: ", this.samples.length )
        
        this.xypoints = xyp
        this.cht_ch4.data = xyp.ch4
        this.cht_hi_flow.data = xyp.hi_flow
        this.cht_lo_flow.data = xyp.lo_flow
        this.cht_press.data = xyp.press
        this.cht_bat_amp.data = xyp.bat_amp
        this.cht_bat_volt.data = xyp.bat_volt
        this.cht_mot_volt.data = xyp.mot_volt

        // this.cht.options.scales.x.min = this.cht_ch4.data[0].x
        // this.cht.options.scales.x.max = this.cht_ch4.data[this.cht_ch4.data.length -1].x
        let flow = this.cht_lo_flow.data.map( f => f.y )
        if ( flow.some( f => { return f > 2.5 } ) ) {
            this.cht.options.scales.y_hi_flow.display = true
            this.cht_hi_flow.hidden = false

            this.cht.options.scales.y_lo_flow.display = false
            this.cht_lo_flow.hidden = true
        } else {
            this.cht.options.scales.y_hi_flow.display = false
            this.cht_hi_flow.hidden = true

            this.cht.options.scales.y_lo_flow.display = true
            this.cht_lo_flow.hidden = false
        } 
        
        this.cht.autoScale( this.cht_ch4,  this.cht.options.scales.y_ch4, 0.1 )
        this.cht.autoScale( this.cht_press,  this.cht.options.scales.y_press, 0.1 )
        this.cht.autoScale( this.cht_hi_flow,  this.cht.options.scales.y_hi_flow, 0.1 )
        this.cht.autoScale( this.cht_lo_flow,  this.cht.options.scales.y_lo_flow, 0.1 )

    }

    resetChart( ) {
        /* CHART DATA **************************************************************/
        this.cht = NewChartData( )

        this.cht_select = this.cht.data.datasets[CHT_DATASET_INDEX_SELECT]
        this.cht_ch4 = this.cht.data.datasets[CHT_DATASET_INDEX_CH4]
        this.cht_hi_flow = this.cht.data.datasets[CHT_DATASET_INDEX_HI_FLOW]
        this.cht_lo_flow = this.cht.data.datasets[CHT_DATASET_INDEX_LO_FLOW]
        this.cht_press = this.cht.data.datasets[CHT_DATASET_INDEX__PRESS]
        this.cht_bat_amp = this.cht.data.datasets[CHT_DATASET_INDEX_BAT_AMP]
        this.cht_bat_volt = this.cht.data.datasets[CHT_DATASET_INDEX_BAT_VOLT]
        this.cht_mot_volt = this.cht.data.datasets[CHT_DATASET_INDEX_MOT_VOLT]
        
        this.cht.options.plugins.zoom.zoom.onZoomComplete = this.chartZoomSelect

        this.cht.options.onClick = ( e ) => {
            debug( "job.cht.options.onClick( e ) -> e: ", e )
            this.selection = Math.floor( e.chart.scales.x.getValueForPixel( e.x ) )
            debug( "job.cht.options.onClick( e ) -> this.selection: ", this.selection )

            let xs = this.cht_press.data.map( d => d.x )
            if ( xs[0] > this.selection ) { this.selection = xs[0] }
            else if ( xs.pop( ) < this.selection  ) { this.selection = xs.pop( ) }
            else { 
                let pre = xs.filter( x => x <= this.selection ).pop( ) 
                let sub = xs.filter( x => x >= this.selection )[0] 
                this.selection = ( this.selection - pre < sub - this.selection ? pre : sub )                
            }
    
            this.cht_select.data = [  
                { x: this.selection, y: Number.MIN_SAFE_INTEGER }, 
                { x: this.selection, y: Number.MAX_SAFE_INTEGER } 
            ]
            updateJobsStore( )
        }

        this.cht.options.scales.y_hi_flow.display = true
        this.cht_point_limit = 0
        this.cht_scale_margin = 0.1
    }

    chartZoomSelect = ( e ) => { 
        debug( "job.chartZoomSelect...\n", e.chart )
    
        let dats = e.chart.config._config.data.datasets
        debug( "job.chartZoomSelect... datasets\n", dats )

        let scls = e.chart.scales
        debug( "job.chartZoomSelect... scales\n", scls )
    
        let xs = ( dats[CHT_DATASET_INDEX_CH4].data.map( v => { return v.x } ) ).filter( x => {
            return ( 
                x > Math.round( e.chart.scales["x"].min ) &&
                x < Math.round( e.chart.scales["x"].max )
            )  
        } )
    
        let xmin = xs[0]
        let xmax = xs[xs.length-1]
    
        debug( `UnixMilli:  ${ xmin } -> ${ xmax }` )
        debug( `DateTime:  ${ FormatDateTime( xmin ) } -> ${ FormatDateTime( xmax ) }` )
    
        dats.forEach( ds => { 
            let scl = e.chart.scales[ds.yAxisID]
            debug( "job.chartZoomSelect( ) -> dats.forEach( ds ): -> scl.id  ", scl.id )
            if ( scl.id != "y") {
                let vStart = ds.data.filter( v => { return v.x == xmin } )[0]
                let vEnd = ds.data.filter( v => { return v.x == xmax } )[0]
                debug( `${ ds.label }: vals: ${ vStart.y } -> ${ vEnd.y }, ${ scl.id }: scales: ${ scl.min } -> ${ scl.max }` )
            }
        } )
    
    }

    newHeader = async( hdr ) => {
        debug( "job.newHeader( ): ", this.reg.des_job_name ) 
        
        let au = get( AUTH )

        hdr.hdr_user_id = au.id
        hdr.hdr_app = client_app

        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app

        let job = {
            hdr: hdr,
            reg: this.reg
        }
        debug( "Send JOB SET HEADER Request:\n", job ) 
        
        let req = new Request( API_URL_C001_V001_JOB_NEW_HDR, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( job )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug("des_api.js -> job.newHeader( ) ->  RESPONSE reg:\n", reg )

        if ( reg.status === "success" ) { 
            debug("JOB NEW HEADER Request -> SUCCESS:\n", this.reg.des_job_name )
        }
    }

    newEvent = async( evt ) => {
        debug( "job.newEvent( ): ", this.reg.des_job_name ) 
        
        let au = get( AUTH )

        evt.evt_user_id = au.id
        evt.hdr_app = client_app

        this.reg.des_job_reg_user_id = au.id
        this.reg.des_job_reg_app = client_app

        let job = {
            evt: evt,
            reg: this.reg
        }
        debug( "Send JOB NEW EVENT Request:\n", job ) 
        
        let req = new Request( API_URL_C001_V001_JOB_NEW_EVT, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.token }` 
            },
            body: JSON.stringify( job )
        } )
        let res = await fetch( req )
        let reg = await res.json( )
        debug("des_api.js -> job.newEvent( ) ->  RESPONSE reg:\n", reg )

        if ( reg.status === "success" ) { 
            debug("JOB NEW EVENT Request -> SUCCESS:\n", this.reg.des_job_name )
        }
    }

    newReport = async( rep ) => { 
        
        let au = get( AUTH ) 

        rep.rep_user_id = au.id
        rep.reg = this.reg
        debug( "job.createReport( ) -> rep: ", rep )
    
        let req = new Request( API_URL_C001_V001_JOB_NEW_REPORT, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ au.token }`
            },
            body: JSON.stringify( rep )
        } )
        let res = await fetch( req )
        let json = await res.json( )
    
        if ( json.status == "success" ) {
            let j = JSON.parse( JSON.stringify( json.data ) )
            debug( "Report: \n", j )
        }
        // rep.rep_job_id = this.reg.des_job_id
        // this.reports.push( rep )
        // debug( "Reports: ", this.reports )
    }

}

export class Report {
    constructor(
        rep_id = 0,
        rep_user_id ="",
        rep_created = 0,
        rep_modified = 0,

        rep_title = "",
        rep_secs = [],

        reg = new DESRegistration( ),
    ) {
        this.rep_id = rep_id
        this.rep_user_id = rep_user_id
        this.rep_created = rep_created
        this.rep_modified = rep_modified

        this.rep_title = rep_title
        this.rep_secs = rep_secs

        this.reg = reg
    }
    
    addSection = ( sec ) => { 
        sec.sec_rep_id = this.rep_id
        /* TODO: VALIDATE */
        rep_secs.push( sec )
        /* TODO: HTTP POST TO DES */
    }
}
export class Section {
    constructor(
        /*  { metadata } */
        sec_id = 0,
        sec_rep_id = 0,
        sec_start = 0,
        sec_end = 0,
        sec_name = "",
        sec_dats = []
    ) {
        this.sec_id = sec_id
        this.rep_id = sec_rep_id
        this.sec_start = sec_start
        this.sec_end = sec_end
        this.sec_name = sec_name
        this.sec_dats = sec_dats
    }

    addSectionDataSet = ( sds ) => {
        sds.sec_id = this.sec_id
        /* TODO: VALIDATE */
        sec_dats.push( sds )
        /* TODO: HTTP POST TO DES */
    }

 }
 export class SectionDataSet {
    constructor(
        /*  { metadata } */
        dat_id,
        dat_sec_id,
        dat_csv = true,
        dat_plot = true,
        dat_y_axis,
        dat_y_min,
        dat_y_max,
    ) {
        this.sds_id = dat_id
        this.sec_id = dat_sec_id
        this.sds_csv = dat_csv
        this.sds_plot = dat_plot
        this.sds_y_axis = dat_y_axis
        this.sds_y_min = dat_y_min
        this.sds_y_max = dat_y_max
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
        adm_time = 0,
        adm_addr = "",
        adm_user_id = "",
        adm_app = client_app,
    
        adm_def_host = "",
        adm_def_port = 0,
        adm_op_host = "",
        adm_op_port = 0,
    
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
        this.adm_time = adm_time,
        this.adm_addr = adm_addr,
        this.adm_user_id = adm_user_id,
        this.adm_app = adm_app,
    
        this.adm_def_host = adm_def_host,
        this.adm_def_port = adm_def_port,
        this.adm_op_host = adm_op_host,
        this.adm_op_port = adm_op_port,
    
        // this.adm_class = adm_class,
        // this.adm_version = adm_version,
        // this.adm_serial = adm_serial,
    
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
  - Device returns readonly state values
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
*/
export class State {
    constructor(
        sta_time = 0,
        sta_addr = "",
        sta_user_id = "",
        sta_app = client_app,

        sta_serial = "",
        sta_version = device_version,
        sta_class = device_class,

        sta_log_fw = "00.00.000",
        sta_mod_fw = "00.00.000",

        sta_logging = 0,
        sta_job_name = "",

        sta_stm_uid1 = 0,
        sta_stm_uid2 = 0,
        sta_stm_uid3 = 0
    
    ) {
        this.sta_time = sta_time
        this.sta_addr = sta_addr
        this.sta_user_id = sta_user_id
        this.sta_app = sta_app

        this.sta_serial = sta_serial
        this.sta_version = sta_version
        this.sta_class = sta_class

        this.sta_log_fw = sta_log_fw
        this.sta_mod_fw = sta_mod_fw  

        this.sta_logging = sta_logging
        this.sta_job_name = sta_job_name
        
        this.sta_stm_uid1 = sta_stm_uid1
        this.sta_stm_uid2 = sta_stm_uid2
        this.sta_stm_uid3 = sta_stm_uid3
    }
}

/* 
WEB CLIENT -> HTTP -> DES ( LOG ) -> MQTT -> DEVICE  
  - Device updates its header settings
  - Device returns new header settings
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
*/
export class Header {
    constructor(
        hdr_time = 0, 
        hdr_addr = "",  
        hdr_user_id = "",
        hdr_app =  client_app,
    
        /*WELL INFORMATION*/
        hdr_well_co = "", 
        hdr_well_name = "",
        hdr_well_sf_loc = "",
        hdr_well_bh_loc = "",
        hdr_well_lic = "",

        /* JOB NAME, START & STOP */
        hdr_job_start = 0,
        hdr_job_end = 0,

        /*GEO LOCATION */
        hdr_geo_lng = 0,
        hdr_geo_lat = 0
    ) {
        this.hdr_time = hdr_time
        this.hdr_addr = hdr_addr
        this.hdr_user_id = hdr_user_id
        this.hdr_app = hdr_app

        this.hdr_well_co = hdr_well_co
        this.hdr_well_name = hdr_well_name
        this.hdr_well_sf_loc = hdr_well_sf_loc
        this.hdr_well_bh_loc = hdr_well_bh_loc
        this.hdr_well_lic = hdr_well_lic

        this.hdr_job_start = hdr_job_start
        this.hdr_job_end = hdr_job_end
        this.hdr_geo_lng = hdr_geo_lng
        this.hdr_geo_lat = hdr_geo_lat
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
        cfg_time = 0, 
        cfg_addr = "",  
        cfg_user_id = "",
        cfg_app =  client_app,
    
        cfg_scvd = 596.8, // m
        cfg_scvd_mult = 10.5, // kPa / m
        cfg_ssp_rate = 1.95, // kPa / hour
        cfg_ssp_dur = 6.0, // hour
        cfg_hi_scvf = 201.4, //  L/min ( 290 m3/day )
        cfg_flow_tog = 1.85, //  L/min 
    
        cfg_vlv_tgt = 2, // vent
        cfg_vlv_pos = 2, // vent
    
        cfg_op_sample = 1000, // milliseconds
        cfg_op_log = 10000, // milliseconds
        cfg_op_trans = 60000, // milliseconds
        
        cfg_diag_sample = 10000, // milliseconds
        cfg_diag_log = 100000, // milliseconds
        cfg_diag_trans = 600000, // milliseconds
     ) {
        this.cfg_time = cfg_time
        this.cfg_addr = cfg_addr
        this.cfg_user_id = cfg_user_id
        this.cfg_app = cfg_app
    
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
        evt_time = 0,
        evt_addr = "",
        evt_user_id = "",
        evt_app = client_app,
        evt_code = 0,
        evt_title = "",
        evt_msg = "" 
    ) {
        // this.evt_id = evt_id // Set by DES upon database write
        this.evt_time = evt_time
        this.evt_addr = evt_addr
        this.evt_user_id = evt_user_id
        this.evt_app = evt_app
        this.evt_code = evt_code
        this.evt_title = evt_title
        this.evt_msg = evt_msg
    }
}
Event.prototype.MaxMsg = 512
Event.prototype.MaxTitle = 36

export class EventType {
    constructor(
        evt_type_code = 0,
        evt_typ_name = "",
        evt_typ_desc = "",
    ) {
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
        smp_time = 0,
        smp_ch4 = 0,
        smp_hi_flow = 0,
        smp_lo_flow = 0,
        smp_press = 0,
        smp_bat_amp = 0,
        smp_bat_volt = 0,
        smp_mot_volt = 0,
        smp_vlv_tgt = 2,
        smp_vlv_pos = 2,
        smp_job_name =""
    ) { 
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
USED FOR SERVER ASSEMBLED SAMPLE DATA 
*/
export class XYSampleData { 
    constructor(
        xy_smp = {
            ch4: [ new XYPoint( ) ],
            hi_flow: [ new XYPoint( ) ],
            lo_flow: [ new XYPoint( ) ],
            press: [ new XYPoint( ) ],
            bat_amp: [ new XYPoint( ) ],
            bat_volt: [ new XYPoint( ) ],
            mot_volt: [ new XYPoint( ) ],
            vlv_tgt: [ new XYPoint( ) ],
            vlv_pos: [ new XYPoint( ) ],
        }
    ) {
        this.ch4 = xy_smp.ch4
        this.hi_flow = xy_smp.hi_flow
        this.lo_flow = xy_smp.lo_flow
        this.press = xy_smp.press
        this.bat_amp = xy_smp.bat_amp
        this.bat_volt = xy_smp.bat_volt
        this.mot_volt = xy_smp.mot_volt
        this.vlv_tgt = xy_smp.vlv_tgt
        this.vlv_pos = xy_smp.vlv_pos
    }
 }

/* 
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has transmitted a diagnostic sample
*/
export class DiagSample { /* NOT IMPLEMENTED */
    /* NOT IMPLEMENTED */
}

/* MAP STUFF ********************************************************************************************/
/* GEOJSON FORMAT HAS PROVEN UNNECESSARY THUS FAR... */
export class GeoJSONFeatureCollection {
    constructor (
        features = [ ]
    ) {
        this.type = "FeatureCollection"
        this.features = features
    }
}
export class GeoJSONFeature {
    constructor(
        geometry = new GeoJSONGeometry( ),
        well_name = ""
    ) {
        this.type = "Feature"
        this.geometry = geometry
        this.properties = { title: well_name }
    }
}
export class GeoJSONGeometry {
    constructor( 
        coordinates = [ -115.000000, 55.000000 ]
    ) {
        this.type = "Point"
        this.coordinates = coordinates
    }
}


/* CHART STUFF ******************************************************************************************/
export const COLORS = {
    CH4: BASE.PINK,
    HI_FLOW: BASE.ORANGE,
    LO_FLOW: BASE.YELLOW,
    PRESS: BASE.GREEN,
    BAT_AMP: BASE.BLUE,
    BAT_VOLT: BASE.PURPLE,
    MOT_VOLT: BASE.RED
}
export const CHT_DATASET_INDEX_SELECT = 0
export const CHT_DATASET_INDEX_CH4 = 1
export const CHT_DATASET_INDEX_HI_FLOW = 2
export const CHT_DATASET_INDEX_LO_FLOW = 3
export const CHT_DATASET_INDEX__PRESS = 4
export const CHT_DATASET_INDEX_BAT_AMP = 5
export const CHT_DATASET_INDEX_BAT_VOLT = 6
export const CHT_DATASET_INDEX_MOT_VOLT = 7

import { LineChartModel, LineChartXScale, LineChartScale, LineChartDataSet, LineChartXSelectScale, CHART_LINE_WIDTH, CHART_MARKER_RADIUS } from './common/chart/line_chart'
const NewChartDataSets = ( datasets = [ ] ) => {
    // return [

         /* 1 */
        datasets.push( new LineChartDataSet( [ ], "Methane", "y_ch4", true,
            CHART_LINE_WIDTH, RGBA( COLORS.CH4, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.CH4, 0.7 ) 
        ) )

         /* 2 */
         datasets.push( new LineChartDataSet( [ ], "High Flow", "y_hi_flow", true, 
            CHART_LINE_WIDTH, RGBA( COLORS.HI_FLOW, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.HI_FLOW, 0.7 ) 
        ) )

         /* 3 */
         datasets.push( new LineChartDataSet( [ ], "Low Flow", "y_lo_flow", true,
            CHART_LINE_WIDTH,  RGBA( COLORS.LO_FLOW, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.LO_FLOW, 0.7 ) 
        ) )

         /* 4 */
         datasets.push( new LineChartDataSet( [ ], "Pressure", "y_press", true,
            CHART_LINE_WIDTH, RGBA( COLORS.PRESS, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.PRESS, 0.7 ) 
        ) )

         /* 5 */
         datasets.push( new LineChartDataSet( [ ], "Battery Amps", "y_bat_amp", false, 
            CHART_LINE_WIDTH, RGBA( COLORS.BAT_AMP, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.BAT_AMP, 0.7 ) 
        ) )

         /* 6 */
         datasets.push( new LineChartDataSet( [ ], "Battery Volts", "y_bat_volt", false,
            CHART_LINE_WIDTH, RGBA( COLORS.BAT_VOLT, 0.3 ),  
            CHART_MARKER_RADIUS, RGBA( COLORS.BAT_VOLT, 0.7 ) 
        ) ) 

         /* 7 */
         datasets.push( new LineChartDataSet( [ ], "Motor Volts", "y_mot_volt", false,
            CHART_LINE_WIDTH, RGBA( COLORS.MOT_VOLT, 0.3 ), 
            CHART_MARKER_RADIUS, RGBA( COLORS.MOT_VOLT, 0.7 ) 
        ) )

    // ]

    return datasets
}
const NewChartScales = ( ) => {

    return {
        
        x: new LineChartXScale( ),

        y: new LineChartXSelectScale( ),
        
        y_ch4: new LineChartScale( "Ch4 ( % )", 3, -5, 100, "left", 
            RGBA( COLORS.CH4, 0.9 ), RGBA( BASE.LIGHT, 0.1 ), false 
        ),
        
        y_hi_flow: new LineChartScale( "Hi Flow ( L/min )", 1.75, -5.0, 250, "left", 
            RGBA( COLORS.HI_FLOW, 0.9 ), RGBA( BASE.LIGHT, 0.1 ), true,
            false 
        ),
        
        y_lo_flow: new LineChartScale( "Lo Flow ( L/min )", 1, -0.1, 2.5, "left",
            RGBA( COLORS.LO_FLOW, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), true, 
        ),
        
        y_press: new LineChartScale( "Press ( kPa )", 0, 0, 7000, "right", 
            RGBA( COLORS.PRESS, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), false 
        ),
        
        y_bat_amp: new LineChartScale( "Bat ( A )", 0, 0, 1.5, "right", 
            RGBA( COLORS.BAT_AMP, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), false, 
            false  
        ),
        
        y_bat_volt: new LineChartScale( "Bat ( V )", 1, 0, 15, "right", 
            RGBA( COLORS.BAT_VOLT, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), false, 
            false 
        ),
        
        y_mot_volt: new LineChartScale( "Mot ( V )", 2, 0, 15, "right", 
            RGBA( COLORS.MOT_VOLT, 1.0 ), RGBA( BASE.LIGHT, 0.1 ), false, 
            false  
        )

    }

}

export const NewChartData = ( ) => {
    let cht = new LineChartModel( "", RGBA( BASE.LIGHT, 0.7 ) )
    cht.options.scales = NewChartScales( )
    cht.data.datasets = NewChartDataSets( cht.data.datasets )
    return cht
}


/* DEMO! - NOT FOR PRODUCTION  *********************************************************************/
export const API_URL_GET_RUN_DEMO_SIM = `${ WS_SERVER }/api/001/001/demo/sim` 
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

        debug( `connectSIM( ) ->  this.dev: ${ JSON.stringify( this.dev.reg.des_dev_serial, null, 4 ) }`  )
        let ws = new WebSocket( url )

        ws.onopen = ( e ) => { debug( "class DemoDevice -> WebSocket OPEN" )  }
        ws.onerror = ( e ) => {
            ws.close( )
            this.sim.run = false
            debug( `class DemoDevice -> ${ this.dev.reg.des_dev_serial } ONERROR:\n`, JSON.stringify( e ) )
            this.update( )
        }
        ws.onmessage = ( msg ) => {
        
            let data =  JSON.parse( JSON.parse( msg.data ) )
            debug( `class DemoDevice: ${ this.dev.reg.des_dev_serial } ONMESSAGE:\n`, data )
            this.update( )
        } 
        this.sim.run = true
       
        this.disconnectSIM = ( ) => { 
                ws.send( "close" )
                ws.close( ) 
                this.sim.run = false
                debug( `class DemoDevice -> ${ this.dev.reg.des_dev_serial } -> WebSocket CLOSED: -> sim ${ this.sim.run }\n` )
                this.update( )
        }
        this.update( )
   }
}
export class Sim {
    constructor(
	    qty = 1000,
	    dur = 500,
	    fillQty = 1,
        max_ch4 = 92.1 + Math.random( ) * 7.9,
        max_flow = 0.199 + Math.random( ) * 248.799,
        run = false,
    ) {
        this.qty = qty
        this.dur = dur
        this.fillQty = fillQty
        this.run = run
        this.max_ch4 = max_ch4
        this.max_flow = max_flow
        this.max_press = ( this.max_flow / 250 ) * 1000

        this.modeVent( )
    }

    modeVent( ) {
        this.mtx_ch4 = new DemoModeTransition( this.max_ch4, 0, 600000, 600000 )
        this.mtx_hi_flow = new DemoModeTransition( this.max_flow, 0, 600000, 500000 )
        this.mtx_lo_flow = new DemoModeTransition( ( this.max_flow > 2 ? 2 : this.max_flow ), 0, 600000, 500000 )
        this.mtx_press = new DemoModeTransition( this.pax_press, 0, 600000, 600000 )
        // debug( "modeVent( ):\n", this )
    }

    modeFlow( ) {
        this.mtx_ch4 = new DemoModeTransition( 0, this.max_ch4, 600000, 600000 )
        this.mtx_hi_flow = new DemoModeTransition( 0, this.max_flow, 600000, 500000 )
        this.mtx_lo_flow = new DemoModeTransition( 0, ( this.max_flow > 2 ? 2 : this.max_flow ), 600000, 500000 )
        this.mtx_press = new DemoModeTransition( this.pax_press, 0, 600000, 600000 )
        // debug( "modeFlow( ):\n", this )
    }

    modeBuild( ) {
        this.mtx_ch4 = new DemoModeTransition( this.max_ch4, 0, 600000, 600000 )
        this.mtx_hi_flow = new DemoModeTransition( this.max_flow, 0, 600000, 500000 )
        this.mtx_lo_flow = new DemoModeTransition( ( this.max_flow > 2 ? 2 : this.max_flow ), 600000, 500000 )
        this.mtx_press = new DemoModeTransition( 0, this.pax_press, 600000, 600000 )
        // debug( "modeBuild( ):\n", this )
    }

}
export class DemoModeTransition {
    constructor(
        v_min = 0,
        v_max = 0,
        span_up = 10000,
        span_dn = 10000,
    ) {
        this.v_min = v_min
        this.v_max = v_max
        this.span_up = span_up
        this.span_dn = span_dn
    }
}


