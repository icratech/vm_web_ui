
import { writable, get } from 'svelte/store'
import { goto } from '$app/navigation'
import mapboxgl from 'mapbox-gl'

import { HTTP_SERVER, WS_SERVER, client_app } from '../des/app'
import { ALERT_CODES, alert, waitMilli, debug } from '../des/utils'
import { AUTH, getRequestAuth, postRequestAuth, wsConnectionAuth, 
    refreshJWT, DESRegistration, Ping } from '../des/api'
import { validateMeasuredValue, validateSerialNumber } from '../des/device'

import { newChartData, CHT_DATASET_INDEX } from './chart_display'
import { 
    device_class, device_version, newC001V001_DESRegistration,
    Admin, 
    State,
    Header, validateLngLat,
    Config, validateCFG,
    Event, EventType,
    Sample, ValidateSMP,
    MODES, OP_CODES, getMode
} from './models'
import { Job } from './job'


/* DEVICE API ROUTES **********************************************************************************/
export const API_URL_C001_V001 = `api/${ device_class }/${ device_version }`
export const API_URL_C001_V001_DEVICE = `${ HTTP_SERVER }/${ API_URL_C001_V001 }/device`
export const API_URL_C001_V001_DEVICE_WS = `${ WS_SERVER }/${ API_URL_C001_V001 }/device`

/* DEVICE-ADMIN-LEVEL OPERATIONS */
export const API_URL_C001_V001_DEVICE_REGISTER =  `${ API_URL_C001_V001_DEVICE }/register`
export const API_URL_C001_V001_DEVICE_DES_CLIENT_REFRESH =  `${ API_URL_C001_V001_DEVICE }/des_client_refresh`
export const API_URL_C001_V001_DEVICE_DES_CLIENT_DISCONNECT =  `${ API_URL_C001_V001_DEVICE }/des_client_disconnect`

/* DEVICE-OPERATOR-LEVEL OPERATIONS */
export const API_URL_C001_V001_DEVICE_START =  `${ API_URL_C001_V001_DEVICE }/start`
export const API_URL_C001_V001_DEVICE_CANCEL_START =  `${ API_URL_C001_V001_DEVICE }/cancel_start`
export const API_URL_C001_V001_DEVICE_END =  `${ API_URL_C001_V001_DEVICE }/end`
export const API_URL_C001_V001_DEVICE_ADM =  `${ API_URL_C001_V001_DEVICE }/admin`
export const API_URL_C001_V001_DEVICE_STA =  `${ API_URL_C001_V001_DEVICE }/state`
export const API_URL_C001_V001_DEVICE_HDR =  `${ API_URL_C001_V001_DEVICE }/header`
export const API_URL_C001_V001_DEVICE_CFG =  `${ API_URL_C001_V001_DEVICE }/config`
export const API_URL_C001_V001_DEVICE_EVT =  `${ API_URL_C001_V001_DEVICE }/event`

/* DEVICE-VIEWER-LEVEL OPERATIONS */
export const API_URL_C001_V001_DEVICE_JOB_EVTS =  `${ API_URL_C001_V001_DEVICE }/job_events`
export const API_URL_C001_V001_DEVICE_SEARCH =  `${ API_URL_C001_V001_DEVICE }/search` // NOT IMPLEMENTED
export const API_URL_C001_V001_DEVICE_LIST =  `${ API_URL_C001_V001_DEVICE }/list`

/* TODO: ROLES HANDLED PER MQTT TOPIC / WS */
export const API_URL_C001_V001_DEVICE_USER_WS =  `${ API_URL_C001_V001_DEVICE_WS }/ws`

/* DEVELOPMENT *** NOT FOR PRODUCTION *** */
export const API_URL_C001_V001_DEVICE_DBG =  `${ API_URL_C001_V001_DEVICE }/debug`
export const API_URL_C001_V001_DEVICE_MSG_LIMIT =  `${ API_URL_C001_V001_DEVICE }/msg_limit`
export const API_URL_C001_V001_DEVICE_SIM_OLS = `${ API_URL_C001_V001_DEVICE }/sim_offline_start`


