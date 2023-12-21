/* Data Exchange Server (DES) is a component of the Datacan Data2Desk (D2D) Platform.
License:

	[PROPER LEGALESE HERE...]

	INTERIM LICENSE DESCRIPTION:
	In spirit, this license:
	1. Allows <Third Party> to use, modify, and / or distributre this software in perpetuity so long as <Third Party> understands:
		a. The software is porvided as is without guarantee of additional support from DataCan in any form.
		b. The software is porvided as is without guarantee of exclusivity.

	2. Prohibits <Third Party> from taking any action which might interfere with DataCan's right to use, modify and / or distributre this software in perpetuity.
*/

import { writable } from 'svelte/store'

/* TODO : REPLACE WITH ENV VARIABLES FOR PRODUCTION *******************************/
export const device_class = "001"
export const device_version= "001"
export const client_app = `C${ device_class }V${ device_version }_client_app v0.0.0`

const local = true
export const SERVER = ( local ? "://127.0.0.1:8007" : "://des1.data2desk.com" )
export const HTTP_SERVER = ( local ? `http${ SERVER }` : `https${ SERVER }` )
export const WS_SERVER = ( local ? `ws${ SERVER }` : `wss${ SERVER }` )
export const debugging = true
/* TODO : REPLACE WITH ENV VARIABLES FOR PRODUCTION *******************************/

export const waitMilli = ( ms ) => new Promise( ( res ) => setTimeout( res, ms ) )
export const debug = ( msg, obj ) => { if ( debugging ) console.log( msg, obj ) }

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

export const ALERT = writable( "" )
export const ALERT_CODE = writable( 0 )
export const ALERT_CODES = {
    SUCCESS: 0,
    WARNING: 1,
    ERROR: 3
}
export const alert = async( code, msg ) => {
    ALERT_CODE.set( code )
    ALERT.set( msg )
}


/* DES DATA STRUCTURES  *****************************************************************************/

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

/* NOT IMPLEMENTED */
export const removeDevice = async( serial ) => {

    /* 
    GET 
    DELETE 
        JobSearches ( des_job_searches.des_job_key = des_jobs.des_job_id )
        Jobs ( des_jobs.des_job_dev_id = des_devs.des_dev_id )
        Device 
    */

}

/* NOT IMPLEMENTED */
export const API_URL_DES_DB_LIST = `${ HTTP_SERVER }/api/des/db/list`
export const getDatabases = async( ) => {

    let res = await getRequestAuth( API_URL_DES_DB_LIST )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    
    else {
        let DATABASES = res.json.data.databases
        debug( "des_api.js -> getDatabases( ) -> DATABASES: ", DATABASES )
    }

}

/* NOT IMPLEMENTED */
export const API_URL_DES_DB_TBL_LIST = `${ HTTP_SERVER }/api/des/db/tbl_list`
export const getDBTables = async( ) => {
    
    let res = await getRequestAuth( API_URL_DES_DB_TBL_LIST )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    
    else {
        let TABLES = res.json.data.tables
        debug( "des_api.js -> getDBTables( ) -> TABLES: ", TABLES )
    }

}

/* NOT IMPLEMENTED */
export const API_URL_DES_DB_TBL_ROWS = `${ HTTP_SERVER }/api/des/db/tbl_rows`
export const getDBTblRows = async( ) => {
        
    let res = await getRequestAuth( API_URL_DES_DB_TBL_ROWS )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    
    else {
        let ROWS = res.json.data.rows
        debug( "des_api.js -> getDBTblRows( ) -> ROWS: ", ROWS )
    }

}


/* NOT IMPLEMENTED */
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
