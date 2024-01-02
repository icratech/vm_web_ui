import { writable, get } from 'svelte/store'
import { goto } from '$app/navigation'
import mapboxgl from 'mapbox-gl'
import { BASE, RGBA } from './common/colors'
import { FormatDateTime } from "./common/format"

import { HTTP_SERVER, WS_SERVER, client_app } from './des/app'

import { ALERT_CODES, alert, waitMilli, debug } from './des/utils'

import { 
    DESRegistration, Ping, 
    AUTH, getRequest, getRequestAuth, postRequest, postRequestAuth
} from './des/api'

import { validateMeasuredValue, validateSerialNumber } from './des/device'

import { 
    device_class, device_version, newC001V001_DESRegistration,
    Admin, 
    State,
    Header, validateLngLat,
    Config, validateCFG,
    Event, EventType,
    Sample, ValidateSMP,
    MODES, OP_CODES, getMode
} from '../lib/c001v001/models'


export const DEMO_DEVICES = writable( [ ] )
export const DEMO_DEVICES_LOADED = writable( false )
export const updateDemoDevicesStore = async( ) => { DEMO_DEVICES.update( ( ) => { return [ ...get( DEMO_DEVICES ) ] } ) }


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
            updateDemoDevicesStore( )
        }
        ws.onmessage = ( msg ) => {
        
            let data =  JSON.parse( JSON.parse( msg.data ) )
            debug( `class DemoDevice: ${ this.dev.reg.des_dev_serial } ONMESSAGE:\n`, data )
            updateDemoDevicesStore( )
        } 
        this.sim.run = true
       
        this.disconnectSIM = ( ) => { 
                ws.send( "close" )
                ws.close( ) 
                this.sim.run = false
                debug( `class DemoDevice -> ${ this.dev.reg.des_dev_serial } -> WebSocket CLOSED: -> sim ${ this.sim.run }\n` )
                this.update( )
        }
        tupdateDemoDevicesStore( )
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