export const DEVICES = writable( [ ] )
export const DEVICES_LOADED = writable( false )
export const updateDevicesStore = async( ) => { DEVICES.update( ( ) => { return [ ...get( DEVICES ) ] } ) }

export const DEMO_DEVICES = writable( [ ] )


export const registerDevice = async( serial ) => {

    let chk = await validateSerialNumber( serial )
    if ( chk.err !== null ) {
        alert( ALERT_CODES.ERROR, chk.err )
        return
    }

    let au = get( AUTH )
    let reg = new DESRegistration( )

    reg.des_dev_serial = serial
    reg.des_dev_reg_user_id = au.user.id
    reg.des_dev_reg_app = client_app
    debug("c001v001/device.js -> registerDevice( ) -> REQUEST reg:\n", reg )

    let res = await postRequestAuth( API_URL_C001_V001_DEVICE_REGISTER, reg )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    
    else {
        alert( ALERT_CODES.SUCCESS, res.json.message )
    }

    await getDevices( )
}

export const getDevices = async( ) => {
    DEVICES_LOADED.set( false )
    let res = await getRequestAuth( API_URL_C001_V001_DEVICE_LIST )
    if ( res.err !== null ) {
        if ( res.err !== 'Unauthorized' )
            alert( ALERT_CODES.ERROR, res.err )
    }
    else {
        let devs = res.json.data.devices  // debug( "c001v001/device.js -> getDevices( ) -> response:\n", devs )
        devs.forEach( dev => {
            if( get( DEVICES ).filter( s => { return s.reg.des_dev_serial == dev.reg.des_dev_serial } )[0] == undefined ) {
                let device = new Device(
                    dev.adm,
                    dev.sta,
                    dev.hdr,
                    dev.cfg,
                    dev.evt,
                    dev.smp,
                    dev.reg,
                    dev.dbg
                )
                DEVICES.update( sdevs => { return [ ...sdevs, device ] } )
            }        
        } )
        await connectDevices( )
        get( DEVICES ).sort( ( a, b ) => b.reg.des_job_reg_time - a.reg.des_job_reg_time )
        DEVICES_LOADED.set( true )
        debug( "c001v001/device.js -> getDevices( ) -> DEVICES: ", get( DEVICES ).length ) 
    }

}

export const connectDevices = async( ) => { 
    get( DEVICES ).forEach( async( d ) => { if ( !d.socket ) { await d.connectWS( ) } } )
    updateDevicesStore( )
}

export const disconnectDevices = async( ) => { 
    // debug( "des_api.js -> disconnectDevices( ) -> DEVICES: ", get( DEVICES ) )
    get( DEVICES ).forEach( async( d ) => { if ( d.socket ) { await d.disconnectWS( ) } } )
    updateDevicesStore( )
}


/* DES DEVICE CLIENT Ping   
    WEB CLIENT <- HTTP (Websocket) <- DES 
        - While the DES device client is connected to the broker, the DES
            - sets device.des_ping.time = now utc unix milli
            - sets device.des_ping.ok = true and
            - publishes the updated device.ping to ccc/vvv/serial/des/des_ping
        - If more than 10 seconds has passed since the last DES DEVICE CLIENT Ping, 
            - WebSocket connected users can take action...
        - This data is NOT stored on the device or the server.
*/
export const DES_PING_LIMIT = 10000

/* DEVICE Ping
    WEB CLIENT <- HTTP (Websocket) <- DES <- MQTT <- DEVICE
        - While the device is connected to the broker it sends a Ping every 30 seconds
        - If more than 30 seconds has passed since the last Ping, the DES 
                - sets device.ping.ok = false and 
                - publishes the updated device.ping to ccc/vvv/serial/des/ping
        - ALL COMMANDS ARE DISABLED at both the web client and server when device.ping.ok == false 
        - This data is NOT stored on the device or the server.
*/
export const PING_LIMIT = 30000



