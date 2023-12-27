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

import { writable, get } from 'svelte/store'
import { goto } from '$app/navigation'

import { HTTP_SERVER, client_app } from './app'
import { ALERT_CODES, alert, debug } from './utils'


export class UserSession {
    constructor (
        sid = "",
        ref_token = "none",
        acc_token = "none",
        user = new User( ),
        logged_in = false,
        func = ( ) => { }
    ) {
        this.sid = sid
        this.ref_token = ref_token
        this.acc_token = acc_token
        this.user = user
        this.logged_in = logged_in
        this.cleanSessionData = func
    }
}

export class User {
    constructor(
        id = "",
        name = "",
        email = "",
        role = "",
        // provider = "",
        created_at = 0,
        updated_at = 0
    ) {
        this.id  = id
        this.name = name
        this.email = email
        this.role = role,
        // this.provider = provider
        this.created_at = created_at
        this.updated_at = updated_at
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

export const AUTH = writable( new UserSession( ) )

/* HANDLES NON-AUTHORIZED GET REQUESTS */
export const getRequest = async( url ) => {
    debug( "des/api.js -> getRequest( ) -> url: ", url )
    let out = { err: null, json: null }
    let req = new Request( url, { method: 'GET' } )
    let res = await fetch( req )
    if ( !res.ok ) 
        out.err = res.statusText 
    else 
        out.json = await res.json( ) 

    return out
}

/* HANDLES AUTHORIZED GET REQUESTS -> CALLS JWT REFRESH IF NECESSARY */
export const getRequestAuth = async( url ) => {
    debug( "des/api.js -> getRequestAuth( ) -> url: ", url)
    let out = { err: null, json: null }
    let au = get( AUTH )
    let ref = await refreshJWT( ) // debug( "des/api.js -> getRequestAuth( ) -> ref.err: ", ref.err )
    if ( ref.ok ) { // debug( "des/api.js -> getRequestAuth( ) -> making GET ", url)
        let req = new Request( url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${ au.acc_token }` },
        } )
        let res = await fetch( req )
        if ( !res.ok ) 
            out.err = res.statusText 
        else 
            out.json = await res.json( ) 

    } else {
        out.err = ref.err
    }
    return out
}

/* HANDLES NON-AUTHORIZED POST REQUESTS */
export const postRequest = async( url, obj ) => {
    debug( "des/api.js -> postRequest( ) -> url: ", url )
    let out = { err: null, json: null }
    let req = new Request( url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify( obj )    
    } )
    let res = await fetch( req )
    if ( !res.ok ) 
        out.err = res.statusText 
    else 
        out.json = await res.json( ) 

    return out
}

/* HANDLES AUTHORIZED POST REQUESTS -> CALLS JWT REFRESH IF NECESSARY */
export const postRequestAuth = async( url, obj ) => {
    debug( "des/api.js -> postRequestAuth( ) -> url: ", url)
    let out = { err: null, json: null }
    let au = get( AUTH )
    let ref = await refreshJWT( ) // debug( "des/api.js -> postRequestAuth( ) -> ref.err: ", ref.err )
    if ( ref.ok ) { // debug( "postRequestAuth( ) -> making POST ", url)
        let req = new Request( url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.acc_token }` 
            },
            body: JSON.stringify( obj )
        } )
        let res = await fetch( req )
        if ( !res.ok ) 
            out.err = await res.text() 
        else 
            out.json = await res.json( )  

    } else {
        out.err = ref.err
    }
    return out
}

export const wsConnectionAuth = async( url, key, obj ) => {
    debug( "des/api.js -> wsConnectionAuth( ) -> url: ", url)
    let out = { err: null, ws: null }
    let au = get( AUTH )
    let ref = await refreshJWT( ) // debug( "des/api.js -> postRequestAuth( ) -> ref.err: ", ref.err )
    if ( ref.ok ) {

        obj = encodeURIComponent(JSON.stringify( obj ) )
        url = `${ url }?access_token=${ au.acc_token }&sid=${ au.sid }&${ key }=${ obj }`
        out.ws = new WebSocket( url )

    } else {
        out.err = ref.err
    }

    return out
}

