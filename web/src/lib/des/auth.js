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
        logged_in = false
    ) {
        this.sid = sid
        this.ref_token = ref_token
        this.acc_token = acc_token
        this.user = user
        this.logged_in = logged_in
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


export const register_user = async( usu ) => {

    let req = new Request(API_URL_USER_REGISTER, { 
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
export const login = async( email, password ) => {

    let req = new Request(API_URL_USER_LOGIN, { 
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify( { email, password } ) 
    } )
    let res = await fetch( req )
    let auth = await res.json( )

    if ( auth.status === "success" ) { 

        let us = new UserSession(
            auth.user_session.sid, 
            auth.user_session.ref_token,
            auth.user_session.acc_token, 
            new User( 
                auth.user_session.user.id,
                auth.user_session.user.name,
                auth.user_session.user.email,
                auth.user_session.user.role,
                auth.user_session.user.created_at,
                auth.user_session.user.updated_at
            ),
            true
        )
        AUTH.set( us ) 
        sessionStorage.setItem( 'des_auth', JSON.stringify( us ), { path: '/' } )

        debug("\ndes/auth.js -> login( ) -> SUCCESS! ", get( AUTH ).user.name )

    } else {
        debug( "\n AUTH FAILED: \n", auth.message )
    }

}
export const refresh_jwt = async( ) => {

    let au = get( AUTH )

    let req = new Request( API_URL_USER_REFRESH, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ au.acc_token }` 
        },
        body: JSON.stringify( au ) 
    } )

    let ok = false
    let res = await fetch( req )
    if ( res.ok ) { 

        let json = await res.json( )
        
        if ( json.status === "success" ) { 
            debug( "des/auth.js -> refresh_jwt( ) -> SUCCESS -> acc_token.exp: ", parseJWT( json.user_session.acc_token ).exp )
            
            au.acc_token = json.user_session.acc_token
            AUTH.set( au )
            sessionStorage.setItem( 'des_auth', JSON.stringify( au ), { path: '/' } )
            ok = true
        } else {
            alert( ALERT_CODES.ERROR, json.message )
        }
    }
    return ok
}
export const terminate_user = async( user ) => {
    debug( "des_api.js -> terminate_user( ) -> REQUEST -> user: ", user )

    let au = get( AUTH )

    let req = new Request( API_URL_USER_TERMINATE, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ au.acc_token }` 
        },
        body: JSON.stringify( user ) 
    } )

    let ok = false
    let res = await fetch( req )
    if ( res.ok ) { 
        let json = await res.json( )
    
        if ( json.status === "success" ) { 
            debug( "des_api.js -> terminate_user( ) -> SUCCESS: ", json.message )
            alert( ALERT_CODES.SUCCESS, json.message )
            ok = true
        } else {
            debug( "des_api.js -> terminate_user( ) -> FAIL: ", json )
            alert( ALERT_CODES.ERROR, json.message )
        }
    }
    return ok
}
export const logout = async( cleanSessionData = ( ) => { } ) => {
    // debug( "des/auth.js -> logout( )" )

    let au = get( AUTH )
    if ( IntervalJWTRefresh !== null ) { stopJWTRefresh( ) }

    let req = new Request( API_URL_USER_LOGOUT, { 
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ au.acc_token }` 
        },
        body: JSON.stringify( au ) 
    } )

    try { let res = await fetch( req )
        if ( !res.ok ) { 
            alert( ALERT_CODES.ERROR, res.statusText ) 
        } else {
            let json = await res.json( )
            alert( ALERT_CODES.SUCCESS, json.message )
        }
    } catch ( err ) { alert( ALERT_CODES.ERROR, err) }

    /* ENSURE WE CLEAR THE SESSION DATA EVENT IF THERE SERVER IS DEAD */
    cleanSessionData( )

}


let IntervalJWTRefresh = null
export const watchJWT = ( onRefreshFail = ( ) => { } ) => { 

    if ( IntervalJWTRefresh !== null ) { stopJWTRefresh( ) }

    if ( get( AUTH ) && get( AUTH ).logged_in ) {

        let jwt = parseJWT( get( AUTH ).acc_token )
        let jwtExpiresIn = Math.floor( jwt.exp * 1000 - Date.now( ) ) // debug( "JWT expires in: ", jwtExpiresIn )
        if ( jwt.exp > 0 && jwtExpiresIn > 0 ) {

            IntervalJWTRefresh = setInterval( async( ) => { 
    
                if ( await refresh_jwt( ) ) {
                    // debug( "ACCESS JWT REFRESHED! -> intervalID:", IntervalJWTRefresh )
                    jwt = parseJWT( get( AUTH ).acc_token )
                    jwtExpiresIn = Math.floor( jwt.exp * 1000 - Date.now( ) ) 
                } else {
                    alert( ALERT_CODES.WARNING, "Access timed out. Please log in again." )
                    stopJWTRefresh( )
                    onRefreshFail( )
                }
    
            }, jwtExpiresIn - 2000 )

        } else {                    
            stopJWTRefresh( )
            onRefreshFail( )
        }

    }
}
const stopJWTRefresh = ( ) => {
    clearInterval( IntervalJWTRefresh )
    IntervalJWTRefresh = null
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

export const get_user_list = async( ) => {

    let req = new Request( API_URL_USER_LIST, { method: 'GET' } )
    let res = await fetch( req )
    let json = await res.json( )

    if ( json.status == "success") { 

        let users = json.data.users // debug( "get_user_list( ) -> response:\n", users )

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

        debug( "des/auth.js -> get_user_list( ) -> USERS: ", get( USERS ).length )
    } else {
        alert(ALERT_CODES.ERROR, json.message )
        debug( "des/auth.js -> get_user_list( ) -> NO USERS: ", get( USERS ).length )
    }
}