/* DEVICE DATA STRUCTURE  *****************************************************************************/
export class Device {
    constructor( 
        adm = new Admin( ),
        sta = new State(),
        hdr = new Header( ),
        cfg = new Config( ),
        evt = new Event( ),
        smp = new Sample( ),
        reg = newC001V001_DESRegistration( ), 
        dbg = new Debug()
    ) { 
        this.adm = adm
        this.sta = sta
        this.hdr = hdr
        this.cfg = cfg
        this.evt = evt
        this.smp = smp
        this.reg = reg 

        /* USED TO MONITOR THE PHYSICAL DEVICE'S BROKER CONNECTION 
            THE PHYSICAL DEVICE SENDS A PING EVERY 30 SECONDS
        */
        this.ping = new Ping( )
        
        /* USED TO MONITOR THE DES DEVICE CLIENT'S BROKER CONNECTION 
            DES DEVICE CLIENT: 
             - SUBSCRIBES TO DEVICE SIGNAL TOPICS 
             - WRITES TO JOB AND CMD DATABASES
             - PUBLISHES TO DEVICE COMMAND TOPICS 
        */
        this.des_ping = new Ping( )

        /* USED TO ALTER THE DEBUG SETTINGS FOR A GIVEN DEVICE
            THIS INFORMATION IS NOT LOGGED TO THE DATABASE 
            OR SENT TO THE PHYSICAL DEVICE
        */
        this.dbg = dbg

        /* USED ON DEVICE PAGE TO DISPLAY ACTIVE JOB */
        this.job = new Job( )
        this.job_evts = [ ]

        /* USED ON ADMIN PAGE TO DISPLAY CMDARCHIVE */
        this.cmd = new Job()

        /* WEB SOCKET CONNECTION STATUS */
        this.socket = false
        
        /* DEVICE SEARCH PAGE MAP MARKER HOVER EFFECT */
        this.highlight = false

        /* MAP DATA ( LIVE ) *****************************************************************/
        /** https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker */
        /* DEVICE PAGE MAP MARKER */
        this.mark_el = document.createElement('div')
        this.mark = new mapboxgl.Marker( 
            this.mark_el, { anchor: 'bottom-right' } ).setLngLat( 
                validateLngLat( this.hdr.hdr_geo_lng, this.hdr.hdr_geo_lat ) 
        ) 

        /* DEVICE SEARCH PAGE MAP MARKER */
        this.s_mark_el = document.createElement('div')
        this.s_mark_el.addEventListener('click', ( ) => { goto( '/device/' + this.reg.des_dev_serial ); this.highlight = false } )
        this.s_mark_el.addEventListener('mouseover', ( ) => { this.highlight = true; updateDevicesStore( ) } )
        this.s_mark_el.addEventListener('mouseleave', ( ) => { this.highlight = false; updateDevicesStore( ) } )
        this.s_mark = new mapboxgl.Marker( 
            this.s_mark_el, { anchor: 'bottom-right' } ).setLngLat( 
                validateLngLat( this.hdr.hdr_geo_lng, this.hdr.hdr_geo_lat ) 
        )

        this.resetChart( )
    }
    
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

