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
import { 
    HTTP_SERVER, 
    ALERT_CODES, alert, 
    debug 
} from './utils'

export const ROLE_ADMIN = "admin"
export const ROLE_OPERATOR = "operator"
export const ROLE_USER = "user"
export const ROLE_DEVICE = "device"

export const ROLES = {
    SUPER: "super",
    ADMIN: "admin",
    OPERATOR: "operator",
    USER: "user",
    DEVICE: "device",
}

export const API_URL_USER_REGISTER =  `${ HTTP_SERVER }/api/user/register`
export const API_URL_USER_LOGIN = `${ HTTP_SERVER }/api/user/login`
export const API_URL_USER_REFRESH = `${ HTTP_SERVER }/api/user/refresh`
export const API_URL_USER_TERMINATE = `${ HTTP_SERVER }/api/user/terminate`
export const API_URL_USER_LOGOUT = `${ HTTP_SERVER }/api/user/logout`
export const API_URL_USER_LIST =  `${ HTTP_SERVER }/api/user/list`

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
    debug( "getRequest( ) -> url: ", url )

    let out = { err: null, json: null }
    
    let req = new Request( url, { method: 'GET' } )
    
    let res = await fetch( req )

    if ( !res.ok ) out.err = res.statusText 
    else out.json = await res.json( ) 

    return out

}

/* HANDLES AUTHORIZED GET REQUESTS -> CALLS JWT REFRESH IF NECESSARY */
export const getRequestAuth = async( url ) => {
    // debug( "getRequestAuth( ) -> url: ", url)

    let out = { err: null, json: null }

    let au = get( AUTH )
    let ref = await refreshJWT( ) // debug( "getRequestAuth( ) -> ref.err: ", ref.err )

    if ( ref.ok ) {

        // debug( "getRequestAuth( ) -> making GET ", url)
        let req = new Request( url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ au.acc_token }` 
            },
        } )
    
        let res = await fetch( req )
        
        if ( !res.ok ) {
            out.err = res.statusText 
        } else {
            out.json = await res.json( ) 
        } 

    } else {
        out.err = ref.err
    }
    return out
    
}

/* HANDLES NON-AUTHORIZED POST REQUESTS */
export const postRequest = async( url, obj ) => {
    debug( "postRequest( ) -> url: ", url )

    let out = { err: null, json: null }

    let req = new Request( url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify( obj )    
    } )
    
    let res = await fetch( req )

    if ( !res.ok ) out.err = res.statusText 
    else out.json = await res.json( ) 

    return out
}

/* HANDLES AUTHORIZED POST REQUESTS -> CALLS JWT REFRESH IF NECESSARY */
export const postRequestAuth = async( url, obj ) => {
    // debug( "postRequestAuth( ) -> url: ", url)

    let out = { err: null, json: null }

    let au = get( AUTH )
    let ref = await refreshJWT( ) // debug( "postRequestAuth( ) -> ref.err: ", ref.err )

    if ( ref.ok ) {

        // debug( "postRequestAuth( ) -> making POST ", url)
        let req = new Request( url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ au.acc_token }` 
            },
            body: JSON.stringify( obj )
        } )
    
        let res = await fetch( req )
        
        if ( !res.ok ) {
            out.err = await res.text() 
        } else {
            out.json = await res.json( ) 
        } 

    } else {
        out.err = ref.err
    }
    return out

}

/* NON-AUTHORIZED POST REQUESTS **********************************************/
export const registerUser = async( usu ) => {

    let res = await postRequest( API_URL_USER_REGISTER, usu )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    else 
        await login( usu.email, usu.password ) 

}
export const login = async( email, password, cleanSessionData = ( ) => { } ) => {

    let res = await postRequest( API_URL_USER_LOGIN, { email, password } )

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

        debug("\ndes/auth.js -> login( ) -> SUCCESS! ", get( AUTH ).user.name )
    }

}

/* AUTHORIZED POST REQUESTS ****************************************************/
export const logout = async( ) => {
    // debug( "des/auth.js -> logout( )" )

    let au = get( AUTH ) 
    let res = await postRequestAuth( API_URL_USER_LOGOUT, au )
    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )
    
    else {
        alert( ALERT_CODES.SUCCESS, res.json.message )
    }

    /* ENSURE WE CLEAR THE SESSION DATA EVENT IF THERE SERVER IS DEAD */
    au.cleanSessionData( )

}
export const terminateUser = async( user ) => {
    debug( "des/authjs -> terminateUser( ) -> REQUEST -> user: ", user.email )

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
export const refreshJWT = async( ) => {
    
    let out = { err: null, ok: false }
    let au =  get( AUTH )

    /* WE'RE NOT LOGGED IN */
    if ( !au.logged_in ) {
        out.err = "You are not logged in."
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
        out.err = res.statusText.toString( )
        debug( "des/auth.js -> refreshJWT( ) -> NOT OK -> out.err: ", out.err )  
        out.err = res.statusText  
        return out
    } else { 

        let json = await res.json( )
        
        if ( json.status === "success" ) { 
            debug( "des/auth.js -> refreshJWT( ) -> SUCCESS -> acc_token.exp: ", parseJWT( json.user_session.acc_token ).exp )
            
            au.acc_token = json.user_session.acc_token
            AUTH.set( au )
            sessionStorage.setItem( 'des_auth', JSON.stringify( au ), { path: '/' } )
            
            out.ok = true
            return out
  
        } 
    }

}
const parseJWT = ( token ) => {
    let jwt = { exp: 0 }

    let base64Url = token.split('.')[1] // debug( "parseJWT( ): -> base64Url: ", base64Url )

    if ( base64Url ) {
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        let jwtStr = decodeURIComponent( window.atob( base64 ).split( '' ).map( c => {
            return '%' + ('00' + c.charCodeAt( 0 ).toString( 16 ) ).slice( -2 )
        } ).join( '' ) )
    
        jwt = JSON.parse( jwtStr )
    } 

    return jwt
}


export const USERS = writable( [ ] )
export const USERS_LOADED = writable( false )
export const updateUsersStore = async( ) => { USERS.update( ( ) => { return [ ...get( USERS ) ] } ) }

export const getUserList = async( ) => {

    let res = await getRequest( API_URL_USER_LIST )

    if ( res.err !== null ) 
        alert( ALERT_CODES.ERROR, res.err )

    else {
        let users = res.json.data.users  // debug( "getUserList( ) -> response:\n", users )

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

        debug( "des/auth.js -> getUserList( ) -> USERS: ", get( USERS ).length )
    }

}

