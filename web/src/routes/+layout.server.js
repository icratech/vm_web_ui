
import { HTTP_SERVER, AUTH, AuthorizedUser } from '../lib/des_api'

/** @type {import('./$types').LayoutServerLoad} */
export const load = async( { cookies } ) => {

    let user_res = await fetch( `${ HTTP_SERVER }/user/me`, { 
            method: "GET",
            headers: { 'Authorization': `Bearer ${ cookies.get( 'des_token' ) }`}      
        } 
    )
    let usr = await user_res.json() 
    let au
    if ( usr.status == "success" ) {

        au = new AuthorizedUser(
            usr.data.user.id, 
            usr.data.user.name, 
            usr.data.user.email, 
            usr.data.user.role,
            usr.data.user.provider, 
            usr.data.user.created_at, 
            usr.data.user.updated_at,
        )
        au.setToken( cookies.get( 'des_token' ) )
        au.logged_in = true
        cookies.set( 'des_user', JSON.stringify( au ), { path: '/' } ) 
        console.log(`\nLAYOUT LOAD FUNCTION: -> AUTHENTICATION SUCCESS!\n${ JSON.stringify( JSON.parse( cookies.get( 'des_user' ) ), null, 4 ) }\n`)

    } 
    else {

        au = new AuthorizedUser( )
        cookies.set( 'des_token', "", { path: '/' } )
        cookies.set( 'des_user', JSON.stringify(  au, { path: '/' } ) )
        console.log(`\nLAYOUT LOAD FUNCTION: -> AUTHENTICATION FAILED!\n${ JSON.stringify( usr, null, 4 ) }\n`) 
    }
    
    cookies.set( 'des_user', JSON.stringify( au), { path: '/' } ) 

    let user = await JSON.parse( cookies.get( 'des_user' ) )
    
    return { user }
}