        point.y = validateMeasuredValue( point.y )
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
        this.cht = newChartData( )
        this.cht_select = this.cht.data.datasets[CHT_DATASET_INDEX.SELECT]
        this.cht_ch4 = this.cht.data.datasets[CHT_DATASET_INDEX.CH4]
        this.cht_hi_flow = this.cht.data.datasets[CHT_DATASET_INDEX.HI_FLOW]
        this.cht_lo_flow = this.cht.data.datasets[CHT_DATASET_INDEX.LO_FLOW]
        this.cht_press = this.cht.data.datasets[CHT_DATASET_INDEX.PRESS]
        this.cht_bat_amp = this.cht.data.datasets[CHT_DATASET_INDEX.BAT_AMP]
        this.cht_bat_volt = this.cht.data.datasets[CHT_DATASET_INDEX.BAT_VOLT]
        this.cht_mot_volt = this.cht.data.datasets[CHT_DATASET_INDEX.MOT_VOLT]
        this.cht_point_limit = 200
        this.cht_scale_margin = 0.2
    }

    /* WEBSOCKET METHODS **************************************************************/
    disconnectWS = async( ) => { }
    connectWS = async( ) => {

        let au = get( AUTH )
        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app
        let dev = { reg : this.reg }
        let res = await wsConnectionAuth( API_URL_C001_V001_DEVICE_USER_WS, "device", dev )
        if ( res.err !== null ) 
            alert( ALERT_CODES.ERROR, `WebSocket connection failed:  ${ res.err }` )
        else {
            res.ws.onopen = ( e ) => {  
                this.socket = true
                updateDevicesStore( )
                // debug( `c001v001/device.js -> class Device -> ${ this.reg.des_dev_serial } -> WebSocket OPEN` ) 
            }
            res.ws.onerror = ( e ) => { 
                res.ws.close( )
                this.socket = false
                updateDevicesStore( )
                // debug( `c001v001/device.js -> class Device -> ${ this.reg.des_dev_serial } -> ws.onerror ERROR\n${ JSON.stringify( e )  }\n` ) 
            }
            res.ws.onmessage = async( e ) => {
    
                let msg = JSON.parse( JSON.parse( e.data ) )
                switch ( msg.type ) {
                
                    case "start":
                        debug("new job start received: ", msg.data)
                        this.adm = msg.data.adm
    
                        this.sta = msg.data.sta
                        this.reg.des_job_name = this.sta.sta_job_name
    
                        if ( msg.data.hdr.hdr_addr == this.reg.des_dev_serial ) {
                            this.hdr = msg.data.hdr
                            this.reg.des_job_start = this.hdr.hdr_job_start
                            this.reg.des_job_end = this.hdr.hdr_job_end
                            this.reg.des_job_lng = this.hdr.hdr_geo_lng 
                            this.reg.des_job_lat = this.hdr.hdr_geo_lat
                            this.updateDeviceSearchMap( this.hdr.hdr_geo_lng, this.hdr.hdr_geo_lat )
                            this.updateDevicePageMap( ( this.hdr.hdr_job_start > 0 && this.hdr.hdr_job_end == 0 ), this.hdr.hdr_geo_lng, this.hdr.hdr_geo_lat )     
                        }
    
                        this.cfg = msg.data.cfg
                        this.updateMarkerMode( )
    
                        this.evt = msg.data.evt
                        this.job_evts.unshift( this.evt )
                        
                        break
    
                    case "end_sig":
                        debug("new end received from device: ", msg.data)
                        
                        this.smp = new Sample( )
                        this.resetChart( )
    
                        break    
                    
                    case "end_cmd":
                        debug("new end received from other user: ", msg.data)
                        this.sta.sta_logging = msg.data.evt_code
                        break    
                        
                    case "ping":
                        // debug(`new ping received from device ${ this.reg.des_dev_serial }: `, { time: FormatDateTime( msg.data.time ), ok: msg.data.ok } )
                        this.ping = msg.data
                        break
                
                    case "des_ping":
                        // debug(`new des_ping received from des device client ${ this.reg.des_dev_serial }: `, { time: FormatDateTime( msg.data.time ), ok: msg.data.ok } )
                        this.des_ping = msg.data
                        break
        
                    case "admin":
                        this.adm = msg.data
                        // debug("new admin received from device: ", this.adm )
                        break
    
                    case "state":
                        this.sta = msg.data
                        // debug("new state received from device: ", this.sta)
                        this.reg.des_job_name = this.sta.sta_job_name
                        break
        
                    case "header":
                        this.hdr = msg.data
                        // debug("new header received from device: ", this.hdr)
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
                        // debug("new config received from device: ", this.cfg)
                        break
                    
                    case "event":
                        this.evt = msg.data
                        if ( this.sta.sta_logging == OP_CODES.JOB_START_REQ && this.evt.evt_code == OP_CODES.GPS_ACQ ) {
                            this.sta.sta_logging = OP_CODES.GPS_ACQ
                        }
                        this.job_evts.unshift( this.evt )
                        // debug("new event received from device: ", this.evt)
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
    
                    case "live": 
                        await refreshJWT( )
                        break
    
                    case "auth":
                        let auth = msg.data
                        if ( auth.status === "fail" && this.socket ) { this.disconnectWS( ) }
                        // debug( "new auth message received from device: ", auth.message ) 
                        break
    
                    case "msg_limit":
                        debug("new MQTT msg size limit test received from device: ", msg.data )
                        debug("total msg size: ", JSON.stringify(msg.data).length )
                        // debug("msg.kafka size: ", msg.data.kafka.length )
                        break
        
                    default: 
                        debug( `class Device -> ${ this.reg.des_dev_serial } ONMESSAGE: Type unknown:\n${ e.data }\n` )
                        break
                }
                
                // debug( `c001v001/device.js -> class Device -> ${ this.reg.des_dev_serial } ONMESSAGE:\n`, msg.data )
                updateDevicesStore( )
            } 
            this.disconnectWS =  async( ) => {
                res.ws.send( "close" )
                res.ws.close( ) 
                debug( `c001v001/device.js -> class Device -> ${ this.reg.des_dev_serial } -> WebSocket CLOSED` ) 
                this.socket = false
                this.highlight = false
                updateDevicesStore( )
            }
            await waitMilli(1000)
        }
    }

    /* HTTP METHODS **********************************************************************/
    startJob = async( ) => {
        // debug( "Start new job for device: ", this.reg.des_dev_serial ) 

        let au = get( AUTH )

        if ( !this.socket ) { await this.connectWS( ) }

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app
        
        this.sta.sta_logging = OP_CODES.JOB_START_REQ
        this.ping = new Ping( )

        this.cfg = validateCFG( this.cfg )
        
        updateDevicesStore( )

        let dev = {
            adm: this.adm,
            sta: this.sta,
            hdr: this.hdr,
            cfg: this.cfg,
            reg: this.reg
        } // debug( "Send START JOB Request: ", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_START, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )
        else  
            this.job_evts = [ ]

    }
    endJob = async( ) => {
        // debug( "End current job for device: ", this.reg.des_dev_serial ) 

        let au = get( AUTH )

        if ( !this.socket ) { await this.connectWS( ) }

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            reg: this.reg
        } //  debug( "Send END JOB Request:\n", dev )  

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_END, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )

    }
    setAdmin = async( ) => {
        // debug( "Set Admin for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.adm.adm_user_id = au.user.id
        this.adm.adm_app = client_app

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            adm: this.adm,
            reg: this.reg
        } // debug( "Send SET ADMIN Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_ADM, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )

    }
    setState = async( ) => {
        // debug( "Set State for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.sta.sta_user_id = au.user.id
        this.sta.sta_app = client_app

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            sta: this.sta,
            reg: this.reg
        } //  debug( "Send DEVICE SET STATE Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_STA, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )
        else
            debug( `new State from device ${ this.reg.des_dev_serial }: `, res.json )

    }
    setHeader = async( ) => {
        // debug( "Set Header for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.hdr.hdr_user_id = au.user.id
        this.hdr.hdr_app = client_app

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            hdr: this.hdr,
            reg: this.reg
        } // debug( "Send DEVICE SET HEADER Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_HDR, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )

    }
    setConfig = async( ) => { 
        // debug( "Set Config for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.cfg.cfg_user_id = au.user.id
        this.cfg.cfg_app = client_app
        this.cfg = validateCFG( this.cfg )

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app
        
        let dev = {
            cfg: this.cfg,
            reg: this.reg
        } // debug( "Send SET CONFIG Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_CFG, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )

    }
    setMode = ( mode ) => {
        this.cfg.cfg_vlv_tgt = mode
        this.cfg.cfg_vlv_pos = mode
        this.setConfig()
    }
    newEvent = async( evt ) => {
        // debug( "Create Event for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        evt.evt_user_id = au.user.id
        evt.evt_app = client_app

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            evt: evt,
            reg: this.reg
        } //  debug( "Send DEVICE CREATE EVENT Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_EVT, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )

    }
    getActiveJobEvents = async( ) => {
        // debug( "Get Events for active job: ", this.reg.des_job_name ) 
        
        let au = get( AUTH )
        
        // if ( !this.socket ) { await this.connectWS( ) }
        
        let dev = { reg: this.reg } // debug( "Send GET ACTIVE JOB EVENTS Request:\n", dev )

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_JOB_EVTS, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )
        
        else 
            this.job_evts = res.json.data.events
          
        if ( this.job_evts === null ) 
            this.job_evts = [ ] 

        // debug( "ACTIVE JOB EVENTS: ", this.job_evts.length )
    }

    /* HTTP METHODS ( DES_ADMIN ) *************************************************************/
    connectDESClient = async( ) => {
        // debug( "Connect DES Client: ", this.reg.des_dev_serial ) 
        this.des_ping.time = 0
        this.des_ping.ok = false

        let au = get( AUTH )
        
        if ( this.socket ) { await this.disconnectWS( ) }

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app
        let dev = { reg: this.reg } // debug( "Send Connect DES Client Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_DES_CLIENT_REFRESH, dev )

        if ( res.err !== null ) {
            alert( ALERT_CODES.ERROR, res.err )
            return false
        } else {
            let d = res.json.data.device // debug("c001v001/device.js -> device.connectDESClient( ) ->  SUCCESS device: ", d )
            this.adm = d.adm
            this.sta = d.sta
            this.hdr = d.hdr
            this.cfg = d.cfg
            this.evt = d.evt
            this.smp = d.smp
            this.reg = d.reg
            await this.connectWS( )
            return true
        }
    }


    /* DEBUG -> REMOVE FOR PRODUCTION */
    setDebug = async( ) => {
        debug( "Set Debug for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let dev = {
            dbg: this.dbg,
            reg: this.reg
        } // debug( "Send DEVICE SET DEBUG Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_DBG, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )
        
    }
    /* DEBUG -> REMOVE FOR PRODUCTION */
    testMsgLimit = async( ) => {
        debug( "TEST MQTT MESSAGE LIMIT for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let dev = { reg: this.reg } // debug( "Send TEST MQTT MESSAGE LIMIT Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_MSG_LIMIT, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )

    }
    /* DEBUG -> REMOVE FOR PRODUCTION */
    simOfflineStart = async ( ) => {
        debug( "TEST OFFLINE START for device: ", this.reg.des_dev_serial ) 
        
        let au = get( AUTH )
        
        if ( !this.socket ) { await this.connectWS( ) }
        
        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let dev = { reg: this.reg } // debug( "Send TEST OFFLINE START Request:\n", dev ) 

        let res = await postRequestAuth( API_URL_C001_V001_DEVICE_SIM_OLS, dev )

        if ( res.err !== null )  
            alert( ALERT_CODES.ERROR, res.err )

    }
}

export class Debug {
    constructor(
        mqtt_delay = 0
    ) {
        this.mqtt_delay = mqtt_delay
    }
}

