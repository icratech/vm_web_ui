import { writable, get } from 'svelte/store'
import { goto } from '$app/navigation'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken = MAPBOX_TOKEN

import { HTTP_SERVER, WS_SERVER, client_app, MAPBOX_TOKEN, MAPBOX_STYLE } from '../des/app'
import { ALERT_CODES, alert, waitMilli, debug } from '../des/utils'
import { AUTH, RoleCheck, getRequestAuth, postRequestAuth } from '../des/api'
import { FormatDateTime } from "../common/format"

import { 
    newChartData, 
    CHT_DATASET_INDEX, 
    CHT_DEFALTS
} from './chart_display'
import { 
    device_class, device_version, newC001V001_DESRegistration, 
    validateLngLat, 
    EventType, 
    Sample 
} from './models'

const role = new RoleCheck( )

/* JOB API ROUTES *************************************************************************************/
export const API_URL_C001_V001 = `api/${ device_class }/${ device_version }`
export const API_URL_C001_V001_JOB = `${ HTTP_SERVER }/${ API_URL_C001_V001 }/job`
export const API_URL_C001_V001_JOB_WS = `${ WS_SERVER }/${ API_URL_C001_V001 }/job`

export const API_URL_C001_V001_JOB_EVENT_TYPE_LIST =  `${ API_URL_C001_V001_JOB }/event/list`

export const API_URL_C001_V001_JOB_LIST = `${ API_URL_C001_V001_JOB }/list`
export const API_URL_C001_V001_JOB_DATA = `${ API_URL_C001_V001_JOB }/data`
export const API_URL_C001_V001_JOB_NEW_REPORT =  `${ API_URL_C001_V001_JOB }/new_report`
export const API_URL_C001_V001_JOB_NEW_HDR = `${ API_URL_C001_V001_JOB }/new_header`
export const API_URL_C001_V001_JOB_NEW_EVT = `${ API_URL_C001_V001_JOB }/new_event`
export const API_URL_C001_V001_JOB_EVTS = `${ API_URL_C001_V001_JOB }/event_list`

export const API_URL_C001_V001_JOB_USER_WS =  `${ API_URL_C001_V001_JOB_WS }/ws`

export const API_URL_C001_V001_JOB_DES_LIST = `${ API_URL_C001_V001_JOB }/des_list`

export const EVT_TYPES = writable( [ ] )
export const EVT_TYPES_LOADED = writable( false )
export const updateEvtTypesStore = async( ) => { EVT_TYPES.update( ( ) => { return [ ...get( EVT_TYPES ) ] } ) }
export const getEventTypes = async( ) => {

    let res = await getRequestAuth( API_URL_C001_V001_JOB_EVENT_TYPE_LIST )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )

    else {    
            let typs = res.json.event_types

            typs.forEach( t => { 
                if( get( EVT_TYPES ).filter( e => { return e.evt_typ_code == t.evt_typ_code } )[0] == undefined ) {
                    let typ = new EventType(
                        t.evt_typ_code,
                        t.evt_typ_name,
                        t.evt_typ_desc
                    )
                    EVT_TYPES.update( styps => { return [ ...styps, typ ] } )
                }        
            } )
            EVT_TYPES_LOADED.set( true )
            debug( "c001v001/job.js -> getEventTypes( ) -> EVT_TYPES: ", get( EVT_TYPES ).length )
    }

}

export const JOBS = writable( [ ] )
export const JOBS_LOADED = writable( false )
export const updateJobsStore = ( ) => { JOBS.update( ( ) => { return [ ...get( JOBS ) ] } ) }

export const getJobs = async( ) => { 
    JOBS_LOADED.set( false )
    let res = await getRequestAuth( API_URL_C001_V001_JOB_LIST )
    if ( res.err !== null ) {
        if ( res.err !== 'Unauthorized' )
            alert( ALERT_CODES.ERROR, res.err )
    }
    else {
            let jobs = ( res.json.jobs === null ? [ ] : res.json.jobs ) // debug( "c001v001/job.js -> getJobs( ) -> response:\n", jobs )
            jobs.forEach( j => {
                let stored = get( JOBS ).filter( sj =>{ return sj.reg.des_job_name === j.reg.des_job_name } )[0]
                if ( stored === undefined ) {
                    let job = new Job( )
                    job.reg = j.reg
                    JOBS.update( sjobs => { return [ ...sjobs, job ] } ) // debug( "new job: ", job )
                 } else {
                    stored.reg = j.reg
                    updateJobsStore( ) // debug( "stored job: ", stored )
                }
            } )
            get( JOBS ).sort( ( a, b ) => b.reg.des_job_reg_time - a.reg.des_job_reg_time )
            JOBS_LOADED.set( true )
            debug( "c001v001/job.js -> getJobs( ) -> JOBS: ", get( JOBS ).length )
    }

}