/* HANDLES REFRESHING OF ACCESS TOKENS */
export const refreshJWT = async( ) => {
    
    let out = { err: null, ok: false }
    let au =  get( AUTH )

    /* WE'RE NOT LOGGED IN */
    if ( !au.logged_in ) {
        out.err = "Unauthorized"
        return out
    }
   
    /* CHECK IF TOKEN IS VALID FOR AT LEAST 5 SECONDS */
    let exp = ( parseJWT( au.acc_token ).exp ) * 1000
    if ( Math.floor( exp - Date.now( ) ) > 5000 ) {
        out.ok = true
        return out
    }
    

    /* REQUEST A NEW ACCESS TOKEN USING THE REFRESH TOKEN */    
    let req = new Request( API_URL_USER_REFRESH, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ au.ref_token }` 
        },
        body: JSON.stringify( au ) 
    } )
    let res = await fetch( req )

    if ( !res.ok ) {      
        debug( "des/api.js -> refreshJWT( ) -> NOT OK -> out.err: ", out.err )  
        out.err = res.statusText  
        logout( )
    } else { 

        let json = await res.json( )
        
        if ( json.status === "success" ) { 
            au.acc_token = json.user_session.acc_token
            AUTH.set( au )
            sessionStorage.setItem( 'des_auth', JSON.stringify( au ), { path: '/' } )
            out.ok = true
            debug( "des/api.js -> refreshJWT( ) -> OK -> acc_token.exp: ", parseJWT( json.user_session.acc_token ).exp )
        } 
    }
    return out

}
export const parseJWT = ( token ) => {
    let jwt = { exp: 0 }
    let base64Url = token.split('.')[1] // debug( "des/api.js -> parseJWT( ): -> base64Url: ", base64Url )
    if ( base64Url ) {
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        let jwtStr = decodeURIComponent( window.atob( base64 ).split( '' ).map( c => {
            return '%' + ('00' + c.charCodeAt( 0 ).toString( 16 ) ).slice( -2 )
        } ).join( '' ) )
        jwt = JSON.parse( jwtStr )
    } 
    return jwt
}


/* DES API USER */
export const API_URL_USER_REGISTER =  `${ HTTP_SERVER }/api/user/register`
export const API_URL_USER_LOGIN = `${ HTTP_SERVER }/api/user/login`
export const API_URL_USER_REFRESH = `${ HTTP_SERVER }/api/user/refresh`
export const API_URL_USER_TERMINATE = `${ HTTP_SERVER }/api/user/terminate`
export const API_URL_USER_LOGOUT = `${ HTTP_SERVER }/api/user/logout`
export const API_URL_USER_LIST =  `${ HTTP_SERVER }/api/user/list`

export const ROLES = {
    SUPER: "super",
    ADMIN: "admin",
    OPERATOR: "operator",
    USER: "user",
    DEVICE: "device",
}

export const registerUser = async( usu ) => {

    let res = await postRequest( API_URL_USER_REGISTER, usu )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    else 
        await login( usu.email, usu.password ) 

}

export const login = async( email, password, cleanSessionData = ( ) => { } ) => {
    let res = await postRequest( API_URL_USER_LOGIN, { email: email, password: password } )
    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    else {
        let us = new UserSession(
            res.json.user_session.sid, 
            res.json.user_session.ref_token,
            res.json.user_session.acc_token, 
            new User( 
                res.json.user_session.user.id,
                res.json.user_session.user.name,
                res.json.user_session.user.email,
                res.json.user_session.user.role,
                res.json.user_session.user.created_at,
                res.json.user_session.user.updated_at
            ),
            true,
            cleanSessionData
        )
        AUTH.set( us ) 
        sessionStorage.setItem( 'des_auth', JSON.stringify( us ), { path: '/' } )
        debug("des/api.js -> login( ) -> USER: ", get( AUTH ).user.email )
    }
}

/* AUTHORIZED POST REQUESTS ****************************************************/
export const logout = async( ) => { // debug( "des/api.js -> logout( )" )
    let au = get( AUTH ) 
    let res = await postRequestAuth( API_URL_USER_LOGOUT, au )
    if ( res.err !== null ) {
        if ( res.err !== 'Unauthorized' )
            alert( ALERT_CODES.ERROR, res.err )
    }
    else {
        alert( ALERT_CODES.SUCCESS, res.json.message )
    }

    /* ENSURE WE CLEAR THE SESSION DATA EVENT IF THERE SERVER IS DEAD */
    if ( au.cleanSessionData )
        au.cleanSessionData( )
    else { // debug( "Default clean user session" )
        sessionStorage.setItem( 'des_auth', 'none', { path: '/' } )
        AUTH.set( new UserSession( ) )
        goto( '/' )
    }
}
export const terminateUser = async( user ) => {
    debug( "des/api.js -> terminateUser( ) -> REQUEST -> user: ", user.email )

    let  res = await postRequestAuth( API_URL_USER_TERMINATE, user )
    if ( res.err !== null ) {
        alert( ALERT_CODES.ERROR, res.err )
    } else {
        if ( res.json.status === "success" ) { 
            alert( ALERT_CODES.SUCCESS, res.json.message )
        } else {
            alert( ALERT_CODES.WARNING, res.json.message )
        }
    }
}

export const USERS = writable( [ ] )
export const USERS_LOADED = writable( false )
export const updateUsersStore = async( ) => { USERS.update( ( ) => { return [ ...get( USERS ) ] } ) }

export const getUserList = async( ) => {

    let res = await getRequest( API_URL_USER_LIST )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )

    else {
        let users = res.json.data.users  // debug( "des/api.js -> getUserList( ) -> response:\n", users )
        users.forEach( usr => { 
            if( get( USERS ).filter( u => { return u.email == usr.email } )[0] == undefined ) {
                let user = new User(
                    usr.id,
                    usr.name,
                    usr.email,
                    usr.role,
                    usr.provider,
                    usr.created_at,
                    usr.updated_at
                )
                USERS.update( susrs => { return [ ...susrs, user ] } )
            }        
        } )
        USERS_LOADED.set( true )
        debug( "des/api.js -> getUserList( ) -> USERS: ", get( USERS ).length )
    }

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
        des_dev_version = "",
        des_dev_class = "",

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

export class Ping {
    constructor(
        time = 0,
        ok = false
    ) {
        this.time = time
        this.ok = ok
    }
}

/* NOT IMPLEMENTED */
export const API_URL_DES_DB_LIST = `${ HTTP_SERVER }/api/des/db/list`
export const getDatabases = async( ) => {

    let res = await getRequestAuth( API_URL_DES_DB_LIST )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    
    else {
        let DATABASES = res.json.data.databases
        debug( "des/api.js -> getDatabases( ) -> DATABASES: ", DATABASES )
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
        debug( "des/api.js -> getDBTables( ) -> TABLES: ", TABLES )
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
        debug( "des/api.js -> getDBTblRows( ) -> ROWS: ", ROWS )
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