export const DES_JOBS = writable( [ ] )
export const DES_JOBS_LOADED = writable( false )
export const updateDESJobsStore = ( ) => { DES_JOBS.update( ( ) => { return [ ...get( DES_JOBS ) ] } ) }
export const getDESJobs = async( ) => {
    DES_JOBS_LOADED.set( false )
    let res = await getRequestAuth( API_URL_C001_V001_JOB_DES_LIST )
    if ( res.err !== null ) {
        if ( res.err !== 'Unauthorized' )
            alert( ALERT_CODES.ERROR, res.err )
    } else {
        let jobs = ( res.json.jobs === null ? [ ] : res.json.jobs )
        jobs.forEach( j => {
            if ( get( DES_JOBS ).filter( s => { return s.reg.des_job_name === j.reg.des_job_name } )[0] === undefined ) {
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
                DES_JOBS.update( sjobs => { return [ ...sjobs, job ] } )
            }
        } )
    
        get( DES_JOBS ).sort( ( a, b ) => b.reg.des_job_reg_time - a.reg.des_job_reg_time )
        DES_JOBS_LOADED.set( true )

        debug( "c001v001/job.js -> getJobs( ) -> DES_JOBS: ", get( DES_JOBS ).length )
    }

}

/* JOB CLASS *******************************************************************************************/
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
        reg = newC001V001_DESRegistration( ),
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
        
        /* USED ON JOB PAGE TO MANAGE CHART DISPLAY AND POINT SELECTION */
        this.selection = 0
        this.selected_smp = new Sample( )
        this.cht_scale_margin = CHT_DEFALTS.MARGIN
        this.cht_auto_scale = false

        /* WEB SOCKET CONNECTION STATUS */
        this.socket = false

        /* JOB SEARCH PAGE MAP MARKER HOVER EFFECT */
        this.highlight = false
        this.selected = false

        /* JOB PAGE MAP MARKER */
        this.mark_el = document.createElement('div')
        this.mark_el.className = 'marker job'; 
        this.mark = new mapboxgl.Marker( this.mark_el, { anchor: 'bottom-right' } ).setLngLat( 
            validateLngLat( this.reg.des_job_lng, this.reg.des_job_lat ) 
        ) 

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
        this.s_mark = new mapboxgl.Marker( this.s_mark_el, { anchor: 'bottom-right' } ).setLngLat( 
            validateLngLat( this.reg.des_job_lng, this.reg.des_job_lat ) 
        )
        
        this.cht = newChartData( )
        this.resetChart( )
    }

    /* JOB PAGE MAP */
    makeMap( ctx, zoom = 6.5 ) {
        this.map = new mapboxgl.Map( {
            container: ctx,
            style: MAPBOX_STYLE, 
            center: validateLngLat( this.reg.des_job_lng, this.reg.des_job_lat ),
            zoom :  zoom,
            interactive: false,
            preserveDrawingBuffer: true
        } )
        this.mark.setLngLat( validateLngLat( this.reg.des_job_lng, this.reg.des_job_lat ) )
        this.mark.addTo( this.map )
    }

    /* WEBSOCKET METHODS **************************************************************/
    disconnectWS = async( ) => { }
    connectWS = async( ) => {
        
        let au = get( AUTH )
        // debug( `c001v001/job.js -> class Job -> ${ this.reg..des_job_name } -> connectWS( ) -> AUTH\n${ JSON.stringify( au )  }\n` )

        let reg = encodeURIComponent(JSON.stringify( this.reg ) )
        let url = `${ API_URL_C001_V001_JOB_USER_WS }?access_token=${ au.acc_token }&des_reg=${ reg }`
        const ws = new WebSocket( url )
        ws.onopen = ( e ) => {  
            this.socket = true
            updateJobsStore( )
            // debug( `c001v001/job.js -> c001v001/job.js -> class Job -> ${ this.reg.des_job_name } -> WebSocket OPEN` ) 
        }
        ws.onerror = ( e ) => { 
            ws.close( )
            this.socket = false
            updateJobsStore( )
            // debug( `c001v001/job.js -> class Job -> ${ this.reg.des_job_name } -> ws.onerror ERROR\n${ JSON.stringify( e )  }\n` ) 
        }
        ws.onmessage = ( e ) => {

            let msg = JSON.parse( JSON.parse( e.data ) )
            switch ( msg.type ) {

                case "update": /*  */ break

                case "report": break

                case "section": break

                case "ssp": break

                case "sscvf": break

                default: 
                    debug( `c001v001/job.js -> class Job -> ${ this.reg.des_job_name } ONMESSAGE: Type unknown:\n${ e.data }\n` )
                    break
            }
            
            // debug( `c001v001/job.js -> class Job -> ${ this.reg.des_job_name } ONMESSAGE:\n`, msg.data )
            updateJobsStore( )
        }
        this.disconnectWS =  async( ) => {
            if ( ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING ) {
                ws.send( "close" )
                ws.close( ) 
            }
            this.socket = false
            updateJobsStore( )
            debug( `c001v001/job.js -> class Job -> ${ this.reg.des_job_name } -> WebSocket CLOSED` ) 
        }
        await waitMilli(1000)

    }

    getJobData = async( ) => {
        // debug( "job.getJobData( ) -> reg: ", this.reg )

        let job = { reg: this.reg }

        let res = await postRequestAuth( API_URL_C001_V001_JOB_DATA, job )

        if ( res.err !== null ) 
            return { ok: false, msg: res.err }

        else {
            let j = res.json.job
            this.admins = j.admins
            this.states = j.states
            this.headers = j.headers
            this.configs = j.configs
            this.events = j.events
            this.samples = j.samples
            if ( this.samples !== null ) { await this.loadChartXYPoints( j.xypoints ) }
            this.reports = j.reports
            return { ok: true, msg: null }
        }

    }
    getJobEvents = async( ) => {
        debug( "GET JOB EVENTS: ", this.reg.des_job_name ) 
        
        let au = get( AUTH )
        
        // if ( !this.socket ) { await this.connectWS( ) }
        
        let job = { reg: this.reg }

        debug( "Send GET JOB EVENTS Request:\n", job )

        let req = new Request( API_URL_C001_V001_JOB_EVTS, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.acc_token }` 
            },
            body: JSON.stringify( job )
        } )
        let res = await fetch( req )
        let evts = await res.json( )
        
        if ( evts.status === "success" ) { 
            debug("GET JOB EVENTS Response -> SUCCESS:\n", this.reg.des_job_name )
            this.events = evts.data.evts
        }  

        if ( this.events === null ) { this.events = [ ] }
        debug( "JOB EVENTS:\n", this.events )
    }
    getSelectedEvents = ( xmin, xmax ) => {  }
    getReports = async( ) => {  }
    newReport = async( rep ) => { 
        
        let au = get( AUTH ) 

        rep.rep_user_id = au.user.id
        rep.reg = this.reg //  debug( "job.createReport( ) -> rep: ", rep )
    
        let res = await postRequestAuth( API_URL_C001_V001_JOB_NEW_REPORT, rep )
        if ( res.err !== null ) 
            return { ok: false, msg: res.err }

        else if ( res.json.report !== null ) 
            this.reports = [ ...this.reports, res.json.report ]
        
        updateJobsStore( )
        debug( "job.createReport( ) -> job.reports AFTER: ", this.reports )
    }
    newHeader = async( hdr ) => {
        debug( "job.newHeader( ): ", this.reg.des_job_name ) 
        
        let au = get( AUTH )

        hdr.hdr_user_id = au.user.id
        hdr.hdr_app = client_app

        this.reg.des_job_reg_user_id = au.user.id
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
                "Authorization": `Bearer ${ au.acc_token }` 
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

        evt.evt_user_id = au.user.id
        evt.hdr_app = client_app

        this.reg.des_job_reg_user_id = au.user.id
        this.reg.des_job_reg_app = client_app

        let job = {
            events: [ evt ],
            reg: this.reg
        }
        debug( "Send JOB NEW EVENT Request:\n", job ) 
        
        let req = new Request( API_URL_C001_V001_JOB_NEW_EVT, { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.acc_token }` 
            },
            body: JSON.stringify( job )
        } )
        let res = await fetch( req )
        let json = await res.json( )
        debug("c001v001/job.js -> job.newEvent( ) ->  RESPONSE json:\n", json )

        if ( json.status === "success" ) { 
            job.events.push( json.data.evt )
            job.events.sort( ( a, b ) => { return a.evt_time - b.evt_time  }  )
            debug("JOB NEW EVENT Request -> SUCCESS:\n", this.reg.des_job_name )
        }
    }

    /* LOCAL DATA ****************************************************************/
    selectReport = ( rep ) => {
        this.reports.forEach( r => { 
            ( r.rep_id == rep.rep_id ? r.selected = true : r.selected = false )
        } )
        updateJobsStore( )
    }
    deselectSection = ( rep ) => { 
        rep.rep_secs.forEach( s => { s.selected = false } )
        updateJobsStore( )
    }
    /* USED FOR REPORT SECTION COLOR CODING */
    selectSectionMode = ( sec ) => {
        sec.smp = this.samples.reduce( ( pre, cur ) => { return ( 
            pre && 
            pre.smp_time > sec.sec_start && 
            pre.smp_time < sec.sec_end && 
            pre.smp_hi_flow > cur.smp_hi_flow 
        ) ? pre : cur } )

        sec.cfg = this.configs.reduce( ( pre, cur ) => { return ( 
            pre &&
            pre.cfg_time >= sec.sec_start &&
            pre.cfg_time < sec.sec_end
        ) ? pre : cur } )
        
        updateJobsStore( )
    }
    
    /* CHART DATA */
    loadChartXYPoints = async( xyp ) => {
        // debug(  "job.loadChartXYPoints( ) -> samples: ", this.samples.length )
        this.xypoints = xyp
        this.cht_ch4.data = xyp.ch4.map( s => { ( s.y === -9999.25 || s.y === -999.25? s.y = null : s.y ); return { x: s.x, y: s.y } } )
        this.cht_hi_flow.data = xyp.hi_flow.map( s => { ( s.y === -9999.25 || s.y === -999.25? s.y = null : s.y ); return { x: s.x, y: s.y } } )
        this.cht_lo_flow.data = xyp.lo_flow.map( s => { ( s.y === -9999.25 || s.y === -999.25? s.y = null : s.y ); return { x: s.x, y: s.y } } )
        this.cht_press.data = xyp.press.map( s => { ( s.y === -9999.25 || s.y === -999.25? s.y = null : s.y ); return { x: s.x, y: s.y } } )
        // this.cht_press.data = xyp.press
        this.cht_bat_amp.data = xyp.bat_amp
        this.cht_bat_volt.data = xyp.bat_volt.map( s => { ( s.y === -9999.25 || s.y === -999.25? s.y = null : s.y ); return { x: s.x, y: s.y } } )
        this.cht_mot_volt.data = xyp.mot_volt.map( s => { ( s.y === -9999.25 || s.y === -999.25? s.y = null : s.y ); return { x: s.x, y: s.y } } )
        
        let flow = this.cht_hi_flow.data.map( f => f.y )
        if ( role.isSuper( get(AUTH).user.role )) {
            this.cht.options.scales.y_hi_flow.display = true
            this.cht_hi_flow.hidden = false

            this.cht.options.scales.y_lo_flow.display = true
            this.cht_lo_flow.hidden = false
        } else if ( flow.some( f => { return f > 2.5 } ) ) {
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
        
        let auto = this.cht_auto_scale
        let margin = this.cht_scale_margin
        let start = ( this.cht.limitDataset( this.cht_press, this.cht_point_limit ) ).start
        
        this.cht.autoScale( this.cht_ch4, start, margin, auto )
        this.cht.autoScale( this.cht_press, start, margin, auto )
        this.cht.autoScale( this.cht_hi_flow, start, margin, auto )
        this.cht.autoScale( this.cht_lo_flow, start, margin, auto )

    }
    resetChart= ( ) =>  {
        /* CHART DATA **************************************************************/
        this.cht = newChartData( )

        this.cht_select = this.cht.data.datasets[CHT_DATASET_INDEX.SELECT]
        this.cht_ch4 = this.cht.data.datasets[CHT_DATASET_INDEX.CH4]
        this.cht_hi_flow = this.cht.data.datasets[CHT_DATASET_INDEX.HI_FLOW]
        this.cht_lo_flow = this.cht.data.datasets[CHT_DATASET_INDEX.LO_FLOW]
        this.cht_press = this.cht.data.datasets[CHT_DATASET_INDEX.PRESS]
        this.cht_bat_amp = this.cht.data.datasets[CHT_DATASET_INDEX.BAT_AMP]
        this.cht_bat_volt = this.cht.data.datasets[CHT_DATASET_INDEX.BAT_VOLT]
        this.cht_mot_volt = this.cht.data.datasets[CHT_DATASET_INDEX.MOT_VOLT]
        
        this.cht.options.plugins.zoom.zoom.onZoomComplete = this.chartZoomSelect

        this.cht.options.onClick = ( e ) => {
            debug( "job.cht.options.onClick( e ) -> e: ", e )
            this.selection = Math.floor( e.chart.scales.x.getValueForPixel( e.x ) )
            debug( "job.cht.options.onClick( e ) -> this.selection: ", this.selection )
            
            this.chartPointSelect( )
            // let xs = this.cht_press.data.map( d => d.x )
            // if ( xs[0] > this.selection ) { this.selection = xs[0] }
            // else if ( xs.pop( ) < this.selection  ) { this.selection = xs.pop( ) }
            // else { 
            //     let pre = xs.filter( x => x <= this.selection ).pop( ) 
            //     let sub = xs.filter( x => x >= this.selection )[0] 
            //     this.selection = ( this.selection - pre < sub - this.selection ? pre : sub )                
            // }
    
            // this.cht_select.data = [  
            //     { x: this.selection, y: Number.MIN_SAFE_INTEGER }, 
            //     { x: this.selection, y: Number.MAX_SAFE_INTEGER } 
            // ]
            // this.selected_smp = this.samples.filter( s => s.smp_time == this.selection )[0]

            // updateJobsStore( )
        }

        this.cht.options.scales.y_hi_flow.display = true
        this.cht_point_limit = 0
        this.cht_scale_margin = 0.1
    }
    chartPointSelect = ( ) => {            
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
        this.selected_smp = this.samples.filter( s => s.smp_time == this.selection )[0]

        updateJobsStore( )
    }
    chartZoomSelect = ( e ) => { 
        // debug( "job.chartZoomSelect...\n", e.chart )
    
        let dats = e.chart.config._config.data.datasets
        // debug( "job.chartZoomSelect... datasets\n", dats )

        let scls = e.chart.scales
        // debug( "job.chartZoomSelect... scales\n", scls )
    
        let xs = ( dats[CHT_DATASET_INDEX.CH4].data.map( v => { return v.x } ) ).filter( x => {
            return ( 
                x > Math.round( e.chart.scales["x"].min ) &&
                x < Math.round( e.chart.scales["x"].max )
            )  
        } )
    
        let xmin = xs[0]
        let xmax = xs[xs.length-1]
    
        // debug( `chartZoomSelect( ):`, { 
        //     unix_min: xmin, 
        //     unix_max: xmax, 
        //     date_min: FormatDateTime( xmin ), 
        //     date_max:  FormatDateTime( xmax ) 
        // } )
    
        dats.forEach( ds => { 
            let scl = e.chart.scales[ds.yAxisID]
            // debug( "job.chartZoomSelect( ) -> dats.forEach( ds ): -> scl.id  ", scl.id )
            if ( scl.id != "y") {
                let vStart = ds.data.filter( v => { return v.x == xmin } )[0]
                let vEnd = ds.data.filter( v => { return v.x == xmax } )[0]
                // debug( `${ ds.label }: vals: ${ vStart.y } -> ${ vEnd.y }, ${ scl.id }: scales: ${ scl.min } -> ${ scl.max }` )
            }
        } )
    
    }
    chartZoomTo = ( xmin, xmax ) => {
        this.cht.options.scales.x.min = xmin
        this.cht.options.scales.x.max = xmax
        this.selection = 0
        updateJobsStore( )
    }
}
